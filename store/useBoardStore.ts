import { create } from "zustand";

interface BoardState {
  boards: any[]; // Replace with Board type
  currentBoard: any | null;
  setBoards: (boards: any[]) => void;
  setCurrentBoard: (board: any) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  boards: [],
  currentBoard: null,
  setBoards: (boards) => set({ boards }),
  setCurrentBoard: (currentBoard) => set({ currentBoard }),
}));
