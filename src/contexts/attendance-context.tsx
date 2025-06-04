
"use client";

import type { ReactNode } from "react";
import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Attendee {
  id: string;
  name: string;
  status: 'present' | 'absent' | 'unmarked'; // Added 'unmarked'
}

interface AttendanceContextType {
  attendees: Attendee[];
  loadAttendees: (names: string[]) => void;
  updateAttendeeStatus: (id: string, status: 'present' | 'absent' | 'unmarked') => void;
  resetAttendance: () => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider = ({ children }: { children: ReactNode }) => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  const loadAttendees = useCallback((names: string[]) => {
    const newAttendees = names.map((name) => ({
      id: crypto.randomUUID(),
      name: name.trim(),
      status: 'unmarked' as 'present' | 'absent' | 'unmarked', // Default to 'unmarked'
    }));
    setAttendees(newAttendees);
  }, []);

  const updateAttendeeStatus = useCallback((id: string, status: 'present' | 'absent' | 'unmarked') => {
    setAttendees((prevAttendees) =>
      prevAttendees.map((attendee) =>
        attendee.id === id ? { ...attendee, status } : attendee
      )
    );
  }, []);

  const resetAttendance = useCallback(() => {
    setAttendees([]);
  }, []);

  return (
    <AttendanceContext.Provider
      value={{ attendees, loadAttendees, updateAttendeeStatus, resetAttendance }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
