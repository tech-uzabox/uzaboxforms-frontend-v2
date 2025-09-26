import { create } from "zustand"
import { Position } from "@/services"

interface PositionState {
  positions: Position[]
  setPositions: (positions: Position[]) => void
  getPositionById: (id: string) => Position | null
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  error: Error | null
  setError: (error: Error | null) => void
}

export const usePositionStore = create<PositionState>((set, get) => ({
  positions: [],
  isLoading: false,
  error: null,

  setPositions: (positions: Position[]) => set({ positions }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: Error | null) => set({ error }),

  getPositionById: (id: string): Position | null => {
    const findPosition = (positions: Position[]): Position | null => {
      for (const position of positions) {
        if (position.id === id) {
          return position
        }

        if (position.subordinates && position.subordinates.length > 0) {
          const found = findPosition(position.subordinates)
          if (found) return found
        }
      }
      return null
    }

    return findPosition(get().positions)
  },
}))
