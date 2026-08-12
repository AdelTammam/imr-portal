import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import type { User } from "@/types";

declare global {
  var _imrUsers: User[] | undefined;
}

if (!global._imrUsers) {
  global._imrUsers = [
    {
      id:         "seed-admin",
      email:      "admin@imr.com",
      password:   bcrypt.hashSync("Admin123!", 10),
      role:       "admin",
      created_at: new Date().toISOString(),
    },
  ];
}

export const usersStore = {
  findByEmail: (email: string) =>
    global._imrUsers!.find((u) => u.email.toLowerCase() === email.toLowerCase()),
  findById: (id: string) =>
    global._imrUsers!.find((u) => u.id === id),
  create: (email: string, hashedPassword: string, role: "admin" | "user" = "user"): User => {
    const user: User = { id: randomUUID(), email: email.toLowerCase().trim(), password: hashedPassword, role, created_at: new Date().toISOString() };
    global._imrUsers!.push(user);
    return user;
  },
  promoteToAdmin: (email: string): boolean => {
    const user = global._imrUsers!.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return false;
    user.role = "admin";
    return true;
  },
};
