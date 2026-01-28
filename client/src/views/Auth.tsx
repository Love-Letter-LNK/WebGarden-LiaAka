import { useSound } from "../hooks/useSound";
import { MainLayout } from "../components/garden/MainLayout";

const Auth = () => {
    const playSound = useSound();

    return (
        <MainLayout>
            <div className="flex-1 p-4 bg-gradient-to-b from-pink-50 to-blue-50 h-full flex items-center justify-center">
                <div className="bg-white border-4 border-pink-200 rounded-xl p-8 text-center max-w-md w-full shadow-lg">
                    <h1 className="text-2xl font-bold text-pink-500 mb-4">Admin Access Only</h1>
                    <p className="text-gray-500 text-sm mb-6">Restricted Area. Please use the secure admin portal if you are an authorized user.</p>
                    <div className="text-4xl animate-bounce mb-4">🔒</div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Auth;
