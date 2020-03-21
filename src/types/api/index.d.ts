/**
 * Represents a job offer
 */
export interface IJobOffer {
    id: string;
    employerId: string;
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

/**
 * Represents a user (both employer and worker)
 */
export interface IUser {
    id: string;
    name: string;
    employerInformation?: IEmployerInformation;
    workerInformation?: IWorkerInformation;
}

/**
 * Represents additiional information for users, that are employers
 */
export interface IEmployerInformation {
    id: string;
    jobOffers: IJobOffer[];
}

/**
 * Represents additiional information for users, that are workers
 */
export interface IWorkerInformation {
    id: string;
}

/**
 * TODO: Document this
 */
export type IOwnUser = IUser & {
    email: string;
}