import { create } from "zustand";
import type { User } from "@/types";

interface UserStore {
    users: User[];
    setUsers: (data: User[]) => void;
    clearUsers: () => void;
}

export const userStore = create<UserStore>((set) => ({
    users: [],
    setUsers: (data: User[]) => {
        set({ users: data });
    },
    clearUsers: () => {
        set({ users: [] });
    }
}));
