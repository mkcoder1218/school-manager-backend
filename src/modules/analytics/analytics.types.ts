export interface AnalyticsPoint {
  label: string;
  value: number;
}

export interface AnalyticsTransaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  description: string;
}

export interface DashboardAnalytics {
  scope: {
    role: string | undefined;
    school_id: string | null;
    branch_id: string | null;
  };
  cards: {
    total_schools: number;
    branches: number;
    students: number;
    teachers: number;
    attendance_rate: number;
    revenue: number;
  };
  branch_performance: AnalyticsPoint[];
  finance: {
    income: number;
    expense: number;
    net: number;
    collection_rate: number;
    transactions: AnalyticsTransaction[];
  };
  registrar: {
    total_students: number;
    new_admissions: number;
    transfers: number;
    attendance_rate: number;
  };
  teacher: {
    active_classes: number;
    student_load: number;
    grading_tasks: number;
  };
  librarian: {
    catalog_size: number;
    circulation: number;
    overdue: number;
    inventory: Array<{
      id: string;
      title: string;
      author: string;
      status: string;
    }>;
  };
  parent: {
    student_name: string | null;
    attendance_rate: number;
    fees_status: string;
    progress: AnalyticsPoint[];
  };
  student: {
    gpa: number | null;
    attendance_rate: number;
    assignments: number;
    grades: Array<{ subject: string; score: number; total: number }>;
    deadlines: Array<{ title: string; due: string; priority: string }>;
  };
}
