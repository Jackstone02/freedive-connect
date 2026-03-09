import { InstructorProfile, LessonType, AvailabilitySlot, Booking, Review, Certification } from '../types';

// ─── Profiles ────────────────────────────────────────────────

export const MOCK_PROFILES: Record<string, any> = {
  'mock-instructor-1': {
    id: 'mock-instructor-1',
    full_name: 'Juan dela Cruz',
    avatar_url: null,
    phone: '+63 917 123 4567',
    role: 'instructor',
    emergency_contact_name: null,
    emergency_contact_phone: null,
    created_at: '2024-01-01T00:00:00Z',
  },
  'mock-instructor-2': {
    id: 'mock-instructor-2',
    full_name: 'Maria Santos',
    avatar_url: null,
    phone: '+63 918 234 5678',
    role: 'instructor',
    emergency_contact_name: null,
    emergency_contact_phone: null,
    created_at: '2024-01-01T00:00:00Z',
  },
  'mock-instructor-3': {
    id: 'mock-instructor-3',
    full_name: 'Pedro Reyes',
    avatar_url: null,
    phone: '+63 919 345 6789',
    role: 'instructor',
    emergency_contact_name: null,
    emergency_contact_phone: null,
    created_at: '2024-01-01T00:00:00Z',
  },
  'mock-instructor-4': {
    id: 'mock-instructor-4',
    full_name: 'Liza Fernandez',
    avatar_url: null,
    phone: '+63 920 456 7890',
    role: 'instructor',
    emergency_contact_name: null,
    emergency_contact_phone: null,
    created_at: '2024-01-01T00:00:00Z',
  },
  'mock-instructor-5': {
    id: 'mock-instructor-5',
    full_name: 'Ramon Villanueva',
    avatar_url: null,
    phone: '+63 921 567 8901',
    role: 'instructor',
    emergency_contact_name: null,
    emergency_contact_phone: null,
    created_at: '2024-01-01T00:00:00Z',
  },
  'mock-instructor-6': {
    id: 'mock-instructor-6',
    full_name: 'Claire Tan',
    avatar_url: null,
    phone: '+63 922 678 9012',
    role: 'instructor',
    emergency_contact_name: null,
    emergency_contact_phone: null,
    created_at: '2024-01-01T00:00:00Z',
  },
  'mock-instructor-7': {
    id: 'mock-instructor-7',
    full_name: 'Miguel Aquino',
    avatar_url: null,
    phone: '+63 923 789 0123',
    role: 'instructor',
    emergency_contact_name: null,
    emergency_contact_phone: null,
    created_at: '2024-01-01T00:00:00Z',
  },
};

// ─── Instructor Profiles ──────────────────────────────────────

export const MOCK_INSTRUCTORS: InstructorProfile[] = [
  {
    id: 'mock-ip-1',
    user_id: 'mock-instructor-1',
    bio: 'AIDA3 certified freediver with 5 years of teaching experience in Mactan and Moal Boal. I specialize in teaching beginners and helping them discover the joy of apnea. Safety is always my top priority.',
    experience_years: 5,
    languages: ['Filipino', 'English'],
    location_lat: 10.2874,
    location_lng: 124.0174,
    location_name: 'Mactan, Cebu',
    payment_info: 'GCash: 0917 123 4567',
    is_verified: true,
    is_active: true,
    rating_avg: 4.8,
    rating_count: 24,
    profile: MOCK_PROFILES['mock-instructor-1'],
  },
  {
    id: 'mock-ip-2',
    user_id: 'mock-instructor-2',
    bio: 'SSI Freediving Instructor from Moal Boal. 7 years of experience. I love sharing the underwater world with students — from the famous Sardine Run to deep open water sessions.',
    experience_years: 7,
    languages: ['Filipino', 'English', 'Bisaya'],
    location_lat: 9.9532,
    location_lng: 123.3967,
    location_name: 'Moal Boal, Cebu',
    payment_info: 'GCash: 0918 234 5678 | BDO: 1234567890',
    is_verified: true,
    is_active: true,
    rating_avg: 4.9,
    rating_count: 41,
    profile: MOCK_PROFILES['mock-instructor-2'],
  },
  {
    id: 'mock-ip-3',
    user_id: 'mock-instructor-3',
    bio: 'PADI Freediver and spearfishing enthusiast based in Malapascua. Advanced dives and specialty courses available. Dawn dives for thresher sharks are my favorite!',
    experience_years: 3,
    languages: ['Filipino', 'English'],
    location_lat: 11.3276,
    location_lng: 124.1174,
    location_name: 'Malapascua, Cebu',
    payment_info: 'GCash: 0919 345 6789',
    is_verified: false,
    is_active: true,
    rating_avg: 4.5,
    rating_count: 10,
    profile: MOCK_PROFILES['mock-instructor-3'],
  },
  {
    id: 'mock-ip-4',
    user_id: 'mock-instructor-4',
    bio: 'AIDA2 instructor and marine biologist based in Oslob. Known for the Whale Shark Encounter experience — I help students dive safely alongside gentle giants. Ocean conservation is close to my heart.',
    experience_years: 6,
    languages: ['Filipino', 'English', 'Bisaya'],
    location_lat: 9.4901,
    location_lng: 123.3855,
    location_name: 'Oslob, Cebu',
    payment_info: 'GCash: 0920 456 7890 | Maya: 0920 456 7890',
    is_verified: true,
    is_active: true,
    rating_avg: 4.7,
    rating_count: 32,
    profile: MOCK_PROFILES['mock-instructor-4'],
  },
  {
    id: 'mock-ip-5',
    user_id: 'mock-instructor-5',
    bio: 'National freediving competitor and AIDA Instructor Trainer based in Bantayan Island. I coach athletes and serious enthusiasts looking to push their depth and breath-hold PBs. Strict on technique, patient with beginners.',
    experience_years: 10,
    languages: ['Filipino', 'English'],
    location_lat: 11.1833,
    location_lng: 123.7167,
    location_name: 'Bantayan Island, Cebu',
    payment_info: 'BDO: 9876543210 | GCash: 0921 567 8901',
    is_verified: true,
    is_active: true,
    rating_avg: 5.0,
    rating_count: 58,
    profile: MOCK_PROFILES['mock-instructor-5'],
  },
  {
    id: 'mock-ip-6',
    user_id: 'mock-instructor-6',
    bio: 'SSI Freediving Instructor based in Dalaguete on Cebu\'s southern coast. Specializing in pool training and open water certification courses. Also conducts bilingual lessons in English and Japanese for international visitors.',
    experience_years: 4,
    languages: ['Filipino', 'English', 'Japanese'],
    location_lat: 9.7614,
    location_lng: 123.5379,
    location_name: 'Dalaguete, Cebu',
    payment_info: 'GCash: 0922 678 9012',
    is_verified: true,
    is_active: true,
    rating_avg: 4.6,
    rating_count: 19,
    profile: MOCK_PROFILES['mock-instructor-6'],
  },
  {
    id: 'mock-ip-7',
    user_id: 'mock-instructor-7',
    bio: 'AIDA4 competitive freediver and coach in Mactan. Former regional champion. I specialize in static apnea, dynamic pool training, and advanced depth progressions. Looking for your personal best? Let\'s work toward it.',
    experience_years: 8,
    languages: ['Filipino', 'English'],
    location_lat: 10.2951,
    location_lng: 124.0027,
    location_name: 'Mactan, Cebu',
    payment_info: 'GCash: 0923 789 0123 | PayMaya: 0923 789 0123',
    is_verified: true,
    is_active: true,
    rating_avg: 4.9,
    rating_count: 45,
    profile: MOCK_PROFILES['mock-instructor-7'],
  },
];

// ─── Certifications ───────────────────────────────────────────

export const MOCK_CERTIFICATIONS: Record<string, Certification[]> = {
  'mock-ip-1': [
    { id: 'cert-1', instructor_id: 'mock-ip-1', cert_type: 'AIDA3', cert_number: 'AIDA-PH-2019-0234', cert_image_url: null, issued_date: '2019-06-15', is_verified: true },
    { id: 'cert-2', instructor_id: 'mock-ip-1', cert_type: 'AIDA Instructor', cert_number: 'AIDA-PH-2021-0056', cert_image_url: null, issued_date: '2021-03-22', is_verified: true },
  ],
  'mock-ip-2': [
    { id: 'cert-3', instructor_id: 'mock-ip-2', cert_type: 'SSI Level 2', cert_number: 'SSI-PH-2018-0456', cert_image_url: null, issued_date: '2018-08-10', is_verified: true },
    { id: 'cert-4', instructor_id: 'mock-ip-2', cert_type: 'SSI Instructor', cert_number: 'SSI-PH-2020-0123', cert_image_url: null, issued_date: '2020-01-15', is_verified: true },
  ],
  'mock-ip-3': [
    { id: 'cert-5', instructor_id: 'mock-ip-3', cert_type: 'PADI Freediver', cert_number: 'PADI-PH-2022-0789', cert_image_url: null, issued_date: '2022-05-20', is_verified: false },
  ],
  'mock-ip-4': [
    { id: 'cert-6', instructor_id: 'mock-ip-4', cert_type: 'AIDA2', cert_number: 'AIDA-PH-2020-0311', cert_image_url: null, issued_date: '2020-03-10', is_verified: true },
    { id: 'cert-7', instructor_id: 'mock-ip-4', cert_type: 'AIDA Instructor', cert_number: 'AIDA-PH-2022-0087', cert_image_url: null, issued_date: '2022-09-05', is_verified: true },
  ],
  'mock-ip-5': [
    { id: 'cert-8', instructor_id: 'mock-ip-5', cert_type: 'AIDA4', cert_number: 'AIDA-PH-2016-0044', cert_image_url: null, issued_date: '2016-07-22', is_verified: true },
    { id: 'cert-9', instructor_id: 'mock-ip-5', cert_type: 'AIDA Instructor Trainer', cert_number: 'AIDA-PH-2019-0012', cert_image_url: null, issued_date: '2019-11-18', is_verified: true },
  ],
  'mock-ip-6': [
    { id: 'cert-10', instructor_id: 'mock-ip-6', cert_type: 'SSI Level 2', cert_number: 'SSI-PH-2021-0567', cert_image_url: null, issued_date: '2021-04-14', is_verified: true },
    { id: 'cert-11', instructor_id: 'mock-ip-6', cert_type: 'SSI Instructor', cert_number: 'SSI-PH-2023-0231', cert_image_url: null, issued_date: '2023-02-28', is_verified: true },
  ],
  'mock-ip-7': [
    { id: 'cert-12', instructor_id: 'mock-ip-7', cert_type: 'AIDA4', cert_number: 'AIDA-PH-2018-0099', cert_image_url: null, issued_date: '2018-05-11', is_verified: true },
    { id: 'cert-13', instructor_id: 'mock-ip-7', cert_type: 'AIDA Instructor', cert_number: 'AIDA-PH-2020-0073', cert_image_url: null, issued_date: '2020-06-30', is_verified: true },
  ],
};

// ─── Lesson Types ─────────────────────────────────────────────

export const MOCK_LESSON_TYPES: Record<string, LessonType[]> = {
  'mock-ip-1': [
    {
      id: 'lt-1', instructor_id: 'mock-ip-1',
      name: 'Intro to Freediving',
      description: 'Perfect first lesson. Learn breath-hold basics, equalization, and pool diving up to 5m.',
      duration_minutes: 90, skill_level: 'beginner', lesson_format: 'private',
      max_participants: 1, price: 1500, is_active: true,
    },
    {
      id: 'lt-2', instructor_id: 'mock-ip-1',
      name: 'Group Beginner Course',
      description: 'Fun group session for 2–4 people. Pool and shallow open water.',
      duration_minutes: 120, skill_level: 'beginner', lesson_format: 'group',
      max_participants: 4, price: 900, is_active: true,
    },
    {
      id: 'lt-3', instructor_id: 'mock-ip-1',
      name: 'Open Water Freedive',
      description: 'Explore Mactan reef. Minimum 10m depth experience required.',
      duration_minutes: 120, skill_level: 'intermediate', lesson_format: 'open_water',
      max_participants: 2, price: 2000, is_active: true,
    },
  ],
  'mock-ip-2': [
    {
      id: 'lt-4', instructor_id: 'mock-ip-2',
      name: 'Sardine Run Experience',
      description: 'Swim with millions of sardines in Moal Boal. All levels welcome!',
      duration_minutes: 120, skill_level: 'beginner', lesson_format: 'group',
      max_participants: 6, price: 1200, is_active: true,
    },
    {
      id: 'lt-5', instructor_id: 'mock-ip-2',
      name: 'Private Freediving Course',
      description: 'Full-day private session covering theory, pool, and open water.',
      duration_minutes: 240, skill_level: 'beginner', lesson_format: 'private',
      max_participants: 1, price: 3500, is_active: true,
    },
    {
      id: 'lt-6', instructor_id: 'mock-ip-2',
      name: 'Advanced Apnea Training',
      description: 'Improve depth and breath-hold time. For intermediate freedivers.',
      duration_minutes: 180, skill_level: 'advanced', lesson_format: 'private',
      max_participants: 1, price: 2500, is_active: true,
    },
  ],
  'mock-ip-3': [
    {
      id: 'lt-7', instructor_id: 'mock-ip-3',
      name: 'Malapascua Shark Dive',
      description: 'Dawn dive for thresher sharks. Advanced divers only.',
      duration_minutes: 90, skill_level: 'advanced', lesson_format: 'open_water',
      max_participants: 3, price: 2000, is_active: true,
    },
    {
      id: 'lt-8', instructor_id: 'mock-ip-3',
      name: 'Intro Pool Session',
      description: 'Beginner pool lesson in Malapascua resort pool.',
      duration_minutes: 60, skill_level: 'beginner', lesson_format: 'pool',
      max_participants: 2, price: 1000, is_active: true,
    },
  ],
  'mock-ip-4': [
    {
      id: 'lt-9', instructor_id: 'mock-ip-4',
      name: 'Whale Shark Encounter Dive',
      description: 'Freedive alongside whale sharks in Oslob. Includes boat and snorkel gear. Perfect for all levels.',
      duration_minutes: 120, skill_level: 'beginner', lesson_format: 'group',
      max_participants: 6, price: 1800, is_active: true,
    },
    {
      id: 'lt-10', instructor_id: 'mock-ip-4',
      name: 'Marine Biology Dive Tour',
      description: 'Learn about reef ecosystems while freediving. Guided by a marine biologist. Intermediate level.',
      duration_minutes: 150, skill_level: 'intermediate', lesson_format: 'open_water',
      max_participants: 4, price: 2200, is_active: true,
    },
    {
      id: 'lt-11', instructor_id: 'mock-ip-4',
      name: 'AIDA2 Certification Course',
      description: 'Full AIDA2 certification over two days. Pool and open water sessions included.',
      duration_minutes: 480, skill_level: 'beginner', lesson_format: 'private',
      max_participants: 1, price: 5500, is_active: true,
    },
  ],
  'mock-ip-5': [
    {
      id: 'lt-12', instructor_id: 'mock-ip-5',
      name: 'Static Apnea Clinic',
      description: 'Master breath-hold techniques for static apnea. Focus on relaxation, CO2 tolerance, and mental training.',
      duration_minutes: 120, skill_level: 'intermediate', lesson_format: 'pool',
      max_participants: 3, price: 2000, is_active: true,
    },
    {
      id: 'lt-13', instructor_id: 'mock-ip-5',
      name: 'Dynamic Pool Training',
      description: 'Underwater distance training in a 25m pool. Technique correction and personalized programming.',
      duration_minutes: 90, skill_level: 'intermediate', lesson_format: 'pool',
      max_participants: 2, price: 1800, is_active: true,
    },
    {
      id: 'lt-14', instructor_id: 'mock-ip-5',
      name: 'Elite Depth Program',
      description: 'One-on-one depth coaching for competitive freedivers. Includes video analysis and custom training plan.',
      duration_minutes: 240, skill_level: 'advanced', lesson_format: 'open_water',
      max_participants: 1, price: 4500, is_active: true,
    },
  ],
  'mock-ip-6': [
    {
      id: 'lt-15', instructor_id: 'mock-ip-6',
      name: 'Dalaguete Half-Day Freedive',
      description: 'Introduction to freediving in the calm southern shores of Dalaguete, Cebu. Gear provided.',
      duration_minutes: 180, skill_level: 'beginner', lesson_format: 'group',
      max_participants: 5, price: 1400, is_active: true,
    },
    {
      id: 'lt-16', instructor_id: 'mock-ip-6',
      name: 'Japanese Language Guided Dive',
      description: 'Freediving lesson conducted in Japanese and English. Ideal for Japanese tourists visiting Bohol.',
      duration_minutes: 120, skill_level: 'beginner', lesson_format: 'private',
      max_participants: 2, price: 2000, is_active: true,
    },
    {
      id: 'lt-17', instructor_id: 'mock-ip-6',
      name: 'SSI Freediving Level 1 Course',
      description: 'SSI certification course. Covers theory, confined water, and open water dives.',
      duration_minutes: 360, skill_level: 'beginner', lesson_format: 'private',
      max_participants: 1, price: 4800, is_active: true,
    },
  ],
  'mock-ip-7': [
    {
      id: 'lt-18', instructor_id: 'mock-ip-7',
      name: 'Breath-Hold Fundamentals',
      description: 'Foundational breath-hold training for athletes and fitness swimmers. Pool-based.',
      duration_minutes: 90, skill_level: 'beginner', lesson_format: 'pool',
      max_participants: 2, price: 1600, is_active: true,
    },
    {
      id: 'lt-19', instructor_id: 'mock-ip-7',
      name: 'Competitive Freediving Camp',
      description: 'Intensive 3-hour session for competitive divers. Static, dynamic, and depth training with video review.',
      duration_minutes: 180, skill_level: 'advanced', lesson_format: 'private',
      max_participants: 1, price: 3800, is_active: true,
    },
    {
      id: 'lt-20', instructor_id: 'mock-ip-7',
      name: 'Open Water Depth Progression',
      description: 'Guided depth sessions from 10m to 20m+ in the warm waters off Mactan.',
      duration_minutes: 150, skill_level: 'intermediate', lesson_format: 'open_water',
      max_participants: 2, price: 2800, is_active: true,
    },
  ],
};

// ─── Availability Slots ───────────────────────────────────────

const today = new Date();
const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r.toISOString().split('T')[0];
};

export const MOCK_SLOTS: Record<string, AvailabilitySlot[]> = {
  'mock-ip-1': [
    { id: 'slot-1',  instructor_id: 'mock-ip-1', slot_date: addDays(today, 1), start_time: '08:00', end_time: '10:00', is_booked: true },
    { id: 'slot-2',  instructor_id: 'mock-ip-1', slot_date: addDays(today, 1), start_time: '14:00', end_time: '16:00', is_booked: false },
    { id: 'slot-3',  instructor_id: 'mock-ip-1', slot_date: addDays(today, 2), start_time: '09:00', end_time: '11:00', is_booked: false },
    { id: 'slot-4',  instructor_id: 'mock-ip-1', slot_date: addDays(today, 3), start_time: '07:00', end_time: '09:30', is_booked: false },
    { id: 'slot-5',  instructor_id: 'mock-ip-1', slot_date: addDays(today, 5), start_time: '08:00', end_time: '10:00', is_booked: false },
    { id: 'slot-6',  instructor_id: 'mock-ip-1', slot_date: addDays(today, 5), start_time: '14:00', end_time: '16:00', is_booked: false },
    { id: 'slot-7',  instructor_id: 'mock-ip-1', slot_date: addDays(today, 7), start_time: '09:00', end_time: '11:30', is_booked: false },
    { id: 'slot-8',  instructor_id: 'mock-ip-1', slot_date: addDays(today, 8), start_time: '07:00', end_time: '09:00', is_booked: false },
    { id: 'slot-9',  instructor_id: 'mock-ip-1', slot_date: addDays(today, 10), start_time: '10:00', end_time: '12:00', is_booked: false },
  ],
  'mock-ip-2': [
    { id: 'slot-10', instructor_id: 'mock-ip-2', slot_date: addDays(today, 1), start_time: '06:00', end_time: '08:00', is_booked: true },
    { id: 'slot-11', instructor_id: 'mock-ip-2', slot_date: addDays(today, 1), start_time: '13:00', end_time: '16:00', is_booked: false },
    { id: 'slot-12', instructor_id: 'mock-ip-2', slot_date: addDays(today, 2), start_time: '06:00', end_time: '10:00', is_booked: false },
    { id: 'slot-13', instructor_id: 'mock-ip-2', slot_date: addDays(today, 3), start_time: '06:00', end_time: '08:00', is_booked: false },
    { id: 'slot-14', instructor_id: 'mock-ip-2', slot_date: addDays(today, 4), start_time: '10:00', end_time: '13:00', is_booked: false },
    { id: 'slot-15', instructor_id: 'mock-ip-2', slot_date: addDays(today, 6), start_time: '06:00', end_time: '10:00', is_booked: false },
    { id: 'slot-16', instructor_id: 'mock-ip-2', slot_date: addDays(today, 8), start_time: '13:00', end_time: '16:00', is_booked: false },
    { id: 'slot-17', instructor_id: 'mock-ip-2', slot_date: addDays(today, 9), start_time: '06:00', end_time: '08:00', is_booked: false },
  ],
  'mock-ip-3': [
    { id: 'slot-18', instructor_id: 'mock-ip-3', slot_date: addDays(today, 2), start_time: '05:30', end_time: '08:00', is_booked: false },
    { id: 'slot-19', instructor_id: 'mock-ip-3', slot_date: addDays(today, 3), start_time: '05:30', end_time: '08:00', is_booked: true },
    { id: 'slot-20', instructor_id: 'mock-ip-3', slot_date: addDays(today, 5), start_time: '05:30', end_time: '08:00', is_booked: false },
    { id: 'slot-21', instructor_id: 'mock-ip-3', slot_date: addDays(today, 7), start_time: '05:30', end_time: '08:00', is_booked: false },
    { id: 'slot-22', instructor_id: 'mock-ip-3', slot_date: addDays(today, 9), start_time: '10:00', end_time: '11:00', is_booked: false },
  ],
  'mock-ip-4': [
    { id: 'slot-23', instructor_id: 'mock-ip-4', slot_date: addDays(today, 1), start_time: '07:00', end_time: '09:30', is_booked: true },
    { id: 'slot-24', instructor_id: 'mock-ip-4', slot_date: addDays(today, 2), start_time: '07:00', end_time: '09:30', is_booked: false },
    { id: 'slot-25', instructor_id: 'mock-ip-4', slot_date: addDays(today, 3), start_time: '13:00', end_time: '16:00', is_booked: false },
    { id: 'slot-26', instructor_id: 'mock-ip-4', slot_date: addDays(today, 4), start_time: '07:00', end_time: '09:30', is_booked: false },
    { id: 'slot-27', instructor_id: 'mock-ip-4', slot_date: addDays(today, 6), start_time: '07:00', end_time: '09:30', is_booked: false },
    { id: 'slot-28', instructor_id: 'mock-ip-4', slot_date: addDays(today, 8), start_time: '13:00', end_time: '16:00', is_booked: false },
  ],
  'mock-ip-5': [
    { id: 'slot-29', instructor_id: 'mock-ip-5', slot_date: addDays(today, 1), start_time: '06:00', end_time: '08:00', is_booked: false },
    { id: 'slot-30', instructor_id: 'mock-ip-5', slot_date: addDays(today, 2), start_time: '14:00', end_time: '18:00', is_booked: true },
    { id: 'slot-31', instructor_id: 'mock-ip-5', slot_date: addDays(today, 3), start_time: '06:00', end_time: '08:00', is_booked: false },
    { id: 'slot-32', instructor_id: 'mock-ip-5', slot_date: addDays(today, 4), start_time: '09:00', end_time: '13:00', is_booked: false },
    { id: 'slot-33', instructor_id: 'mock-ip-5', slot_date: addDays(today, 6), start_time: '06:00', end_time: '08:00', is_booked: false },
    { id: 'slot-34', instructor_id: 'mock-ip-5', slot_date: addDays(today, 7), start_time: '14:00', end_time: '18:00', is_booked: false },
    { id: 'slot-35', instructor_id: 'mock-ip-5', slot_date: addDays(today, 10), start_time: '09:00', end_time: '13:00', is_booked: false },
  ],
  'mock-ip-6': [
    { id: 'slot-36', instructor_id: 'mock-ip-6', slot_date: addDays(today, 1), start_time: '09:00', end_time: '12:00', is_booked: false },
    { id: 'slot-37', instructor_id: 'mock-ip-6', slot_date: addDays(today, 2), start_time: '13:00', end_time: '16:00', is_booked: false },
    { id: 'slot-38', instructor_id: 'mock-ip-6', slot_date: addDays(today, 3), start_time: '09:00', end_time: '12:00', is_booked: true },
    { id: 'slot-39', instructor_id: 'mock-ip-6', slot_date: addDays(today, 5), start_time: '09:00', end_time: '12:00', is_booked: false },
    { id: 'slot-40', instructor_id: 'mock-ip-6', slot_date: addDays(today, 7), start_time: '13:00', end_time: '16:00', is_booked: false },
  ],
  'mock-ip-7': [
    { id: 'slot-41', instructor_id: 'mock-ip-7', slot_date: addDays(today, 1), start_time: '07:00', end_time: '10:30', is_booked: true },
    { id: 'slot-42', instructor_id: 'mock-ip-7', slot_date: addDays(today, 2), start_time: '15:00', end_time: '18:00', is_booked: false },
    { id: 'slot-43', instructor_id: 'mock-ip-7', slot_date: addDays(today, 3), start_time: '07:00', end_time: '10:30', is_booked: false },
    { id: 'slot-44', instructor_id: 'mock-ip-7', slot_date: addDays(today, 5), start_time: '07:00', end_time: '10:00', is_booked: false },
    { id: 'slot-45', instructor_id: 'mock-ip-7', slot_date: addDays(today, 6), start_time: '15:00', end_time: '18:00', is_booked: false },
    { id: 'slot-46', instructor_id: 'mock-ip-7', slot_date: addDays(today, 8), start_time: '07:00', end_time: '10:30', is_booked: false },
    { id: 'slot-47', instructor_id: 'mock-ip-7', slot_date: addDays(today, 10), start_time: '07:00', end_time: '10:00', is_booked: false },
  ],
  // Demo instructor profile (shown in AvailabilityScreen when logged in as instructor)
  'demo-instructor-profile': [
    { id: 'dslot-1',  instructor_id: 'demo-instructor-profile', slot_date: addDays(today, 1), start_time: '08:00', end_time: '10:00', is_booked: true },
    { id: 'dslot-2',  instructor_id: 'demo-instructor-profile', slot_date: addDays(today, 1), start_time: '14:00', end_time: '16:00', is_booked: false },
    { id: 'dslot-3',  instructor_id: 'demo-instructor-profile', slot_date: addDays(today, 2), start_time: '09:00', end_time: '12:00', is_booked: true },
    { id: 'dslot-4',  instructor_id: 'demo-instructor-profile', slot_date: addDays(today, 3), start_time: '07:00', end_time: '09:00', is_booked: false },
    { id: 'dslot-5',  instructor_id: 'demo-instructor-profile', slot_date: addDays(today, 3), start_time: '13:00', end_time: '15:30', is_booked: false },
    { id: 'dslot-6',  instructor_id: 'demo-instructor-profile', slot_date: addDays(today, 5), start_time: '08:00', end_time: '10:00', is_booked: false },
    { id: 'dslot-7',  instructor_id: 'demo-instructor-profile', slot_date: addDays(today, 5), start_time: '14:00', end_time: '16:00', is_booked: false },
    { id: 'dslot-8',  instructor_id: 'demo-instructor-profile', slot_date: addDays(today, 7), start_time: '07:00', end_time: '09:30', is_booked: false },
    { id: 'dslot-9',  instructor_id: 'demo-instructor-profile', slot_date: addDays(today, 8), start_time: '10:00', end_time: '12:00', is_booked: true },
    { id: 'dslot-10', instructor_id: 'demo-instructor-profile', slot_date: addDays(today, 9), start_time: '08:00', end_time: '10:00', is_booked: false },
    { id: 'dslot-11', instructor_id: 'demo-instructor-profile', slot_date: addDays(today, 10), start_time: '13:00', end_time: '16:00', is_booked: false },
    { id: 'dslot-12', instructor_id: 'demo-instructor-profile', slot_date: addDays(today, 12), start_time: '07:00', end_time: '09:00', is_booked: false },
  ],
};

export const getMockSlots = (instructorProfileId: string) =>
  (MOCK_SLOTS[instructorProfileId] ?? []).filter(
    (s) => s.slot_date >= new Date().toISOString().split('T')[0]
  );

// ─── Reviews ──────────────────────────────────────────────────

export const MOCK_REVIEWS: Record<string, Review[]> = {
  'mock-ip-1': [
    {
      id: 'rev-1', booking_id: 'booking-past-1',
      reviewer_id: 'demo-customer', reviewed_id: 'mock-instructor-1',
      rating: 5, comment: 'Juan is an amazing instructor! Very patient and professional. I went from zero to diving 8m in one session. Highly recommend!',
      created_at: '2026-02-10T08:00:00Z',
      reviewer: { id: 'demo-customer', full_name: 'Demo Customer', avatar_url: null, phone: null, role: 'customer', emergency_contact_name: null, emergency_contact_phone: null, created_at: '' },
    },
    {
      id: 'rev-2', booking_id: 'booking-past-2',
      reviewer_id: 'other-customer', reviewed_id: 'mock-instructor-1',
      rating: 5, comment: 'Best freediving intro I\'ve had. Juan explains everything clearly. The underwater world is now my new addiction!',
      created_at: '2026-01-20T08:00:00Z',
      reviewer: { id: 'other-customer', full_name: 'Ana Garcia', avatar_url: null, phone: null, role: 'customer', emergency_contact_name: null, emergency_contact_phone: null, created_at: '' },
    },
    {
      id: 'rev-3', booking_id: 'booking-past-3',
      reviewer_id: 'other-customer-2', reviewed_id: 'mock-instructor-1',
      rating: 4, comment: 'Great session, very safe and informative. Would book again!',
      created_at: '2026-01-05T08:00:00Z',
      reviewer: { id: 'other-customer-2', full_name: 'Carlo Lim', avatar_url: null, phone: null, role: 'customer', emergency_contact_name: null, emergency_contact_phone: null, created_at: '' },
    },
  ],
  'mock-ip-2': [
    {
      id: 'rev-4', booking_id: 'booking-past-4',
      reviewer_id: 'other-customer', reviewed_id: 'mock-instructor-2',
      rating: 5, comment: 'Maria took us to the Sardine Run and it was absolutely life-changing. She made sure everyone was comfortable and safe the entire time.',
      created_at: '2026-02-14T08:00:00Z',
      reviewer: { id: 'other-customer', full_name: 'Ana Garcia', avatar_url: null, phone: null, role: 'customer', emergency_contact_name: null, emergency_contact_phone: null, created_at: '' },
    },
    {
      id: 'rev-5', booking_id: 'booking-past-5',
      reviewer_id: 'other-customer-2', reviewed_id: 'mock-instructor-2',
      rating: 5, comment: 'Top instructor! I booked the Advanced Apnea Training and reached 20m for the first time. Incredible experience.',
      created_at: '2026-01-28T08:00:00Z',
      reviewer: { id: 'other-customer-2', full_name: 'Carlo Lim', avatar_url: null, phone: null, role: 'customer', emergency_contact_name: null, emergency_contact_phone: null, created_at: '' },
    },
  ],
  'mock-ip-3': [
    {
      id: 'rev-6', booking_id: 'booking-past-6',
      reviewer_id: 'other-customer', reviewed_id: 'mock-instructor-3',
      rating: 4, comment: 'Saw a thresher shark up close! Pedro knows the site very well. Dawn wake-up was worth every minute.',
      created_at: '2026-02-01T08:00:00Z',
      reviewer: { id: 'other-customer', full_name: 'Ana Garcia', avatar_url: null, phone: null, role: 'customer', emergency_contact_name: null, emergency_contact_phone: null, created_at: '' },
    },
  ],
  'mock-ip-4': [
    {
      id: 'rev-7', booking_id: 'booking-past-7',
      reviewer_id: 'other-customer', reviewed_id: 'mock-instructor-4',
      rating: 5, comment: 'Swimming next to a whale shark while Liza explained the marine biology was surreal. Absolutely worth the trip to Oslob!',
      created_at: '2026-02-18T08:00:00Z',
      reviewer: { id: 'other-customer', full_name: 'Ana Garcia', avatar_url: null, phone: null, role: 'customer', emergency_contact_name: null, emergency_contact_phone: null, created_at: '' },
    },
    {
      id: 'rev-8', booking_id: 'booking-past-8',
      reviewer_id: 'other-customer-2', reviewed_id: 'mock-instructor-4',
      rating: 5, comment: 'Liza is incredibly knowledgeable. She turned a simple dive into a full ocean education. I booked her AIDA2 course and passed with confidence.',
      created_at: '2026-01-30T08:00:00Z',
      reviewer: { id: 'other-customer-2', full_name: 'Carlo Lim', avatar_url: null, phone: null, role: 'customer', emergency_contact_name: null, emergency_contact_phone: null, created_at: '' },
    },
    {
      id: 'rev-9', booking_id: 'booking-past-9',
      reviewer_id: 'other-customer-3', reviewed_id: 'mock-instructor-4',
      rating: 4, comment: 'Great whale shark experience! Liza was very safety-conscious and made the whole group feel at ease.',
      created_at: '2026-01-12T08:00:00Z',
      reviewer: { id: 'other-customer-3', full_name: 'Sofia Ramos', avatar_url: null, phone: null, role: 'customer', emergency_contact_name: null, emergency_contact_phone: null, created_at: '' },
    },
  ],
  'mock-ip-5': [
    {
      id: 'rev-10', booking_id: 'booking-past-10',
      reviewer_id: 'other-customer-2', reviewed_id: 'mock-instructor-5',
      rating: 5, comment: 'Ramon is on a different level. I went from 15m to 28m in one training block. His coaching style is methodical and incredibly effective.',
      created_at: '2026-02-20T08:00:00Z',
      reviewer: { id: 'other-customer-2', full_name: 'Carlo Lim', avatar_url: null, phone: null, role: 'customer', emergency_contact_name: null, emergency_contact_phone: null, created_at: '' },
    },
    {
      id: 'rev-11', booking_id: 'booking-past-11',
      reviewer_id: 'other-customer', reviewed_id: 'mock-instructor-5',
      rating: 5, comment: 'The static apnea clinic changed how I breathe completely. Ramon has a gift for making complex techniques easy to understand.',
      created_at: '2026-02-05T08:00:00Z',
      reviewer: { id: 'other-customer', full_name: 'Ana Garcia', avatar_url: null, phone: null, role: 'customer', emergency_contact_name: null, emergency_contact_phone: null, created_at: '' },
    },
  ],
  'mock-ip-6': [
    {
      id: 'rev-12', booking_id: 'booking-past-12',
      reviewer_id: 'other-customer-3', reviewed_id: 'mock-instructor-6',
      rating: 5, comment: 'Claire conducted the whole lesson in Japanese for my parents and English for me. So thoughtful and professional. Highly recommend!',
      created_at: '2026-02-12T08:00:00Z',
      reviewer: { id: 'other-customer-3', full_name: 'Sofia Ramos', avatar_url: null, phone: null, role: 'customer', emergency_contact_name: null, emergency_contact_phone: null, created_at: '' },
    },
    {
      id: 'rev-13', booking_id: 'booking-past-13',
      reviewer_id: 'other-customer', reviewed_id: 'mock-instructor-6',
      rating: 4, comment: 'Great half-day session at the beach. Claire is patient and the waters in that area are beautiful. Will come back!',
      created_at: '2026-01-22T08:00:00Z',
      reviewer: { id: 'other-customer', full_name: 'Ana Garcia', avatar_url: null, phone: null, role: 'customer', emergency_contact_name: null, emergency_contact_phone: null, created_at: '' },
    },
  ],
  'mock-ip-7': [
    {
      id: 'rev-14', booking_id: 'booking-past-14',
      reviewer_id: 'other-customer-2', reviewed_id: 'mock-instructor-7',
      rating: 5, comment: "Miguel's competitive training is no joke. Intense, focused, and results-driven. I hit a personal best of 32m after just 3 sessions with him.",
      created_at: '2026-02-22T08:00:00Z',
      reviewer: { id: 'other-customer-2', full_name: 'Carlo Lim', avatar_url: null, phone: null, role: 'customer', emergency_contact_name: null, emergency_contact_phone: null, created_at: '' },
    },
    {
      id: 'rev-15', booking_id: 'booking-past-15',
      reviewer_id: 'other-customer-3', reviewed_id: 'mock-instructor-7',
      rating: 5, comment: 'The video analysis alone was worth every peso. Miguel spotted issues in my technique no one else ever caught. Best investment in my freediving journey.',
      created_at: '2026-02-08T08:00:00Z',
      reviewer: { id: 'other-customer-3', full_name: 'Sofia Ramos', avatar_url: null, phone: null, role: 'customer', emergency_contact_name: null, emergency_contact_phone: null, created_at: '' },
    },
    {
      id: 'rev-16', booking_id: 'booking-past-16',
      reviewer_id: 'other-customer', reviewed_id: 'mock-instructor-7',
      rating: 5, comment: 'Former national champion coaching you personally — what more could you ask for? Extremely knowledgeable and dedicated.',
      created_at: '2026-01-15T08:00:00Z',
      reviewer: { id: 'other-customer', full_name: 'Ana Garcia', avatar_url: null, phone: null, role: 'customer', emergency_contact_name: null, emergency_contact_phone: null, created_at: '' },
    },
  ],
};

// ─── Customer Demo Bookings ───────────────────────────────────

export const MOCK_CUSTOMER_BOOKINGS: Booking[] = [
  {
    id: 'booking-confirmed-1',
    customer_id: 'demo-customer',
    instructor_id: 'mock-ip-2',
    lesson_type_id: 'lt-4',
    availability_slot_id: 'slot-5',
    booking_date: addDays(today, 1),
    start_time: '06:00',
    participants_count: 2,
    status: 'confirmed',
    notes: 'Coming with a friend, both first-timers!',
    cancel_reason: null,
    created_at: new Date().toISOString(),
    instructor: { ...MOCK_INSTRUCTORS[1] },
    lesson_type: MOCK_LESSON_TYPES['mock-ip-2'][0],
    customer: { id: 'demo-customer', full_name: 'Demo Customer', avatar_url: null, phone: null, role: 'customer', emergency_contact_name: null, emergency_contact_phone: null, created_at: '' },
  },
  {
    id: 'booking-pending-1',
    customer_id: 'demo-customer',
    instructor_id: 'mock-ip-1',
    lesson_type_id: 'lt-2',
    availability_slot_id: 'slot-3',
    booking_date: addDays(today, 2),
    start_time: '09:00',
    participants_count: 1,
    status: 'pending',
    notes: null,
    cancel_reason: null,
    created_at: new Date().toISOString(),
    instructor: { ...MOCK_INSTRUCTORS[0] },
    lesson_type: MOCK_LESSON_TYPES['mock-ip-1'][1],
    customer: { id: 'demo-customer', full_name: 'Demo Customer', avatar_url: null, phone: null, role: 'customer', emergency_contact_name: null, emergency_contact_phone: null, created_at: '' },
  },
  {
    id: 'booking-past-1',
    customer_id: 'demo-customer',
    instructor_id: 'mock-ip-1',
    lesson_type_id: 'lt-1',
    availability_slot_id: 'slot-1',
    booking_date: addDays(today, -7),
    start_time: '08:00',
    participants_count: 1,
    status: 'completed',
    notes: 'First time freediver!',
    cancel_reason: null,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    instructor: { ...MOCK_INSTRUCTORS[0] },
    lesson_type: MOCK_LESSON_TYPES['mock-ip-1'][0],
    customer: { id: 'demo-customer', full_name: 'Demo Customer', avatar_url: null, phone: null, role: 'customer', emergency_contact_name: null, emergency_contact_phone: null, created_at: '' },
  },
  {
    id: 'booking-cancelled-1',
    customer_id: 'demo-customer',
    instructor_id: 'mock-ip-3',
    lesson_type_id: 'lt-7',
    availability_slot_id: 'slot-9',
    booking_date: addDays(today, -2),
    start_time: '05:30',
    participants_count: 1,
    status: 'cancelled',
    notes: null,
    cancel_reason: 'Cancelled due to bad weather conditions.',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    instructor: { ...MOCK_INSTRUCTORS[2] },
    lesson_type: MOCK_LESSON_TYPES['mock-ip-3'][0],
    customer: { id: 'demo-customer', full_name: 'Demo Customer', avatar_url: null, phone: null, role: 'customer', emergency_contact_name: null, emergency_contact_phone: null, created_at: '' },
  },
];

// ─── Instructor Demo Booking Requests ─────────────────────────

export const MOCK_INSTRUCTOR_BOOKINGS: Booking[] = [
  {
    id: 'req-pending-1',
    customer_id: 'other-customer-1',
    instructor_id: 'demo-instructor-profile',
    lesson_type_id: 'lt-demo-1',
    availability_slot_id: 'slot-demo-1',
    booking_date: addDays(today, 1),
    start_time: '08:00',
    participants_count: 2,
    status: 'pending',
    notes: 'Coming with my sister, both total beginners.',
    cancel_reason: null,
    created_at: new Date().toISOString(),
    customer: { id: 'other-customer-1', full_name: 'Ana Garcia', avatar_url: null, phone: '+63 920 111 1111', role: 'customer', emergency_contact_name: 'Roberto Garcia', emergency_contact_phone: '+63 920 222 2222', created_at: '' },
    lesson_type: { id: 'lt-demo-1', instructor_id: 'demo-instructor-profile', name: 'Intro to Freediving', description: null, duration_minutes: 90, skill_level: 'beginner', lesson_format: 'private', max_participants: 1, price: 1500, is_active: true },
  },
  {
    id: 'req-pending-2',
    customer_id: 'other-customer-2',
    instructor_id: 'demo-instructor-profile',
    lesson_type_id: 'lt-demo-2',
    availability_slot_id: 'slot-demo-2',
    booking_date: addDays(today, 2),
    start_time: '09:00',
    participants_count: 3,
    status: 'pending',
    notes: null,
    cancel_reason: null,
    created_at: new Date().toISOString(),
    customer: { id: 'other-customer-2', full_name: 'Carlo Lim', avatar_url: null, phone: '+63 920 333 3333', role: 'customer', emergency_contact_name: 'Linda Lim', emergency_contact_phone: '+63 920 444 4444', created_at: '' },
    lesson_type: { id: 'lt-demo-2', instructor_id: 'demo-instructor-profile', name: 'Group Beginner Course', description: null, duration_minutes: 120, skill_level: 'beginner', lesson_format: 'group', max_participants: 4, price: 900, is_active: true },
  },
  {
    id: 'req-confirmed-1',
    customer_id: 'other-customer-3',
    instructor_id: 'demo-instructor-profile',
    lesson_type_id: 'lt-demo-1',
    availability_slot_id: 'slot-demo-3',
    booking_date: addDays(today, 1),
    start_time: '14:00',
    participants_count: 1,
    status: 'confirmed',
    notes: 'I have some snorkeling background.',
    cancel_reason: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    customer: { id: 'other-customer-3', full_name: 'Sofia Ramos', avatar_url: null, phone: '+63 920 555 5555', role: 'customer', emergency_contact_name: 'Eduardo Ramos', emergency_contact_phone: '+63 920 666 6666', created_at: '' },
    lesson_type: { id: 'lt-demo-1', instructor_id: 'demo-instructor-profile', name: 'Intro to Freediving', description: null, duration_minutes: 90, skill_level: 'beginner', lesson_format: 'private', max_participants: 1, price: 1500, is_active: true },
  },
  {
    id: 'req-completed-1',
    customer_id: 'other-customer-1',
    instructor_id: 'demo-instructor-profile',
    lesson_type_id: 'lt-demo-1',
    availability_slot_id: 'slot-demo-4',
    booking_date: addDays(today, -3),
    start_time: '08:00',
    participants_count: 1,
    status: 'completed',
    notes: null,
    cancel_reason: null,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    customer: { id: 'other-customer-1', full_name: 'Ana Garcia', avatar_url: null, phone: '+63 920 111 1111', role: 'customer', emergency_contact_name: 'Roberto Garcia', emergency_contact_phone: '+63 920 222 2222', created_at: '' },
    lesson_type: { id: 'lt-demo-1', instructor_id: 'demo-instructor-profile', name: 'Intro to Freediving', description: null, duration_minutes: 90, skill_level: 'beginner', lesson_format: 'private', max_participants: 1, price: 1500, is_active: true },
  },
  {
    id: 'req-cancelled-1',
    customer_id: 'other-customer-2',
    instructor_id: 'demo-instructor-profile',
    lesson_type_id: 'lt-demo-2',
    availability_slot_id: 'slot-demo-5',
    booking_date: addDays(today, -1),
    start_time: '10:00',
    participants_count: 2,
    status: 'cancelled',
    notes: null,
    cancel_reason: 'Customer requested cancellation due to weather conditions.',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    customer: { id: 'other-customer-2', full_name: 'Carlo Lim', avatar_url: null, phone: '+63 920 333 3333', role: 'customer', emergency_contact_name: 'Linda Lim', emergency_contact_phone: '+63 920 444 4444', created_at: '' },
    lesson_type: { id: 'lt-demo-2', instructor_id: 'demo-instructor-profile', name: 'Group Beginner Course', description: null, duration_minutes: 120, skill_level: 'beginner', lesson_format: 'group', max_participants: 4, price: 900, is_active: true },
  },
];

// ─── Mock Messages ────────────────────────────────────────────

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000).toISOString();
const minsAgo  = (m: number) => new Date(Date.now() - m * 60000).toISOString();

// All mock messages keyed by a sorted pair "idA:idB"
const msgKey = (a: string, b: string) => [a, b].sort().join(':');

export const MOCK_MESSAGES: Record<string, any[]> = {
  // demo-customer ↔ mock-instructor-1 (Juan dela Cruz) — pending booking
  [msgKey('demo-customer', 'mock-instructor-1')]: [
    { id: 'msg-1a', sender_id: 'mock-instructor-1', receiver_id: 'demo-customer', content: 'Hi! Thanks for booking the Group Beginner Course. Are you coming alone or with someone?', created_at: hoursAgo(22), is_read: true, sender: MOCK_PROFILES['mock-instructor-1'] },
    { id: 'msg-1b', sender_id: 'demo-customer',     receiver_id: 'mock-instructor-1', content: "Hi Juan! Just me this time. I'm super excited — it's my first time freediving!", created_at: hoursAgo(21), is_read: true, sender: { id: 'demo-customer', full_name: 'Demo Customer' } },
    { id: 'msg-1c', sender_id: 'mock-instructor-1', receiver_id: 'demo-customer', content: "That's great! Don't worry, we'll start slow. Make sure you've had a light meal and stay hydrated before we dive.", created_at: hoursAgo(20), is_read: true, sender: MOCK_PROFILES['mock-instructor-1'] },
    { id: 'msg-1d', sender_id: 'demo-customer',     receiver_id: 'mock-instructor-1', content: 'Got it! Should I bring anything specific?', created_at: hoursAgo(19), is_read: true, sender: { id: 'demo-customer', full_name: 'Demo Customer' } },
    { id: 'msg-1e', sender_id: 'mock-instructor-1', receiver_id: 'demo-customer', content: "Just a swimsuit and a towel. We'll have all the gear ready for you at the dive site. See you soon!", created_at: hoursAgo(18), is_read: true, sender: MOCK_PROFILES['mock-instructor-1'] },
  ],

  // demo-customer ↔ mock-instructor-2 (Maria Santos) — confirmed booking
  [msgKey('demo-customer', 'mock-instructor-2')]: [
    { id: 'msg-2a', sender_id: 'demo-customer',     receiver_id: 'mock-instructor-2', content: "Hi Maria! We're confirmed for tomorrow's Sardine Run. So excited!", created_at: hoursAgo(5), is_read: true, sender: { id: 'demo-customer', full_name: 'Demo Customer' } },
    { id: 'msg-2b', sender_id: 'mock-instructor-2', receiver_id: 'demo-customer', content: 'Hello! Yes, confirmed! Please arrive at 5:45 AM at the Moal Boal pier. Look for our blue boat.', created_at: hoursAgo(4), is_read: true, sender: MOCK_PROFILES['mock-instructor-2'] },
    { id: 'msg-2c', sender_id: 'demo-customer',     receiver_id: 'mock-instructor-2', content: "Perfect! My friend and I will be there. Any tips for first-timers?", created_at: hoursAgo(3), is_read: true, sender: { id: 'demo-customer', full_name: 'Demo Customer' } },
    { id: 'msg-2d', sender_id: 'mock-instructor-2', receiver_id: 'demo-customer', content: 'Just relax and breathe! The sardines are used to swimmers. Stay close to me and enjoy the experience!', created_at: hoursAgo(2), is_read: true, sender: MOCK_PROFILES['mock-instructor-2'] },
    { id: 'msg-2e', sender_id: 'demo-customer',     receiver_id: 'mock-instructor-2', content: 'Amazing! Thank you so much, Maria!', created_at: minsAgo(45), is_read: true, sender: { id: 'demo-customer', full_name: 'Demo Customer' } },
    { id: 'msg-2f', sender_id: 'mock-instructor-2', receiver_id: 'demo-customer', content: 'See you tomorrow! Bring some snacks for after the session, you will need the energy!', created_at: minsAgo(30), is_read: false, sender: MOCK_PROFILES['mock-instructor-2'] },
  ],

  // demo-instructor ↔ other-customer-1 (Ana Garcia)
  [msgKey('demo-instructor', 'other-customer-1')]: [
    { id: 'msg-3a', sender_id: 'other-customer-1', receiver_id: 'demo-instructor', content: 'Hi! I just sent a booking request for the Intro lesson tomorrow. Just checking if you got it!', created_at: hoursAgo(10), is_read: true, sender: { id: 'other-customer-1', full_name: 'Ana Garcia' } },
    { id: 'msg-3b', sender_id: 'demo-instructor',  receiver_id: 'other-customer-1', content: "Hi Ana! I got it — I'll confirm shortly. Are you and your sister both total beginners?", created_at: hoursAgo(9), is_read: true, sender: { id: 'demo-instructor', full_name: 'Demo Instructor' } },
    { id: 'msg-3c', sender_id: 'other-customer-1', receiver_id: 'demo-instructor', content: 'Yes, completely new to this! We are a little nervous haha', created_at: hoursAgo(8), is_read: true, sender: { id: 'other-customer-1', full_name: 'Ana Garcia' } },
    { id: 'msg-3d', sender_id: 'demo-instructor',  receiver_id: 'other-customer-1', content: "No worries at all! That's exactly what I'm here for. We'll take it step by step and make sure you're comfortable before we go deeper.", created_at: hoursAgo(7), is_read: true, sender: { id: 'demo-instructor', full_name: 'Demo Instructor' } },
    { id: 'msg-3e', sender_id: 'other-customer-1', receiver_id: 'demo-instructor', content: 'Thank you so much! We cannot wait!', created_at: minsAgo(20), is_read: false, sender: { id: 'other-customer-1', full_name: 'Ana Garcia' } },
  ],

  // demo-instructor ↔ other-customer-2 (Carlo Lim)
  [msgKey('demo-instructor', 'other-customer-2')]: [
    { id: 'msg-4a', sender_id: 'other-customer-2', receiver_id: 'demo-instructor', content: 'Hello! I booked a group session for 3 people. Just want to confirm the meeting point.', created_at: hoursAgo(30), is_read: true, sender: { id: 'other-customer-2', full_name: 'Carlo Lim' } },
    { id: 'msg-4b', sender_id: 'demo-instructor',  receiver_id: 'other-customer-2', content: 'Hi Carlo! 3 people is perfect for the group session. We meet at the main beach entrance near the dive shop at 8:45 AM.', created_at: hoursAgo(29), is_read: true, sender: { id: 'demo-instructor', full_name: 'Demo Instructor' } },
    { id: 'msg-4c', sender_id: 'other-customer-2', receiver_id: 'demo-instructor', content: 'Great! Any things to prepare beforehand?', created_at: hoursAgo(28), is_read: true, sender: { id: 'other-customer-2', full_name: 'Carlo Lim' } },
    { id: 'msg-4d', sender_id: 'demo-instructor',  receiver_id: 'other-customer-2', content: 'Light breakfast, bring a towel, sunscreen, and comfortable swimwear. Everything else is provided!', created_at: hoursAgo(27), is_read: true, sender: { id: 'demo-instructor', full_name: 'Demo Instructor' } },
    { id: 'msg-4e', sender_id: 'other-customer-2', receiver_id: 'demo-instructor', content: 'Perfect, thanks!', created_at: hoursAgo(26), is_read: true, sender: { id: 'other-customer-2', full_name: 'Carlo Lim' } },
  ],

  // demo-instructor ↔ other-customer-3 (Sofia Ramos)
  [msgKey('demo-instructor', 'other-customer-3')]: [
    { id: 'msg-5a', sender_id: 'other-customer-3', receiver_id: 'demo-instructor', content: 'Hi! I confirmed my booking for tomorrow afternoon. I have some snorkeling background — does that help?', created_at: hoursAgo(3), is_read: true, sender: { id: 'other-customer-3', full_name: 'Sofia Ramos' } },
    { id: 'msg-5b', sender_id: 'demo-instructor',  receiver_id: 'other-customer-3', content: 'Hi Sofia! Yes, snorkeling experience definitely helps — you already know how to breathe and move in the water. You will adapt quickly!', created_at: hoursAgo(2), is_read: true, sender: { id: 'demo-instructor', full_name: 'Demo Instructor' } },
    { id: 'msg-5c', sender_id: 'other-customer-3', receiver_id: 'demo-instructor', content: 'Awesome! Really looking forward to it.', created_at: minsAgo(50), is_read: true, sender: { id: 'other-customer-3', full_name: 'Sofia Ramos' } },
    { id: 'msg-5d', sender_id: 'demo-instructor',  receiver_id: 'other-customer-3', content: 'Me too! See you at 2 PM at the dive center. Feel free to message me if you have any questions before then!', created_at: minsAgo(10), is_read: false, sender: { id: 'demo-instructor', full_name: 'Demo Instructor' } },
  ],
};

export const getMockMessages = (myId: string, otherId: string) =>
  MOCK_MESSAGES[msgKey(myId, otherId)] ?? [];

// Returns mock conversation list for a given user ID
export const getMockConversations = (myId: string) => {
  const partners: Record<string, { other_user: any; last_message: any; unread: number }> = {};

  Object.values(MOCK_MESSAGES).forEach((msgs) => {
    const relevant = msgs.filter(
      (m) => m.sender_id === myId || m.receiver_id === myId
    );
    if (!relevant.length) return;

    const last = relevant[relevant.length - 1];
    const otherId = last.sender_id === myId ? last.receiver_id : last.sender_id;
    const otherUser = last.sender_id === myId ? last.receiver ?? { id: otherId, full_name: otherId } : last.sender;
    const unread = relevant.filter((m) => m.receiver_id === myId && !m.is_read).length;

    if (!partners[otherId]) {
      partners[otherId] = { other_user: otherUser, last_message: last, unread };
    }
  });

  return Object.values(partners).sort(
    (a, b) => new Date(b.last_message.created_at).getTime() - new Date(a.last_message.created_at).getTime()
  );
};

// ─── Helper ───────────────────────────────────────────────────

export const isDemoMode = (profileId?: string | null) =>
  profileId?.startsWith('demo-') ?? false;
