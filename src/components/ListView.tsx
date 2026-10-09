import {Link} from 'react-router'
import {useState} from 'react'
import './ListView.css'
import {type PokemonDetails} from '../api'

type SortKey = 'id' | 'name' | 'height';

const getFilteredPokemonList = (query: string, pokemonList: PokemonDetails[]): PokemonDetails[] => {
  const trimmed = query.trim().toLowerCase();
  return pokemonList.filter(pokemon => pokemon.name.toLowerCase().includes(trimmed) || String(pokemon.id).startsWith(trimmed));
};

function comparePokemonId(a: PokemonDetails, b: PokemonDetails): number {
  if (a.id < b.id){
    return -1;
  } else if (a.id > b.id) {
    return 1;
  }
  return 0;
}

function comparePokemonName(a: PokemonDetails, b: PokemonDetails): number{
  return a.name.localeCompare(b.name);
}

function comparePokemonHeight(a: PokemonDetails, b: PokemonDetails): number{
  if (a.height < b.height){
    return -1;
  } else if (a.height > b.height) {
    return 1;
  }
  return 0;
}

const sortMap: Record<SortKey, (a: PokemonDetails, b: PokemonDetails) => number> = {
  id: comparePokemonId,
  name: comparePokemonName,
  height: comparePokemonHeight,
};

const getSortedPokemonList = (sortBy: SortKey, searchAsc: boolean, pokemonList: PokemonDetails[]): PokemonDetails[] => {
  const comparator = sortMap[sortBy];
  const multiplier = searchAsc ? 1 : -1;
  return pokemonList.sort((a, b) => multiplier * comparator(a, b));
}

export default function ListView({ pokemonList }: { pokemonList: PokemonDetails[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>('id');
  const [searchAsc, setSearchAsc] =  useState<boolean>(true);


  const filteredPokemonList = getFilteredPokemonList(searchQuery, pokemonList);
  const sortedPokemonList = getSortedPokemonList(sortBy, searchAsc, filteredPokemonList);

  return (
    <>
      <div className="list-toolbar">
        <div className="list-search">
          <label htmlFor="search">Search</label>
          <input id="search" type="text" placeholder="ID or Name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>

        <div className="list-sort">
            <select name="sort" id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)}>
              <option value="id">Sort by ID</option>
              <option value="name">Sort by Name</option>
              <option value="height">Sort by Height</option>
            </select>
          <div className="sort-dir" role="group" aria-label="Sort Direction">
            <button type="button" aria-pressed={searchAsc} onClick={() => setSearchAsc(true)}>Ascending</button>
            <button type="button" aria-pressed={!searchAsc} onClick={() => setSearchAsc(false)}>Descending</button>
          </div>
         </div>
      </div>
      {sortedPokemonList.length === 0 &&  <p className="no-results">No Pokemon found</p>}
      <ul className="poke-list">
        {sortedPokemonList.map((item) => (
          <li key={item.name}>
            <Link to={`/detail/${item.name}`} className="poke-row">
              <span className="poke-id">#{item.id}</span>
              <span className="poke-img">
                {item.small_image && <img src={item.small_image} alt={item.name} />}
              </span>
              <span className="poke-name">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
