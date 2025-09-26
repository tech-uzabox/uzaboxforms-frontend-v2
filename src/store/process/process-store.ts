import { create } from "zustand";

interface ProcessStore {
    processes: any[];
    setProcesses: (data: any[]) => void;
}

export const ProcessStore = create<ProcessStore>((set) => ({
    processes: [],
    setProcesses: (data: any[]) => {
        set({ processes: data });
    },
}));