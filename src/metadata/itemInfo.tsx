export interface Deck {
    id: number | null
    name: string | null
    brand: string | null
    image: string | null
    width: number | null
    length: number | null
    'grip-tape': boolean | null
    info: string | null
    price: number | null
    link: string | null
}

export interface Trucks {
    id: number | null
    name: string | null
    brand: string | null
    image: string | null
    width: number | null
    info: string | null
    price: number | null
    link: string | null
}

export interface Wheels {
    id: number | null
    name: string | null
    brand: string | null
    image: string | null
    diameter: number | null
    durometer: string | null
    info: string | null
    price: number | null
    link: string | null
}

export interface Bearings {
    id: number | null
    name: string | null
    brand: string | null
    image: string | null
    abec: number | null
    info: string | null
    price: number | null
    link: string | null
}

export interface Hardware {
    id: number | null
    name: string | null
    brand: string | null
    image: string | null
    length: number | null
    info: string | null
    price: number | null
    link: string | null
}

export interface Extras {
    id: number | null
    name: string | null
    brand: string | null
    image: string | null
    info: string | null
    price: number | null
    link: string | null
}

export interface ItemInfo {
    Decks: Deck[]
    Trucks: Trucks[]
    Wheels: Wheels[]
    Bearings: Bearings[]
    Hardware: Hardware[]
    Extras: Extras[]
}

export interface build {
    name: string | null
    deck: Deck
    trucks: Trucks
    wheels: Wheels
    bearings: Bearings
    hardware: Hardware
    extras: Extras
}

export interface buildsObject {
    builds: build[]
}

export class Build {
    public _build: build

    constructor(name: string) {
        this._build = {
            name,
            deck: {
                id: null,
                name: null,
                brand: null,
                image: null,
                width: null,
                length: null,
                'grip-tape':  null,
                info: null,
                price: null,
                link: null
            },
            trucks: {
                id: null,
                name: null,
                brand: null,
                image: null,
                width: null,
                info: null,
                price: null,
                link: null
            },
            wheels: {
                id: null,
                name: null,
                brand: null,
                image: null,
                diameter: null,
                durometer: null,
                info: null,
                price: null,
                link: null
            },
            bearings: {
                id: null,
                name: null,
                brand: null,
                image: null,
                abec: null,
                info: null,
                price:  null,
                link: null
            },
            hardware: {
                id: null,
                name: null,
                brand: null,
                image: null,
                length: null,
                info: null,
                price:  null,
                link: null
            },
            extras: {
                id: null,
                name: null,
                brand: null,
                image: null,
                info: null,
                price:  null,
                link: null
            }
        }
    };

    getBuild = () => {
        return this._build
    };

    getName = () => {
        return this._build.name
    };

    getDeck = () => {
        return this._build.deck
    };

    getTrucks = () => {
        return this._build.trucks
    };

    getWheels = () => {
        return this._build.wheels
    };

    getBearings = () => {
        return this._build.wheels
    };

    getHardware = () => {
        return this._build.bearings
    };

    getExtras = () => {
        return this._build.extras
    };

    setName = (name:string) => {
        this._build.name = name;
    }
}