// Pokedex v2
let pokemonData = []

window.addEventListener('DOMContentLoaded', async () => {
    // Data
    pokemonData = await loadPokemons();
   
    // Render Pokemons
    renderPokemons(pokemonData)

    // Hide loading Screen
    hideLoadingScreen();

    // Show Pokedex
    showPokedex();
})


// API

const baseUrl = 'https://pokeapi.co/api/v2/'

const loadPokemons = async () => {
    const res = await fetch(`${baseUrl}pokemon?limit=100000&offset=0`)
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
<div class="pokemon__card ${p.types[0].type.name}">
    <div class="pokemon__data">
      <h4 class="pokemon__id">#${p.id.toString().padStart(3,0)} </h4>
      <h2 class="pokemon__name">${p.name}</h2>
      <img src="${p.sprites.other['official-artwork'].front_default}" class="pokemon__img" />
      </div>
    <div class="pokemon__types">
        ${p.types.map( t => `<p class="pokemon__type badge-${t.type.name}">${t.type.name}</p>`).join(" ")} 
    </div> 
</div>`).join(" ")

// Render

const container = document.querySelector('.pokemons__wrapper')

const renderPokemons = (pokemons) => {
    const items = createPokemonCards(pokemons)
    container.innerHTML = items;
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

    input.value.length !== 0 ? renderPokemons(newPokemons) : renderPokemons(pokemonData)
})