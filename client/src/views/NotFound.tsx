import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Heart } from "lucide-react";
import { useSound } from "../hooks/useSound";
import { MainLayout } from "../components/garden/MainLayout";

const NotFound = () => {
  const location = useLocation();
  const playSound = useSound();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="flex-1 p-4 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center relative overflow-hidden h-full rounded-lg">
        {/* Floating Pixel Sparkles & Love Background - Desktop only */}
        <div className="hidden md:block absolute inset-0 pointer-events-none">
          {/* Sparkles */}
          {[...Array(10)].map((_, i) => (
            <img
              key={`sparkle-${i}`}
              src="/pixel sparkel.gif"
              alt=""
              className="absolute animate-float opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                width: `${15 + Math.random() * 25}px`,
                height: `${15 + Math.random() * 25}px`,
              }}
            />
          ))}
          {/* Love Hearts */}
          {[...Array(8)].map((_, i) => (
            <img
              key={`love-${i}`}
              src="/pixel love.gif"
              alt=""
              className="absolute animate-float opacity-55"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
                width: `${12 + Math.random() * 20}px`,
                height: `${12 + Math.random() * 20}px`,
              }}
            />
          ))}
        </div>


        {/* Aka Character - Left Side */}
        <div className="absolute left-4 md:left-12 lg:left-20 top-1/2 -translate-y-1/2 z-10 hidden md:block">
          <div className="relative animate-float" style={{ animationDuration: '3s' }}>
            <img
              src="/zekk_pixel.webp"
              alt="Aka"
              className="w-32 h-40 md:w-40 md:h-52 lg:w-48 lg:h-60 object-contain drop-shadow-2xl opacity-50 grayscale"
            />
            <div className="absolute -top-2 right-0 text-2xl md:text-3xl animate-twinkle">💔</div>
          </div>
        </div>

        {/* Lia Character - Right Side */}
        <div className="absolute right-4 md:right-12 lg:right-20 top-1/2 -translate-y-1/2 z-10 hidden md:block">
          <div className="relative animate-float" style={{ animationDuration: '3.5s' }}>
            <img
              src="/lia_pixel.webp"
              alt="Lia"
              className="w-32 h-40 md:w-40 md:h-52 lg:w-48 lg:h-60 object-contain drop-shadow-2xl opacity-50 grayscale"
            />
            <div className="absolute -top-2 left-0 text-2xl md:text-3xl animate-twinkle">💔</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center px-6 max-w-lg mx-auto">
          {/* 404 Title */}
          <div className="relative inline-block mb-4">
            <h1 className="text-8xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
              404
            </h1>
          </div>

          {/* Message Box */}
          <div className="bg-white/80 backdrop-blur-sm border-4 border-pink-200 rounded-2xl p-6 max-w-md mx-auto shadow-xl mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-pink-400 animate-pulse" />
              <h2 className="text-xl font-bold text-pink-500">Oops! Halaman Tidak Ditemukan</h2>
              <Heart className="w-5 h-5 text-pink-400 animate-pulse" />
            </div>
            <p className="text-gray-600 text-xs leading-relaxed mb-4">
              Sepertinya kamu tersesat di antara kenangan indah ini...
              <br />
              Jangan khawatir, cinta selalu menemukan jalan pulang! 💕
            </p>
            <div className="p-3 bg-pink-50 rounded-xl border border-pink-100">
              <p className="text-[10px] text-gray-500 italic">
                "Not all those who wander are lost, but this page definitely is."
              </p>
            </div>
          </div>

          {/* Action Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
            onClick={() => playSound('click')}
            onMouseEnter={() => playSound('hover')}
          >
            <Heart className="w-4 h-4 group-hover:animate-bounce" />
            Kembali ke Rumah Cinta
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
