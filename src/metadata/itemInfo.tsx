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
    asin: string | null
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
    asin: string | null
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
    asin: string | null
}

export interface Bearings {
    id: number | null
    name: string | null
    brand: string | null
    image: string | null
    info: string | null
    price: number | null
    link: string | null
    asin: string | null
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
    asin: string | null
}

export interface Extras {
    id: number | null
    name: string | null
    brand: string | null
    image: string | null
    info: string | null
    price: number | null
    link: string | null
    asin: string | null
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
    id: number | null
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

    constructor(name: string | null, id: number | null) {
        this._build = {
            name,
            id,
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
                link: null,
                asin: null
            },
            trucks: {
                id: null,
                name: null,
                brand: null,
                image: null,
                width: null,
                info: null,
                price: null,
                link: null,
                asin: null
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
                link: null,
                asin: null
            },
            bearings: {
                id: null,
                name: null,
                brand: null,
                image: null,
                info: null,
                price:  null,
                link: null,
                asin: null
            },
            hardware: {
                id: null,
                name: null,
                brand: null,
                image: null,
                length: null,
                info: null,
                price:  null,
                link: null,
                asin: null
            },
            extras: {
                id: null,
                name: null,
                brand: null,
                image: null,
                info: null,
                price:  null,
                link: null,
                asin: null
            }
        }
    };

    getBuild = () => {
        return this._build
    };

    getName = () => {
        return this._build.name
    };

    getId = () => {
        return this._build.id
    }

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
        return this._build.bearings
    };

    getHardware = () => {
        return this._build.hardware
    };

    getExtras = () => {
        return this._build.extras
    };

    setName = (name:string) => {
        this._build.name = name;
    }
}