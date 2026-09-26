"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { useToast } from "./toast-context";

export const PLAN_LIMIT = 5;

const STORAGE_KEY = "ph-fitlog-plan-v1";

const EMPTY_STATE = { plan: [], saved: [], hydrated: false };

/** Read and sanity-check whatever the last session left in localStorage. */
function loadStoredState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const plan = Array.isArray(parsed.plan)
      ? parsed.plan
          .filter((item) => item && item.id != null && item.name)
          .slice(0, PLAN_LIMIT)
          .map((item) => ({ ...item, done: Boolean(item.done) }))
      : [];
    const saved = Array.isArray(parsed.saved)
      ? parsed.saved.filter((item) => item && item.id != null && item.name)
      : [];
    return { plan, saved };
  } catch {
    return null;
  }
}

function planReducer(state, action) {
  switch (action.type) {
    case "hydrate":
      return { plan: action.plan, saved: action.saved, hydrated: true };
    case "plan/add":
      return {
        ...state,
        plan: [...state.plan, { ...action.workout, done: false }],
      };
    case "plan/remove":
      return { ...state, plan: state.plan.filter((item) => item.id !== action.id) };
    case "plan/toggleDone":
      return {
        ...state,
        plan: state.plan.map((item) =>
          item.id === action.id ? { ...item, done: !item.done } : item
        ),
      };
    case "saved/add":
      return { ...state, saved: [...state.saved, action.workout] };
    case "saved/remove":
      return {
        ...state,
        saved: state.saved.filter((item) => item.id !== action.id),
      };
    default:
      return state;
  }
}

const PlanContext = createContext(null);

export function PlanProvider({ children }) {
  const { toast } = useToast();
  const [state, dispatch] = useReducer(planReducer, EMPTY_STATE);

  // Pull the persisted lists back in once, after mount, so the server
  // render and the first client render stay identical (reload safety).
  useEffect(() => {
    const stored = loadStoredState();
    dispatch({
      type: "hydrate",
      plan: stored ? stored.plan : [],
      saved: stored ? stored.saved : [],
    });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ plan: state.plan, saved: state.saved })
      );
    } catch {
      // Storage can be unavailable (private mode / full) — the in-memory
      // plan keeps working, it just won't survive a reload.
    }
  }, [state]);

  const addToPlan = useCallback(
    (workout) => {
      if (state.plan.some((item) => item.id === workout.id)) {
        toast("Already in today's plan", "info");
        return;
      }
      if (state.plan.length >= PLAN_LIMIT) {
        toast(
          `Today's plan is full — ${PLAN_LIMIT} lifts max. Remove one first.`,
          "warning"
        );
        return;
      }
      dispatch({ type: "plan/add", workout });
      toast(`"${workout.name}" added to today's plan`, "success");
    },
    [state.plan, toast]
  );

  const removeFromPlan = useCallback(
    (id, name) => {
      dispatch({ type: "plan/remove", id });
      toast(`"${name}" removed from today's plan`, "info");
    },
    [toast]
  );

  const toggleDone = useCallback(
    (id, name, isDone) => {
      dispatch({ type: "plan/toggleDone", id });
      toast(
        isDone ? `"${name}" moved back to to-do` : `"${name}" marked as done`,
        isDone ? "info" : "success"
      );
    },
    [toast]
  );

  const toggleSave = useCallback(
    (workout) => {
      const isSaved = state.saved.some((item) => item.id === workout.id);
      if (isSaved) {
        dispatch({ type: "saved/remove", id: workout.id });
        toast(`"${workout.name}" removed from saved`, "info");
      } else {
        dispatch({ type: "saved/add", workout });
        toast(`"${workout.name}" saved for later`, "success");
      }
    },
    [state.saved, toast]
  );

  const planIds = useMemo(
    () => new Set(state.plan.map((item) => item.id)),
    [state.plan]
  );
  const savedIds = useMemo(
    () => new Set(state.saved.map((item) => item.id)),
    [state.saved]
  );

  const value = useMemo(
    () => ({
      plan: state.plan,
      saved: state.saved,
      hydrated: state.hydrated,
      planCount: state.plan.length,
      savedCount: state.saved.length,
      planIsFull: state.plan.length >= PLAN_LIMIT,
      planIds,
      savedIds,
      addToPlan,
      removeFromPlan,
      toggleDone,
      toggleSave,
    }),
    [state, planIds, savedIds, addToPlan, removeFromPlan, toggleDone, toggleSave]
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlan must be used inside <PlanProvider>");
  }
  return context;
}
