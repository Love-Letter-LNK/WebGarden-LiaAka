
import { useState, useEffect } from "react";
import { ShoppingBag, Mail, X, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSound } from "../hooks/useSound";
import { useDigitalGardenController } from "../controllers/useDigitalGardenController";
import { MainLayout } from "../components/garden/MainLayout";
import Landing from "./Landing";
import { AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { NewsModal } from "@/components/news/NewsModal";
import { usePageTitle } from "@/hooks/usePageTitle";

import { TravelWidget } from '../components/travel/TravelWidget';

import { galleryApi, GalleryImage, visitorApi } from "@/lib/api";

// Cookie helper functions
const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};

const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

const Index = () => {
  usePageTitle("Home");
  const { news } = useDigitalGardenController();
  const playSound = useSound();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewCaption, setPreviewCaption] = useState<string>("");

  // Gallery State
  const [photos, setPhotos] = useState<GalleryImage[]>([]);

  useEffect(() => {
    galleryApi.list().then(data => {
      // Take top 8 photos
      setPhotos(data.slice(0, 8));
    }).catch(console.error);
  }, []);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedNews, setSelectedNews] = useState<any | null>(null);

  // Visitor Tracking
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [todayVisitors, setTodayVisitors] = useState<number>(0);

  // Track visit and fetch stats on mount
  useEffect(() => {
    // Track this visit
    visitorApi.track(window.location.pathname).catch(console.error);

    // Fetch visitor stats
    visitorApi.getStats().then(stats => {
      setVisitorCount(stats.total);
      setTodayVisitors(stats.today);
    }).catch(console.error);
  }, []);

  // Show landing only if no cookie exists (first visit or after cookie expires)
  const [showLanding, setShowLanding] = useState(() => {
    return getCookie('hasVisited') !== 'true';
  });

  // Hide body scrollbar when landing page is shown
  useEffect(() => {
    if (showLanding) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [showLanding]);

  const formatNewsDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' });
  };

  const handleSearch = () => {
    playSound('click');
    if (searchQuery.trim()) {
      toast({
        title: "Searching...",
        description: `Looking for "${searchQuery}"... (Search feature coming soon!) 🔍`,
      });
    } else {
      toast({
        title: "Oops!",
        description: "Please enter a keyword to search! 📝",
        variant: "destructive",
      });
    }
  };

  const handleBlogClick = (name: string) => {
    playSound('click');
    toast({
      title: "Coming Soon! 🚧",
      description: `Tunggu update website kita ya! ${name} 's Blog is under construction. 💕`,
    });
  };

  return (
    <>
      <AnimatePresence>
        {showLanding && (
          <Landing
            onEnter={() => {
              setCookie('hasVisited', 'true', 7); // Cookie expires in 7 days
              setShowLanding(false);
            }}
          />
        )}
      </AnimatePresence>

      <MainLayout>
        {/* MAIN 3-COLUMN LAYOUT */}
        <div className="flex flex-col md:flex-row gap-2 h-full">

          {/* --- LEFT SIDEBAR (Menu) --- */}
          <aside className="w-full md:w-[200px] flex-shrink-0 space-y-4 relative">
            {/* Sidebar Decoration - Book - Desktop only */}
            <div className="hidden md:block">
              <img src="/book.webp" alt="" className="absolute -left-6 top-40 w-12 opacity-70 pointer-events-none" style={{ transform: 'rotate(-15deg)' }} />
            </div>

            {/* 1. SEARCH WIDGET */}
            <div className="bg-pink-50 border border-pink-200 p-1.5 rounded relative">
              <div className="bg-gradient-to-r from-pink-400 to-pink-300 text-white p-1 font-bold text-xs flex items-center gap-2 mb-1 shadow-sm">
                <span className="bg-white text-pink-400 w-4 h-4 flex items-center justify-center font-pixel text-[8px] shadow-sm border border-pink-200">1</span>
                <span className="text-[10px]">SEARCH</span>
              </div>
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Find memory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full text-[9px] p-1 border-2 border-pink-200 focus:outline-none focus:border-pink-400 placeholder-pink-200 text-pink-500 font-pixel bg-white h-7"
                />
                <button
                  className="w-full bg-pink-400 hover:bg-pink-500 text-white text-[9px] py-0.5 border-b-2 border-pink-600 active:border-b-0 active:translate-y-1 transition-all font-bold"
                  onClick={handleSearch}
                >
                  GO!
                </button>
              </div>
            </div>

            {/* 2. FEATURED WIDGET */}
            <div className="bg-blue-50 border border-blue-200 p-2 rounded relative mt-4">
              <div className="bg-gradient-to-r from-pink-400 to-pink-300 text-white p-1 font-bold text-xs flex items-center gap-2 mb-2 shadow-sm">
                <span className="bg-white text-pink-400 w-5 h-5 flex items-center justify-center font-pixel text-[10px] shadow-sm border border-pink-200">2</span>
                <span>FEATURED</span>
              </div>
              <ul className="space-y-1 pl-1">
                {[
                  { label: 'First Date', path: '/category/first-date' },
                  { label: 'Anniversary', path: '/category/anniversary' },
                  { label: 'Travel', path: '/category/travel' },
                  { label: 'Random', path: '/category/random' },
                  { label: 'Letters', path: '/letters' }
                ].map((item) => (
                  <li
                    key={item.label}
                    className="text-[10px] text-blue-500 hover:text-pink-500 cursor-pointer flex items-center gap-2 transition-colors group"
                    onClick={() => { playSound('click'); navigate(item.path); }}
                  >
                    <span className="text-[8px] text-pink-300 group-hover:text-pink-500">♥</span>
                    <span className="border-b border-transparent group-hover:border-pink-300">{item.label}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 bg-pink-100 border-2 border-pink-200 p-1 text-center cursor-pointer hover:bg-pink-200" onClick={() => { playSound('click'); navigate('/calculator'); }}>
                <span className="text-[9px] font-bold text-pink-500 block">Love Calculator</span>
              </div>
              {/* Decorative Sticker */}
              <div className="absolute -top-3 -right-2 text-xl animate-bounce">🍬</div>
            </div>

            {/* 3. MEMORIES WIDGET */}
            <div className="bg-pink-50 border border-pink-200 p-2 rounded relative mt-4">
              <div className="bg-gradient-to-r from-pink-400 to-pink-300 text-white p-1 font-bold text-xs flex items-center gap-2 mb-2 shadow-sm">
                <span className="bg-white text-pink-400 w-5 h-5 flex items-center justify-center font-pixel text-[10px] shadow-sm border border-pink-200">3</span>
                <span>MEMORIES</span>
              </div>
              <div className="text-center p-2 bg-white border-2 border-pink-100 mb-2">
                <p className="text-[10px] text-gray-400 mb-2">Our digital photo book</p>
                <div
                  className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-[10px] py-1 px-2 rounded cursor-pointer hover:scale-105 transition-transform shadow-md flex items-center justify-center gap-1"
                  onClick={() => { playSound('click'); navigate('/memories'); }}
                >
                  OPEN GALLERY <span>✨</span>
                </div>
              </div>
            </div>

            {/* 4. TRAVEL LOG WIDGET */}
            <TravelWidget />

            {/* 5. Q&A - Existing Section */}
            <div className="bg-orange-50 border border-orange-200 p-2 rounded mt-4">
              <div className="bg-gradient-to-r from-orange-400 to-orange-300 text-white p-1 font-bold text-xs flex items-center gap-2 mb-2 shadow-sm">
                <span className="bg-white text-orange-400 w-5 h-5 flex items-center justify-center font-pixel text-[10px] shadow-sm border border-orange-200">5</span>
                <span>Q&A</span>
              </div>
              <div className="text-center p-2">
                <p className="text-[9px] text-gray-500 mb-2">Ask us anything!</p>
                <Link
                  to="/qna"
                  className="block w-full bg-orange-400 text-white text-[9px] py-1 rounded hover:bg-orange-500 transition-colors font-bold border-b-2 border-orange-600 active:border-b-0 active:translate-y-1"
                  onClick={() => playSound('click')}
                >
                  SEND QUESTION 📝
                </Link>
              </div>
            </div>
          </aside>

          {/* --- CENTER AREA (Content) --- */}
          <main className="flex-1 space-y-4 min-w-0">

            {/* MAIN BANNER - Couple Image */}
            <div className="border-4 border-pink-200 p-1 rounded-xl">
              <div className="relative h-64 w-full bg-gradient-to-br from-pink-50 to-blue-50 rounded overflow-hidden flex items-center justify-center">
                <img src="/we.webp" className="h-full object-contain hover:scale-105 transition-all duration-700" alt="Zekk & Lia Together" />
                <div className="absolute bottom-0 w-full bg-white/90 p-2 text-center border-t border-pink-200">
                  <span className="text-pink-500 font-bold text-xs">💕 OUR LOVE STORY 💕</span>
                  <h3 className="font-bold text-sm text-gray-700">Kenangan Perjalanan Cinta</h3>
                </div>
                <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-[8px] rotate-12 shadow-md animate-pulse">
                  NEW!
                </div>
              </div>
            </div>

            {/* PICK UP / NEWS */}
            <div className="border-t-4 border-pink-400 pt-2">
              <div className="flex items-center gap-2 mb-2 bg-pink-100 p-1">
                <span className="bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5">PICK UP</span>
                <span className="text-xs font-bold text-pink-500">JOURNEY LOG</span>
              </div>

              <div className="bg-white border border-gray-200 p-2 max-h-40 overflow-y-auto">
                {news.map((n: any) => (
                  <div key={n.id} className="news-item flex gap-2 items-center border-b border-gray-100 py-1 last:border-0 hover:bg-pink-50 cursor-pointer transition-colors" onClick={() => { playSound('click'); setSelectedNews(n); }}>
                    <span className="text-pink-400 font-pixel text-[8px] bg-pink-50 px-1 rounded">{formatNewsDate(n.date)}</span>
                    <span className="font-bold text-[10px] text-gray-700 truncate flex-1">{n.title}</span>
                  </div>
                ))}
                {news.length === 0 && <div className="text-xs text-gray-400 p-2 text-center">No news yet...</div>}
              </div>
            </div>

            {/* MEMORY CATALOG - Photo Grid */}
            <div>
              <div className="bg-gradient-to-r from-blue-200 to-transparent p-1 mb-2">
                <span className="text-blue-600 font-bold text-xs flex items-center gap-1"><ShoppingBag size={12} /> PHOTO CATALOG</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="border-2 border-pink-200 p-1 bg-white group cursor-pointer transform hover:scale-105 hover:border-pink-400 hover:shadow-lg hover:z-10 transition-all duration-300"
                    onClick={() => {
                      playSound('click');
                      setPreviewImage(photo.url);
                      setPreviewCaption(photo.alt || "");
                    }}
                    onMouseEnter={() => playSound('hover')}
                  >
                    <div className="aspect-square bg-gray-50 overflow-hidden relative">
                      <img src={photo.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" alt={photo.alt} />
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-pink-500/90 to-transparent text-white text-[8px] text-center py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        💕 CLICK TO VIEW 💕
                      </div>
                    </div>
                    <div className="p-1 text-center">
                      <p className="text-[9px] text-gray-600 truncate font-bold">{photo.alt || "Untilted"}</p>
                      <p className="text-[8px] text-pink-400">{new Date(photo.createdAt).getFullYear() || "2024"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>



          </main>

          {/* --- RIGHT SIDEBAR (Widgets) --- */}
          <aside className="w-full md:w-[180px] flex-shrink-0 space-y-4 relative">
            {/* Sidebar Decorations - Desktop only */}
            <div className="hidden md:block">
              <img src="/computer.webp" alt="" className="absolute -right-4 top-2 w-14 opacity-70 pointer-events-none" />
              <img src="/kamera.webp" alt="" className="absolute -right-6 bottom-20 w-10 opacity-60 pointer-events-none" style={{ transform: 'rotate(10deg)' }} />
            </div>

            {/* KITA'S CORNER - Our Corner with we.png */}
            <div
              className="bg-gradient-to-br from-pink-200 to-blue-200 p-2 rounded text-center cursor-pointer hover:opacity-90 hover:scale-105 transition-transform"
              onClick={() => { playSound('click'); navigate('/memories'); }}
              onMouseEnter={() => playSound('hover')}
            >
              <div className="bg-white border-2 border-dashed border-purple-400 p-1 rounded-lg w-16 h-16 mx-auto mb-1 overflow-hidden">
                <img src="/we.webp" className="w-full h-[140%] object-cover object-top" alt="Kita" />
              </div>
              <h4 className="font-bold text-white text-xs">OUR'S CORNER</h4>
              <p className="text-[9px] text-purple-600">Our favorite moments!</p>
            </div>

            {/* BLOGS - Both Zekk and Lia */}
            <div className="grid grid-cols-2 gap-2">
              {/* Zekk's Blog */}
              <div
                className="bg-blue-200 p-2 rounded text-center cursor-pointer hover:opacity-90 hover:scale-105 transition-transform"
                onClick={() => handleBlogClick('Zekk')}
                onMouseEnter={() => playSound('hover')}
              >
                <div className="bg-white border-2 border-dashed border-blue-400 p-1 rounded-lg w-12 h-12 mx-auto mb-1 overflow-hidden">
                  <img src="/zekk_pixel.webp" className="w-full h-[160%] object-cover object-top" alt="Zekk" />
                </div>
                <h4 className="font-bold text-white text-[8px]">Zekk's BLOG</h4>
              </div>

              {/* Lia's Blog */}
              <div
                className="bg-pink-200 p-2 rounded text-center cursor-pointer hover:opacity-90 hover:scale-105 transition-transform"
                onClick={() => handleBlogClick('Lia')}
                onMouseEnter={() => playSound('hover')}
              >
                <div className="bg-white border-2 border-dashed border-pink-400 p-1 rounded-lg w-12 h-12 mx-auto mb-1 overflow-hidden">
                  <img src="/lia_pixel.webp" className="w-full h-[160%] object-cover object-top" alt="Lia" />
                </div>
                <h4 className="font-bold text-white text-[8px]">Lia's BLOG</h4>
              </div>
            </div>

            {/* MESSAGE - Options for Lia or Zekk */}
            <div className="bg-yellow-100 border border-yellow-300 p-2 text-center rounded">
              <Mail className="w-6 h-6 mx-auto text-yellow-500 mb-1 animate-float" />
              <h4 className="font-bold text-yellow-600 text-xs">MESSAGE</h4>
              <p className="text-[9px] text-gray-500 mb-2">Send a love letter!</p>
              <div className="flex gap-1">
                <Link
                  to="/contact?to=zekk"
                  className="flex-1 bg-blue-400 text-white text-[8px] px-2 py-1 rounded-full hover:bg-blue-500 hover:scale-105 transition-all block"
                  onClick={() => playSound('click')}
                  onMouseEnter={() => playSound('hover')}
                >
                  TO ZEKK
                </Link>
                <Link
                  to="/contact?to=lia"
                  className="flex-1 bg-pink-400 text-white text-[8px] px-2 py-1 rounded-full hover:bg-pink-500 hover:scale-105 transition-all block"
                  onClick={() => playSound('click')}
                  onMouseEnter={() => playSound('hover')}
                >
                  TO LIA
                </Link>
              </div>
            </div>

            {/* Coming Soon Features */}
            <div className="bg-yellow-50 border border-yellow-200 p-2 text-center rounded">
              <p className="text-[8px] text-gray-400 italic mb-1">Coming Soon:</p>
              <div className="flex gap-1 justify-center">
                <button disabled className="text-[8px] bg-white text-yellow-600 px-2 py-1 rounded border border-yellow-200 cursor-not-allowed flex items-center gap-1 opacity-70">
                  🎁 Gift
                </button>
                <button disabled className="text-[8px] bg-white text-purple-600 px-2 py-1 rounded border border-purple-200 cursor-not-allowed flex items-center gap-1 opacity-70">
                  🎮 Game
                </button>
              </div>
            </div>

            {/* OUR PLAYLIST - New Widget */}
            <div className="bg-pink-50 border border-pink-200 p-2 rounded mt-2">
              <div className="flex items-center gap-1 mb-2">
                <span className="bg-pink-100 p-1 rounded-full">🎵</span>
                <h4 className="text-[10px] font-bold text-pink-500">OUR PLAYLIST</h4>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[9px] bg-white p-1 rounded border border-pink-100 cursor-pointer hover:bg-pink-50" onClick={() => playSound('click')}>
                  <span className="truncate w-24">Terbuang Dalam Waktu</span>
                  <span>▶</span>
                </div>
                <div className="flex items-center justify-between text-[9px] bg-white p-1 rounded border border-pink-100 cursor-pointer hover:bg-pink-50" onClick={() => playSound('click')}>
                  <span className="truncate w-24">About You</span>
                  <span>▶</span>
                </div>
                <div className="text-center mt-1">
                  <span className="text-[8px] text-pink-400 underline cursor-pointer hover:text-pink-600" onClick={() => { playSound('click'); navigate('/playlist'); }}>View All</span>
                </div>
              </div>
            </div>

            {/* LOVE COUNTDOWN - New Widget */}
            <div className="bg-blue-50 border border-blue-200 p-2 rounded mt-2 text-center">
              <h4 className="text-[9px] font-bold text-blue-500 mb-1">DAYS IN LOVE</h4>
              <div className="bg-white border-2 border-blue-100 rounded-lg p-2">
                <span className="text-xl font-black text-blue-400">365</span>
                <span className="text-[8px] text-gray-400 block">days & counting!</span>
              </div>
            </div>

            {/* TODAY'S MOOD - New Widget */}
            <div className="bg-purple-50 border border-purple-200 p-2 rounded mt-2 text-center">
              <h4 className="text-[9px] font-bold text-purple-500 mb-1">TODAY'S MOOD</h4>
              <div className="flex justify-center gap-2 text-lg">
                <button className="hover:scale-125 transition-transform" onClick={() => playSound('click')} title="Happy">😊</button>
                <button className="hover:scale-125 transition-transform" onClick={() => playSound('click')} title="Loved">😍</button>
                <button className="hover:scale-125 transition-transform" onClick={() => playSound('click')} title="Silly">🤪</button>
                <button className="hover:scale-125 transition-transform" onClick={() => playSound('click')} title="Cool">😎</button>
              </div>
            </div>

            {/* SITE STATS - Real Visitor Counter */}
            <div className="bg-gray-50 border border-gray-200 p-2 rounded mt-2">
              <div className="text-[9px] font-bold text-gray-500 mb-1 flex items-center gap-1">
                <span>📊</span> SITE STATS
              </div>
              <div className="bg-pink-500 text-white font-mono text-[10px] p-1 rounded text-center tracking-widest border-2 border-gray-300 shadow-inner">
                {String(visitorCount).padStart(6, '0')}
              </div>
              <div className="text-[8px] text-gray-400 text-center mt-1">
                {todayVisitors > 0 ? `+${todayVisitors} today` : 'Visitors since 2026'}
              </div>
            </div>
          </aside>

        </div>

        {/* LIGHTBOX PREVIEW MODAL */}
        {
          previewImage && (
            <div
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setPreviewImage(null)}
            >
              <div className="relative max-w-3xl max-h-[90vh] animate-pulse" style={{ animationDuration: '0.3s', animationIterationCount: 1 }}>
                {/* Close Button */}
                <button
                  className="absolute -top-10 right-0 text-white hover:text-pink-300 transition-colors"
                  onClick={() => { playSound('click'); setPreviewImage(null); }}
                  onMouseEnter={() => playSound('hover')}
                >
                  <X size={32} />
                </button>

                {/* Image */}
                <div className="bg-white p-2 border-4 border-pink-300 rounded-lg shadow-2xl">
                  <img
                    src={previewImage}
                    alt={previewCaption}
                    className="max-w-full max-h-[70vh] object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="text-center py-2 bg-pink-50 rounded-b">
                    <p className="text-pink-500 font-bold text-sm">{previewCaption}</p>
                    <p className="text-[10px] text-gray-400">💕 ZEKK & LIA 💕</p>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </MainLayout>
    </>
  );
};

export default Index;
