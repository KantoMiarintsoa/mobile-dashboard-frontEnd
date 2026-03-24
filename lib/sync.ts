import { db } from "./db";
import api from "@/service/api";

export async function replayQueue() {
  const queue = await db.syncQueue.orderBy("timestamp").toArray();

  for (const item of queue) {
    try {
      if (item.method === "POST") {
        await api.post(item.endpoint, item.data);
      } else if (item.method === "PUT") {
        await api.put(item.endpoint, item.data);
      } else if (item.method === "DELETE") {
        await api.delete(item.endpoint);
      }
      await db.syncQueue.delete(item.id!);
    } catch {
      break;
    }
  }
}

export function isOnline() {
  return typeof navigator !== "undefined" && navigator.onLine;
}