import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfilePicture } from '@/utils/auth';
import { getCurrentUser } from '@/utils/auth';

interface AvatarProps {
    src: string;
    alt: string;
    editable: boolean;
    onAvatarChange: (newSrc: string) => void;
}

export function Avatar({ src, alt, editable, onAvatarChange }: AvatarProps) {
    const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAvatarChange = async () => {
        if (!newAvatarFile) {
            setError('Please select a file.');
            return;
        }

        try {
            const user = getCurrentUser();
            if (!user) {
                throw new Error('User is not logged in.');
            }

            const updatedUser = await updateProfilePicture(user.id, newAvatarFile);
            onAvatarChange(updatedUser.avatarUrl); // Assuming the updated user object contains the avatar URL
            setNewAvatarFile(null);
            setError(null);
        } catch (err) {
            console.error('Error updating avatar:', err);
            setError('Failed to update avatar. Please try again.');
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setNewAvatarFile(file);
        setError(null);
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative w-40 h-40 rounded-3xl overflow-hidden border-4 border-black">
                <img
                    src={src}
                    alt={alt}
                    className="object-cover w-full h-full"
                />
            </div>
            {editable && (
                <div className="flex flex-col space-y-2 w-full">
                    <Input
                        type="file"
                        onChange={handleFileInputChange}
                        className="border-2 border-black rounded-xl"
                    />
                    <Button
                        onClick={handleAvatarChange}
                        className="bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-500"
                    >
                        Update Avatar
                    </Button>
                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}
                </div>
            )}
        </div>
    );
}
