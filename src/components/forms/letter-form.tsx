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

export default function LetterForm({ currentUser, friends }: LetterFormProps) {
    const [letterContent, setLetterContent] = useState("");
    const [selectedFriend, setSelectedFriend] = useState<RecordModel | null>(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                    receiver: selectedFriend.id
                }).then(() => {
                    setLetterContent("");
                    setSelectedFriend(null);
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


    return (
        <div className="min-h-screen bg-[#f0f0f0] p-8 font-mono">
            <Card className="mx-auto max-w-2xl border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-4xl font-black">2025 TIME CAPSULE</h1>
                    <div className="mx-auto h-4 w-32 rounded-full bg-yellow-400" />
                </div>

                <div className="mb-6 grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        {
                            currentUser && (
                                <>
                                    <Label className="text-lg font-bold">From:</Label>
                                    <div className="flex items-center gap-3 rounded-xl border-4 border-black bg-blue-100 p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <Avatar className="h-8 w-8 border-2 border-black">
                                            <AvatarImage src={currentUser.avatar} />
                                            <AvatarFallback className="bg-blue-300 font-bold">
                                                {currentUser.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-lg font-bold">{currentUser.name}</span>
                                    </div>
                                </>
                            ) || (
                                <div className="h-8 w-8 animate-spin rounded-full border-8 border-dashed border-blue-500" />
                            )
                        }
                    </div>

                    <div className="space-y-2">
                        <Label className="text-lg font-bold">To:</Label>
                        {
                            !friends && (
                                <div className="h-8 w-8 animate-spin rounded-full border-8 border-dashed border-green-500" />
                            ) || <Select
                                onValueChange={(value) => {
                                    const friend = friends ? friends.find(f => f.id === value) : null
                                    setSelectedFriend(friend || null)
                                }}
                            >
                                <SelectTrigger className="w-full rounded-xl border-4 border-black bg-green-100 p-3 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-green-200">
                                    <SelectValue placeholder="Select friend...">
                                        {selectedFriend && (
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8 border-2 border-black">
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
                                        {friends && friends.map((friend) => (
                                            <SelectItem
                                                key={friend.id}
                                                value={friend.id}
                                                className="font-medium"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8 border-2 border-black">
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
                        }
                    </div>
                </div>

                <div className="mb-6 space-y-2">
                    <Label className="text-lg font-bold">Your Message:</Label>
                    <Textarea
                        value={letterContent}
                        onChange={(e) => setLetterContent(e.target.value)}
                        placeholder="Write your letter for 2025..."
                        className="min-h-[300px] rounded-xl border-4 border-black bg-pink-50 p-4 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-500 focus-visible:ring-0"
                    />
                    <div className="flex justify-end text-sm text-gray-500">
                        {letterContent.length} characters
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="h-12 w-12 animate-spin rounded-full border-8 border-dashed border-purple-500" />
                    <Button
                        className="rounded-xl border-4 border-black bg-yellow-400 px-8 py-6 text-xl font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                        disabled={!selectedFriend || !letterContent.trim() || !currentUser}
                        onClick={handleSubmit}
                    >
                        SEAL THIS LETTER
                    </Button>
                </div>

                {
                    error && (
                        <div className="mt-8 p-4 text-center text-red-500 bg-red-100 rounded-xl border-4 border-red-500">
                            {error}
                        </div>
                    )
                }
                {
                    loading && (
                        <div className="mt-8 flex justify-center gap-4">
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
                    )
                }

            </Card>
        </div>
    )
}

