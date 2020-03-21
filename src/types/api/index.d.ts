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

export interface IOwnUser extends IUser {
    email: string;
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

export interface IConversation {
    id: string;
    workerId: string;
    jobOfferId: string;
    messages: IChatMessage[];
}

export interface IChatMessage {
    id: string;
    conversationId: string;
    message: string;
    authorId: string;
    createdAt: number;
}
