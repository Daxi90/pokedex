let currentPokemon;
let limit = 50;
let offset = 0;
let isLoading = false;

let tl = gsap.timeline();

// function animateCard(card) {
//   tl.from(card, {opacity: 0, x: -200, rotate: 180, duration: 0.1}, "+=0.1");
// }
function animateCard(card) {
  tl.from(
    card,
    {
      opacity: 0,
      x: 200,
      rotate: 90,
      duration: 0.5,
      delay: 0.05,
      ease: "back.out(1.7)",
    },
    "+=0.1"
  );
}

async function loadPokedex() {
  let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  let response = await fetch(url);

  pokemonSet = await response.json();
  offset = offset + 50;
  renderPokemonIndex(pokemonSet);
}

async function getSinglePokemonOverviewImage(url) {
  let response = await fetch(url);
  let pokemonSingleData = await response.json();
  let imageUrl =
    pokemonSingleData["sprites"]["other"]["official-artwork"]["front_default"];
  //console.log(imageUrl);
  return imageUrl;
}

async function renderPokemonIndex(pokemonSet) {
  let pokedex = document.getElementById("pokedex");

  for (let i = 0; i < pokemonSet["results"].length; i++) {
    const pokemon = pokemonSet["results"][i];
    console.log(pokemon);
    //RENDER IMAGE FROM POKEMON
    let imageUrl = await getSinglePokemonOverviewImage(pokemon["url"]);

    //console.log(currentPokemon);
    let card = document.createElement("div");
    card.id = `pokemon-${pokemon["name"]}`;
    card.className = "singlePokemonCard";
    card.onclick = function () {
      renderModal(pokemon["name"]);
    };

    card.innerHTML = /*html*/ `
      <h2 class="singlePokemonCardHeader">${pokemon["name"]}</h2>
      <div class="singlePokemonCardDataContainer">
        <div class="singlePokemonCardDataContainerType">
          <div><span>Grass</span></div>
          <div><span>Poison</span></div> 
        </div>
        <div class="singlePokemonCardDataContainerImage">
          <img src="${imageUrl}" alt="">
        </div>
      </div>
    `;

    pokedex.appendChild(card);

    animateCard(card);
  }
}

function closeModal() {
  document.getElementById("modal").classList.add("d-none");
}

function renderModal(name) {
  let modalContainer = document.getElementById("modal-container");
  modalContainer.innerHTML = "";

  modalContainer.innerHTML = /*html*/ `
  <!-- Modal -->
  <div onclick="closeModal()" id="modal" class="modal-background-container">
    <div class="modal-container">
      <span>${name}</span>
    </div>
  </div>
  `;
}

window.onscroll = async function () {
  if (
    window.innerHeight + window.pageYOffset >= document.body.offsetHeight &&
    !isLoading
  ) {
    // Funktion aufrufen, wenn am Ende der Seite angelangt
    isLoading = true;
    console.log("Pokemon nachladen");
    await loadPokedex();
    isLoading = false;
  }
};
