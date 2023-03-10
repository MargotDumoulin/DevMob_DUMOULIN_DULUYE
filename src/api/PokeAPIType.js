import {
    POKE_API_WS_BASE_URL,
    POKE_API_WS_LIMIT,
} from "../config/PokeAPIConfig";
import { transformName } from "../utils/methods";

const getTypeId = (json) => {
    return json.url.split("https://pokeapi.co/api/v2/type/")?.[1]?.slice(0, -1);
};

export const getAllTypesLight = async () => {
    const limit = POKE_API_WS_LIMIT;
    let idList = [];
    let typeList = [];
    let offset = 0;
    let count = -1;
    try {
        while (count === -1 || offset < count) {
            console.log(`[GET] : /type (limit : ${limit}, offset : ${offset})`);
            const response = await fetch(
                `${POKE_API_WS_BASE_URL}/type?offset=${offset}&limit=${limit}`
            );
            const json = await response.json();

            idList = [
                ...idList,
                ...json.results.map((item) => getTypeId(item)),
            ];

            count = json.count;
            offset += limit;

            typeList = [
                ...typeList,
                ...json.results.map((type) => {
                    return {
                        name: transformName(type.name),
                        id: getTypeId(type),
                    };
                }),
            ];
        }

        return typeList;
    } catch (error) {
        console.error(error);
    }
};
