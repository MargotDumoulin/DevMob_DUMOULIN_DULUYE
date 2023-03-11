export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const transformName = (str) =>
    str
        .replace(/-/g, " ")
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

export const geo32 = (str) => {
    let position;
    let coords = {
        lat: {
            min: -90,
            max: 90,
        },
        long: {
            min: -180,
            max: 180,
        },
        last: "lat",
    };

    let tabBinary = // Conversion de la chaîne de caractères en binaire 8 bits
        str
            .split("")
            .map((char) => char.charCodeAt(0).toString(2))
            .map((ascii) => makeOn8digit(ascii))
            .map((ascii) => ascii.substring(5))
            .join("")
            .split("");

    tabBinary.forEach((bit) => {
        // Recherche dichotomique selon la chaîne de caractère
        if (coords.last === "lat") {
            coords.long = dichotomicSearch(bit, coords.long);

            coords.last = "long";
        } else if (coords.last === "long") {
            coords.lat = dichotomicSearch(bit, coords.lat);

            coords.last = "lat";
        }
    });

    position = {
        // Récupération du point central de la zone
        lat: (coords.lat.min + coords.lat.max) / 2,
        long: (coords.long.min + coords.long.max) / 2,
    };

    return position;
};

const makeOn8digit = (str) => {
    while (str.length < 8) {
        str = "0" + str;
    }

    return str;
};

const dichotomicSearch = (bit, minmax) => {
    let center;

    center = (minmax.min + minmax.max) / 2;

    if (bit === "0") {
        return {
            min: minmax.min,
            max: center,
        };
    } else if (bit === '1') {
        return {
            min: center,
            max: minmax.max,
        };
    }
};
