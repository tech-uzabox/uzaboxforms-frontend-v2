import { create } from "zustand";

interface store {
    processAndRoles: any[],
    setProcessAndRoles: (data: any[]) => void
}

const ProcessAndRoleStore = create<store>((set) => ({
    processAndRoles: [],
    setProcessAndRoles: (data: any[]) => {
        set({ processAndRoles: data })
    }
}))

export { ProcessAndRoleStore };