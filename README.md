# FreeDive Connect

> **Find Your Depth** — A marketplace connecting freediving instructors with students in Cebu, Philippines.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile | React Native 0.81.5 + Expo SDK 54 |
| Language | TypeScript |
| Backend | Supabase (Auth + PostgreSQL + Storage + Realtime) |
| State | Zustand |
| Navigation | React Navigation v6 (native-stack + bottom-tabs) |
| Maps | react-native-maps (Google Maps) |
| Location | expo-location |
| Notifications | expo-notifications |
| UI | react-native-paper + custom theme |
| Video Calls | Daily.co (WebView embed) |
| Images | expo-image-picker + Supabase Storage |

---

## Project Structure

```
freedive-connect/
├── App.tsx                      # Root component
├── index.js                     # Entry point
├── app.json                     # Expo config
├── package.json
├── tsconfig.json
├── babel.config.js
├── schema.sql                   # Full DB schema + sample data
├── WIREFRAME.md                 # Screen-by-screen wireframe plan
│
└── src/
    ├── constants/
    │   └── theme.ts             # Colors, spacing, font sizes
    ├── types/
    │   └── index.ts             # All TypeScript interfaces & nav types
    ├── lib/
    │   └── supabase.ts          # Supabase client (update with your keys)
    ├── store/
    │   └── authStore.ts         # Zustand auth state
    ├── navigation/
    │   ├── AppNavigator.tsx     # Root navigator
    │   ├── CustomerTabs.tsx     # Customer bottom tabs + stack
    │   └── InstructorTabs.tsx   # Instructor bottom tabs + stack
    ├── screens/
    │   ├── auth/
    │   │   ├── SplashScreen.tsx
    │   │   ├── WelcomeScreen.tsx
    │   │   ├── SignInScreen.tsx
    │   │   └── SignUpScreen.tsx
    │   ├── customer/
    │   │   ├── HomeMapScreen.tsx
    │   │   ├── SearchScreen.tsx
    │   │   ├── InstructorDetailScreen.tsx
    │   │   ├── BookingFormScreen.tsx
    │   │   ├── BookingConfirmationScreen.tsx
    │   │   ├── MyBookingsScreen.tsx
    │   │   ├── LeaveReviewScreen.tsx
    │   │   └── CustomerProfileScreen.tsx
    │   ├── instructor/
    │   │   ├── DashboardScreen.tsx
    │   │   ├── BookingRequestsScreen.tsx
    │   │   ├── InstructorBookingDetailScreen.tsx
    │   │   ├── InstructorProfileScreen.tsx
    │   │   └── AvailabilityScreen.tsx
    │   └── shared/
    │       ├── ChatScreen.tsx
    │       ├── MessagesListScreen.tsx
    │       └── VideoCallScreen.tsx
    └── components/
        ├── InstructorCard.tsx
        ├── BookingCard.tsx
        ├── StarRating.tsx
        └── CertBadge.tsx
```

---

## Setup Instructions

### 1. Prerequisites

- Node.js v20+
- Expo CLI: `npm install -g expo-cli`
- EAS CLI (for builds): `npm install -g eas-cli`
- Android Studio or Xcode (for device emulation)

### 2. Clone & Install

```bash
cd D:\NEWPROJECT2\freedive-connect
npm install
```

### 3. Supabase Setup

1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. Name it `freedive-connect`
3. Copy the **Project URL** and **Anon/Public key** from:
   - Project Settings → API
4. Open [src/lib/supabase.ts](src/lib/supabase.ts) and replace:
   ```ts
   const SUPABASE_URL = 'https://your-project-id.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key-here';
   ```
5. In the Supabase SQL Editor, run the full contents of [schema.sql](schema.sql)
6. In Supabase Dashboard → Database → Replication, enable realtime for the `messages` table

### 4. Google Maps Setup

For Android:
1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com)
2. Enable **Maps SDK for Android** and **Maps SDK for iOS**
3. Add to [app.json](app.json) under `expo.android.config.googleMaps`:
   ```json
   "config": {
     "googleMaps": {
       "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
     }
   }
   ```
4. For iOS, add to `expo.ios.config.googleMapsApiKey`

### 5. Daily.co Setup (Video Calls)

1. Create a free account at [https://www.daily.co](https://www.daily.co)
2. Create a room (e.g., `freedive-verify`)
3. Copy the room URL and update [InstructorBookingDetailScreen.tsx](src/screens/instructor/InstructorBookingDetailScreen.tsx) and [BookingDetail] with your actual room URL
4. For production, generate unique per-session room URLs via the Daily.co REST API

### 6. Run the App

```bash
# Start development server
npm start

# Run on Android (device/emulator)
npm run android

# Run on iOS (Mac only)
npm run ios
```

---

## Supabase Configuration Checklist

After running `schema.sql`, verify these in your Supabase dashboard:

- [ ] All 8 tables created: `profiles`, `instructor_profiles`, `certifications`, `lesson_types`, `availability_slots`, `bookings`, `reviews`, `messages`, `dive_sites`
- [ ] RLS (Row Level Security) is enabled on all tables
- [ ] All policies are listed under each table
- [ ] `on_auth_user_created` trigger is active
- [ ] `after_review_insert` trigger is active
- [ ] Realtime enabled on `messages` table
- [ ] Sample data inserted (3 instructors, 3 customers, lesson types, availability slots)

---

## User Roles

| Feature | Customer | Instructor |
|---|---|---|
| Browse instructors on map | ✅ | |
| Search & filter instructors | ✅ | |
| View instructor profile | ✅ | |
| Send booking request | ✅ | |
| Accept/decline bookings | | ✅ |
| Set availability calendar | | ✅ |
| Manage lesson types | | ✅ |
| In-app messaging | ✅ | ✅ |
| Video verification call | ✅ | ✅ |
| Leave reviews | ✅ | |
| Emergency contact | ✅ | |

---

## Development Phases

| Phase | Features | Status |
|---|---|---|
| **Phase 1** | Auth, role selection, profile creation | 🔧 In Progress |
| **Phase 2** | Map, search, instructor profile view | 🔧 In Progress |
| **Phase 3** | Booking flow, availability calendar | 🔧 In Progress |
| **Phase 4** | Messaging (realtime), video calls | 🔧 In Progress |
| **Phase 5** | Reviews, certifications, polish | ⏳ Pending |
| **Phase 6** | Push notifications, admin panel | ⏳ Pending |
| **v2.0** | In-app payments (PayMongo/Maya) | ⏳ Future |

---

## Environment Variables (when needed)

Create a `.env` file at the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EXPO_PUBLIC_GOOGLE_MAPS_KEY=your-google-maps-key
EXPO_PUBLIC_DAILY_DOMAIN=https://your-domain.daily.co
```

Then update [src/lib/supabase.ts](src/lib/supabase.ts) to use `process.env.EXPO_PUBLIC_SUPABASE_URL`.

---

## Notes

- **Payments:** Handled outside the app in v1. Instructors list their rate and payment method (GCash/bank). Customers pay directly.
- **Verification calls:** Uses Daily.co free tier. A short video call before confirming a booking helps verify both parties are legitimate.
- **Group lessons:** Each lesson type has `max_participants`. Customers see remaining slots and can book 1 to N spots.
- **Region:** Cebu-only in Phase 1. Expanding nationally is as simple as removing location filters.

---

## Related Files

- [WIREFRAME.md](WIREFRAME.md) — Full screen-by-screen wireframe plan
- [schema.sql](schema.sql) — Complete Supabase schema with sample data
