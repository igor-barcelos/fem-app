import { signal } from "@preact/signals-react";
export type IDrawType =
  | "Line"
  | "Rectangular"
  | "None";

export const drawTypeSignal = signal<IDrawType>('None')