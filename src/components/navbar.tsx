import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { PenLine, Inbox, LogOut } from 'lucide-react'
import { AuthRecord } from 'pocketbase'

interface NavbarProps {
    user: AuthRecord
    onSignOut: () => void
}

export default function Navbar({ user, onSignOut }: NavbarProps) {

    return (
        <header className="sticky top-0 z-50 border-b-4 border-black bg-white font-mono">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2"
                >
                    <div className="relative">
                        <div className="h-8 w-8 rotate-12 rounded-lg border-4 border-black bg-yellow-400" />
                        <div className="absolute left-4 top-2 h-8 w-8 -rotate-12 rounded-lg border-4 border-black bg-blue-400" />
                    </div>
                    <span className="relative z-10 text-xl font-black">
                        LETTERS
                        <div className="absolute -bottom-1 left-0 -z-10 h-2 w-full bg-purple-400" />
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="flex items-center gap-2">
                    <Link to="/">
                        <Button
                            variant="ghost"
                            className="group relative rounded-xl border-4 border-black bg-green-400 px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:bg-green-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                        >
                            <PenLine className="mr-2 h-4 w-4" />
                            Ecrire une lettre
                            <span className="absolute -right-1 -top-1 flex h-4 w-4 animate-bounce">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black opacity-75"></span>
                                <span className="relative inline-flex h-4 w-4 rounded-full bg-black"></span>
                            </span>
                        </Button>
                    </Link>

                    <Link to="/read">
                        <Button
                            variant="ghost"
                            className="rounded-xl border-4 border-black bg-pink-400 px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:bg-pink-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                        >
                            <Inbox className="mr-2 h-4 w-4" />
                            Mon courrier
                        </Button>
                    </Link>

                    {/* User Menu */}
                    <div className="ml-4 flex items-center gap-4 rounded-xl border-4 border-black bg-blue-100 px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        {
                            user && (
                                <div className="flex items-center gap-2">
                                    <p>{user.name}</p>
                                </div>
                            )
                        }
                        <div className="h-8 w-px bg-black/20" />
                        <Button
                            onClick={onSignOut}
                            variant="ghost"
                            className="rounded-lg border-2 border-black bg-red-400 p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:bg-red-300 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="sr-only">Sign out</span>
                        </Button>
                    </div>
                </nav>
            </div>
        </header>
    )
}

