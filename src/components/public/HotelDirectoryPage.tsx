import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { getThemeStyles } from '../../utils/themeStyles';
import { HotelItem, ThemeStyles, CustomPage } from '../../types/database';
import { ArrowLeft } from 'lucide-react';

interface HotelDirectoryPageProps {
  page: CustomPage;
  onBack: () => void;
  themeStyles: ThemeStyles;
  isPreview?: boolean;
}

export function HotelDirectoryPage({ page, onBack, themeStyles, isPreview = false }: HotelDirectoryPageProps) {
  const hotels = useAppStore((s) => s.hotels);
  const [activeFilter, setActiveFilter] = useState('all');

  const targetCity = (page.filterCity || 'all').trim().toLowerCase();
  const subtitleText = page.description || 'Pilihan hotel akomodasi bintang 5 premium terpopuler.';

  let filteredHotels: HotelItem[] = hotels;

  if (targetCity === 'all') {
    if (activeFilter !== 'all') {
      filteredHotels = hotels.filter((h) => h.city.toLowerCase() === activeFilter.toLowerCase());
    }
  } else {
    filteredHotels = hotels.filter((h) => h.city.toLowerCase() === targetCity);
  }

  const uniqueCities = [...new Set(hotels.map((h) => h.city.toLowerCase().trim()))].filter(Boolean);

  const isLightBg = themeStyles.bg.includes('text-slate-900') || themeStyles.bg.includes('text-slate-800');

  const tabClassActive = isLightBg
    ? 'px-3 py-1.5 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white shadow-sm shrink-0'
    : 'px-3 py-1.5 rounded-full text-[10px] font-extrabold bg-white text-slate-900 shadow-md shrink-0';

  const tabClassInactive = isLightBg
    ? 'px-3 py-1.5 rounded-full text-[10px] font-medium bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 shrink-0'
    : 'px-3 py-1.5 rounded-full text-[10px] font-medium bg-white/10 hover:bg-white/20 border border-white/10 text-white shrink-0';

  const cardBg = isLightBg
    ? 'bg-white border border-slate-200 hover:border-indigo-300'
    : 'bg-white/5 border border-white/10 hover:bg-white/10';
  const cardText = isLightBg ? 'text-slate-800' : 'text-white';
  const cardBadge = isLightBg
    ? 'px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[8px] font-bold uppercase tracking-wider'
    : 'px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[8px] font-bold uppercase tracking-wider';
  const cardLocationText = isLightBg ? 'text-slate-500' : 'opacity-75';
  const cardDivider = isLightBg ? 'border-t border-slate-200' : 'border-t border-white/10';
  const cardPriceText = isLightBg ? 'text-indigo-700' : '';
  const backBtn = isLightBg
    ? 'self-start flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 transition-all mb-4'
    : 'self-start flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/25 transition-all mb-4';

  return (
    <div className={`w-full h-full flex flex-col items-stretch text-left animate-fade-in ${isPreview ? 'px-4 pt-10 pb-6' : 'px-6 pt-10 pb-8'} overflow-y-auto rounded-[2.5rem]`}>
      <button onClick={onBack} className={backBtn}>
        <ArrowLeft className="w-3 h-3" /> Kembali
      </button>

      <div className={`shrink-0 ${isLightBg ? '' : 'text-white'}`}>
        <h3 className={`${isPreview ? 'text-base' : 'text-lg'} font-extrabold tracking-tight`}>{page.title}</h3>
        <p className={`${isPreview ? 'text-[10px]' : 'text-xs'} opacity-80 mt-0.5 leading-relaxed`}>{subtitleText}</p>
      </div>

      {targetCity === 'all' ? (
        <div className="flex items-center gap-1.5 my-3 shrink-0 overflow-x-auto py-1 no-scrollbar justify-start">
          <button
            onClick={() => setActiveFilter('all')}
            className={activeFilter === 'all' ? tabClassActive : tabClassInactive}
          >
            Semua Kota
          </button>
          {uniqueCities.map((city) => (
            <button
              key={city}
              onClick={() => setActiveFilter(city)}
              className={activeFilter === city ? tabClassActive : tabClassInactive}
            >
              {city.charAt(0).toUpperCase() + city.slice(1)}
            </button>
          ))}
        </div>
      ) : (
        <div className="my-3">
          <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold ${themeStyles.badge}`}>
            Kota: {targetCity.charAt(0).toUpperCase() + targetCity.slice(1)}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-1">
        {filteredHotels.length === 0 ? (
          <div className={`py-8 text-center text-[11px] ${isLightBg ? 'text-slate-400' : 'opacity-60'}`}>
            Tidak ada hotel untuk kota ini.
          </div>
        ) : (
          filteredHotels.map((hotel) => {
            const bookingLink = hotel.bookingUrl || `https://www.google.com/search?q=${encodeURIComponent(hotel.name)}`;
            return (
              <div key={hotel.id} className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${cardBg}`}>
                <img src={hotel.image} className={`${isPreview ? 'w-14 h-14' : 'w-16 h-16'} rounded-xl object-cover bg-white/10 shrink-0`} alt="" />
                <div className={`overflow-hidden flex-grow ${cardText}`}>
                  <div className="flex items-center justify-between gap-1">
                    <span className={cardBadge}>{hotel.badge || 'Populer'}</span>
                    <span className="text-amber-500 text-[10px] font-bold shrink-0">
                      <i className="fas fa-star text-[9px]"></i> {hotel.rating}
                    </span>
                  </div>
                  <h4 className={`font-bold ${isPreview ? 'text-[11px]' : 'text-xs'} truncate mt-1`}>{hotel.name}</h4>
                  <span className={`text-[9px] truncate flex items-center gap-1 ${cardLocationText}`}>
                    <i className="fas fa-map-marker-alt"></i> {hotel.location}
                  </span>
                  <div className={`flex items-center justify-between mt-2.5 pt-2 ${cardDivider}`}>
                    <div className="flex flex-col">
                      <span className="text-[8px] opacity-60">Mulai Dari</span>
                      <span className={`font-extrabold text-[11px] ${cardPriceText}`}>{hotel.price}</span>
                    </div>
                    <a
                      href={bookingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg text-[9px] font-extrabold bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md text-center flex items-center gap-1"
                    >
                      Pesan <i className="fas fa-external-link-alt text-[8px]"></i>
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
