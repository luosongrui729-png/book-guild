import React from 'react';
import { BookOracleResponse, LanguageMode } from '../types';
import { Gift } from 'lucide-react';

interface BookDisplayProps {
  data: BookOracleResponse | null;
  isLoading: boolean;
  language: LanguageMode;
}

const BookDisplay: React.FC<BookDisplayProps> = ({ data, isLoading, language }) => {
  if (!data && !isLoading) return null;

  const labels = {
    page1: language === 'zh' ? 'PAGE 1 • THE STORY / 故事' : 'PAGE 1 • THE STORY',
    page2: language === 'zh' ? 'PAGE 2 • REFLECTION / 回响' : 'PAGE 2 • REFLECTION',
    gift: language === 'zh' ? 'A GIFT FOR YOU / 送你一句话' : 'A GIFT FOR YOU',
    consulting: language === 'zh' ? '正在查阅图书馆...' : 'Consulting the library...',
    disclaimer: language === 'zh' ? '这只是书里的一种选择，并非唯一的答案。' : 'This is just one perspective from the book, not the only answer.',
  };

  return (
    <div className="w-full max-w-6xl mx-auto perspective-1000 my-8">
      {/* Book Container */}
      <div className={`
        relative bg-paper-50 rounded-lg md:rounded-r-lg md:rounded-l-lg 
        shadow-2xl flex flex-col md:flex-row overflow-hidden
        transition-all duration-1000 ease-in-out
        min-h-[650px] border border-paper-200
        ${isLoading ? 'scale-100' : 'scale-100'}
      `}>
        
        {/* Loading State Overlay - Full Book Flipping */}
        {isLoading && (
          <div className="absolute inset-0 z-50 flex">
             {/* Left Page Static (Underneath) */}
             <div className="flex-1 bg-paper-100 border-r border-paper-300 flex items-center justify-center p-8">
                <div className="text-center opacity-60">
                   <p className="font-serif italic text-xl text-paper-800 animate-pulse">{labels.consulting}</p>
                </div>
             </div>
             
             {/* Right Page Area */}
             <div className="flex-1 bg-paper-50 relative perspective-1000">
                {/* Static Base for Right Page */}
                <div className="absolute inset-0 bg-paper-50 border-l border-paper-200"></div>

                {/* Animated Flipping Pages */}
                {/* These divs rely on CSS defined in index.html to rotate from right to left */}
                <div className="flipping-page flipping-page-1"></div>
                <div className="flipping-page flipping-page-2"></div>
                <div className="flipping-page flipping-page-3"></div>
             </div>
          </div>
        )}
        
        {/* Spine (Center decoration for desktop) */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-paper-300 z-10 shadow-[inset_1px_0_5px_rgba(0,0,0,0.05)]"></div>

        {/* CONTENT (Only visible when not loading) */}
        {!isLoading && (
          <>
            {/* Left Page (Page 1) */}
            <div className="flex-1 p-8 md:p-14 relative bg-gradient-to-r from-paper-50 to-paper-100 border-b md:border-b-0 md:border-r border-paper-200 animate-fade-in">
              <div className="flex flex-col h-full">
                {/* Empathy Section - "The Warm Hug" (Top of page 1) */}
                <div className="mb-10 pb-8 border-b border-paper-200">
                  <p className="font-serif text-xl md:text-2xl text-paper-800 italic leading-relaxed">
                    {data?.empathy}
                  </p>
                </div>

                <div className="text-paper-800/60 text-xs md:text-sm font-sans tracking-[0.2em] uppercase mb-6">
                  {labels.page1}
                </div>

                <div className="prose prose-stone flex-grow max-w-none">
                  {/* Book Title & Author - Highlighted */}
                  <div className="mb-6">
                    <h3 className="font-serif text-3xl md:text-4xl text-ink font-bold leading-tight tracking-tight">
                      {data?.bookContext.title}
                    </h3>
                    <p className="font-sans text-sm font-semibold text-paper-800 uppercase tracking-wider mt-3">
                      — {data?.bookContext.author}
                    </p>
                  </div>

                  <p className="font-serif text-xl leading-loose text-ink/90">
                    {data?.bookContext.summary}
                  </p>
                </div>

                {/* Static Disclaimer Footer */}
                <div className="mt-8 pt-6 border-t border-paper-200/50">
                  <p className="text-[10px] md:text-xs text-paper-400 font-sans italic">
                    {labels.disclaimer}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Page (Page 2) */}
            <div className="flex-1 p-8 md:p-14 relative bg-paper-50 bg-gradient-to-l from-paper-50 to-paper-100 animate-fade-in">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="text-paper-800/60 text-xs md:text-sm font-sans tracking-[0.2em] uppercase mb-8 border-b border-paper-200 pb-2">
                    {labels.page2}
                  </div>

                  {/* Quote Section - "Golden Sentence Card" */}
                  <div className="relative mb-8 pl-6 border-l-4 border-paper-400">
                    <blockquote className="font-serif text-2xl md:text-3xl italic text-ink leading-relaxed">
                      "{data?.reflection.quote}"
                    </blockquote>
                  </div>

                  <div className="space-y-4 mb-10">
                    <p className="font-serif text-xl text-ink/90 leading-loose">
                      {data?.reflection.analysis}
                    </p>
                  </div>
                </div>

                {/* Gift Section - "Gift Card" */}
                <div className="mt-auto pt-8">
                  <div className="flex items-center gap-2 mb-4 text-paper-800">
                    <span className="text-xs md:text-sm font-sans font-bold uppercase tracking-[0.15em]">{labels.gift}</span>
                  </div>
                  <div className="bg-white/60 p-6 rounded-lg border border-paper-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex items-start gap-4 transition-transform hover:scale-[1.01]">
                    <Gift className="w-6 h-6 text-paper-800 mt-1 shrink-0 opacity-70" />
                    <p className="font-serif text-xl text-ink leading-snug italic">
                      {data?.tinyStep}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Decorative pages effect underneath */}
      <div className={`
        mx-2 md:mx-4 -mt-2 h-2 bg-paper-100 border border-paper-300 rounded-b-lg shadow-sm
        transition-opacity duration-700
        ${isLoading || !data ? 'opacity-0' : 'opacity-100'}
      `}></div>
       <div className={`
        mx-4 md:mx-8 -mt-2 h-2 bg-paper-200 border border-paper-300 rounded-b-lg shadow-sm
        transition-opacity duration-700
        ${isLoading || !data ? 'opacity-0' : 'opacity-100'}
      `}></div>
    </div>
  );
};

export default BookDisplay;
