'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react'

import { signIn, register, registerOrSignInWithSpotify } from "@/utils/auth"
import { Link } from "react-router"
import { routesPaths } from "@/constants/routes"
import { Separator } from "../ui/separator";
import { CibSpotify } from "../icons/spotify"

export default function AuthForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [activeTab, setActiveTab] = useState("signin")

    const [data, setData] = useState({
        email: "",
        password: "",
        name: "",
        passwordConfirm: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const { email, password, passwordConfirm, name } = data
        console.log("data", data)
        if (activeTab === "signin") {
            try {
                await signIn(email, password).then((res) => {
                    if (res.token) {
                        window.location.href = routesPaths.home
                    } else {
                        console.error("Invalid credentials")
                    }
                });
            } catch (error) {
                console.error("Error signing in:", error)
            }
        } else {
            if (password !== passwordConfirm) {
                console.error("Passwords do not match")
                setIsLoading(false)
                return
            }

            try {
                await register(email, password, passwordConfirm, name).then((res) => {
                    if (res) {
                        window.location.href = routesPaths.home
                    } else {
                        console.error("Invalid credentials")
                    }
                });
            } catch (error) {
                console.error("Error registering:", error)
            }
        }
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen bg-[#f0f0f0] p-4 font-mono antialiased sm:p-8">
            <Card className="mx-auto w-full border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:p-6 md:max-w-md">
                <div className="mb-8">
                    <div className="text-center">
                        <div className="mb-2 inline-block rounded-xl border-4 border-black bg-yellow-400 px-4 py-2 text-2xl font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:text-3xl">
                            Welcome Back
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="signin" className="space-y-6" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 gap-2 bg-transparent p-0 sm:gap-4">
                        {["signin", "register"].map((tab) => (
                            <TabsTrigger
                                key={tab}
                                value={tab}
                                className="rounded-xl border-4 border-black bg-white p-2 text-base font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all data-[state=active]:bg-purple-400 data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] data-[state=active]:translate-x-[2px] data-[state=active]:translate-y-[2px] sm:p-3 sm:text-lg"
                            >
                                {tab === "signin" ? "Se connecter" : "Créer un compte"}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="signin" className="space-y-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-base font-bold sm:text-lg">Email</Label>
                                <Input
                                    required
                                    type="email"
                                    name="email"
                                    placeholder="hello@example.com"
                                    className="rounded-xl border-4 border-black bg-blue-100 p-4 text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-500 focus-visible:ring-0 sm:p-6 sm:text-lg"
                                    value={data.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-base font-bold sm:text-lg">Mot de passe</Label>
                                <div className="relative">
                                    <Input
                                        required
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••"
                                        className="rounded-xl border-4 border-black bg-green-100 p-4 text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-500 focus-visible:ring-0 sm:p-6 sm:text-lg"
                                        value={data.password}
                                        onChange={handleChange}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="absolute right-2 top-1/2 -translate-y-1/2"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOffIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="relative w-full rounded-xl border-4 border-black bg-yellow-400 p-4 text-lg font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:p-6 sm:text-xl"
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin sm:h-6 sm:w-6" />
                                ) : (
                                    "Se connecter"
                                )}
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="register" className="space-y-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-base font-bold sm:text-lg">Qui es tu ?</Label>
                                <Input
                                    required
                                    type="text"
                                    name="name"
                                    placeholder="John Doe"
                                    className="rounded-xl border-4 border-black bg-pink-100 p-4 text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-500 focus-visible:ring-0 sm:p-6 sm:text-lg"
                                    value={data.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-base font-bold sm:text-lg">Email</Label>
                                <Input
                                    required
                                    type="email"
                                    name="email"
                                    placeholder="hello@example.com"
                                    className="rounded-xl border-4 border-black bg-blue-100 p-4 text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-500 focus-visible:ring-0 sm:p-6 sm:text-lg"
                                    value={data.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-base font-bold sm:text-lg">Mot de passe</Label>
                                <Input
                                    required
                                    minLength={8}
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    className="rounded-xl border-4 border-black bg-green-100 p-4 text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-500 focus-visible:ring-0 sm:p-6 sm:text-lg"
                                    value={data.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-base font-bold sm:text-lg">Confirme ton mot de passe</Label>
                                <Input
                                    required
                                    minLength={8}
                                    type={showPassword ? "text" : "password"}
                                    name="passwordConfirm"
                                    placeholder="••••••••"
                                    className="rounded-xl border-4 border-black bg-green-100 p-4 text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-500 focus-visible:ring-0 sm:p-6 sm:text-lg"
                                    value={data.passwordConfirm}
                                    onChange={handleChange}
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="relative w-full rounded-xl border-4 border-black bg-yellow-400 p-4 text-lg font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:p-6 sm:text-xl"
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin sm:h-6 sm:w-6" />
                                ) : (
                                    "Créer mon compte"
                                )}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
                <CardFooter className="my-6 flex flex-col items-center space-y-4 text-center">
                    <Separator className="my-4 sm:my-6" />
                    <Button
                        onClick={registerOrSignInWithSpotify}
                        className="w-full rounded-xl border-4 border-black bg-green-400 p-4 text-lg font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:bg-green-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:p-6 sm:text-xl"
                    >
                        <span className="inline sm:hidden">Spotify</span>
                        <span className="hidden sm:inline md:hidden">Connection avec</span>
                        <span className="hidden md:inline lg:hidden">Connection avec Spotify</span>
                        <span className="hidden lg:inline">Se connecter avec Spotify</span>
                        <CibSpotify className="ml-2 h-8 w-8 sm:h-10 sm:w-10" />
                    </Button>
                    <Link to="https://friends.ethlny.net" className="text-base font-bold sm:text-lg" target="_blank">
                        Les comptes sont partagés avec l'autre application <span className="text-blue-400">friends.ethlny.net</span>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
