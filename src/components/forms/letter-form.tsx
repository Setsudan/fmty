'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import type { LetterFormProps } from "@/types/user";
import { RecordModel } from "pocketbase";
import { createLetter } from "@/utils/letter"
import { getSpotifyToken } from "@/utils/spotify"
import { SpotifyTrackSelector } from "../spotify-track-select"

type SpotifyTrack = {
    id: string;
    name: string;
    album: {
        images: { url: string }[];
    };
    artists: { name: string }[];
};

export default function LetterForm({ currentUser, friends }: LetterFormProps) {
    const [letterContent, setLetterContent] = useState("");
    const [selectedFriend, setSelectedFriend] = useState<RecordModel | null>(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [spotifyResults, setSpotifyResults] = useState<SpotifyTrack[]>([]); // Results from Spotify API
    const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null); // Selected track

    const convertContentTextToHTML = (content: string) => {
        return content.replace(/\n/g, "<br />");
    }

    const handleSubmit = async () => {
        setLoading(true);
        if (!selectedFriend || !letterContent.trim()) return;
        if (currentUser && selectedFriend) {
            try {
                await createLetter({
                    content: convertContentTextToHTML(letterContent),
                    author: currentUser.id,
                    receiver: selectedFriend.id,
                    spotifyTrackId: selectedTrack ? selectedTrack.id : undefined,
                }).then(() => {
                    setLetterContent("");
                    setSelectedFriend(null);
                    setSelectedTrack(null);
                }).finally(() => {
                    // wait 2 seconds before setting loading to false
                    setTimeout(() => setLoading(false), 2000);
                    setLoading(false);
                });
            } catch (error) {
                console.error("Error creating letter:", error);
                setError("Error : " + error);
            }
        }
    }

    const timerOfTimeLeftBefore2025 = () => {
        const currentDate = new Date();
        const year2025 = new Date("2025-01-01T00:00:00");
        const timeLeft = year2025.getTime() - currentDate.getTime();
        const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        return `${daysLeft} jours et ${hoursLeft} heures restants avant 2025`;
    }

    const handleSpotifySearch = async (query: string) => {
        if (!query.trim()) return;
        const token = await getSpotifyToken();
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setSpotifyResults(data.tracks.items);
    };


    return (
        <div className="min-h-screen bg-[#f0f0f0] p-4 font-mono sm:p-6 md:p-8">
            <Card className="mx-auto w-full max-w-md border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:max-w-lg md:max-w-2xl">
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-2xl font-black sm:text-3xl md:text-4xl">2025 TIME CAPSULE</h1>
                    <h2 className="text-lg font-bold sm:text-xl md:text-2xl">
                        {timerOfTimeLeftBefore2025()}
                    </h2>
                    <div className="mx-auto h-4 w-24 rounded-full bg-yellow-400 sm:w-32" />
                </div>
                <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        {currentUser ? (
                            <>
                                <Label className="text-base font-bold sm:text-lg">From:</Label>
                                <div className="flex items-center gap-3 rounded-xl border-4 border-black bg-blue-100 p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <Avatar className="h-6 w-6 border-2 border-black sm:h-8 sm:w-8">
                                        <AvatarImage src={currentUser.avatar} />
                                        <AvatarFallback className="bg-blue-300 font-bold">
                                            {currentUser.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-base font-bold sm:text-lg">{currentUser.name}</span>
                                </div>
                            </>
                        ) : (
                            <div className="h-6 w-6 animate-spin rounded-full border-4 border-dashed border-blue-500 sm:h-8 sm:w-8" />
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-base font-bold sm:text-lg">To:</Label>
                        {!friends ? (
                            <div className="h-6 w-6 animate-spin rounded-full border-4 border-dashed border-green-500 sm:h-8 sm:w-8" />
                        ) : (
                            <Select
                                onValueChange={(value) => {
                                    const friend = friends.find((f) => f.id === value) || null;
                                    setSelectedFriend(friend);
                                }}
                            >
                                <SelectTrigger className="w-full rounded-xl border-4 border-black bg-green-100 p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:p-3 sm:text-lg hover:bg-green-200">
                                    <SelectValue placeholder="Select friend...">
                                        {selectedFriend && (
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-6 w-6 border-2 border-black sm:h-8 sm:w-8">
                                                    <AvatarImage src={selectedFriend.avatar} />
                                                    <AvatarFallback className="bg-green-300 font-bold">
                                                        {selectedFriend.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {selectedFriend.name}
                                            </div>
                                        )}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="border-2 border-black">
                                    <SelectGroup>
                                        <SelectLabel className="font-bold">Friends</SelectLabel>
                                        {friends.map((friend) => (
                                            <SelectItem
                                                key={friend.id}
                                                value={friend.id}
                                                className="font-medium"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-6 w-6 border-2 border-black sm:h-8 sm:w-8">
                                                        <AvatarImage src={friend.avatar} />
                                                        <AvatarFallback className="bg-green-300 font-bold">
                                                            {friend.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {friend.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </div>
                <div className="mb-6 space-y-2">
                    <Label className="text-base font-bold sm:text-lg">Your Message:</Label>
                    <Textarea
                        value={letterContent}
                        onChange={(e) => setLetterContent(e.target.value)}
                        placeholder="Write your letter for 2025..."
                        className="min-h-[200px] w-full rounded-xl border-4 border-black bg-pink-50 p-3 text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-500 focus-visible:ring-0 sm:min-h-[250px] md:min-h-[300px]"
                    />
                    <div className="flex justify-end text-xs text-gray-500 sm:text-sm">
                        {letterContent.length} characters
                    </div>
                </div>
                <div className="space-y-4">
                    <SpotifyTrackSelector handleSpotifySearch={handleSpotifySearch} onTrackSelect={setSelectedTrack} spotifyResults={spotifyResults} selectedTrack={selectedTrack} />
                </div>
                <div className="flex items-center justify-between mt-6">
                    <div className="h-6 w-6 animate-spin rounded-full border-4 border-dashed border-purple-500 sm:h-8 sm:w-8 md:h-12 md:w-12" />
                    <Button
                        className="rounded-xl border-4 border-black bg-yellow-400 px-6 py-4 text-lg font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:px-8 sm:py-6 sm:text-xl hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                        disabled={!selectedFriend || !letterContent.trim() || !currentUser}
                        onClick={handleSubmit}
                    >
                        Envoyer cette lettre
                    </Button>
                </div>
                {error && (
                    <div className="mt-8 rounded-xl border-4 border-red-500 bg-red-100 p-4 text-center text-red-500">
                        {error}
                    </div>
                )}
                {loading && (
                    <div className="mt-8 flex justify-center gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="h-3 w-3 rounded-full bg-black"
                                style={{ animation: `bounce 0.6s ${i * 0.2}s infinite` }}
                            />
                        ))}
                    </div>
                )}
            </Card>
        </div>

    )
}

