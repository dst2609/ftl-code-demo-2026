import PokemonCard from "./Components/PokemonCard/PokemonCard.jsx";

const App = () => {
  const pokemonList = [
    {
      id: 25,
      name: "Pikachu",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
      type: "Electric",
    },
    {
      id: 4,
      name: "Charmander",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
      type: "Fire",
    },
    {
      id: 1,
      name: "Bulbasaur",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
      type: "Grass",
    },
  ];

  return (
    <fieldset>
      <legend>App.jsx</legend>
      <div>
        <h1>App</h1>
        {pokemonList.map((pokemon) => {
          return (
            <PokemonCard
              key={pokemon.id}
              name={pokemon.name}
              image={pokemon.image}
              type={pokemon.type}
            />
          );
        })}
      </div>
    </fieldset>
  );
};

export default App;
