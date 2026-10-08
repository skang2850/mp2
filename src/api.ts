import axios from 'axios';

export type PokemonListItem = {name: string; url: string};

type RawPokemonDetails = {
    id: number;
    name: string;
    height: number;
    weight: number;
    base_experience: number;
    types: { slot: number; type: { name: string; url: string } }[];
    sprites: {
        front_default: string | null;
        other: {
            "official-artwork": {front_default: string | null};
        };
    };
};

export type PokemonDetails = {
    id: number;
    name: string;
    height: number;
    weight: number;
    base_experience: number;
    types: string[];
    small_image: string | null;
    large_image: string | null;
};

let pokemonListCache: Promise<PokemonListItem[]> | null = null;
const pokemonCache = new Map<string, Promise<PokemonDetails>>();

export const getPokemonList = (): Promise<PokemonListItem[]> => {
    if (!pokemonListCache) {
        pokemonListCache = axios.get<{results: PokemonListItem[]}>('https://pokeapi.co/api/v2/pokemon?limit=200')
            .then(({data}) => data.results)
            .catch((error) => {
                pokemonListCache = null; // allow a retry after failure
                throw error;
            });
    }
    return pokemonListCache;
};

export const getPokemonDetails = (name: string,url: string): Promise<PokemonDetails> => {
    const cachedPokemon = pokemonCache.get(name);
    if (cachedPokemon) {
        return cachedPokemon;
    }

    const promise = axios.get<RawPokemonDetails>(url)
                    .then(({data}) => ({
                        id: data.id,
                        name: data.name,
                        height: data.height*10,
                        weight: data.weight/10,
                        base_experience: data.base_experience,
                        types: data.types.map(t => t.type.name),
                        small_image: data.sprites.front_default,
                        large_image: data.sprites.other["official-artwork"].front_default,
                    }))
                    .catch((error) => {
                        if (pokemonCache.get(name) === promise) pokemonCache.delete(name);
                        throw error;
                    });
    pokemonCache.set(name, promise);
    return promise;
}

export const getDetailedPokemonList = async (): Promise<PokemonDetails[]> => {
    const list = await getPokemonList();
    let promiseList = await Promise.allSettled(list.map(item => getPokemonDetails(item.name, item.url)));
    promiseList = promiseList.filter((result)=> result.status === 'fulfilled');
    const pokeList = promiseList.map((result) => (result as PromiseFulfilledResult<PokemonDetails>).value);
    return pokeList;
}
