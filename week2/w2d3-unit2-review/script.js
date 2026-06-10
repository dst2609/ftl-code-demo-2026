const input = document.getElementById("pokemonInput");
const button = document.getElementById("searchBtn");
const result = document.getElementById("result");

button.addEventListener("click", async function () {
  try {
    const pokemonName = input.value.toLowerCase();

    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
    );

    // If the API couldn't find the Pokémon
    if (!response.ok) {
      throw new Error("Pokemon not found");
    }

    const data = await response.json();

    result.innerHTML = `
      <h2>${data.name}</h2>
      <img src="${data.sprites.front_default}" />
      <p>Height: ${data.height}</p>
      <p>Weight: ${data.weight}</p>
      <p>Type: ${data.types[0].type.name}</p>
    `;
  } catch (error) {
    result.innerHTML = `
      <h2>Oops!</h2>
      <p>Pokemon not found. Try again.</p>
    `;

    console.log(error);
  }
});
