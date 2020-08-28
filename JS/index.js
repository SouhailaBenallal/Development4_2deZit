let data = [];
let genders = [];
let categories = [];
let filteredData = [];
let isFilterOn = false;

function onSearch(event) {
  event.preventDefault();
  const searchInput = document.getElementById("search-input");
  const searchValue = searchInput.value;

  if (searchValue) {
    const matchedValues = data.filter((el) => {
      const elName = el.name.toLowerCase().trim();
      const SearchValueToCompare = searchValue.toLowerCase().trim();

      return elName.includes(SearchValueToCompare);
    });
    isFilterOn = true;
    hydrateFilteredData(matchedValues);
  } else {
    isFilterOn = false;
  }
  displayData();
}

function attachEvents() {
  const searchBtn = document.getElementById("search-btn");
  searchBtn.addEventListener("click", onSearch);
}

async function fetchData() {
  const res = await fetch("../data.json");
  const dataJson = await res.json();

  return dataJson;
}

function displayData() {
  const list = document.getElementById("list");

  // Empty the list content
  list.innerHTML = "";

  // Fill list content
  if (isFilterOn) {
    filteredData.forEach((el) => {
      const card = createCard(el);
      list.appendChild(card);
    });
  } else {
    data.forEach((el) => {
      const card = createCard(el);
      list.appendChild(card);
    });
  }
}

function hydrateData(newData) {
  data = [...newData];
}
function hydrateFilteredData(newData) {
  filteredData = [...newData];
}

(async function () {
  attachEvents();
  const dataFetched = await fetchData();
  hydrateData(dataFetched);
  displayData();
})();