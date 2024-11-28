import { pb } from "@/lib/pocketbase";
import { AuthModel } from "pocketbase";


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