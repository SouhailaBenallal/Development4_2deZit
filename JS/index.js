const searchBtn = document.getElementById("search-btn");
const nbCardEl = document.getElementById("nb-card");
const currPageEl = document.getElementById("currentPage");
const totalPageEl = document.getElementById("totalPage");
const searchInput = document.getElementById("search-input");
const list = document.getElementById("list");
const genreList = document.getElementById("genres-list");
const categoryList = document.getElementById("categories-list");
const previousPageBtn = document.getElementById("previousPage");
const nextPageBtn = document.getElementById("nextPage");
const mainPage = document.getElementById("main-page");
const eventPage = document.getElementById("event-page");
const homeLink = document.getElementById("home-link");

const data = [];
let filteredData = [];

const genres = [];
let filteredGenres = [];

const categories = [];
let filteredCategories = [];

let userSearchValue = "";

let isFilterOn = false;

let totalPage = 1;
let currentPage = 1;
const elPerPage = 15;

//functie voor url te veranderen met behulp van de slug
function handleUrl(slug) {
  window.history.pushState(
    {
      page: slug ? slug : "/",
    },
    null,
    slug ? slug : "/"
  );
}
//functie voor inzetten van data op het tweede pagina met behulp van de slug
function injectEventData(slug) {
  const eventTitle = document.getElementById("event-title");
  const eventDesc = document.getElementById("event-desc");
  const videoWrapper = document.getElementById("video-wrapper");
  const d = data.find((el) => el.slug === slug);

  videoWrapper.innerHTML = "";

  eventTitle.innerText = d.name;
  eventDesc.innerText = d["social-share-description"];
  videoWrapper.appendChild(createVideo(d["link-to-video"].url));

  console.log(createVideo(d["link-to-video"].url));
}
//functie voor het verbegen van ene pagina via event en gaan naar de hoofdpagina
function goMainPage(event) {
  event.preventDefault();
  eventPage.classList.add("hidden");
  mainPage.classList.remove("hidden");
  handleUrl();
}
//functie voor het verbegen van ene pagina via slug en wanneer je op de card klik
function onCardClick(slug) {
  event.preventDefault();
  mainPage.classList.add("hidden");
  eventPage.classList.remove("hidden");
  handleUrl(slug);
  injectEventData(slug);
}
//functie voor te gaan naar de vorige pagina
function goPreviousPage() {
  if (currentPage !== 1) {
    currentPage = currentPage - 1;
  }
  displayData();
}
//functie voor te gaan naar de vorige pagina
function goNextPage() {
  if (currentPage < totalPage) {
    currentPage = currentPage + 1;
  }
  displayData();
}
//functie van gepagineerde gegevens ophalen
function getPaginateData(dataToSplit) {
  let mutli;
  if (currentPage === 1) {
    multi = 0;
  } else {
    multi = currentPage - 1;
  }

  let start = 0 + elPerPage * multi;
  let end = start + elPerPage;

  return dataToSplit.slice(start, end);
}
//functie voor wisselen van het filter
function setFilterToggle(hasSearch) {
  if (filteredCategories.length || filteredGenres.length || hasSearch) {
    isFilterOn = true;
  } else {
    isFilterOn = false;
  }
}
//functie maken van nieuwe data bij het filteren
function setFilteredData(newData) {
  filteredData = [...newData];
}
//functie van het opzoeken van gegevens 
function onSearch(event) {
  event.preventDefault();
  const searchValue = searchInput.value;

  if (searchValue) {
    const matchedValues = data.filter((el) => {
      //trim --> splitesen van woord
      const elName = el.name.toLowerCase().trim();
      const SearchValueToCompare = searchValue.toLowerCase().trim();
      //includes --> omvat
      return elName.includes(SearchValueToCompare);
    });
    setFilterToggle(true);
    setFilteredData(matchedValues);
    userSearchValue = searchValue;
  } else {
    setFilterToggle(false);
  }
  displayData();
}
//functie voor voegen van evenementen toe
function attachEvents() {
  searchBtn.addEventListener("click", onSearch);
  previousPageBtn.addEventListener("click", goPreviousPage);
  nextPageBtn.addEventListener("click", goNextPage);
  homeLink.addEventListener("click", goMainPage);
}
//functie op Genre-tag aangeklikt via if else structuur
function onGenreTagClicked(event) {
  const genreToFilter = event.target.innerText;
  if (filteredGenres.includes(genreToFilter)) {
    //indexOf --> geeft de eerste index terug waarvoor een bepaald element in een array wordt gevonden.
    const elIndex = filteredGenres.indexOf(genreToFilter);
    //splice --> wijzig de inhoud van een array door elementen te verwijderen en / of nieuwe elementen toe te voegen
    filteredGenres.splice(elIndex, 1);
  } else {
    filteredGenres.push(genreToFilter);
  }
  setFilterToggle(!!userSearchValue);
  displayGenresData();
  displayData();
}
//functie op Category-tag aangeklikt via if else structuur
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
//gegevens ophalen 
async function fetchData() {
  const res = await fetch("../data.json");
  const dataJson = await res.json();

  return dataJson;
}
//gegevens weergeven
function displayData() {
  // Empty the list content
  list.innerHTML = "";

  let dataToDisplay = data;

  // Fill list content
  if (isFilterOn) {
    const dataFilterBySearch = data.filter((el) => {
      const elName = el.name.toLowerCase().trim();
      const SearchValueToCompare = userSearchValue.toLowerCase().trim();

      return elName.includes(SearchValueToCompare);
    });

    const dataFilterBySearchAndGenres = dataFilterBySearch.filter((el) => {
      if (filteredGenres.length) {
        return filteredGenres.includes(el["genre-v2"]);
      }
      return true;
    });

    const dataFilterBySearchAndGenresAndCategories = dataFilterBySearchAndGenres.filter(
      (el) => {
        if (filteredCategories.length) {
          return filteredCategories.includes(el.category);
        }
        return true;
      }
    );

    dataToDisplay = dataFilterBySearchAndGenresAndCategories;
  }

  // console.log("dataToDisplay", dataToDisplay.length);

  let paginateData = getPaginateData(dataToDisplay);

  paginateData.forEach((el) => {
    const card = createCard(el);
    card.addEventListener("click", function (event) {
      event.preventDefault();
      return onCardClick(el.slug);
    });
    list.appendChild(card);
  });

  nbCardEl.innerText = dataToDisplay.length;
  currPageEl.innerText = currentPage;
  if (Math.round(dataToDisplay.length / elPerPage) < 1) {
    totalPage = 1;
  } else {
    totalPage = Math.round(dataToDisplay.length / elPerPage);
  }
  totalPageEl.innerText = totalPage;
}
//gegevens weergeven op genres
function displayGenresData() {
  genreList.innerHTML = "";

  genres.forEach((el) => {
    const isActive = filteredGenres.includes(el);
    const tag = createTag(el, isActive);
    tag.addEventListener("click", onGenreTagClicked);
    genreList.appendChild(tag);
  });
}
//gegevens weergeven op categorie
function displayCategoriesData() {
  categoryList.innerHTML = "";

  categories.forEach((el) => {
    const isActive = filteredCategories.includes(el);
    const tag = createTag(el, isActive);
    tag.addEventListener("click", onCategoryTagClicked);
    categoryList.appendChild(tag);
  });
}
//gegevens instellen
function setData(newData) {
  newData.forEach((el) => {
    data.push(el);
  });
}
//gegevens instellen op genres
function setGenresData(newData) {
  newData.forEach((el) => {
    if (!genres.includes(el["genre-v2"])) {
      genres.push(el["genre-v2"]);
    }
  });
}
//gegevens instellen op categorie
function setCategoriesData(newData) {
  newData.forEach((el) => {
    if (!categories.includes(el.category)) {
      categories.push(el.category);
    }
  });
}
//functie die zich zelf oproep en oproep andere functies op
(async function () {
  attachEvents();

  const dataFetched = await fetchData();

  setData(dataFetched);
  setGenresData(dataFetched);
  setCategoriesData(dataFetched);

  displayData();
  displayGenresData();
  displayCategoriesData();
})(); 