// models/response/NewsResponse.ts

export interface NewsResponse {
    _id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    updatedAt: string;
    imageUrl: string | null; // Optional image URL for the news article
    message: string; // The message field added to all responses
  }
  