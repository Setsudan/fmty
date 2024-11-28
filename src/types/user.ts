import { RecordModel } from "pocketbase";

export interface User {
    avatar?: string;
    bio?: string;
    birthdate: string;
    collectionId: string;
    collectionName: string;
    created: string;
    emailVisibility: boolean;
    group: string;
    id: string;
    name: string;
    updated: string;
    username: string;
    verified: boolean;
}

export interface LetterFormProps {
    currentUser: RecordModel | null;
    friends: RecordModel[] | null;
}

