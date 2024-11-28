'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react'

import { signIn, register } from "@/utils/auth"
import { Link } from "react-router"

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
                        window.location.href = "/"
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
                        window.location.href = "/"
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
        <div className="min-h-screen bg-[#f0f0f0] p-8 font-mono antialiased">
            <Card className="mx-auto max-w-md border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="mb-8">
                    <div className="text-center">
                        <div className="mb-2 inline-block rounded-xl border-4 border-black bg-yellow-400 px-4 py-2 text-3xl font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            Welcome Back
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="signin" className="space-y-6" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 gap-4 bg-transparent p-0">
                        {["signin", "register"].map((tab) => (
                            <TabsTrigger
                                key={tab}
                                value={tab}
                                className="rounded-xl border-4 border-black bg-white p-3 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all data-[state=active]:bg-purple-400 data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] data-[state=active]:translate-x-[2px] data-[state=active]:translate-y-[2px]"
                            >
                                {tab === "signin" ? "Sign In" : "Register"}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="signin" className="space-y-4" onChange={() => setActiveTab("signin")}>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-lg font-bold">Email</Label>
                                <Input
                                    required
                                    type="email"
                                    name="email"
                                    placeholder="hello@example.com"
                                    className="rounded-xl border-4 border-black bg-blue-100 p-6 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-500 focus-visible:ring-0"
                                    value={data.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-lg font-bold">Password</Label>
                                <div className="relative">
                                    <Input
                                        required
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••"
                                        className="rounded-xl border-4 border-black bg-green-100 p-6 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-500 focus-visible:ring-0"
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
                                            <EyeOffIcon className="h-6 w-6" />
                                        ) : (
                                            <EyeIcon className="h-6 w-6" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="relative w-full rounded-xl border-4 border-black bg-yellow-400 p-6 text-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="register" className="space-y-4" onChange={() => setActiveTab("register")}>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-lg font-bold">Name</Label>
                                <Input
                                    required
                                    type="text"
                                    name="name"
                                    placeholder="John Doe"
                                    className="rounded-xl border-4 border-black bg-pink-100 p-6 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-500 focus-visible:ring-0"
                                    value={data.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-lg font-bold">Email</Label>
                                <Input
                                    required
                                    type="email"
                                    name="email"
                                    placeholder="hello@example.com"
                                    className="rounded-xl border-4 border-black bg-blue-100 p-6 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-500 focus-visible:ring-0"
                                    value={data.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-lg font-bold">Password</Label>
                                <Input
                                    required
                                    minLength={8}
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    className="rounded-xl border-4 border-black bg-green-100 p-6 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-500 focus-visible:ring-0"
                                    value={data.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-lg font-bold">Confirm Password</Label>
                                <Input
                                    required
                                    minLength={8}
                                    type={showPassword ? "text" : "password"}
                                    name="passwordConfirm"
                                    placeholder="••••••••"
                                    className="rounded-xl border-4 border-black bg-green-100 p-6 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-500 focus-visible:ring-0"
                                    value={data.passwordConfirm}
                                    onChange={handleChange}
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="relative w-full rounded-xl border-4 border-black bg-yellow-400 p-6 text-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                ) : (
                                    "Register"
                                )}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
                <CardFooter className="text-center my-6">
                    <Link to="https://friends.ethlny.net" className="text-lg font-bold" target="_blank">
                        Les comptes sont partagés avec l'autre application <span className="text-blue-400">friends.ethlny.net</span>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
