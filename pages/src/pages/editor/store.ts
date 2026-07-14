import { create } from "zustand";
import {
  defaultPointsGenerator,
  gridPointsGenerator,
  type EasingName,
  type Point,
  type PointGenerationOptions,
} from "easy-mesh-gradient";

export type EditorPoint = Point & { id: string };
export type GeneratorKind = "scatter" | "grid";

export interface GenerationSettings {
  seed: string;
  pointCount: number;
  generator: GeneratorKind;
  gridCols: number;
  gridRows: number;
  hueRange: [number, number];
  saturationRange: [number, number];
  lightnessRange: [number, number];
  scaleRange: [number, number];
}

interface EditorState {
  points: EditorPoint[];
  easingName: EasingName;
  easingStops: number;
  generation: GenerationSettings;
  /**
   * True once points were edited by hand (drag, recolor, reorder, …).
   * While false, the gradient is fully described by seed + settings,
   * so exports can use the seed instead of explicit points.
   */
  dirty: boolean;
  setEasingName: (name: EasingName) => void;
  setEasingStops: (stops: number) => void;
  /** Merges generation settings and regenerates the points. */
  setGeneration: (partial: Partial<GenerationSettings>) => void;
  /** Picks a fresh random seed and regenerates the points. */
  shuffle: () => void;
  /** Discards manual edits and regenerates from the current seed. */
  regenerate: () => void;
  updatePoint: (id: string, partial: Partial<Point>) => void;
  addPoint: () => void;
  removePoint: (id: string) => void;
  movePoint: (from: number, to: number) => void;
}

let nextId = 0;
const makeId = () => `p${nextId++}`;

export const randomSeed = () => Math.random().toString(36).slice(2, 9);

/** Library defaults — used to keep exports minimal. */
export const GENERATION_DEFAULTS = {
  pointCount: 5,
  hueRange: [0, 360] as [number, number],
  saturationRange: [0.5, 1] as [number, number],
  lightnessRange: [0.5, 1] as [number, number],
  scaleRange: [0.5, 2] as [number, number],
  easingName: "easeInOutCubic" as EasingName,
  easingStops: 10,
};

function generationOptions(
  settings: GenerationSettings
): PointGenerationOptions {
  return {
    seed: settings.seed,
    pointCount: settings.pointCount,
    hueRange: settings.hueRange,
    saturationRange: settings.saturationRange,
    lightnessRange: settings.lightnessRange,
    scaleRange: settings.scaleRange,
  };
}

function generatePoints(settings: GenerationSettings): EditorPoint[] {
  const options = generationOptions(settings);
  const points =
    settings.generator === "grid"
      ? gridPointsGenerator(options, settings.gridCols, settings.gridRows)
      : defaultPointsGenerator(options);
  return points.map((point) => ({ ...point, id: makeId() }));
}

const initialGeneration: GenerationSettings = {
  seed: randomSeed(),
  generator: "scatter",
  gridCols: 3,
  gridRows: 3,
  pointCount: GENERATION_DEFAULTS.pointCount,
  hueRange: GENERATION_DEFAULTS.hueRange,
  saturationRange: GENERATION_DEFAULTS.saturationRange,
  lightnessRange: GENERATION_DEFAULTS.lightnessRange,
  scaleRange: GENERATION_DEFAULTS.scaleRange,
};

export const useEditorStore = create<EditorState>((set) => ({
  points: generatePoints(initialGeneration),
  easingName: GENERATION_DEFAULTS.easingName,
  easingStops: GENERATION_DEFAULTS.easingStops,
  generation: initialGeneration,
  dirty: false,

  setEasingName: (easingName) => set({ easingName }),
  setEasingStops: (easingStops) => set({ easingStops }),

  setGeneration: (partial) =>
    set((state) => {
      const generation = { ...state.generation, ...partial };
      return { generation, points: generatePoints(generation), dirty: false };
    }),

  shuffle: () =>
    set((state) => {
      const generation = { ...state.generation, seed: randomSeed() };
      return { generation, points: generatePoints(generation), dirty: false };
    }),

  regenerate: () =>
    set((state) => ({
      points: generatePoints(state.generation),
      dirty: false,
    })),

  updatePoint: (id, partial) =>
    set((state) => ({
      dirty: true,
      points: state.points.map((point) =>
        point.id === id ? { ...point, ...partial } : point
      ),
    })),

  addPoint: () =>
    set((state) => {
      // Single random point styled by the current generation ranges
      const [generated] = defaultPointsGenerator({
        ...generationOptions(state.generation),
        seed: undefined,
        pointCount: 1,
      });
      const point = {
        ...generated,
        x: 0.1 + Math.random() * 0.8,
        y: 0.1 + Math.random() * 0.8,
        id: makeId(),
      };
      return { points: [...state.points, point], dirty: true };
    }),

  removePoint: (id) =>
    set((state) => ({
      dirty: true,
      points: state.points.filter((point) => point.id !== id),
    })),

  movePoint: (from, to) =>
    set((state) => {
      if (from === to) return state;
      const points = [...state.points];
      const [moved] = points.splice(from, 1);
      points.splice(to, 0, moved);
      return { points, dirty: true };
    }),
}));
