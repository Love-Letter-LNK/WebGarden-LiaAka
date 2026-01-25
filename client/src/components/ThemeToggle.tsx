import { useEffect, useState } from "react";
import { Heart, Palette } from "lucide-react";


export const ThemeToggle = () => {
    const [isBlue, setIsBlue] = useState(false);

    useEffect(() => {
        if (isBlue) {
            document.body.classList.add("theme-blue");
        } else {
            document.body.classList.remove("theme-blue");
        }
    }, [isBlue]);

    return (
        <button
            onClick={() => setIsBlue(!isBlue)}
            className={`p-2 rounded-full border-2 shadow-md hover:scale-110 transition-all duration-300 ${isBlue
                    ? 'bg-blue-100 border-blue-400 hover:bg-blue-200'
                    : 'bg-pink-100 border-pink-400 hover:bg-pink-200'
                }`}
            title={isBlue ? "Switch to Pink Theme" : "Switch to Blue Theme"}
        >
            <Heart className={`w-5 h-5 transition-colors ${isBlue ? 'text-blue-500 fill-blue-300' : 'text-pink-500 fill-pink-300'}`} />
            <span className="sr-only">Toggle theme</span>
        </button>
    );
};
