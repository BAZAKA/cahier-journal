
export type View = 'DASHBOARD' | 'CLASSES' | 'STUDENTS' | 'PROGRAM' | 'LESSONS' | 'ACTIVITIES';

export interface Student {
  id: string;
  name: string;
  notes: StudentNote[];
}

export interface StudentNote {
  id: string;
  date: string;
  note: string;
}

export interface Class {
  id: string;
  name: string;
  level: string; // e.g., A1, A2, B1
  schedule: string;
  students: Student[];
}

export interface Program {
  title: string;
  goals: string[];
  modules: ProgramModule[];
}

export interface ProgramModule {
  id: string;
  title: string;
  topics: string[];
}

export interface Lesson {
  id: string;
  title: string;
  date: string;
  objectives: string[];
  materials: string[];
  procedure: string;
  notes: string;
}

export interface Activity {
  id: string;
  title: string;
  type: string; // e.g., Icebreaker, Grammar, Speaking
  description: string;
  duration: number; // in minutes
}

export interface AppData {
  classes: Class[];
  program: Program;
  lessons: Lesson[];
  activities: Activity[];
}
