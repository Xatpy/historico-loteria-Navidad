window.onload = () => {
    loadNumbersData();
}

let listNumbers = {};

async function loadNumbersData() {
    //const jsonData = await  fetchJson(jsonUrl);
    const listOfJsons = [
        "out/2020_numbers.json",
        "out/2019_numbers.json"
    ]
    for (let i = 0; i < listOfJsons.length; ++i) {
        const jsonData = await fetchJson(listOfJsons[i]);
        const year = jsonData.year;
        const numbers = jsonData.numbers;
        numbers.forEach(element => {
            const num = element.n;
            const prize = element.p;
            const obj = {
                year: year,
                prize: prize
            }
            if (listNumbers[num] === undefined) {
                listNumbers[num] = [];
            }
            
            listNumbers[num].push(obj);
        });
        console.log("aaaaa", jsonData);

        listNumbers[jsonData.year] = jsonData.numbers;
    }

    console.log(listNumbers)
}

async function fetchJson(jsonUrl) {
    return await fetch(jsonUrl)
                    .then(response => {
                        return response.json();
                    })
                    .catch(error => {
                        console.error(`There was an error fetching the data ${jsonUrl}: ${error}`)
                    })
}

async function tellJoke() {
    let response = await fetch(url);
    let data = await response.json();
    return data.value.joke;
}

const search = () => {
    const value = document.getElementById("numberToSearch").value;
    console.log("Valor", value);

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    const foundNumber = listNumbers[value];
    if (foundNumber) {
        debugger
        console.log("Existe el ", value);
        let ul = document.createElement('ul');
        foundNumber.forEach(number => {
            const year = number.year;
            const prize = number.prize;
            let li = document.createElement("li");
            li.innerText = `${year} - ${prize}€`;
            ul.appendChild(li);
        })
        resultsDiv.appendChild(ul);
    } else {
        console.log("NOOOO Existe el ", value);
        const span = document.createElement('span');
        span.innerHTML = "Este número NUNCA ha sido premiado 🤷‍♂️👎";
        resultsDiv.appendChild(span);
    }
}

window.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("btnSearch").click();
    }
});