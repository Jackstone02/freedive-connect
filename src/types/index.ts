// ─── User & Auth ─────────────────────────────────────────────────────────────

export type UserRole = 'customer' | 'instructor';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
  role: UserRole;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  created_at: string;
}

// ─── Instructor ───────────────────────────────────────────────────────────────

export interface InstructorProfile {
  id: string;
  user_id: string;
  bio: string | null;
  experience_years: number;
  languages: string[];
  location_lat: number;
  location_lng: number;
  location_name: string;
  payment_info: string | null;
  is_verified: boolean;
  is_active: boolean;
  rating_avg: number;
  rating_count: number;
  // joined from profiles
  profile?: Profile;
}

export interface Certification {
  id: string;
  instructor_id: string;
  cert_type: string;
  cert_number: string | null;
  cert_image_url: string | null;
  issued_date: string | null;
  is_verified: boolean;
}

// ─── Lessons ──────────────────────────────────────────────────────────────────

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
export type LessonFormat = 'private' | 'group' | 'pool' | 'open_water';

export interface LessonType {
  id: string;
  instructor_id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  skill_level: SkillLevel;
  lesson_format: LessonFormat;
  max_participants: number;
  price: number;
  is_active: boolean;
}

// ─── Availability ─────────────────────────────────────────────────────────────

export interface AvailabilitySlot {
  id: string;
  instructor_id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  customer_id: string;
  instructor_id: string;
  lesson_type_id: string;
  availability_slot_id: string;
  booking_date: string;
  start_time: string;
  participants_count: number;
  status: BookingStatus;
  notes: string | null;
  cancel_reason: string | null;
  created_at: string;
  // joined
  instructor?: InstructorProfile;
  lesson_type?: LessonType;
  customer?: Profile;
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewed_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer?: Profile;
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  booking_id: string | null;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: Profile;
}

export interface Conversation {
  other_user: Profile;
  last_message: Message;
  unread_count: number;
}

// ─── Dive Sites ───────────────────────────────────────────────────────────────

export interface DiveSite {
  id: string;
  name: string;
  location_lat: number;
  location_lng: number;
  description: string | null;
  difficulty: SkillLevel | null;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  SignIn: undefined;
  SignUp: { role: UserRole };
  CustomerTabs: undefined;
  InstructorTabs: undefined;
  // Shared
  Chat: { other_user_id: string; other_user_name: string; booking_id?: string };
  VideoCall: { room_url: string; other_user_name: string };
};

export type CustomerTabParamList = {
  HomeMap: undefined;
  Search: undefined;
  MyBookings: undefined;
  Messages: undefined;
  CustomerProfile: undefined;
};

export type InstructorTabParamList = {
  Dashboard: undefined;
  BookingRequests: undefined;
  InstructorProfile: undefined;
  Availability: undefined;
  Messages: undefined;
};

export type CustomerStackParamList = {
  CustomerTabs: undefined;
  InstructorDetail: { instructor_id: string };
  BookingForm: { instructor_id: string; lesson_type_id: string };
  BookingConfirmation: { booking_id: string };
  BookingDetail: { booking_id: string };
  LeaveReview: { booking_id: string; instructor_id: string };
};

export type InstructorStackParamList = {
  InstructorTabs: undefined;
  InstructorBookingDetail: { booking_id: string };
  EditProfile: undefined;
  ManageLessonTypes: undefined;
  AddLessonType: undefined;
  Settings: undefined;
};
