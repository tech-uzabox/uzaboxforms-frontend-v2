import { create } from "zustand";

interface store {
    groups: any,
    setGroups: (data: any) => void,
}

export const groupStore = create<store>((set) => ({
    groups: null,
    setGroups: (data: any) => {
        set({ groups: data })
    }
}))
