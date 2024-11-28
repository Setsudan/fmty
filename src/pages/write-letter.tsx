import LetterForm from "@/components/forms/letter-form";
import { getAllUsers, getCurrentUser } from "@/utils/users";
import { RecordModel } from "pocketbase"

import { useState, useEffect } from "react";

export default function WriteLetter() {
    const [currentUser, setCurrentUser] = useState<RecordModel | null>(null);
    const [users, setUsers] = useState<RecordModel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCurrentUser() {
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);
            } catch (error) {
                console.error("Error fetching current user:", error);
            }
        }

        async function fetchUsers() {
            try {
                const users = await getAllUsers();
                const usersWithoutCurrentUser = users.filter((user) => user.id !== currentUser?.id);
                setUsers(usersWithoutCurrentUser);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }

        async function fetchData() {
            setLoading(true);
            await Promise.all([fetchCurrentUser(), fetchUsers()]);
            setLoading(false);
        }

        fetchData();
    }, [currentUser?.id]);

    return (
        <div className="min-h-screen bg-[#f0f0f0] p-8 font-mono">
            {
                loading ? (
                    <div>Loading...</div>
                ) : (

                    <LetterForm currentUser={currentUser} friends={users} />
                )
            }
        </div>
    );
}

