const nbCardEl = document.getElementById("nb-card");

let data = [];
let filteredData = [];

let genres = [];
let filteredGenres = [];

let categories = [];
let filteredCategories = [];

let userSearchValue = "";

let isFilterOn = false;

function setFilterToggle(hasSearch) {
  if (filteredCategories.length || filteredGenres.length || hasSearch) {
    isFilterOn = true;
  } else {
    isFilterOn = false;
  }
}

function onGenreTagClicked(event) {
  const genreToFilter = event.target.innerText;
  if (filteredGenres.includes(genreToFilter)) {
    const elIndex = filteredGenres.indexOf(genreToFilter);
    filteredGenres.splice(elIndex, 1);
  } else {
    filteredGenres.push(genreToFilter);
  }
  setFilterToggle(!!userSearchValue);
  displayGenresData();
  displayData();
}
function onCategoryTagClicked(event) {
  const categoryToFilter = event.target.innerText;
  if (filteredCategories.includes(categoryToFilter)) {
    const elIndex = filteredCategories.indexOf(categoryToFilter);
    filteredCategories.splice(elIndex, 1);
  } else {
    filteredCategories.push(categoryToFilter);
  }
  setFilterToggle(!!userSearchValue);
  displayCategoriesData();
  displayData();
}

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
    setFilterToggle(true);
    hydrateFilteredData(matchedValues);
    userSearchValue = searchValue;
  } else {
    setFilterToggle(false);
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
    const dataFilterBySearch = data.filter((el) => {
      const elName = el.name.toLowerCase().trim();
      const SearchValueToCompare = userSearchValue.toLowerCase().trim();

      return elName.includes(SearchValueToCompare);
    });

    console.log("dataFilterBySearch", dataFilterBySearch);

    const dataFilterBySearchAndGenres = dataFilterBySearch.filter((el) => {
      if (filteredGenres.length) {
        return filteredGenres.includes(el["genre-v2"]);
      }
      return true;
    });

    console.log("dataFilterBySearchAndGenres", dataFilterBySearchAndGenres);

    const dataFilterBySearchAndGenresAndCategories = dataFilterBySearchAndGenres.filter(
      (el) => {
        if (filteredCategories.length) {
          return filteredCategories.includes(el.category);
        }
        return true;
      }
    );

    console.log(
      "dataFilterBySearchAndGenresAndCategories",
      dataFilterBySearchAndGenresAndCategories
    );

    dataFilterBySearchAndGenresAndCategories.forEach((el) => {
      const card = createCard(el);
      list.appendChild(card);
    });

    nbCardEl.innerText = dataFilterBySearchAndGenresAndCategories.length;
  } else {
    data.forEach((el) => {
      const card = createCard(el);
      list.appendChild(card);
    });

    nbCardEl.innerText = data.length;
  }
}

function displayGenresData() {
  const list = document.getElementById("genres-list");

  list.innerHTML = "";

  genres.forEach((el) => {
    const isActive = filteredGenres.includes(el);
    const tag = createTag(el, isActive);
    tag.addEventListener("click", onGenreTagClicked);
    list.appendChild(tag);
  });
}
function displayCategoriesData() {
  const list = document.getElementById("categories-list");

  list.innerHTML = "";

  categories.forEach((el) => {
    const isActive = filteredCategories.includes(el);
    const tag = createTag(el, isActive);
    tag.addEventListener("click", onCategoryTagClicked);
    list.appendChild(tag);
  });
}

function hydrateData(newData) {
  data = [...newData];
}
function hydrateFilteredData(newData) {
  filteredData = [...newData];
}

function hydrateGenresData(newData) {
  const newGenres = [];

  newData.forEach((el) => {
    if (!newGenres.includes(el["genre-v2"])) {
      newGenres.push(el["genre-v2"]);
    }
  });

  genres = [...newGenres];
}

function hydrateCategoriesData(newData) {
  const newCategories = [];

  newData.forEach((el) => {
    if (!newCategories.includes(el.category)) {
      newCategories.push(el.category);
    }
  });

  categories = [...newCategories];
}

(async function () {
  attachEvents();
  const dataFetched = await fetchData();
  hydrateData(dataFetched);
  hydrateGenresData(dataFetched);
  hydrateCategoriesData(dataFetched);
  displayData();
  displayGenresData();
  displayCategoriesData();
})();