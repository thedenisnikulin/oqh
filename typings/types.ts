export interface IUserData {
    id?: string;
    username: string;
    password: string;
    bio: string;
    rep: number;
    isSearching: boolean;
    roomId: string | null;

    createdAt?: string;
    updatedAt?: string;
}

export interface IRoomData {
    id?: string;
    topic: string;
    users: Array<IUserData>;
}