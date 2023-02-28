import {
    POKE_API_WS_BASE_URL,
    POKE_API_WS_LIMIT,
} from "../config/PokeAPIConfig";

const getLocationId = (json) => {
    return json.url.substring(35, json.url.lastIndexOf("/"));
};

const getLocation = (json) => {
    const areaList = json.areas.map((item) => getArea(item));

    return {
        id: json.id,
        name: json.names
            .filter(function (item) {
                return item.language.name === "en";
            })
            .map((item) => item.name)[0],
        areas: areaList,
        coords: {
            x: "", // TODO : a randomiser
            y: "",
        },
    };
};
const getArea = (json) => {
    return Number(json.url.substring(40, json.url.lastIndexOf("/")));
};

export const getAllLocations = async () => {
    const limit = POKE_API_WS_LIMIT;
    let idList = [];
    let locationList = [];
    let offset = 0;
    let count = -1;
    try {
        while (count === -1 || offset < count) {
            console.log(
                `[GET] : /location (limit : ${limit}, offset : ${offset})`
            );
            const response = await fetch(
                `${POKE_API_WS_BASE_URL}/location?offset=${offset}&limit=${limit}`
            );
            const json = await response.json();

            idList = [
                ...idList,
                ...json.results.map((item) => getLocationId(item)),
            ];

            count = json.count;
            offset += limit;
        }

        for (let id of idList) {
            locationList = [...locationList, await getLocationById(id)];
        }

        return locationList;
    } catch (error) {
        console.error(error);
    }
};

export const getLocationById = async (id) => {
    try {
        console.log(`[GET] : /location/:id (id : ${id})`);
        const response = await fetch(`${POKE_API_WS_BASE_URL}/location/${id}`);

        return getLocation(await response.json());
    } catch (error) {
        console.error(error);
    }
};
