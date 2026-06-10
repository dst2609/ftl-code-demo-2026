const input = document.getElementById("pokemonInput");
const button = document.getElementById("searchBtn");
const result = document.getElementById("result");

button.addEventListener("click", async () => {
  try {
    const pokemonName = input.value.toLocaleLowerCase();

    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
    );
    // if the api could not find the pokemon
    if (!response.ok) {
      throw new Error("Pokemon not found, nooob");
    }

    const data = await response.json();

    result.innerHTML = `
    <h2>${data.name}</h2>
    <img src="${data.sprites.front_default}" />
    `;
  } catch (error) {
    console.error(error);
  }
});
