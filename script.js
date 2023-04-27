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

var initialX;
var swipeOccurred = false;

document.addEventListener("touchstart", function(event) {
  initialX = event.touches[0].clientX;
  swipeOccurred = false;
});

document.addEventListener("touchmove", function(event) {
  if (!swipeOccurred) {
    var currentX = event.touches[0].clientX;
    var diffX = initialX - currentX;

    if (diffX > 0) { // swipe left
      if (currentPokemon <= 1281) {
        currentPokemon++;
        renderModal(currentPokemon);
        swipeOccurred = true;
      }
    } else if (diffX < 0) { // swipe right
      if (currentPokemon > 1) {
        currentPokemon--;
        renderModal(currentPokemon);
        swipeOccurred = true;
      }
    }
  }
});

document.addEventListener("keydown", function (event) {
  if (event.code === "ArrowRight") {
    if (currentPokemon <= 1281) {
      currentPokemon++;
      renderModal(currentPokemon);
    }
  }
  if (event.code === "ArrowLeft") {
    if (currentPokemon > 1) {
      currentPokemon--;
      renderModal(currentPokemon);
    }
  }

  if (event.code === "Escape") {
    closeModal();
  }
});

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

function getTypeClass(type){
  let typeClass = "default";

  if(type == "grass"){
    typeClass = "grass";
  }else if(type == "fire"){
    typeClass = "fire";
  }else if(type == "water"){
    typeClass = "water";
  }else if(type == "bug"){
    typeClass = "bug";
  }else if(type == "normal"){
    typeClass = "normal";
  }else if(type == "poison"){
    typeClass = "poison";
  }else if(type == "electric"){
    typeClass = "electric";
  }else if(type == "ground"){
    typeClass = "ground";
  }else if(type == "psychic"){
    typeClass = "psychic";
  }else if(type == "fairy"){
    typeClass = "fairy";
  }else if(type == "fighting"){
    typeClass = "fighting";
  }else if(type == "ghost"){
    typeClass = "ghost";
  }else if(type == "rock"){
    typeClass = "rock";
  }else if(type == "flying"){
    typeClass = "flying";
  }else if(type == "dragon"){
    typeClass = "dragon";
  }else if(type == "nothing"){
    typeClass = "d-none";
  }else if(type == "ice"){
    typeClass = "ice";
  }

  return typeClass;
  
}

function renderCard(pokemon, types, imageUrl, pokeId) {
  let type1 = types[0] || "nothing";
  let type2 = types[1] || "nothing";

  let type1Class = getTypeClass(type1);
  let type2Class = getTypeClass(type2);




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
          <div><span class="${type1Class}">${type1}</span></div>
          <div><span class="${type2Class}">${type2}</span></div> 
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
