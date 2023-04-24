let currentPokemon;
let limit = 20;
let offset = 0;
let loadMoreUrl;

async function loadPokedex() {
  let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  let response = await fetch(url);

  currentPokemon = await response.json();
  renderPokemonIndex(currentPokemon);
}

function renderPokemonIndex(currentPokemon) {

    let pokedex = document.getElementById('pokedex');
  for (let i = 0; i < currentPokemon["results"].length; i++) {
    const pokemon = currentPokemon["results"][i];
    console.log(currentPokemon);
    pokedex.innerHTML += /*html*/ `

            <div class="card" id="pokemon-${pokemon["name"]} style="width: 18rem;">
            <img src="..." class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${pokemon["name"]}</h5>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" class="btn btn-primary">Details</a>
            </div>
            </div>        
        `;
    // FOR LOOP RENDER IMAGE FROM POKEMON 
  }

  loadMoreUrl = currentPokemon["next"];
  console.log(loadMoreUrl);
}

async function loadMore(loadMoreUrl) {
    let response = await fetch(loadMoreUrl);
    nextPokemon = await response.json();
    renderPokemonIndex(nextPokemon);
  }
