import { useSound } from "../hooks/useSound";
import { MainLayout } from "../components/garden/MainLayout";

const Admin = () => {
    const playSound = useSound();

    return (
        <MainLayout>
            <div className="flex-1 p-4 bg-gradient-to-b from-blue-50 to-pink-50 h-full flex items-center justify-center">
                <div className="bg-white border-4 border-blue-200 rounded-xl p-8 text-center max-w-md w-full shadow-lg">
                    <h1 className="text-2xl font-bold text-blue-500 mb-4">Admin Panel</h1>
                    <p className="text-gray-500 text-sm mb-6">Manage your digital garden ✧</p>
                    <div className="space-y-2">
                        <div
                            className="bg-blue-50 p-3 rounded border border-blue-100 text-sm cursor-pointer hover:bg-blue-100 transition-colors"
                            onClick={() => playSound('click')}
                            onMouseEnter={() => playSound('hover')}
                        >
                            📝 Manage Memories
                        </div>
                        <div
                            className="bg-pink-50 p-3 rounded border border-pink-100 text-sm cursor-pointer hover:bg-pink-100 transition-colors"
                            onClick={() => playSound('click')}
                            onMouseEnter={() => playSound('hover')}
                        >
                            💌 View Guestbook
                        </div>
                        <div
                            className="bg-yellow-50 p-3 rounded border border-yellow-100 text-sm cursor-pointer hover:bg-yellow-100 transition-colors"
                            onClick={() => playSound('click')}
                            onMouseEnter={() => playSound('hover')}
                        >
                            ⚙️ Settings
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Admin;
