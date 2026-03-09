-- ============================================================
-- FreeDive Connect — Supabase Database Schema
-- ============================================================
-- Run this in your Supabase SQL Editor after creating a project.
-- Order matters: run tables first, then sample data.
-- ============================================================

-- ─── Enable UUID extension ───────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PROFILES ────────────────────────────────────────────────
-- Extends Supabase auth.users
CREATE TABLE profiles (
  id                      UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name               TEXT NOT NULL,
  avatar_url              TEXT,
  phone                   TEXT,
  role                    TEXT NOT NULL CHECK (role IN ('customer', 'instructor')),
  emergency_contact_name  TEXT,
  emergency_contact_phone TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── INSTRUCTOR PROFILES ─────────────────────────────────────
CREATE TABLE instructor_profiles (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  bio              TEXT,
  experience_years INT DEFAULT 0,
  languages        TEXT[] DEFAULT ARRAY['Filipino', 'English'],
  location_lat     FLOAT NOT NULL DEFAULT 10.3157,
  location_lng     FLOAT NOT NULL DEFAULT 123.8854,
  location_name    TEXT NOT NULL DEFAULT 'Cebu, Philippines',
  payment_info     TEXT,
  is_verified      BOOLEAN NOT NULL DEFAULT FALSE,
  is_active        BOOLEAN NOT NULL DEFAULT FALSE,
  rating_avg       FLOAT NOT NULL DEFAULT 0,
  rating_count     INT NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── CERTIFICATIONS ──────────────────────────────────────────
CREATE TABLE certifications (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id  UUID NOT NULL REFERENCES instructor_profiles(id) ON DELETE CASCADE,
  cert_type      TEXT NOT NULL,
  cert_number    TEXT,
  cert_image_url TEXT,
  issued_date    DATE,
  is_verified    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── LESSON TYPES ────────────────────────────────────────────
CREATE TABLE lesson_types (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id    UUID NOT NULL REFERENCES instructor_profiles(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  description      TEXT,
  duration_minutes INT NOT NULL DEFAULT 60,
  skill_level      TEXT NOT NULL CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  lesson_format    TEXT NOT NULL CHECK (lesson_format IN ('private', 'group', 'pool', 'open_water')),
  max_participants INT NOT NULL DEFAULT 1,
  price            NUMERIC(10, 2) NOT NULL DEFAULT 0,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── AVAILABILITY SLOTS ──────────────────────────────────────
CREATE TABLE availability_slots (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id UUID NOT NULL REFERENCES instructor_profiles(id) ON DELETE CASCADE,
  slot_date     DATE NOT NULL,
  start_time    TIME NOT NULL,
  end_time      TIME NOT NULL,
  is_booked     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_times CHECK (start_time < end_time)
);

-- ─── BOOKINGS ────────────────────────────────────────────────
CREATE TABLE bookings (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id          UUID NOT NULL REFERENCES profiles(id),
  instructor_id        UUID NOT NULL REFERENCES instructor_profiles(id),
  lesson_type_id       UUID NOT NULL REFERENCES lesson_types(id),
  availability_slot_id UUID REFERENCES availability_slots(id),
  booking_date         DATE NOT NULL,
  start_time           TIME NOT NULL,
  participants_count   INT NOT NULL DEFAULT 1,
  status               TEXT NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes                TEXT,
  cancel_reason        TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── REVIEWS ─────────────────────────────────────────────────
CREATE TABLE reviews (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id   UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id  UUID NOT NULL REFERENCES profiles(id),
  reviewed_id  UUID NOT NULL REFERENCES profiles(id),
  rating       INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (booking_id, reviewer_id)
);

-- Auto-update instructor rating when a review is inserted
CREATE OR REPLACE FUNCTION update_instructor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE instructor_profiles
  SET
    rating_avg = (
      SELECT ROUND(AVG(rating)::NUMERIC, 1)
      FROM reviews
      WHERE reviewed_id = NEW.reviewed_id
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE reviewed_id = NEW.reviewed_id
    )
  WHERE user_id = NEW.reviewed_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_review_insert
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_instructor_rating();

-- ─── MESSAGES ────────────────────────────────────────────────
CREATE TABLE messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id   UUID NOT NULL REFERENCES profiles(id),
  receiver_id UUID NOT NULL REFERENCES profiles(id),
  booking_id  UUID REFERENCES bookings(id) ON DELETE SET NULL,
  content     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── DIVE SITES (Reference data for Cebu) ───────────────────
CREATE TABLE dive_sites (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  location_lat FLOAT NOT NULL,
  location_lng FLOAT NOT NULL,
  description  TEXT,
  difficulty   TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced'))
);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- profiles: users can read all, update own
CREATE POLICY "Public profiles are viewable" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- instructor_profiles: readable by all, writable by owner
CREATE POLICY "Instructor profiles viewable" ON instructor_profiles FOR SELECT USING (TRUE);
CREATE POLICY "Instructors can insert own profile" ON instructor_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Instructors can update own profile" ON instructor_profiles FOR UPDATE USING (auth.uid() = user_id);

-- certifications: readable by all, writable by instructor owner
CREATE POLICY "Certs viewable" ON certifications FOR SELECT USING (TRUE);
CREATE POLICY "Instructors manage own certs" ON certifications FOR ALL
  USING (auth.uid() = (SELECT user_id FROM instructor_profiles WHERE id = instructor_id));

-- lesson_types: readable by all, writable by instructor owner
CREATE POLICY "Lessons viewable" ON lesson_types FOR SELECT USING (TRUE);
CREATE POLICY "Instructors manage own lessons" ON lesson_types FOR ALL
  USING (auth.uid() = (SELECT user_id FROM instructor_profiles WHERE id = instructor_id));

-- availability_slots: readable by all, writable by instructor owner
CREATE POLICY "Slots viewable" ON availability_slots FOR SELECT USING (TRUE);
CREATE POLICY "Instructors manage own slots" ON availability_slots FOR ALL
  USING (auth.uid() = (SELECT user_id FROM instructor_profiles WHERE id = instructor_id));

-- bookings: visible to the customer or instructor involved
CREATE POLICY "Bookings visible to parties" ON bookings FOR SELECT
  USING (
    auth.uid() = customer_id
    OR auth.uid() = (SELECT user_id FROM instructor_profiles WHERE id = instructor_id)
  );
CREATE POLICY "Customers can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Booking parties can update" ON bookings FOR UPDATE
  USING (
    auth.uid() = customer_id
    OR auth.uid() = (SELECT user_id FROM instructor_profiles WHERE id = instructor_id)
  );

-- reviews: readable by all, writable by reviewer
CREATE POLICY "Reviews viewable" ON reviews FOR SELECT USING (TRUE);
CREATE POLICY "Reviewers insert own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- messages: visible to sender or receiver
CREATE POLICY "Messages visible to parties" ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Authenticated users can send messages" ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Receiver can mark read" ON messages FOR UPDATE
  USING (auth.uid() = receiver_id);

-- ─── REALTIME ────────────────────────────────────────────────
-- Enable realtime on messages table
-- (do this in Supabase Dashboard → Database → Replication → messages table)

-- ============================================================
-- SAMPLE DATA (Cebu, Philippines)
-- ============================================================
-- NOTE: Sample data uses hardcoded UUIDs.
-- Replace with real auth user UUIDs after testing.
-- ============================================================

-- Dive sites in Cebu
INSERT INTO dive_sites (name, location_lat, location_lng, description, difficulty) VALUES
  ('Moal Boal - Sardine Run', 9.9532, 123.3967, 'Famous for millions of sardines and sea turtles. Perfect for all levels.', 'beginner'),
  ('Malapascua - Thresher Shark Dive', 11.3276, 124.1174, 'World-class thresher shark site. Early morning dives.', 'advanced'),
  ('Mactan Island - Tambuli Beach', 10.2874, 124.0174, 'Gentle slope, good visibility. Ideal for beginners.', 'beginner'),
  ('Pescador Island', 9.9427, 123.3901, 'Cathedral dive site with stunning formations.', 'intermediate'),
  ('Gato Island', 11.1832, 123.9554, 'White-tip sharks and sea snakes. Intermediate level.', 'intermediate');

-- Sample instructor 1 (placeholder UUID — replace with real user ID after signup)
-- Step 1: create the profile
INSERT INTO profiles (id, full_name, phone, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Juan dela Cruz', '+639171234567', 'instructor'),
  ('22222222-2222-2222-2222-222222222222', 'Maria Santos',   '+639182345678', 'instructor'),
  ('33333333-3333-3333-3333-333333333333', 'Pedro Reyes',    '+639193456789', 'instructor');

-- Step 2: instructor profiles
INSERT INTO instructor_profiles (id, user_id, bio, experience_years, location_lat, location_lng, location_name, payment_info, is_verified, is_active, rating_avg, rating_count)
VALUES
  (
    'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'AIDA3 certified freediver with 5 years of teaching experience in Mactan and Moal Boal. I specialize in teaching beginners and helping them discover the joy of apnea.',
    5, 10.2874, 124.0174, 'Mactan, Cebu',
    'GCash: 0917 123 4567',
    TRUE, TRUE, 4.8, 24
  ),
  (
    'bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '22222222-2222-2222-2222-222222222222',
    'SSI Freediving Instructor from Moal Boal. I love sharing the underwater world with students. I offer private and group lessons at the famous Sardine Run.',
    7, 9.9532, 123.3967, 'Moal Boal, Cebu',
    'GCash: 0918 234 5678 | BDO: 1234567890',
    TRUE, TRUE, 4.9, 41
  ),
  (
    'cccc3333-cccc-cccc-cccc-cccccccccccc',
    '33333333-3333-3333-3333-333333333333',
    'PADI Freediver and spearfishing enthusiast based in Malapascua. Advanced dives and specialty courses available.',
    3, 11.3276, 124.1174, 'Malapascua, Cebu',
    'GCash: 0919 345 6789',
    FALSE, TRUE, 4.5, 10
  );

-- Certifications
INSERT INTO certifications (instructor_id, cert_type, cert_number, issued_date, is_verified) VALUES
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'AIDA3', 'AIDA-PH-2019-0234', '2019-06-15', TRUE),
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'AIDA Instructor', 'AIDA-PH-2021-0056', '2021-03-22', TRUE),
  ('bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'SSI Freediving Level 2', 'SSI-PH-2018-0456', '2018-08-10', TRUE),
  ('bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'SSI Instructor', 'SSI-PH-2020-0123', '2020-01-15', TRUE),
  ('cccc3333-cccc-cccc-cccc-cccccccccccc', 'PADI Freediver', 'PADI-PH-2022-0789', '2022-05-20', FALSE);

-- Lesson types
INSERT INTO lesson_types (instructor_id, name, description, duration_minutes, skill_level, lesson_format, max_participants, price)
VALUES
  -- Juan's lessons
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Intro to Freediving', 'Perfect first lesson. Learn breath-hold basics, equalisation, and pool diving up to 5m.', 90, 'beginner', 'private', 1, 1500.00),
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Group Beginner Course', 'Fun group session for 2-4 people. Pool and shallow open water.', 120, 'beginner', 'group', 4, 900.00),
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Open Water Freedive', 'Explore Mactan reef. Min 10m depth experience required.', 120, 'intermediate', 'open_water', 2, 2000.00),

  -- Maria's lessons
  ('bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Sardine Run Experience', 'Swim with millions of sardines in Moal Boal. All levels welcome.', 120, 'beginner', 'group', 6, 1200.00),
  ('bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Private Freediving Course', 'Full-day private session covering theory, pool, and open water.', 240, 'beginner', 'private', 1, 3500.00),
  ('bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Advanced Apnea Training', 'Improve depth and breathhold time. For intermediate freedivers.', 180, 'advanced', 'private', 1, 2500.00),

  -- Pedro's lessons
  ('cccc3333-cccc-cccc-cccc-cccccccccccc', 'Malapascua Shark Dive', 'Dawn dive for thresher sharks. Advanced divers only.', 90, 'advanced', 'open_water', 3, 2000.00),
  ('cccc3333-cccc-cccc-cccc-cccccccccccc', 'Intro Pool Session', 'Beginner pool lesson in Malapascua resort pool.', 60, 'beginner', 'pool', 2, 1000.00);

-- Availability slots (from today + a few days)
-- NOTE: Update dates to be in the future when running
INSERT INTO availability_slots (instructor_id, slot_date, start_time, end_time, is_booked) VALUES
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_DATE + 1, '08:00', '10:00', FALSE),
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_DATE + 1, '14:00', '16:00', FALSE),
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_DATE + 2, '09:00', '11:00', FALSE),
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_DATE + 3, '07:00', '10:00', FALSE),
  ('bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_DATE + 1, '06:00', '09:00', FALSE),
  ('bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_DATE + 1, '13:00', '16:00', FALSE),
  ('bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_DATE + 2, '06:00', '09:00', FALSE),
  ('bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_DATE + 4, '10:00', '13:00', FALSE),
  ('cccc3333-cccc-cccc-cccc-cccccccccccc', CURRENT_DATE + 2, '05:30', '08:00', FALSE),
  ('cccc3333-cccc-cccc-cccc-cccccccccccc', CURRENT_DATE + 3, '05:30', '08:00', FALSE);

-- Sample customer profiles
INSERT INTO profiles (id, full_name, phone, role, emergency_contact_name, emergency_contact_phone) VALUES
  ('44444444-4444-4444-4444-444444444444', 'Ana Garcia',   '+639201111111', 'customer', 'Roberto Garcia',   '+639202222222'),
  ('55555555-5555-5555-5555-555555555555', 'Carlo Lim',    '+639203333333', 'customer', 'Linda Lim',        '+639204444444'),
  ('66666666-6666-6666-6666-666666666666', 'Sofia Ramos',  '+639205555555', 'customer', 'Eduardo Ramos',    '+639206666666');

-- Sample bookings
INSERT INTO bookings (customer_id, instructor_id, lesson_type_id, booking_date, start_time, participants_count, status, notes)
VALUES
  (
    '44444444-4444-4444-4444-444444444444',
    'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    (SELECT id FROM lesson_types WHERE name = 'Intro to Freediving' LIMIT 1),
    CURRENT_DATE - 7, '08:00', 1, 'completed',
    'First time freediver, excited to learn!'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    (SELECT id FROM lesson_types WHERE name = 'Sardine Run Experience' LIMIT 1),
    CURRENT_DATE + 1, '06:00', 3, 'confirmed',
    'Coming with 2 friends, all beginners'
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    (SELECT id FROM lesson_types WHERE name = 'Group Beginner Course' LIMIT 1),
    CURRENT_DATE + 2, '09:00', 2, 'pending',
    NULL
  );

-- Sample reviews (only for completed bookings)
INSERT INTO reviews (booking_id, reviewer_id, reviewed_id, rating, comment)
VALUES
  (
    (SELECT id FROM bookings WHERE status = 'completed' LIMIT 1),
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    5,
    'Juan is an amazing instructor! Very patient and professional. I went from zero to diving 8m in one session. Highly recommend!'
  );
