import { Role } from "@/types";
import { create } from "zustand";

interface store {
    roles: Role[],
    setRoles: (data: Role[]) => void
}

export const roleStore = create<store>((set) => ({
    roles: [],
    setRoles: (data: Role[]) => {
        set({ roles: data })
    }
}))