import "./PokemonCard.css";
const PokemonCard = (props) => {
  //this is where you JS goes
  return (
    <fieldset>
      <legend>PokemonCard.jsx</legend>
      <div className="pokemon-card">
        <h2>{props.name}</h2>
        <img src={props.image} alt={props.name} />
        <p>Type: {props.type}</p>
      </div>
    </fieldset>
  );
};

export default PokemonCard;
