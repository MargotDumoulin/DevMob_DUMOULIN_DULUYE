import {
    POKE_API_WS_BASE_URL,
    POKE_API_WS_LIMIT,
} from "../config/PokeAPIConfig";

const getPokemonBaseStat = (stats, name) => {
    return stats
        .filter(function (item) {
            return item.stat.name === name;
        })
        .map((item) => item.base_stat)[0];
};

export const getPokemonId = (url) => {
    return url.split("https://pokeapi.co/api/v2/pokemon/")?.[1]?.slice(0, -1);
};

const getArea = (json) => {
    return Number(
        json.location_area.url.substring(
            40,
            json.location_area.url.lastIndexOf("/")
        )
    );
};

const getPokemon = (pokemon, encounter) => {
    const abilityList = pokemon.types.map((item) => item.type.name);
    const typeList = pokemon.types.map((item) => item.type.name);
    const locationList = encounter.map((item) => getArea(item));

    return {
        id: pokemon.id,
        name: pokemon.name,
        types: typeList,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
        locations: locationList,
        abilities: abilityList,
        height: pokemon.height,
        weight: pokemon.weight,
        baseStats: {
            healthPoint: getPokemonBaseStat(pokemon.stats, "hp"),
            attack: getPokemonBaseStat(pokemon.stats, "attack"),
            defense: getPokemonBaseStat(pokemon.stats, "defense"),
            attackSpe: getPokemonBaseStat(pokemon.stats, "special-attack"),
            defenseSpe: getPokemonBaseStat(pokemon.stats, "special-defense"),
            speed: getPokemonBaseStat(pokemon.stats, "speed"),
        },
    };
};

export const getPokemonsWithDetails = async (
    pokemonsCached,
    addPokemonDetails,
    page = 1
) => {
    try {
        const limit = 20;
        const offset = (page - 1) * limit;
        const url = `${POKE_API_WS_BASE_URL}/pokemon?offset=${offset}&limit=${limit}`;
        const response = await fetch(url);
        const json = await response.json();

        const pokemonsWithoutDetails = json.results;
        const pokemonsWithDetails = [];

        for (const pokemon of pokemonsWithoutDetails) {
            const pokeDetails = await getPokemonById(getPokemonId(pokemon.url));
            pokemonsWithDetails.push({
                ...pokemon,
                ...pokeDetails,
            });
        }

        return { ...json, results: pokemonsWithDetails };
    } catch (error) {
        console.log(
            `Error with function getPokemonsWithDetails: ${error.message}`
        );
        throw error;
    }
};

// Used in order to create a cache
export const getAllPokemons = async (offset = 0) => {
    try {
        let limit = 1300;
        let response = await fetch(
            `${POKE_API_WS_BASE_URL}/pokemon?limit=${limit}`
        );
        let json = await response.json();
        let pokemonsWithoutDetails = json.results;
        let isThereAnyMore = json.next;

        while (isThereAnyMore) {
            offset = limit + offset;
            limit = json.count;
            response = await fetch(
                `${POKE_API_WS_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
            );
            json = await response.json();
            isThereAnyMore = json.next;
            pokemonsWithoutDetails = [
                ...pokemonsWithoutDetails,
                ...json.results,
            ];
        }

        return { ...json, results: pokemonsWithoutDetails };
    } catch (error) {
        console.log(`Error with function getCachedPokemons: ${error.message}`);
        throw error;
    }
};

export const getPokemonById = async (id) => {
    try {
        console.log(`[GET] : /pokemon/:id (id : ${id})`);
        const response = await fetch(`${POKE_API_WS_BASE_URL}/pokemon/${id}`);

        return getPokemon(
            await response.json(),
            await getPokemonEncounterById(id)
        );
    } catch (error) {
        console.error(error);
    }
};

export const getPokemonEncounterById = async (id) => {
    try {
        console.log(`[GET] : /pokemon/:id/encounters (id : ${id})`);
        const response = await fetch(
            `${POKE_API_WS_BASE_URL}/pokemon/${id}/encounters`
        );

        return await response.json();
    } catch (error) {
        console.error(error);
    }
};
