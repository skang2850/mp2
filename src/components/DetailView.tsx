import {Link, useParams} from 'react-router'
import './DetailView.css'
import {type PokemonDetails} from '../api'

export default function DetailView({pokemonList} : { pokemonList: PokemonDetails[] }) {
  const {name} = useParams()
  const pokemonIndex = pokemonList.findIndex(p => p.name === name)
  const pokemon = pokemonList[pokemonIndex]
    if (!pokemon) {
    return <p>Error: Cannot find Pokemon</p>
  }
  const prevPokemon = pokemonList[(pokemonIndex - 1 + pokemonList.length) % pokemonList.length]
  const nextPokemon = pokemonList[(pokemonIndex + 1) % pokemonList.length]
  return (
    <div className="detail">
      <nav className="detail-back">
          <Link to="/">Back</Link>
      </nav>
      <h2>{pokemon.name}</h2>
      {pokemon.large_image && <img src={pokemon.large_image} alt={pokemon.name} />}
      <dl className="detail-info">
        <dt>ID</dt>
        <dd>#{pokemon.id}</dd>
        <dt>Height</dt>
        <dd>{pokemon.height} cm</dd>
        <dt>Weight</dt>
        <dd>{pokemon.weight} kg</dd>
        <dt>Base Experience</dt>
        <dd>{pokemon.base_experience}</dd>
        <dt>Types</dt>
        <dd className="capitalize">{pokemon.types.join(', ')}</dd>
      </dl>
      <nav className="detail-pager">
        <Link to={`/detail/${prevPokemon.name}`}>Previous</Link>
        <Link to={`/detail/${nextPokemon.name}`}>Next</Link>
      </nav>
    </div>
  )
}
