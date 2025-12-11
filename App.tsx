import React, { useState, useRef, useEffect } from 'react';
import { Book, AlertCircle, RefreshCcw, BookOpen, Sparkles } from 'lucide-react';
import BookDisplay from './components/BookDisplay';
import { fetchBookWisdom } from './services/geminiService';
import { BookOracleResponse, LanguageMode } from './types';

const SAMPLE_QUESTIONS = {
  en: [
    "I feel like I'm falling behind my peers.",
    "I'm afraid to make the wrong choice.",
    "How do I deal with a broken heart?",
    "I've lost my motivation to work."
  ],
  zh: [
    "感觉同龄人都比我成功，很焦虑。",
    "虽然不快乐，但不敢跳出舒适圈。",
    "如何面对一段关系的结束？",
    "最近对什么都提不起兴趣。"
  ]
};

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<BookOracleResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<LanguageMode>('en');
  
  // Use a ref to scroll to the book when it opens
  const bookRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await fetchBookWisdom(query, language);
      setResponse(result);
    } catch (err) {
      setError("The library is currently silent. Please try asking again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResponse(null);
    setQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSampleClick = (q: string) => {
    setQuery(q);
    // Optional: auto-submit or just fill
  };

  useEffect(() => {
    if ((response || isLoading) && bookRef.current) {
      setTimeout(() => {
        bookRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [response, isLoading]);

  // Logic to determine vertical alignment
  // If showing result or loading, behave normally.
  // If initial state, center everything vertically.
  const isCenteredState = !response && !isLoading;

  return (
    <div className={`min-h-screen font-sans bg-paper-100 text-ink selection:bg-paper-300 selection:text-ink pb-20 flex flex-col`}>
      {/* Navigation / Header */}
      <nav className={`w-full px-6 py-6 flex justify-between items-center max-w-5xl mx-auto transition-all duration-500 ${isCenteredState ? 'absolute top-0 left-0 right-0 z-10' : ''}`}>
        <div className="flex items-center gap-2 group cursor-pointer" onClick={handleReset}>
          <Book className="w-6 h-6 text-paper-800 group-hover:text-ink transition-colors" />
          <h1 className="font-serif text-xl font-semibold tracking-tight text-ink">Book Oracle</h1>
        </div>
        
        <div className="flex items-center bg-paper-200 rounded-full p-1 shadow-inner">
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              language === 'en' 
                ? 'bg-white text-ink shadow-sm' 
                : 'text-paper-800 hover:text-ink'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('zh')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              language === 'zh' 
                ? 'bg-white text-ink shadow-sm' 
                : 'text-paper-800 hover:text-ink'
            }`}
          >
            中文
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`container mx-auto px-4 max-w-6xl flex-grow flex flex-col ${isCenteredState ? 'justify-center items-center' : 'pt-8 md:pt-12'}`}>
        
        {/* Intro Section - Hide when book is open */}
        {!response && !isLoading && (
          <div className="text-center mb-10 space-y-6 animate-fade-in-up w-full max-w-2xl">
            {/* Logo instead of Badge */}
            <div className="flex justify-center">
              <div className="bg-paper-200/50 p-4 rounded-full border border-paper-200 shadow-sm mb-2">
                <BookOpen className="w-10 h-10 text-paper-800" strokeWidth={1.5} />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-serif text-4xl md:text-5xl text-ink font-medium leading-tight">
                {language === 'en' ? (
                  <>Life has questions. <br/><span className="italic text-paper-800">Books have voices.</span></>
                ) : (
                  <>生活常有困惑，<br/><span className="italic text-paper-800">书籍自有回响。</span></>
                )}
              </h2>
            </div>
          </div>
        )}

        {/* Input Form */}
        {!response && !isLoading && (
          <div className={`transition-all duration-500 ease-in-out w-full max-w-2xl`}>
            <form onSubmit={handleSubmit} className="relative w-full group">
              <div className="absolute inset-0 bg-white rounded-2xl shadow-xl transform rotate-1 group-hover:rotate-0 transition-transform duration-300 border border-paper-200"></div>
              <div className="absolute inset-0 bg-white rounded-2xl shadow-md transform -rotate-1 group-hover:rotate-0 transition-transform duration-300 border border-paper-200"></div>
              
              <div className="relative bg-white p-2 rounded-2xl shadow-sm border border-paper-200">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={language === 'en' ? "What are you struggling with right now?" : "你现在正为什么而困扰？"}
                  className="w-full h-32 md:h-40 p-6 bg-transparent border-none resize-none focus:ring-0 text-lg font-serif placeholder:text-paper-300 placeholder:italic text-ink outline-none"
                  disabled={isLoading}
                />
                <div className="flex justify-between items-center px-4 pb-2">
                  <span className="text-xs text-paper-300 font-medium px-2">
                    {language === 'en' ? 'Private & Anonymous' : '隐私且匿名'}
                  </span>
                  <button
                    type="submit"
                    disabled={!query.trim() || isLoading}
                    className={`
                      flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300
                      ${!query.trim() || isLoading 
                        ? 'bg-paper-100 text-paper-300 cursor-not-allowed' 
                        : 'bg-ink text-paper-50 hover:bg-paper-800 shadow-md hover:shadow-lg active:scale-95'}
                    `}
                  >
                    <Sparkles className="w-4 h-4" />
                    {language === 'en' ? 'Open the Book' : '翻开书页'}
                  </button>
                </div>
              </div>
            </form>

            {/* Sample Questions */}
            <div className="max-w-2xl mx-auto mt-8">
              <p className="text-center text-xs text-paper-400 font-sans uppercase tracking-widest mb-4">
                {language === 'en' ? 'Or try one of these' : '或者试着问问'}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {SAMPLE_QUESTIONS[language].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSampleClick(q)}
                    className="px-4 py-2 bg-white border border-paper-200 rounded-full text-paper-800 text-sm font-medium hover:bg-paper-50 hover:border-paper-300 hover:text-ink transition-colors shadow-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 flex items-center justify-center gap-2 text-red-800 bg-red-50 p-3 rounded-lg max-w-md mx-auto animate-fade-in text-sm border border-red-100">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        {/* Book Display Section */}
        <div ref={bookRef} className="w-full flex justify-center">
          <BookDisplay data={response} isLoading={isLoading} language={language} />
        </div>
        
        {/* Reset Action (only show after response) */}
        {response && (
           <div className="text-center mt-8 md:mt-12 space-y-6 animate-fade-in pb-10">
              <button 
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-paper-200 rounded-full text-paper-800 font-medium hover:bg-paper-50 hover:text-ink shadow-sm transition-all hover:shadow-md"
              >
                <RefreshCcw className="w-4 h-4" />
                {language === 'en' ? 'Ask Another Question' : '问另一个问题'}
              </button>
           </div>
        )}
      </main>

      {/* Footer Disclaimer */}
      <footer className="w-full text-center px-4 py-6 mt-auto">
        <p className="text-[10px] md:text-xs text-paper-400 max-w-2xl mx-auto leading-relaxed">
          AI may produce inaccurate information. It is not a substitute for professional medical, legal, or psychological advice. 
          If you are in distress or danger, please contact local emergency services or a professional immediately.
        </p>
      </footer>
    </div>
  );
};

export default App;