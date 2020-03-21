export type IJobOffer = {
    id: string;
    categories: number[];
    workdays: number[];
    payment: number;
    description: string;
    requirements: string[];
    geoHash: string;
    from: number;
    to: number;
    image: string;
}

export type IUser = {
    id: string;
    name: string;
}

export type IOwnUser = IUser & {
    email: string;
}

