# FreeDive Connect — Screen-by-Screen Wireframe Plan

## App Info
- **Name:** FreeDive Connect
- **Tagline:** Find Your Depth
- **Region:** Cebu, Philippines (Phase 1)
- **Roles:** Customer (student) | Instructor (freediver)

---

## Auth Flow (Shared)

### [A1] Splash Screen
```
┌────────────────────────┐
│                        │
│                        │
│      FreeDive          │
│      Connect           │
│                        │
│    FIND YOUR DEPTH     │
│                        │
│                        │
└────────────────────────┘
```
- Auto-navigates after 1.5s
- Checks active session → routes to correct tab stack or Welcome

---

### [A2] Welcome Screen
```
┌────────────────────────┐
│   FreeDive             │
│   Connect              │
│   FIND YOUR DEPTH      │
├────────────────────────┤
│  I am a...             │
│                        │
│  ┌──────────────────┐  │
│  │  🤿  Student /   │  │
│  │      Customer    │  │
│  └──────────────────┘  │
│                        │
│  ┌──────────────────┐  │
│  │  🧑‍🏫 Freediving  │  │
│  │    Instructor    │  │
│  └──────────────────┘  │
│                        │
│  Already have account? │
│       Sign In          │
└────────────────────────┘
```

---

### [A3] Sign Up Screen
```
┌────────────────────────┐
│ < Back                 │
│                        │
│  Create Account        │
│  (or Join as Instr.)   │
│                        │
│  Full Name *           │
│  [________________]    │
│  Email *               │
│  [________________]    │
│  Phone                 │
│  [________________]    │
│  Password *            │
│  [________________]    │
│  Confirm Password *    │
│  [________________]    │
│                        │
│  [  Create Account  ]  │
│                        │
│  Already have account? │
│         Sign In        │
└────────────────────────┘
```

---

### [A4] Sign In Screen
```
┌────────────────────────┐
│ < Back                 │
│  Welcome back          │
│  Sign in to continue   │
│                        │
│  Email                 │
│  [________________]    │
│  Password              │
│  [________________]    │
│                        │
│  [     Sign In     ]   │
│                        │
│  No account? Sign Up   │
└────────────────────────┘
```

---

## Customer Screens

### [C1] Home / Map Screen (Tab 1 — Home)
```
┌────────────────────────┐
│  ┌─────────────────┐   │
│  │   [Near Me]     │   │
│  │                 │   │
│  │   MAP VIEW      │   │
│  │  [Juan] [Maria] │   │
│  │       [Pedro]   │   │
│  │                 │   │
│  └─────────────────┘   │
│ ──────────────────────  │
│ 5 Instructors in Cebu  │
│  ┌──┐ ┌──┐ ┌──┐        │
│  │  │ │  │ │  │  ──>   │
│  └──┘ └──┘ └──┘        │
└────────────────────────┘
  [Home][Search][Book][Msg][Me]
```
- Map shows instructor pins with name bubbles
- Bottom horizontal card list
- "Near Me" button re-centers map to user location

---

### [C2] Search / Filter Screen (Tab 2 — Search)
```
┌────────────────────────┐
│  🔍 Search instructors │
│                        │
│  Skill Level           │
│  [Beginner][Inter.][Adv│
│                        │
│  Lesson Type           │
│  [Private][Group][Pool]│
│                        │
│  ┌──────────────────┐  │
│  │ [avatar] Juan    │  │
│  │  Mactan, Cebu    │  │
│  │  ★★★★☆ (23)     │  │
│  └──────────────────┘  │
│  ┌──────────────────┐  │
│  │ [avatar] Maria   │  │
│  │  Moal Boal       │  │
│  │  ★★★★★ (41)     │  │
│  └──────────────────┘  │
└────────────────────────┘
```

---

### [C3] Instructor Profile Screen
```
┌────────────────────────┐
│ < Back                 │
│ ┌──────────────────┐   │
│ │  [cover photo]   │   │
│ │  [avatar] Name   │   │
│ │  Mactan, Cebu    │   │
│ │  ★★★★☆  Verified │   │
│ └──────────────────┘   │
│                        │
│  About                 │
│  Bio text here...      │
│                        │
│  Certifications        │
│  [AIDA2✓][SSI✓]        │
│                        │
│  Payment               │
│  GCash: 09xx xxx xxxx  │
│                        │
│  Lesson Types          │
│  Intro (60min) ₱1,500  │
│  [Book →]              │
│  Group Dive (90min)    │
│  [Book →]              │
│                        │
│  Reviews (23)          │
│  [...]                 │
│                        │
│  [ Send Message ]      │
└────────────────────────┘
```

---

### [C4] Booking Form Screen
```
┌────────────────────────┐
│ < Back                 │
│  Book a Session        │
│                        │
│  Intro to Freediving   │
│  60 min • beginner     │
│  ₱1,500                │
│                        │
│  Select a Time Slot    │
│  ┌──────────────────┐  │
│  │ Mon Mar 10  08:00│  │  ← selected
│  └──────────────────┘  │
│  ┌──────────────────┐  │
│  │ Tue Mar 11  10:00│  │
│  └──────────────────┘  │
│                        │
│  Participants  [ - 2 +]│
│  (max 5)               │
│                        │
│  Notes (optional)      │
│  [________________]    │
│                        │
│  [Send Booking Request]│
└────────────────────────┘
```

---

### [C5] Booking Confirmation Screen
```
┌────────────────────────┐
│                        │
│          🎉            │
│   Booking Sent!        │
│                        │
│  Your request has been │
│  sent to the instr.    │
│  They'll confirm in    │
│  24 hours.             │
│                        │
│  ┌──────────────────┐  │
│  │ Status: Pending  │  │
│  │ You'll get a     │  │
│  │ notification.    │  │
│  └──────────────────┘  │
│                        │
│  [ Go to My Bookings ] │
│  [   Back to Home   ]  │
└────────────────────────┘
```

---

### [C6] My Bookings Screen (Tab 3)
```
┌────────────────────────┐
│  My Bookings           │
│                        │
│  [Upcoming][Done][Canc]│
│  ─────────────────     │
│  ┌──────────────────┐  │
│  │ Juan dela Cruz   │  │
│  │ Intro Freediving │  │
│  │ Mon Mar 10 08:00 │  │
│  │ 1 participant    │  │
│  │            [Conf]│  │
│  └──────────────────┘  │
│  ┌──────────────────┐  │
│  │ Maria Santos     │  │
│  │ Group Open Water │  │
│  │ Tue Mar 11 10:00 │  │
│  │           [Pend] │  │
│  └──────────────────┘  │
└────────────────────────┘
```

---

### [C7] Booking Detail Screen
```
┌────────────────────────┐
│ < Back                 │
│  Booking Detail        │
│  ┌ CONFIRMED ──────┐   │
│  └─────────────────┘   │
│  Session Details       │
│  Lesson: Intro ...     │
│  Date: Mon Mar 10 2026 │
│  Time: 08:00           │
│  Participants: 1       │
│  Notes: ...            │
│                        │
│  [Start Verif. Call]   │
│  [ Message Instructor ]│
│  [  Cancel Booking  ]  │
└────────────────────────┘
```

---

### [C8] Leave Review Screen
```
┌────────────────────────┐
│ Cancel                 │
│  Leave a Review        │
│  How was your session? │
│                        │
│     ★ ★ ★ ★ ☆          │
│                        │
│  Comment (optional)    │
│  ┌──────────────────┐  │
│  │                  │  │
│  │                  │  │
│  └──────────────────┘  │
│                        │
│  [ Submit Review ]     │
└────────────────────────┘
```

---

### [C9] Customer Profile Screen (Tab 5)
```
┌────────────────────────┐
│  My Profile            │
│        [avatar]        │
│  Full Name             │
│  [________________]    │
│  Phone                 │
│  [________________]    │
│  ──────────────────    │
│  Emergency Contact     │
│  Important for safety! │
│  Contact Name          │
│  [________________]    │
│  Contact Phone         │
│  [________________]    │
│                        │
│  [ Save Changes ]      │
│  [ Sign Out ]          │
└────────────────────────┘
```

---

## Instructor Screens

### [I1] Dashboard Screen (Tab 1)
```
┌────────────────────────┐
│  Hello, Juan!          │
│  FreeDive Instructor   │
│                        │
│  ┌─────┐ ┌────┐ ┌────┐ │
│  │  3  │ │ 2  │ │4.8 │ │
│  │Pend │ │Today│ │★  │ │
│  └─────┘ └────┘ └────┘ │
│                        │
│  Quick Actions         │
│  ┌──────┐┌──────┐┌────┐│
│  │ 📋   ││ 📅   ││ ✏️ ││
│  │Reqs  ││Avail.││Edit││
│  │  [3] ││      ││    ││
│  └──────┘└──────┘└────┘│
│                        │
│  Today's Sessions      │
│  ┌──────────────────┐  │
│  │ Maria  08:00     │  │
│  │ Intro Freediving │  │
│  └──────────────────┘  │
└────────────────────────┘
```

---

### [I2] Booking Requests Screen (Tab 2)
```
┌────────────────────────┐
│  Booking Requests      │
│  [Pending][Conf.][Done]│
│  ─────────────────     │
│  ┌──────────────────┐  │
│  │ Maria Santos     │  │
│  │ Group Dive       │  │
│  │ Mon Mar 10 10:00 │  │
│  │ 3 participants   │  │
│  │ [Accept][Decline]│  │
│  └──────────────────┘  │
└────────────────────────┘
```

---

### [I3] Booking Detail (Instructor)
```
┌────────────────────────┐
│ < Back                 │
│  Booking Detail        │
│  ┌ PENDING ────────┐   │
│  └─────────────────┘   │
│  Customer              │
│  Maria Santos          │
│  +63 9xx xxx xxxx      │
│  Emergency: Dad (09xx) │
│                        │
│  Session Details       │
│  Lesson: Group Dive    │
│  Date: Mon Mar 10      │
│  Time: 10:00           │
│  Participants: 3       │
│                        │
│  [ Accept Booking ]    │
│  [    Decline     ]    │
│  [Start Verif.Call]    │
│  [ Message Customer ]  │
└────────────────────────┘
```

---

### [I4] Instructor Profile Screen (Tab 5)
```
┌────────────────────────┐
│  My Instructor Profile │
│  Open for Bookings [●] │
│                        │
│  Bio                   │
│  [__________________]  │
│                        │
│  Teaching Location     │
│  [__________________]  │
│                        │
│  Payment Info          │
│  [__________________]  │
│                        │
│  [Manage Lesson Types >]│
│                        │
│  [ Save Changes ]      │
│  [ Sign Out ]          │
└────────────────────────┘
```

---

### [I5] Availability Screen (Tab 3)
```
┌────────────────────────┐
│  My Availability       │
│                        │
│  Add New Slot          │
│  Date: [Mon Mar 10  ]  │
│  Start [08:00] End[10] │
│  [ + Add Slot ]        │
│                        │
│  MONDAY, MARCH 10      │
│  08:00–10:00 Available │
│  10:00–12:00 Booked    │
│                        │
│  TUESDAY, MARCH 11     │
│  09:00–11:00 Available │
└────────────────────────┘
```

---

## Shared Screens

### [S1] Chat Screen
```
┌────────────────────────┐
│ < Back   Maria Santos  │
│                        │
│     Hi! I'm interested │
│     in your group dive.│
│                        │
│ Hi Maria! Sure, when   │
│ are you available?     │
│                        │
│     This Saturday?     │
│                        │
│                        │
│ ┌────────────┐ [Send]  │
│ │Type here...│         │
│ └────────────┘         │
└────────────────────────┘
```

---

### [S2] Video Call Screen (Verification)
```
┌────────────────────────┐
│  Verification Call     │
│  with Maria Santos     │
│                        │
│  ┌──────────────────┐  │
│  │                  │  │
│  │  Daily.co call   │  │
│  │    embedded      │  │
│  │    WebView       │  │
│  │                  │  │
│  └──────────────────┘  │
│                        │
│      [ End Call ]      │
└────────────────────────┘
```

---

## Navigation Structure

```
App
├── Splash
├── Welcome
├── SignIn
├── SignUp
│
├── CustomerStack
│   ├── Tabs
│   │   ├── HomeMap (Tab 1)
│   │   ├── Search (Tab 2)
│   │   ├── MyBookings (Tab 3)
│   │   ├── Messages (Tab 4)
│   │   └── CustomerProfile (Tab 5)
│   └── Stack (modal-style)
│       ├── InstructorDetail
│       ├── BookingForm
│       ├── BookingConfirmation
│       ├── BookingDetail
│       ├── LeaveReview
│       ├── Chat
│       └── VideoCall
│
└── InstructorStack
    ├── Tabs
    │   ├── Dashboard (Tab 1)
    │   ├── BookingRequests (Tab 2)
    │   ├── Availability (Tab 3)
    │   ├── Messages (Tab 4)
    │   └── InstructorProfile (Tab 5)
    └── Stack
        ├── InstructorBookingDetail
        ├── ManageLessonTypes
        ├── Chat
        └── VideoCall
```

---

## Color Scheme

| Token | Color | Usage |
|---|---|---|
| Primary | `#0077B6` | Buttons, active states, links |
| Secondary | `#00B4D8` | Highlights, secondary actions |
| Accent | `#48CAE4` | Badges, accents |
| Background | `#F8FDFF` | Screen backgrounds |
| Success | `#10B981` | Confirmed status, verified |
| Warning | `#F59E0B` | Pending status, stars |
| Error | `#EF4444` | Cancelled, errors, sign out |
