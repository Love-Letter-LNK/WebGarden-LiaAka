import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

export const ThemeToggle = () => {
    const [isBlue, setIsBlue] = useState(() => {
        // Check localStorage on initial load
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'blue';
        }
        return false;
    });

    useEffect(() => {
        if (isBlue) {
            document.body.classList.add("theme-blue");
            localStorage.setItem('theme', 'blue');
        } else {
            document.body.classList.remove("theme-blue");
            localStorage.setItem('theme', 'pink');
        }
    }, [isBlue]);

    // Apply theme on initial mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'blue') {
            document.body.classList.add("theme-blue");
            setIsBlue(true);
        }
    }, []);

    return (
        <button
            onClick={() => setIsBlue(!isBlue)}
            className={`p-2 rounded-full border-2 shadow-md hover:scale-110 transition-all duration-300 ${isBlue
                ? 'bg-sky-100 border-sky-400 hover:bg-sky-200'
                : 'bg-pink-100 border-pink-400 hover:bg-pink-200'
                }`}
            title={isBlue ? "Switch to Pink Theme 💖" : "Switch to Blue Theme 🌊"}
        >
            <Heart className={`w-5 h-5 transition-colors ${isBlue ? 'text-sky-500 fill-sky-300' : 'text-pink-500 fill-pink-300'}`} />
            <span className="sr-only">Toggle theme</span>
        </button>
    );
};
