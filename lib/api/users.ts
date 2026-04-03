import type { User } from "@/types/user";

export const usersApi = {
  async getProfile(): Promise<User> {
    return {
      id: "USR-101",
      name: "Aarav Sharma",
      email: "aarav@example.com",
      phone: "+91 98765 12345",
      walletBalance: 1230
    };
  }
};
