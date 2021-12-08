window.onload = () => {
    loadNumbersData();
}

let listNumbers = {};

async function loadNumbersData() {
    const listOfJsons = [
        "out/2020_numbers.json",
        "out/2019_numbers.json",
        "out/2018_numbers.json",
        "out/2017_numbers.json",
        "out/2016_numbers.json",
        "out/2015_numbers.json"
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
            if (listNumbers[year] === undefined) {
                listNumbers[year] = [];
            }

            listNumbers[year].push(obj);
        });

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

const toggleErrorMessage = (hasError) => {
    let elem = document.getElementById("errorMessage");
    elem.classList.add(hasError ? "show" : "hide");
    elem.classList.remove(hasError ? "hide" : "show");
}

const isNum = (val) => {
    return !isNaN(val)
}

const search = () => {
    let value = document.getElementById("numberToSearch").value;

    if (value === "" || !isNum(value)) {
        toggleErrorMessage(true);
        return;
    }

    toggleErrorMessage(false);

    value = value.toString().padStart(5, '0');
    document.getElementById("numberToSearch").value = value;


    console.log("Valor", value);

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    const foundNumber = listNumbers[value];
    if (foundNumber) {
        console.log("Existe el ", value);
        let ul = document.createElement('ul');
        foundNumber.forEach(number => {
            const year = number.year;
            const prize = number.prize;
            let li = document.createElement("li");
            li.innerText = `${year} - ${prize}€`;
            ul.appendChild(li);
        })
        const span = document.createElement('span');
        span.textContent = `👍🍾¡Yay! Este número fue premiado ${foundNumber.length > 1 ? "los años": "el año"}:`;
        resultsDiv.appendChild(span);
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