import { pb } from "@/lib/pocketbase";

export async function getCurrentUser() {
    try {
        const user = await pb.authStore.model;
        return user;
    } catch (error) {
        console.error("Error fetching current user:", error);
        throw error;
    }
}

export async function getAllUsers() {
    try {
        const users = await pb.collection('users').getFullList();
        return users;
    } catch (error) {
        console.error("Error fetching all users:", error);
        throw error;
    }
}

export async function getUserById(id: string) {
    try {
        const user = await pb.collection('users').getOne(id);
        return user;
    } catch (error) {
        console.error("Error fetching user by id:", error);
        throw error;
    }
}

export async function searchUserByName(name: string) {
    try {
        const users = await pb.collection('users').getList(1, 50, {
            filters: {
                name: {
                    $regex: name,
                    $options: 'i'
                }
            }
        });
        return users;
    } catch (error) {
        console.error("Error searching for user by name:", error);
        throw error;
    }
}

export async function getUserAvatarUri(userId: string) {
    try {
        const user = await getUserById(userId);
        const avatar = pb.files.getURL(user, user.avatar);
        if (user && user.avatar) {
            return avatar;
        } else {
            return `https://ui-avatars.com/api/?name=${user.name}&background=random`;
        }
    } catch (error) {
        console.error("Error fetching user avatar URI:", error);
        throw error;
    }
}