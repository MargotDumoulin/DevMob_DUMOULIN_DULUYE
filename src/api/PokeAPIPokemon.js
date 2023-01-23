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

const getPokemonId = (json) => {
    return Number(json.url.substring(34, json.url.lastIndexOf("/")));
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
    const abilityList = pokemon.abilities.map((item) => item.ability.name);
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

export const getAllPokemon = async () => {
    const limit = POKE_API_WS_LIMIT;
    let idList = [];
    let pokemonList = [];
    let offset = 0;
    let count = -1;
    try {
        while (count === -1 || offset < count) {
            console.log(
                `[GET] : /pokemon (limit : ${limit}, offset : ${offset})`
            );
            const response = await fetch(
                `${POKE_API_WS_BASE_URL}/pokemon?offset=${offset}&limit=${limit}`
            );
            const json = await response.json();

            idList = [
                ...idList,
                ...json.results.map((item) => getPokemonId(item)),
            ];

            count = json.count;
            offset += limit;
        }

        for (let id of idList) {
            pokemonList = [...pokemonList, await getPokemonById(id)];
        }

        return pokemonList;
    } catch (error) {
        console.error(error);
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
