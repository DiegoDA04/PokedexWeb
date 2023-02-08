// Pokedex v2
let pokemonData = []

window.addEventListener('DOMContentLoaded', async () => {
    // Data
    pokemonData = await loadPokemons();
   
    // Render Pokemons
    renderPokemons(pokemonData)
    const pokemonCards = document.querySelectorAll(".pokemon__card")

    // Hide loading Screen
    hideLoadingScreen();

    // Show Pokedex
    showPokedex();

    //Pokemon Info
    showPokemonInfo(pokemonCards, pokemonData)
})


// API

const baseUrl = 'https://pokeapi.co/api/v2/'

const loadPokemons = async () => {
    const res = await fetch(`${baseUrl}pokemon?limit=512&offset=0`)
    const data = await res.json();

    const promises = data.results.map( async (pokemon) => {
        const res = await fetch(pokemon.url);
        const data = await res.json();

        return data;
    })

    const results = await Promise.all(promises);

    return results;
}

// Create Pokemons Cards

const createPokemonCards = (pokemons) => pokemons.map( p => `
<div class="pokemon__card ${p.types[0].type.name}" id="${p.id}">
    <div class="pokemon__data">
      <h4 class="pokemon__id">#${p.id.toString().padStart(4,0)}</h4>
      <h2 class="pokemon__name">${p.name}</h2>
      <img src="${p.sprites.other['official-artwork'].front_default}" class="pokemon__img" />
      </div>
    <div class="pokemon__types">
        ${p.types.map( t => `<p class="pokemon__type badge-${t.type.name}">${t.type.name}</p>`).join(" ")} 
    </div> 
</div>`).join(" ")

const createPokemonInfo = (pokemon) => `
  <div class="pokemon-info__data ${pokemon.types[0].type.name}"> 
  <h2 class="pokemon-info__id">#${pokemon.id.toString().padStart(4,0)}</h2>
  <h3 class="pokemon-info__name">${pokemon.name}</h3>
  <img src="${pokemon.sprites.other['official-artwork'].front_default}" class="pokemon-info__img">
    <div class="pokemon-info__types">
        ${pokemon.types.map( t => `<p class="pokemon-info__type badge-${t.type.name}">${t.type.name}</p>`).join(" ")} 
    </div> 
    <div class="pokemon-info__close">
      <i class="fa-solid fa-xmark"></i>
    </div>
  </div> 
  <div class="pokemon-info__options">
    <p class="pokemon-info__item pokemon-info__item--active" id="pokemon-about">About</p>
    <p class="pokemon-info__item " id="pokemon-stats">Stats</p>
    <p class="pokemon-info__item" id="pokemon-evolutions">Evolutions</p>
    <p class="pokemon-info__item" id"pokemon-moves">Moves</p>
  </div>
  <div class="pokemon-info__option">
    <div class="pokemon-info__about">
      <p class="pokemon-info__about-text"> Height: <span>${pokemon.height/ 10} m </span></p>
      <p class="pokemon-info__about-text"> Weight: <span>${pokemon.weight / 10} kg</span></p> 
      <p class="pokemon-info__about-text"> Abilities: <span>${pokemon.abilities.map( a => `${a.ability.name}`).join(", ")}</span></p>  
    </div>
  </div>`

// Render

const container = document.querySelector('.pokemons__wrapper')
const infoContainer = document.querySelector(".pokemon-info")

const renderPokemons = (pokemons) => {
    const items = createPokemonCards(pokemons)
    container.innerHTML = items;
}

const renderPokemonInfo = (pokemon) => {
    const item = createPokemonInfo(pokemon)
    infoContainer.innerHTML = item;
}

// Loading

const load = document.querySelector(".load");

const hideLoadingScreen = () => load.classList.add("hidden")

// Pokedex Screen

const main = document.querySelector(".main")

const showPokedex = () => main.classList.remove("hidden")

// Events 

const input = document.querySelector(".main__input")

input.addEventListener("keyup", (e) => {
    const newPokemons = pokemonData.filter( p => p.name.includes(input.value.toLowerCase()));

    if(input.value.length !== 0) {
      renderPokemons(newPokemons) 
    } else{
      renderPokemons(pokemonData)
    }
    const cards = document.querySelectorAll(".pokemon__card")

    showPokemonInfo(cards,pokemonData) 
})

const showPokemonInfo = (cards, pokemons) => cards.forEach(c => c.addEventListener('click', () => {
    
    infoContainer.classList.add('front')
    infoContainer.classList.remove('hidden')
    main.classList.add("back")

    renderPokemonInfo(pokemons[c.id - 1])

    const closeBtn = document.querySelector('.pokemon-info__close')

    closeBtn.addEventListener('click', () => {
        main.classList.remove('hidden')
        infoContainer.classList.add('hidden')
    })

}))


