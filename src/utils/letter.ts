import { pb } from "@/lib/pocketbase";
import { getUserById, getUserAvatarUri } from "@/utils/users";
import { RecordModel } from "pocketbase";

interface Letter {
    content: string;
    author: string;
    receiver: string;
}

export async function createLetter(letter: Letter) {
    try {
        const record = await pb.collection('letters').create(letter);
        return record;
    } catch (error) {
        console.error('Error creating letter:', error);
        throw error;
    }
}

export async function updateLetter(id: string, letter: Partial<Letter>) {
    try {
        const record = await pb.collection('letters').update(id, letter);
        return record;
    } catch (error) {
        console.error('Error updating letter:', error);
        throw error;
    }
}

export async function deleteLetter(id: string) {
    try {
        await pb.collection('letters').delete(id);
    } catch (error) {
        console.error('Error deleting letter:', error);
        throw error;
    }
}

export async function getAllLetters() {
    try {
        const records = await pb.collection('letters').getFullList();
        return records;
    } catch (error) {
        console.error('Error fetching letters:', error);
        throw error;
    }
}

export async function getLetterById(id: string) {
    try {
        const record = await pb.collection('letters').getOne(id);
        return record;
    } catch (error) {
        console.error('Error fetching letter by id:', error);
        throw error;
    }
}

export async function getLettersByAuthor(authorId: string) {
    try {
        const records = await pb.collection('letters').getFullList({
            filter: `author = "${authorId}"`,
        });
        return records;
    }
    catch (error) {
        console.error('Error fetching letters by author:', error);
        throw error;
    }
}

export async function getLettersByReceiver(receiverId: string) {
    try {
        const records = await pb.collection('letters').getFullList({
            filter: `receiver = "${receiverId}"`,
        });
        return records;
    }
    catch (error) {
        console.error('Error fetching letters by receiver:', error);
        throw error;
    }
}


export async function getLetterData(letter: RecordModel) {
    const author = await getUserById(letter.author);
    const receiver = await getUserById(letter.receiver);
    const authorAvatar = await getUserAvatarUri(letter.author);
    const receiverAvatar = await getUserAvatarUri(letter.receiver);

    return { author, receiver, authorAvatar, receiverAvatar };
}