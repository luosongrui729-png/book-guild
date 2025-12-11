export interface BookOracleResponse {
  empathy: string;
  bookContext: {
    title: string;
    author: string;
    summary: string;
  };
  reflection: {
    quote: string;
    analysis: string;
  };
  tinyStep: string;
}

export type LanguageMode = 'en' | 'zh';

export interface Message {
  role: 'user' | 'assistant';
  content: string | BookOracleResponse;
}
