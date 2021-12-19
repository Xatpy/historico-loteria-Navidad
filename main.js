window.onload = () => {
  loadNumbersData();
};

let listNumbers = {};

async function loadNumbersData() {
  const listOfJsons = [
    './out/2020_numbers.json',
    './out/2019_numbers.json',
    './out/2018_numbers.json',
    './out/2017_numbers.json',
    './out/2016_numbers.json',
    './out/2015_numbers.json',
    './out/2014_numbers.json',
    './out/2013_numbers.json',
    './out/2012_numbers.json',
    './out/2011_numbers.json',
  ];
  for (let i = 0; i < listOfJsons.length; ++i) {
    const jsonData = await fetchJson(listOfJsons[i]);
    const year = jsonData.year;
    const numbers = jsonData.numbers;
    numbers.forEach((element) => {
      const num = element.n;
      const prize = element.p;
      if (listNumbers[year] === undefined) {
        listNumbers[year] = {};
      }
      listNumbers[year][num.toString()] = {
        year: year,
        prize: prize,
      };
    });
  }
}

async function fetchJson(jsonUrl) {
  return await fetch(jsonUrl)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.error(
        `There was an error fetching the data ${jsonUrl}: ${error}`,
      );
    });
}

async function tellJoke() {
  const response = await fetch(url);
  const data = await response.json();
  return data.value.joke;
}

const toggleErrorMessage = (hasError) => {
  let elem = document.getElementById('errorMessage');
  elem.classList.add(hasError ? 'show' : 'hide');
  elem.classList.remove(hasError ? 'hide' : 'show');
};

const isNum = (val) => {
  return !isNaN(val);
};

const search = () => {
  let value = document.getElementById('numberToSearch').value;

  if (value === '' || !isNum(value)) {
    toggleErrorMessage(true);
    return;
  }

  toggleErrorMessage(false);

  value = value.toString().padStart(5, '0');
  document.getElementById('numberToSearch').value = value;

  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';
  resultsDiv.classList.remove('hide');
  resultsDiv.classList.add('fade-in');
  const list_years = [2020, 2019, 2018, 2017, 2016, 2015];

  let found_numbers = [];
  list_years.forEach((year) => {
    if (listNumbers[year][value]) {
      found_numbers.push(listNumbers[year][value]);
    }
  });

  if (found_numbers.length > 0) {
    let ul = document.createElement('ul');
    found_numbers.forEach((number) => {
      const year = number.year;
      let prize = number.prize;
      const isPremiaco = prize.includes('EUROS');

      if (isPremiaco) {
        prize = prize
          .trim()
          .replaceAll('DE', '')
          .replaceAll('EUROS', '')
          .replaceAll('.', '');
        prize = parseInt(prize);
      }
      prize = (parseInt(prize) / 10).toLocaleString(); // Calculando el "décimo"
      prize += '  €';

      let li = document.createElement('li');
      li.innerText = `${year} : ${prize}`;
      if (isPremiaco) {
        li.classList.add('bigPrize');
      } else {
        li.classList.add('normalPrize');
      }
      ul.appendChild(li);
    });
    const span = document.createElement('span');
    span.textContent = `👍 ¡Yay! El número (${value}) fue premiado  ${
      found_numbers.length > 1 ? 'los años' : 'el año'
    }: 🍾`;
    resultsDiv.appendChild(span);
    resultsDiv.appendChild(ul);
  } else {
    const span = document.createElement('span');
    span.innerHTML = `👎 El número (${value}) NUNCA ha sido premiado 🤷‍♂️`;
    resultsDiv.appendChild(span);
  }
};

window.addEventListener('keyup', function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById('btnSearch').click();
  }
});
