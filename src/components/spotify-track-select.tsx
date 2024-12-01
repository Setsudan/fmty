import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Track {
    id: string
    name: string
    artists: { name: string }[]
    album: { images: { url: string }[] }
}

interface SpotifyTrackSelectorProps {
    onTrackSelect: (track: Track | null) => void
    handleSpotifySearch: (query: string) => void
    spotifyResults: Track[]
    selectedTrack: Track | null
}

export function SpotifyTrackSelector({
    onTrackSelect,
    handleSpotifySearch,
    spotifyResults,
    selectedTrack,
}: SpotifyTrackSelectorProps) {
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value
        setSearchQuery(query)
        handleSpotifySearch(query)
    }

    return (
        <div className="space-y-4">
            <div className="relative">
                <Input
                    placeholder="Search for a song..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="rounded-xl border-4 border-black bg-white pl-10 pr-4 py-3 text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-500"
                />
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            </div>

            {spotifyResults.length > 0 && (
                <Card className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <CardContent className="p-0">
                        <ScrollArea className="h-72">
                            {spotifyResults.map((track) => (
                                <Button
                                    key={track.id}
                                    variant="ghost"
                                    className="w-full justify-start gap-3 rounded-none border-b border-gray-200 p-3 hover:bg-gray-100"
                                    onClick={() => onTrackSelect(track)}
                                >
                                    <img
                                        src={track.album.images[0].url}
                                        alt={`${track.name} album cover`}
                                        className="h-12 w-12 rounded-md object-cover"
                                    />
                                    <div className="text-left">
                                        <p className="font-semibold">{track.name}</p>
                                        <p className="text-sm text-gray-500">{track.artists[0].name}</p>
                                    </div>
                                </Button>
                            ))}
                        </ScrollArea>
                    </CardContent>
                </Card>
            )}

            {selectedTrack && (
                <Card className="border-4 border-black bg-green-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <CardContent className="flex items-center gap-4 p-4">
                        <img
                            src={selectedTrack.album.images[0].url}
                            alt={`${selectedTrack.name} album cover`}
                            className="h-16 w-16 rounded-md object-cover"
                        />
                        <div>
                            <p className="font-semibold">{selectedTrack.name}</p>
                            <p className="text-sm text-gray-600">{selectedTrack.artists[0].name}</p>
                        </div>
                        <Button
                            variant="outline"
                            className="ml-auto rounded-full"
                            onClick={() => onTrackSelect(null)}
                        >
                            Change
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}