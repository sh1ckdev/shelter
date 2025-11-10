// models/response/VolunteerResponse.ts

export interface VolunteerResponse {
    _id: string;
    userId: string; 
    tasks: string[]; 
    schedule: string | null;
    status: 'pending' | 'approved' | 'rejected'; 
    createdAt: string;
    updatedAt: string;
    message: string;
  }
  

  