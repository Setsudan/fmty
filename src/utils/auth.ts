import { pb } from "@/lib/pocketbase";
import { AuthModel } from "pocketbase";

interface UserInterface {
    password: string;
    passwordConfirm: string;
    oldPassword: string;
    email: string;
    emailVisibility: boolean;
    verified: boolean;
    username: string;
    name: string;
    birthdate: string;
    bio: string;
    group: string;
}

export async function signIn(email: string, password: string) {
    try {
        const authData = await pb.collection('users').authWithPassword(email, password);
        return authData;
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
}

export function signOut() {
    pb.authStore.clear();
}

export function getCurrentUser() {
    return pb.authStore.record;
}

export async function register(email: string, password: string, passwordConfirm: string, name: string): Promise<AuthModel | Error> {
    try {
        const user = await pb.collection('users').create({
            username: name.toLowerCase().replace(/[^a-z0-9]/g, ''),
            email: email,
            password: password,
            name: name,
            passwordConfirm: passwordConfirm,
        });
        return user;
    } catch (error) {
        console.error('Error registering:', error);
        return error as Error;
    }
}

export async function registerOrSignInWithSpotify() {
    const authData = await pb.collection('users').authWithOAuth2({ provider: 'spotify' });

    if (pb.authStore.isValid) {
        window.location.href = '/';
    }
    return authData;

};

export async function updateProfile(userId: string, profile: Partial<UserInterface>) {
    try {
        const user = await pb.collection('users').update(userId, profile);
        return user;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
}

export async function updateProfilePicture(userId: string, avatar: File) {
    // In pocket base file upload is via form data
    const formData = new FormData();

    formData.append('avatar', avatar);

    try {
        const user = await pb.collection('users').update(userId, formData);
        return user;
    } catch (error) {
        console.error('Error updating profile picture:', error);
        throw error;
    }
}