import {Link} from 'react-router'
import{useState} from 'react'
import './GalleryView.css'
import {type PokemonDetails} from '../api'

function filterPokemonTypes(selectedTypes: string[], pokemonList: PokemonDetails[]): PokemonDetails[] {
  return pokemonList.filter(pokemon => selectedTypes.every(type => pokemon.types.includes(type)));
}

export default function GalleryView({ pokemonList }: { pokemonList: PokemonDetails[] }) {
  const TYPES = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const filteredPokemonList = filterPokemonTypes(selectedTypes, pokemonList);
  return (
    <>
      <fieldset className="type-filter" aria-label="Filter by Type">
        <legend>Type</legend>
        <div className="type-options">
          {TYPES.map((t) => (
          <label key={t}>
              <input type="checkbox" value={t} checked={selectedTypes.includes(t)} onChange={(e) => {
                if (e.target.checked) {
                  setSelectedTypes(selectedTypes => [...selectedTypes, t]);
                } else {
                  setSelectedTypes(selectedTypes => selectedTypes.filter((v) => v !== t));
                }
              }} />
              {t[0].toUpperCase() + t.slice(1)}
          </label>
          ))}
          </div>
    </fieldset>
    <ul className="poke-gallery">
      {filteredPokemonList.map((item) => (
        <li key={item.name}>
          <Link to={`/detail/${item.name}`} className="poke-card">
            <div className="poke-card-img">
              {item.large_image && <img src={item.large_image} alt={item.name} />}
            </div>
            <span className="poke-card-id">#{item.id}</span>
            <span className="poke-card-name">{item.name}</span>
          </Link>
        </li>
      ))}
    </ul>
    </>
  );
}
