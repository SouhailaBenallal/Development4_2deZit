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

function handleUrl(slug) {
  window.history.pushState(
    {
      page: slug ? slug : "/",
    },
    null,
    slug ? slug : "/"
  );
}

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

function goMainPage(event) {
  event.preventDefault();
  eventPage.classList.add("hidden");
  mainPage.classList.remove("hidden");
  handleUrl();
}

function onCardClick(slug) {
  event.preventDefault();
  mainPage.classList.add("hidden");
  eventPage.classList.remove("hidden");
  handleUrl(slug);
  injectEventData(slug);
}

function goPreviousPage() {
  if (currentPage !== 1) {
    currentPage = currentPage - 1;
  }
  displayData();
}
function goNextPage() {
  if (currentPage < totalPage) {
    currentPage = currentPage + 1;
  }
  displayData();
}

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

function setFilterToggle(hasSearch) {
  if (filteredCategories.length || filteredGenres.length || hasSearch) {
    isFilterOn = true;
  } else {
    isFilterOn = false;
  }
}

function setFilteredData(newData) {
  filteredData = [...newData];
}

function onSearch(event) {
  event.preventDefault();
  const searchValue = searchInput.value;

  if (searchValue) {
    const matchedValues = data.filter((el) => {
      const elName = el.name.toLowerCase().trim();
      const SearchValueToCompare = searchValue.toLowerCase().trim();

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

function attachEvents() {
  searchBtn.addEventListener("click", onSearch);
  previousPageBtn.addEventListener("click", goPreviousPage);
  nextPageBtn.addEventListener("click", goNextPage);
  homeLink.addEventListener("click", goMainPage);
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

async function fetchData() {
  const res = await fetch("../data.json");
  const dataJson = await res.json();

  return dataJson;
}

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

function displayGenresData() {
  genreList.innerHTML = "";

  genres.forEach((el) => {
    const isActive = filteredGenres.includes(el);
    const tag = createTag(el, isActive);
    tag.addEventListener("click", onGenreTagClicked);
    genreList.appendChild(tag);
  });
}
function displayCategoriesData() {
  categoryList.innerHTML = "";

  categories.forEach((el) => {
    const isActive = filteredCategories.includes(el);
    const tag = createTag(el, isActive);
    tag.addEventListener("click", onCategoryTagClicked);
    categoryList.appendChild(tag);
  });
}

function setData(newData) {
  newData.forEach((el) => {
    data.push(el);
  });
}

function setGenresData(newData) {
  newData.forEach((el) => {
    if (!genres.includes(el["genre-v2"])) {
      genres.push(el["genre-v2"]);
    }
  });
}

function setCategoriesData(newData) {
  newData.forEach((el) => {
    if (!categories.includes(el.category)) {
      categories.push(el.category);
    }
  });
}

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