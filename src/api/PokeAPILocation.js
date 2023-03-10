import {
    POKE_API_WS_BASE_URL,
    POKE_API_WS_LIMIT,
} from "../config/PokeAPIConfig";
import { geo32, transformName } from "../utils/methods";

const getLocationId = (json) => {
    return json.url.substring(35, json.url.lastIndexOf("/"));
};

const getLocation = (json) => {
    const areaList = json.areas.map((item) => getArea(item));
    const name = json.names
        .filter((item) => item.language.name === "en")
        .map((item) => item.name)[0];
    const coords = geo32(name);

    return {
        id: json.id,
        name: name,
        areas: areaList,
        coords: {
            x: coords.long,
            y: coords.lat,
        },
    };
};

const getArea = (json) => {
    return Number(json.url.substring(40, json.url.lastIndexOf("/")));
};

export const getAllLocationsLight = async () => {
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

            locationList = [
                ...locationList,
                ...json.results.map((location) => {
                    return {
                        name: transformName(location.name),
                        coords: geo32(location.name),
                        id: getLocationId(location),
                    };
                }),
            ];
        }

        return locationList;
    } catch (error) {
        console.error(error);
    }
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
