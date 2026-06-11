const PokemonCard = (props) => {
  //this is where you JS goes
  return (
    <fieldset>
      <legend>PokemonCard.jsx</legend>
      <div>
        <h2>{props.name}</h2>
        <img src={props.image} alt={props.name} />
        <h5>Type: {props.type}</h5>
      </div>
    </fieldset>
  );
};

export default PokemonCard;
