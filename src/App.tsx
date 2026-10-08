import './App.css'
import 'normalize.css'
import {Outlet, Routes, Route, Link} from 'react-router'
import {useEffect, useState} from 'react'
import {getDetailedPokemonList, type PokemonDetails} from './api'
import ListView from './components/ListView'
import GalleryView from './components/GalleryView'
import DetailView from './components/DetailView'


function NavLayout() {
  return (
    <>
      <nav>
        <Link to="/">List</Link> <Link to="/gallery">Gallery</Link>
      </nav>
      <Outlet />
    </>   
  );
}

export default function App() {
  const [pokemonList, setPokemonList] = useState<PokemonDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDetailedPokemonList()
      .then(results => setPokemonList(results))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <h1>Pokemon Index</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
      <Routes>
        <Route element={<NavLayout/>}>
          <Route path="/" element={<ListView pokemonList={pokemonList} />} />
          <Route path="/gallery" element={<GalleryView pokemonList={pokemonList} />} />
        </Route>
          <Route path="/detail/:name" element={<DetailView pokemonList={pokemonList} />} />
      </Routes>
      )}
    </main>
  )
}

