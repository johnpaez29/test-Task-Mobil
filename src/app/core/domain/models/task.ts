import { Category } from "./category";

export interface Task {
    id?: string | null;
    isExec: boolean;
    description: string;
    active: boolean;
    category?: Category | null;
  }