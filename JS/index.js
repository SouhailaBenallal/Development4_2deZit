let data = [];

async function fetchData() {
  const res = await fetch("../data.json");
  const dataJson = await res.json();

  return dataJson;
}

function displayData() {
  const list = document.getElementById("list");

  data.forEach((el) => {
    const card = createCard(el);
    list.appendChild(card);
  });
}

function hydrateData(newData) {
  const copyData = [...newData];
  data = copyData;
}

function createCard(d) {
  // Create card & add class
  const card = document.createElement("LI");
  card.classList.add("card");

  // Link
  const link = document.createElement("A");
  link.href = d.slug;

  // Add link to card
  card.appendChild(link);

  const divHeader = document.createElement("DIV");
  divHeader.classList.add("header");
  const divBody = document.createElement("DIV");
  divBody.classList.add("body");

  link.appendChild(divHeader);
  link.appendChild(divBody);

  if (d.genre) {
    const tag = document.createElement("SPAN");
    tag.classList.add("tag");
    tag.innerText = d.genre;
    divHeader.appendChild(tag);
  }

  const play = document.createElement("div");
  play.classList.add("play-btn");

  divHeader.appendChild(play);

  const title = document.createElement("h3");
  title.innerText = d.name;
  const desc = document.createElement("p");
  desc.innerText = d.excerpt;
  const time = document.createElement("div");
  time.innerText = "100 min";

  divBody.appendChild(title);
  divBody.appendChild(desc);
  divBody.appendChild(time);

  return card;
}

(async function () {
  const dataFetched = await fetchData();
  hydrateData(dataFetched);
  displayData();
})();