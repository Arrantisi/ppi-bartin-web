"use client";

import { useReducer, useCallback } from "react";
import type { CalendarEvent, ViewType, DialogState } from "../types";

type State = {
  events: CalendarEvent[];
  selectedDate: Date;
  view: ViewType;
  dialog: DialogState;
};

type Action =
  | { type: "SET_EVENTS"; payload: CalendarEvent[] }
  | { type: "SELECT_DATE"; payload: Date }
  | { type: "SET_VIEW"; payload: ViewType }
  | { type: "OPEN_DIALOG"; payload: { mode: "add" | "edit"; event?: CalendarEvent } }
  | { type: "CLOSE_DIALOG" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_EVENTS":
      return { ...state, events: action.payload };
    case "SELECT_DATE":
      return { ...state, selectedDate: action.payload };
    case "SET_VIEW":
      return { ...state, view: action.payload };
    case "OPEN_DIALOG":
      return {
        ...state,
        dialog: { open: true, ...action.payload },
      };
    case "CLOSE_DIALOG":
      return {
        ...state,
        dialog: { open: false, mode: "add" },
      };
    default:
      return state;
  }
}

const initialState: State = {
  events: [],
  selectedDate: new Date(),
  view: "daily",
  dialog: { open: false, mode: "add" },
};

export function useCalendar(initialEvents: CalendarEvent[] = []) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    events: initialEvents,
  });

  const selectDate = useCallback((date: Date) => {
    dispatch({ type: "SELECT_DATE", payload: date });
  }, []);

  const setView = useCallback((view: ViewType) => {
    dispatch({ type: "SET_VIEW", payload: view });
  }, []);

  const openAddDialog = useCallback(() => {
    dispatch({ type: "OPEN_DIALOG", payload: { mode: "add" } });
  }, []);

  const openEditDialog = useCallback((event: CalendarEvent) => {
    dispatch({ type: "OPEN_DIALOG", payload: { mode: "edit", event } });
  }, []);

  const closeDialog = useCallback(() => {
    dispatch({ type: "CLOSE_DIALOG" });
  }, []);

  const setEvents = useCallback((events: CalendarEvent[]) => {
    dispatch({ type: "SET_EVENTS", payload: events });
  }, []);

  return {
    state,
    selectDate,
    setView,
    openAddDialog,
    openEditDialog,
    closeDialog,
    setEvents,
  };
}
