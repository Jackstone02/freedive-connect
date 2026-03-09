import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { Profile, InstructorProfile } from '../types';

interface AuthState {
  session: Session | null;
  profile: Profile | null;
  instructorProfile: InstructorProfile | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setInstructorProfile: (profile: InstructorProfile | null) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  profile: null,
  instructorProfile: null,
  isLoading: true,
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setInstructorProfile: (instructorProfile) => set({ instructorProfile }),
  setLoading: (isLoading) => set({ isLoading }),
  clearAuth: () =>
    set({ session: null, profile: null, instructorProfile: null }),
}));
