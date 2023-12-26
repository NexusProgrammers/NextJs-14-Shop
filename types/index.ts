import { User } from "@prisma/client";

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string | null;
  updatedAt: string | null;
  emailVerified: string | null;
};
