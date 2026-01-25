import { useState } from "react";
import { ShoppingBag, Mail, X, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useSound } from "../hooks/useSound";
import { useDigitalGardenController } from "../controllers/useDigitalGardenController";
import { MainLayout } from "../components/garden/MainLayout";

// Our couple photos for memory catalog
// Our couple photos for memory catalog
const couplePhotos = [
  { id: 1, src: "/we.png", caption: "Always Together", date: "2024" },
  { id: 2, src: "/LiaaZekk.jpeg", caption: "Our Precious Moment", date: "2024" },
  { id: 3, src: "/zekk_pixel.png", caption: "Zekk's Style", date: "2024" },
  { id: 4, src: "/lia_pixel.png", caption: "Lia's Beauty", date: "2024" },
  { id: 5, src: "/we.png", caption: "Sweet Memory", date: "2023" },
  { id: 6, src: "/LiaaZekk.jpeg", caption: "First Date", date: "2023" },
  { id: 7, src: "/zekk_pixel.png", caption: "Cool Vibes", date: "2023" },
  { id: 8, src: "/lia_pixel.png", caption: "Pretty Smile", date: "2023" },
];

const Index = () => {
  const { milestones } = useDigitalGardenController();
  const playSound = useSound();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewCaption, setPreviewCaption] = useState<string>("");

  return (
    <MainLayout>
      {/* HEADER BANNER AREA (Mobile Only - or Custom for Home?) 
          MainLayout has the main banner. We can rely on that.
      */}

      {/* MAIN 3-COLUMN LAYOUT */}
      <div className="flex flex-col md:flex-row gap-2 h-full">

        {/* --- LEFT SIDEBAR (Menu) --- */}
        <aside className="w-full md:w-[200px] flex-shrink-0 space-y-4 relative">
          {/* Sidebar Decoration - Book - Desktop only */}
          <div className="hidden md:block">
            <img src="/book.png" alt="" className="absolute -left-6 top-40 w-12 opacity-70 pointer-events-none" style={{ transform: 'rotate(-15deg)' }} />
          </div>

          {/* ITEM SEARCH */}
          <div className="bg-pink-50 border border-pink-200 p-2 rounded">
            <div className="sidebar-header">
              <span className="num-badge">1</span> SEARCH
            </div>
            <div className="flex flex-col gap-2">
              <input type="text" placeholder="Find memory..." className="text-xs p-1 border border-pink-300 w-full" />
              <button
                className="text-[10px] bg-pink-400 text-white py-1 rounded hover:bg-pink-500"
                onClick={() => playSound('click')}
                onMouseEnter={() => playSound('hover')}
              >GO!</button>
            </div>
          </div>

          {/* CATEGORY MENU */}
          <div className="bg-blue-50 border border-blue-200 p-2 rounded">
            <div className="sidebar-header !from-blue-400 !to-blue-300">
              <span className="num-badge text-blue-500">2</span> FEATURED
            </div>
            <div className="flex flex-col gap-1">
              {[{ name: 'First Date', slug: 'first-date' }, { name: 'Anniversary', slug: 'anniversary' }, { name: 'Travel', slug: 'travel' }, { name: 'Random', slug: 'random' }, { name: 'Letters', slug: 'letters' }].map(cat => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className="text-left text-xs bg-white border border-blue-100 p-1 hover:bg-blue-100 text-blue-600 font-bold block"
                  onClick={() => playSound('click')}
                  onMouseEnter={() => playSound('hover')}
                >
                  ♥ {cat.name}
                </Link>
              ))}
              <Link
                to="/calculator"
                className="text-left text-xs bg-pink-100 border border-pink-200 p-1 hover:bg-pink-200 text-pink-600 font-bold block mt-2 flex items-center gap-1"
                onClick={() => playSound('click')}
                onMouseEnter={() => playSound('hover')}>
                <Heart size={10} className="animate-pulse" /> Love Calculator
              </Link>
            </div>
          </div>

          {/* OUR MEMORIES - New Section */}
          <div className="bg-purple-50 border border-purple-200 p-2 rounded">
            <div className="sidebar-header !from-purple-400 !to-purple-300">
              <span className="num-badge text-purple-500">3</span> MEMORIES
            </div>
            <div className="text-center p-2">
              <p className="text-[10px] text-gray-600 mb-2 font-pixel">Our digital photo book</p>
              <Link
                to="/memories"
                className="block w-full bg-purple-400 text-white text-[10px] py-1.5 rounded hover:bg-purple-500 hover:scale-105 transition-all shadow-sm font-bold"
                onClick={() => playSound('click')}
                onMouseEnter={() => playSound('hover')}
              >
                OPEN GALLERY ✨
              </Link>
            </div>
          </div>

          {/* TRAVEL LOG - New Section */}
          <div className="bg-green-50 border border-green-200 p-2 rounded mt-2">
            <div className="sidebar-header !from-green-400 !to-green-300">
              <span className="num-badge text-green-500">4</span> TRAVEL LOG
            </div>
            <ul className="text-[9px] space-y-1 mt-1 pl-1">
              <li className="flex items-center gap-1 text-gray-600">
                <span>Checking...</span>
              </li>
            </ul>
            <div className="bg-white p-1 rounded border border-green-100 mt-1">
              <div className="flex items-center justify-between text-[8px] text-green-600 mb-1">
                <span>Next Trip:</span>
                <span className="font-bold">Bali? 🏖️</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-green-400 h-1.5 rounded-full w-[40%] animate-pulse"></div>
              </div>
              <div className="text-[8px] text-gray-400 text-right mt-0.5">40% Saved</div>
            </div>
          </div>

          {/* Q&A - New Section */}
          <div className="bg-orange-50 border border-orange-200 p-2 rounded mt-2">
            <div className="sidebar-header !from-orange-400 !to-orange-300">
              <span className="num-badge text-orange-500">5</span> Q&A
            </div>
            <div className="text-center p-2">
              <p className="text-[9px] text-gray-500 mb-2">Ask us anything!</p>
              <Link
                to="/qna"
                className="block w-full bg-orange-400 text-white text-[9px] py-1 rounded hover:bg-orange-500 transition-colors font-bold"
                onClick={() => playSound('click')}
              >
                SEND QUESTION 📝
              </Link>
            </div>
          </div>


        </aside>

        {/* --- CENTER AREA (Content) --- */}
        <main className="flex-1 space-y-4">

          {/* MAIN BANNER - Couple Image */}
          <div className="border-4 border-pink-200 p-1 rounded-xl">
            <div className="relative h-64 w-full bg-gradient-to-br from-pink-50 to-blue-50 rounded overflow-hidden flex items-center justify-center">
              <img src="/we.png" className="h-full object-contain hover:scale-105 transition-all duration-700" alt="Zekk & Lia Together" />
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
              {milestones.map((m: any) => (
                <div key={m.id} className="news-item">
                  <span className="text-gray-400 text-[10px]">{m.date}</span>
                  <span className="font-bold flex-1">{m.title}</span>
                </div>
              ))}
              {milestones.length === 0 && <div className="text-xs text-gray-400 p-2 text-center">No news yet...</div>}
            </div>
          </div>

          {/* MEMORY CATALOG - Photo Grid */}
          <div>
            <div className="bg-gradient-to-r from-blue-200 to-transparent p-1 mb-2">
              <span className="text-blue-600 font-bold text-xs flex items-center gap-1"><ShoppingBag size={12} /> PHOTO CATALOG</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {couplePhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="border-2 border-pink-200 p-1 bg-white group cursor-pointer transform hover:scale-105 hover:border-pink-400 hover:shadow-lg hover:z-10 transition-all duration-300"
                  onClick={() => {
                    playSound('click');
                    setPreviewImage(photo.src);
                    setPreviewCaption(photo.caption);
                  }}
                  onMouseEnter={() => playSound('hover')}
                >
                  <div className="aspect-square bg-gray-50 overflow-hidden relative">
                    <img src={photo.src} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" alt={photo.caption} />
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-pink-500/90 to-transparent text-white text-[8px] text-center py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      💕 CLICK TO VIEW 💕
                    </div>
                  </div>
                  <div className="p-1 text-center">
                    <p className="text-[9px] text-gray-600 truncate font-bold">{photo.caption}</p>
                    <p className="text-[8px] text-pink-400">{photo.date}</p>
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
            <img src="/computer.png" alt="" className="absolute -right-4 top-2 w-14 opacity-70 pointer-events-none" />
            <img src="/kamera.png" alt="" className="absolute -right-6 bottom-20 w-10 opacity-60 pointer-events-none" style={{ transform: 'rotate(10deg)' }} />
          </div>

          {/* KITA'S CORNER - Our Corner with we.png */}
          <div
            className="bg-gradient-to-br from-pink-200 to-blue-200 p-2 rounded text-center cursor-pointer hover:opacity-90 hover:scale-105 transition-transform"
            onClick={() => playSound('click')}
            onMouseEnter={() => playSound('hover')}
          >
            <div className="bg-white border-2 border-dashed border-purple-400 p-1 rounded-lg w-16 h-16 mx-auto mb-1 overflow-hidden">
              <img src="/we.png" className="w-full h-[140%] object-cover object-top" alt="Kita" />
            </div>
            <h4 className="font-bold text-white text-xs">OUR'S CORNER</h4>
            <p className="text-[9px] text-purple-600">Our favorite moments!</p>
          </div>

          {/* BLOGS - Both Zekk and Lia */}
          <div className="grid grid-cols-2 gap-2">
            {/* Zekk's Blog */}
            <div
              className="bg-blue-200 p-2 rounded text-center cursor-pointer hover:opacity-90 hover:scale-105 transition-transform"
              onClick={() => playSound('click')}
              onMouseEnter={() => playSound('hover')}
            >
              <div className="bg-white border-2 border-dashed border-blue-400 p-1 rounded-lg w-12 h-12 mx-auto mb-1 overflow-hidden">
                <img src="/zekk_pixel.png" className="w-full h-[160%] object-cover object-top" alt="Zekk" />
              </div>
              <h4 className="font-bold text-white text-[8px]">Zekk's BLOG</h4>
            </div>

            {/* Lia's Blog */}
            <div
              className="bg-pink-200 p-2 rounded text-center cursor-pointer hover:opacity-90 hover:scale-105 transition-transform"
              onClick={() => playSound('click')}
              onMouseEnter={() => playSound('hover')}
            >
              <div className="bg-white border-2 border-dashed border-pink-400 p-1 rounded-lg w-12 h-12 mx-auto mb-1 overflow-hidden">
                <img src="/lia_pixel.png" className="w-full h-[160%] object-cover object-top" alt="Lia" />
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
                <span className="text-[8px] text-pink-400 underline cursor-pointer hover:text-pink-600">View All</span>
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

          {/* SITE STATS - Relocated Section */}
          <div className="bg-gray-50 border border-gray-200 p-2 rounded mt-2">
            <div className="text-[9px] font-bold text-gray-500 mb-1 flex items-center gap-1">
              <span>📊</span> SITE STATS
            </div>
            <div className="bg-pink-500 text-white font-mono text-[10px] p-1 rounded text-center tracking-widest border-2 border-gray-300 shadow-inner">
              001284
            </div>
            <div className="text-[8px] text-gray-400 text-center mt-1">
              Visitors since 2024
            </div>
          </div>
        </aside>

      </div >

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
    </MainLayout >
  );
};

export default Index;

