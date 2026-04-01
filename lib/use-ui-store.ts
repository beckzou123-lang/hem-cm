"use client";

import { create } from "zustand";

type UiState = {
  watchlist: string[];
  saved: string[];
  toggleWatch: (eventId: string) => void;
  markSaved: (eventId: string) => void;
};

export const useUiStore = create<UiState>((set) => ({
  watchlist: [],
  saved: [],
  toggleWatch: (eventId) =>
    set((state) => ({
      watchlist: state.watchlist.includes(eventId) ? state.watchlist.filter((item) => item !== eventId) : [...state.watchlist, eventId]
    })),
  markSaved: (eventId) =>
    set((state) => ({
      saved: state.saved.includes(eventId) ? state.saved : [...state.saved, eventId]
    }))
}));
