import { RecordModel } from "pocketbase";
import { useState, useEffect } from "react";
import WriteLetter from "./write-letter";
import { getLettersByAuthor } from "@/utils/letter";
import { getUserById, getUserAvatarUri } from "@/utils/users";
import Letter from "@/components/letter";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/utils/auth";
import { RefreshCw } from "lucide-react";
export default function Home() {
    const [letters, setLetters] = useState<RecordModel[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                throw new Error("User is not authenticated");
            }
            const rawLetters = await getLettersByAuthor(currentUser.id);
            console.log("rawLetters", rawLetters);

            // Fetch author and receiver data for each letter
            const enrichedLetters = await Promise.all(
                rawLetters.map(async (letter: RecordModel) => {
                    const [author, receiver, authorAvatar, receiverAvatar] = await Promise.all([
                        getUserById(letter.author),
                        getUserById(letter.receiver),
                        getUserAvatarUri(letter.author),
                        getUserAvatarUri(letter.receiver),
                    ]);

                    return {
                        ...letter,
                        author,
                        receiver,
                        authorAvatar,
                        receiverAvatar,
                    };
                })
            );

            setLetters(enrichedLetters);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <WriteLetter />
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="bg-white border-2 border-black p-4 shadow-lg">
                        <h2 className="text-xl font-bold">Loading Letters...</h2>
                    </div>
                </div>
            ) : letters.length === 0 ? (
                <div className="flex justify-center items-center h-64 relative">
                    <Button onClick={fetchData} variant="ghost" className="absolute top-4 right-4">
                        <RefreshCw className="mr-2" />
                        Refresh
                    </Button>
                    <div className="bg-white border-2 border-black p-4 shadow-lg">
                        <h2 className="text-xl font-bold">Tu n'as pas encore écris de lettre.... Tristesse</h2>
                    </div>
                </div>
            ) : (<>
                <Button onClick={fetchData} variant="ghost" className="mb-4">
                    <RefreshCw className="mr-2" />
                    Refresh
                </Button>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {letters.map((letter) => (
                        <Letter
                            key={letter.id}
                            letter={letter}
                            author={letter.author}
                            receiver={letter.receiver}
                            authorAvatar={letter.authorAvatar}
                            receiverAvatar={letter.receiverAvatar}
                        />
                    ))}
                </div>
            </>
            )}
        </>
    );
}
