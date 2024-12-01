import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-purple-200 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <h2 className="text-4xl font-bold mb-8">Page Not Found</h2>
                <p className="text-xl mb-8">Oops! The page you're looking for doesn't exist.</p>
                <div className="inline-block relative">
                    <div className="absolute -inset-1 bg-red-500 rounded-xl"></div>
                    <Link to="/" className="relative block">
                        <Button className="bg-yellow-400 text-black font-bold text-lg rounded-xl hover:bg-yellow-500 px-6 py-3">
                            Go Back Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

