import { getCurrentUser, updateProfile } from "@/utils/auth";
import { useEffect, useState } from 'react'
import { Avatar } from "@/components/avatar";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { getUserAvatarUri } from "@/utils/users";

interface UserData {
    id: string
    username: string
    name: string
    avatar: string
    birthdate: string
    bio: string
}

export function Profile() {
    const [isEditing, setIsEditing] = useState(false)
    const currentUser = getCurrentUser();
    const [avatarUri, setAvatarUri] = useState<string>('');
    const [userData, setUserData] = useState<UserData>({
        id: currentUser?.id || '',
        username: currentUser?.username || '',
        name: currentUser?.name || '',
        avatar: currentUser?.avatar || '',
        birthdate: currentUser?.birthdate || '',
        bio: currentUser?.bio || '',
    })

    useEffect(() => {
        if (userData.id) {
            getUserAvatarUri(userData.id).then(avatarUri => {
                setAvatarUri(avatarUri);
            });
        }
    }, [userData.id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setUserData(prevData => ({ ...prevData, [name]: value }))
    }

    const handleAvatarChange = (newSrc: string) => {
        setUserData(prevData => ({ ...prevData, avatar: newSrc }))
    }

    const toggleEdit = () => {
        if (isEditing && getCurrentUser()) {
            const user = getCurrentUser();
            if (user) {
                updateProfile(user.id, userData);
                setIsEditing(false);
                window.location.reload();
            }
        }
        setIsEditing(!isEditing);
    }

    return (
        <div className="min-h-screen bg-purple-200 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Your Profile</h1>
                    <Button onClick={toggleEdit} className="bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600">
                        {isEditing ? 'Save' : 'Edit'}
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Avatar
                        src={avatarUri}
                        alt={userData.name}
                        editable={isEditing}
                        onAvatarChange={handleAvatarChange}
                    />
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="username" className="font-bold">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                value={userData.username}
                                onChange={handleInputChange}
                                readOnly={!isEditing}
                                className="border-2 border-black rounded-xl"
                            />
                        </div>
                        <div>
                            <Label htmlFor="name" className="font-bold">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={userData.name}
                                onChange={handleInputChange}
                                readOnly={!isEditing}
                                className="border-2 border-black rounded-xl"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <Label htmlFor="bio" className="font-bold">Bio</Label>
                    <Textarea
                        id="bio"
                        name="bio"
                        value={userData.bio}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        className="border-2 border-black rounded-xl h-32"
                    />
                </div>
            </div>
        </div>
    )
}