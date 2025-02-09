// models/response/VolunteerResponse.ts

export interface VolunteerResponse {
    _id: string;
    userId: string; // Refers to the User object (user's ID)
    tasks: string[]; // List of tasks assigned to the volunteer
    schedule: string | null; // Availability schedule
    status: 'pending' | 'approved' | 'rejected'; // Volunteer approval status
    createdAt: string;
    updatedAt: string;
    message: string; // The message field added to all responses
  }
  