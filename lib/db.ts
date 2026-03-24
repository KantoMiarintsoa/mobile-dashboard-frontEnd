import Dexie, { type Table } from "dexie";
import { User } from "@/types/user.types";

interface SyncAction {
  id?: number;
  action: "create" | "update" | "delete";
  endpoint: string;
  method: "POST" | "PUT" | "DELETE";
  data?: unknown
  timestamp: number;
}

class DashboardDB extends Dexie {
  users!: Table<User, string>;
  syncQueue!: Table<SyncAction, number>;

  constructor() {
    super("dashboard");
    this.version(1).stores({
      users: "id, name, email, createdAt",
      syncQueue: "++id, action, timestamp",
    });
  }
}

export const db = new DashboardDB();
