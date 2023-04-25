let currentPokemon;
let limit = 10;
let offset = 0;
let loadMoreUrl;

async function loadPokedex() {
  let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  let response = await fetch(url);

  currentPokemon = await response.json();
  renderPokemonIndex(currentPokemon);
}

async function getSinglePokemonOverviewImage(url) {
  let response = await fetch(url);
  let pokemonSingleData = await response.json();
  let imageUrl =
    pokemonSingleData["sprites"]["other"]["official-artwork"]["front_default"];
  //console.log(imageUrl);
  return imageUrl;
}

async function renderPokemonIndex(currentPokemon) {
  let pokedex = document.getElementById("pokedex");
  for (let i = 0; i < currentPokemon["results"].length; i++) {
    const pokemon = currentPokemon["results"][i];
    console.log(pokemon);
    //RENDER IMAGE FROM POKEMON
    let imageUrl = await getSinglePokemonOverviewImage(pokemon["url"]);

    //console.log(currentPokemon);
    pokedex.innerHTML += /*html*/ `

            <div class="card col-lg-3 col-12" id="pokemon-${pokemon["name"]} style="width: 18rem;">
              <img src="${imageUrl}" class="card-img-top" alt="...">
              <div class="card-body">
                  <h5 class="card-title text-capitalize">${pokemon["name"]}</h5>
                  <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  <a onclick="renderModal('${pokemon["name"]}')" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Details</a> 
              </div>
            </div>        
        `;
  }

  loadMoreUrl = currentPokemon["next"];
  //console.log(loadMoreUrl);
}

async function loadMore(loadMoreUrl) {
  let response = await fetch(loadMoreUrl);
  nextPokemon = await response.json();
  renderPokemonIndex(nextPokemon);
}

function renderModal(name) {
  let modalContainer = document.getElementById("modal-container");
  modalContainer.innerHTML = '';

  modalContainer.innerHTML = /*html*/ `
  <!-- Modal -->
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">
            ${name}
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">...</div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>

  `;
}
