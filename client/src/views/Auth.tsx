import { useSound } from "../hooks/useSound";
import { MainLayout } from "../components/garden/MainLayout";

const Auth = () => {
    const playSound = useSound();

    return (
        <MainLayout>
            <div className="flex-1 p-4 bg-gradient-to-b from-pink-50 to-blue-50 h-full flex items-center justify-center">
                <div className="bg-white border-4 border-pink-200 rounded-xl p-8 text-center max-w-md w-full shadow-lg">
                    <h1 className="text-2xl font-bold text-pink-500 mb-4">Login</h1>
                    <p className="text-gray-500 text-sm mb-6">Welcome back! ♥</p>
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 border border-pink-200 rounded mb-3 text-sm focus:outline-none focus:border-pink-400"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 border border-pink-200 rounded mb-4 text-sm focus:outline-none focus:border-pink-400"
                    />
                    <button
                        className="w-full bg-pink-400 text-white py-2 rounded hover:bg-pink-500 text-sm font-bold transition-colors"
                        onClick={() => playSound('click')}
                        onMouseEnter={() => playSound('hover')}
                    >
                        Sign In ♥
                    </button>
                </div>
            </div>
        </MainLayout>
    );
};

export default Auth;
