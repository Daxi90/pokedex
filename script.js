let currentPokemon;
let limit = 30;
let offset = 0;
let isLoading = false;

let AUDIO_INTRO = new Audio("./audio/Pokemon-Theme-Song.mp3");
AUDIO_INTRO.volume = 0.2;

let tl = gsap.timeline();

function animateCard(card) {
  tl.from(
    card,
    {
      opacity: 0,
      x: -200,
      rotate: 90,
      duration: 0.5,
      delay: 0.05,
      ease: "back.out(1.7)",
    },
    "+=0.1"
  );
}

document.addEventListener("keydown", function (event) {
  if (event.code === "ArrowRight") {
    nextPokemon();
  }
  if (event.code === "ArrowLeft") {
    previousPokemon();
  }

  if (event.code === "Escape") {
    closeModal();
  }
});

function nextPokemon() {
  if (currentPokemon <= 1281) {
    currentPokemon++;
    renderModal(currentPokemon);
  }
}

function previousPokemon() {
  if (currentPokemon > 1) {
    currentPokemon--;
    renderModal(currentPokemon);
  }
}

function doNotClose(event) {
  event.stopPropagation();
}

async function loadPokedex() {
  let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  let response = await fetch(url);

  pokemonSet = await response.json();
  offset = offset + 30;
  renderPokemonIndex(pokemonSet);
}

async function getSinglePokemonOverviewImage(url) {
  let response = await fetch(url);
  let pokemonSingleData = await response.json();
  let imageUrl =
    pokemonSingleData["sprites"]["other"]["official-artwork"]["front_default"];
  return imageUrl;
}

function getStats(pokemonDetailData) {
  let stats = pokemonDetailData["stats"];
  return stats;
}

async function getSinglePokemonTypes(url) {
  let typeArray = [];

  let response = await fetch(url);
  let pokemonSingleData = await response.json();
  let types = pokemonSingleData["types"];

  for (let i = 0; i < types.length; i++) {
    const type = types[i]["type"]["name"];
    typeArray.push(type);
  }
  return typeArray;
}

async function renderPokemonIndex(pokemonSet) {
  let pokedex = document.getElementById("pokedex");

  for (let i = 0; i < pokemonSet["results"].length; i++) {
    const pokemon = pokemonSet["results"][i];
    //RENDER IMAGE FROM POKEMON
    let imageUrl = await getSinglePokemonOverviewImage(pokemon["url"]);
    let types = await getSinglePokemonTypes(pokemon["url"]);
    let pokeId = pokemon["url"].split("/")[6];
    renderCard(pokemon, types, imageUrl, pokeId);
  }
}

function renderStats(stats) {
  let statsContainer = document.getElementById("pokeModalDetailStats");
  statsContainer.innerHTML = "";

  for (let i = 0; i < stats.length; i++) {
    const stat = stats[i];

    statsContainer.innerHTML += `
    <div class="popupsingleStat">
      <span class="leftStatBar">${stats[i]["stat"]["name"]}</span>
      <div class="rightStatBar progress" role="progressbar" aria-valuenow="${stats[i]["base_stat"]}" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar" style="width: ${stats[i]["base_stat"]}%">${stats[i]["base_stat"]}</div>
      </div>
      <span></span>
    </div>
    <div class="popupline"></div>
    `;
  }
}

function renderCard(pokemon, types, imageUrl, pokeId) {
  let type1 = types[0] || "nothing";
  let type2 = types[1] || "nothing";

  let typeClass1;
  let typeClass2;

  if (type1 == "nothing") {
    typeClass1 = "d-none";
  } else {
    typeClass1 = type1;
  }

  if (type2 == "nothing") {
    typeClass2 = "d-none";
  } else {
    typeClass2 = type2;
  }

  let card = document.createElement("div");
  card.id = `pokemon-${pokemon["name"]}`;
  card.className = "singlePokemonCard";
  card.onclick = function () {
    renderModal(pokeId);
  };

  card.innerHTML = /*html*/ `
      <h2 class="singlePokemonCardHeader">${pokemon["name"]}</h2>
      <div class="singlePokemonCardDataContainer">
        <div class="singlePokemonCardDataContainerType">
          <div><span class="${typeClass1}">${type1}</span></div>
          <div><span class="${typeClass2}">${type2}</span></div> 
        </div>
        <div class="singlePokemonCardDataContainerImage">
          <img src="${imageUrl}" alt="">
        </div>
      </div>
    `;
  // Hier fügen wir die pokeId hinzu
  card.dataset.pokeId = pokeId;

  pokedex.appendChild(card);
  animateCard(card);
}

function closeModal() {
  document.getElementById("modal").classList.add("d-none");
}

async function renderModal(id) {
  currentPokemon = id;
  let dataUrl = `https://pokeapi.co/api/v2/pokemon/${id}/`;
  let response = await fetch(dataUrl);
  let pokemonDetailData = await response.json();
  let stats = getStats(pokemonDetailData);

  let modalContainer = document.getElementById("modal-container");
  modalContainer.innerHTML = "";

  modalContainer.innerHTML = /*html*/ `
  <!-- Modal -->
  <div onclick="closeModal()" id="modal" class="modal-background-container">
    <div onclick="doNotClose(event)" class="popupsinglePokemonCard">
    <div class="popupsinglePokemonCardHeader">
      <span class="popupsinglePokemonCardNumber">#${pokemonDetailData["id"]}</span>
      <img class="popupsinglePokemonCardPokemon" src="${pokemonDetailData["sprites"]["other"]["official-artwork"]["front_default"]}" alt="">
    </div>
    <div class="popupsinglePokemonCardBody">
      <img onclick="previousPokemon()" style="cursor: pointer; width: 30px; position: absolute; top:38px; left: 16px;" src="./img/left-arrow.png" alt="">
      <img onclick="nextPokemon()" style="cursor: pointer; width: 30px;  position: absolute; top:38px; right: 16px; transform: rotate(180deg)" src="./img/left-arrow.png" alt="">
      <span class="popupsinglePokemonCardBodyName">${pokemonDetailData["name"]}</span>
      <div id="pokeModalDetailStats" class="popupsinglePokemonCardBodyStatsContainer">
        <!-- Render Stats Function -->
      </div>
    </div>
  </div>
  `;

  renderStats(stats);
}

window.onscroll = async function () {
  if (
    window.innerHeight + window.pageYOffset >= document.body.offsetHeight &&
    !isLoading
  ) {
    // Funktion aufrufen, wenn am Ende der Seite angelangt
    isLoading = true;
    await loadPokedex();
    isLoading = false;
  }
};
