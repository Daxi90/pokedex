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
  //console.log(imageUrl);
  console.log(pokemonSingleData);
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
    console.log(pokemon);
    //RENDER IMAGE FROM POKEMON
    let imageUrl = await getSinglePokemonOverviewImage(pokemon["url"]);
    let types = await getSinglePokemonTypes(pokemon["url"]);
    let pokeId = pokemon["url"].split("/")[6];
    // console.log(pokeId);
    //console.log(currentPokemon);
    renderCard(pokemon, types, imageUrl, pokeId);
  }
}

function renderStats(stats) {
  let statsContainer = document.getElementById("pokeModalDetailStats");
  statsContainer.innerHTML = "";

  for (let i = 0; i < stats.length; i++) {
    const stat = stats[i];

    statsContainer.innerHTML += `
    <span>${stats[i]["stat"]["name"]}: ${stats[i]["base_stat"]}</span>
    `;
  }
}

function renderCard(pokemon, types, imageUrl, pokeId) {
  let card = document.createElement("div");
  card.id = `pokemon-${pokemon["name"]}`;
  card.className = "singlePokemonCard";
  card.onclick = function () {
    renderModal(pokeId);
    console.log(pokeId);
  };

  card.innerHTML = /*html*/ `
      <h2 class="singlePokemonCardHeader">${pokemon["name"]}</h2>
      <div class="singlePokemonCardDataContainer">
        <div class="singlePokemonCardDataContainerType">
          <div><span>${types[0]}</span></div>
          <div><span>${types[1]}</span></div> 
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
  let dataUrl = `https://pokeapi.co/api/v2/pokemon/${id}/`;
  let response = await fetch(dataUrl);
  let pokemonDetailData = await response.json();
  let stats = getStats(pokemonDetailData);
  console.log(stats);
  console.log(stats[0]["base_stat"]);
  console.log(stats[0]["stat"]["name"]);

  let modalContainer = document.getElementById("modal-container");
  modalContainer.innerHTML = "";

  modalContainer.innerHTML = /*html*/ `
  <!-- Modal -->
  <div onclick="closeModal()" id="modal" class="modal-background-container">
    <div onclick="doNotClose(event)" class="modal-container">
      <img onclick="closeModal()" id="closePopup" src="./img/iconmonstr-x-mark-thin.svg" alt="">
      <h3 id="pokeModalDetailName">${pokemonDetailData["name"]}</h3>
      <div id="pokeModalDetailStats">
       <!-- renderStats Function --> 
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
