import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Trash2 } from "lucide-react";
import { deleteLetter } from "@/utils/letter";
import { RecordModel } from "pocketbase";
import { getCurrentUser } from "@/utils/auth";

export default function Letter({
    letter,
    author,
    receiver,
    authorAvatar,
    receiverAvatar }: {
        letter: RecordModel;
        author: RecordModel;
        receiver: RecordModel;
        authorAvatar: string;
        receiverAvatar: string;
    }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        await deleteLetter(letter.id);
        setIsDeleting(false);
    };

    const handleEdit = () => {
        console.log("Edit letter:", letter.id);
    };

    return (
        <Card className="relative mx-auto max-w-2xl border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Author */}
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-500">From</p>
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 border-2 border-black">
                                <AvatarImage src={authorAvatar} />
                                <AvatarFallback className="bg-blue-300 font-bold">
                                    {author?.name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="font-bold">{author?.name}</span>
                        </div>
                    </div>
                    <div className="h-12 w-px bg-black" />
                    {/* Receiver */}
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-500">To</p>
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 border-2 border-black">
                                <AvatarImage src={receiverAvatar} />
                                <AvatarFallback className="bg-green-300 font-bold">
                                    {receiver?.name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="font-bold">{receiver?.name}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Letter Content */}
            <div className="relative mb-6 rounded-xl border-4 border-black bg-pink-50 p-6 font-mono leading-relaxed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div dangerouslySetInnerHTML={{ __html: letter.content }} />
            </div>

            {/* Spotify Track preview */}
            <div className="relative mb-3 rounded-xl">
                <iframe
                    src={`https://open.spotify.com/embed/track/${letter.spotifyTrackId}`}
                    className="w-full h-80"
                    allow="encrypted-media"
                ></iframe>
            </div>

            {/* Actions */}
            {
                getCurrentUser()?.id === author.id && (
                    <div className="flex justify-end gap-4">
                        <Button onClick={handleEdit} className="action-button">
                            <Pencil />
                            Edit
                        </Button>
                        <Button onClick={handleDelete} className="action-button" disabled={isDeleting}>
                            <Trash2 />
                            Delete
                        </Button>
                    </div>
                )
            }
        </Card>
    );
}