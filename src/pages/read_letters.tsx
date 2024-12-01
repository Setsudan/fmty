import Letter from "@/components/letter";
import { getLettersByReceiver } from "@/utils/letter";
import { RecordModel } from "pocketbase";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/utils/auth";


export default function ReadLetters() {
    const [letters, setLetters] = useState<RecordModel[]>([]);

    const today = new Date();
    const isTodayAfter2025 = today.getFullYear() > 2025;

    const fetchData = async () => {
        try {
            const currentUser = getCurrentUser();
            if (currentUser) {
                const rawLetters = await getLettersByReceiver(currentUser.id);
                setLetters(rawLetters);
            } else {
                console.error("No current user found");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-[#f0f0f0] p-8 font-mono">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="relative z-10 text-4xl font-black uppercase">
                        Ton Courrier
                        <div className="absolute -bottom-2 left-0 -z-10 h-4 w-full bg-yellow-400" />
                    </h1>
                    <div className="mt-4 flex gap-2">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="h-3 w-3 rounded-full bg-black"
                                style={{
                                    animation: `bounce 0.6s ${i * 0.2}s infinite`
                                }}
                            />
                        ))}
                    </div>
                </div>
                <div className="rounded-xl border-4 border-black bg-purple-400 px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {letters.length} Lettres
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {!isTodayAfter2025 ? (
                    <div className="relative overflow-hidden rounded-xl border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <div className="absolute -right-8 -top-8 h-24 w-24 rotate-12 bg-yellow-400" />
                        <div className="absolute -left-8 -top-8 h-24 w-24 -rotate-12 bg-blue-400" />
                        <div className="relative">
                            {
                                isTodayAfter2025 ? (
                                    <>
                                        <h2 className="text-2xl font-black">Tu n'as pas reçu de lettre....</h2>
                                        <p className="mt-2 text-gray-600">
                                            Patience! Les bonnes choses prennent du temps.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-2xl font-black">Hop hop hop !!!</h2>
                                        <p className="mt-2 text-gray-600">
                                            C'est pas encore 2025, tu ne peux pas encore lire tes lettres.
                                        </p>
                                    </>
                                )
                            }
                            <div className="mt-4 flex items-center gap-4">
                                <div className="h-1 w-12 bg-black" />
                                <div className="h-4 w-4 animate-spin rounded-full border-4 border-dashed border-black" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {letters.map((letter, index) => (
                            <div
                                key={letter.id}
                                className="transform transition-transform hover:-translate-y-1"
                                style={{
                                    animation: `fadeIn 0.5s ${index * 0.1}s both`
                                }}
                            >
                                <Letter
                                    key={letter.id}
                                    letter={letter}
                                    author={letter.author}
                                    receiver={letter.receiver}
                                    authorAvatar={letter.authorAvatar}
                                    receiverAvatar={letter.receiverAvatar}

                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>


        </div>
    );
}