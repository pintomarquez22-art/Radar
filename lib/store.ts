"use client";

import { createContext, useContext, useReducer, ReactNode, createElement } from "react";
import { Signal, Comment, Tag } from "./types";
import { MOCK_SIGNALS, ALL_TAGS } from "./mockData";

interface State {
  signals: Signal[];
  tags: Tag[];
  searchQuery: string;
  activeType: string;
  activeTag: string;
}

type Action =
  | { type: "VOTE"; signalId: string }
  | { type: "ADD_COMMENT"; signalId: string; comment: Omit<Comment, "id" | "signalId"> }
  | { type: "ADD_SIGNAL"; signal: Omit<Signal, "id" | "createdAt" | "updatedAt" | "votes" | "userVoted" | "comments"> }
  | { type: "SET_SEARCH"; query: string }
  | { type: "SET_TYPE_FILTER"; value: string }
  | { type: "SET_TAG_FILTER"; value: string };

const initialState: State = {
  signals: MOCK_SIGNALS,
  tags: ALL_TAGS,
  searchQuery: "",
  activeType: "all",
  activeTag: "all",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "VOTE":
      return {
        ...state,
        signals: state.signals.map((s) =>
          s.id === action.signalId
            ? { ...s, votes: s.userVoted ? s.votes - 1 : s.votes + 1, userVoted: !s.userVoted }
            : s
        ),
      };
    case "ADD_COMMENT":
      return {
        ...state,
        signals: state.signals.map((s) =>
          s.id === action.signalId
            ? {
                ...s,
                comments: [
                  ...s.comments,
                  { ...action.comment, id: `c${Date.now()}`, signalId: action.signalId },
                ],
              }
            : s
        ),
      };
    case "ADD_SIGNAL":
      const newSignal: Signal = {
        ...action.signal,
        id: `s${Date.now()}`,
        votes: 0,
        userVoted: false,
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { ...state, signals: [newSignal, ...state.signals] };
    case "SET_SEARCH":
      return { ...state, searchQuery: action.query };
    case "SET_TYPE_FILTER":
      return { ...state, activeType: action.value };
    case "SET_TAG_FILTER":
      return { ...state, activeTag: action.value };
    default:
      return state;
  }
}

const StoreContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return createElement(StoreContext.Provider, { value: { state, dispatch } }, children);
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
