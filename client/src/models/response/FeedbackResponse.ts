// models/response/FeedbackResponse.ts

export interface FeedbackResponse {
    _id: string;
    name: string;
    email: string;
    message: string; // Feedback message content
    date: string;
    responseMessage: string; // A separate field for response message from admin or system
  }
  