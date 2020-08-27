let data = [];

async function fetchData() {
  const res = await fetch("../data.json");
  const dataJson = await res.json();

  const list = document.getElementById("list");

  dataJson.forEach((el) => {
    const card = createCard(el);
    list.appendChild(card);
  });
}

function createCard(data) {
  // Create card & add class
  const card = document.createElement("LI");
  card.classList.add("card");

  // Link
  const link = document.createElement("A");
  link.href = data.slug;

  // Add link to card
  card.appendChild(link);

  const divHeader = document.createElement("DIV");
  divHeader.classList.add("header");
  const divBody = document.createElement("DIV");
  divBody.classList.add("body");

  link.appendChild(divHeader);
  link.appendChild(divBody);

  if (data.genre) {
    const tag = document.createElement("SPAN");
    tag.classList.add("tag");
    tag.innerText = data.genre;
    divHeader.appendChild(tag);
  }

  const play = document.createElement("div");
  play.classList.add("play-btn");

  divHeader.appendChild(play);

  const title = document.createElement("h3");
  title.innerText = data.name;
  const desc = document.createElement("p");
  desc.innerText = data.excerpt;
  const time = document.createElement("div");
  time.innerText = "100 min";

  divBody.appendChild(title);
  divBody.appendChild(desc);
  divBody.appendChild(time);

  return card;
}

fetchData();