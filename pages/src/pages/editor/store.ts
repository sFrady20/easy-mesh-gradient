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
  setEasingName: (name: EasingName) => void;
  setEasingStops: (stops: number) => void;
  /** Merges generation settings and regenerates the points. */
  setGeneration: (partial: Partial<GenerationSettings>) => void;
  /** Picks a fresh random seed and regenerates the points. */
  shuffle: () => void;
  updatePoint: (id: string, partial: Partial<Point>) => void;
  addPoint: () => void;
  removePoint: (id: string) => void;
  movePoint: (from: number, to: number) => void;
}

let nextId = 0;
const makeId = () => `p${nextId++}`;

export const randomSeed = () => Math.random().toString(36).slice(2, 9);

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
  pointCount: 5,
  generator: "scatter",
  gridCols: 3,
  gridRows: 3,
  hueRange: [0, 360],
  saturationRange: [0.5, 1],
  lightnessRange: [0.5, 0.85],
  scaleRange: [0.5, 2],
};

export const useEditorStore = create<EditorState>((set) => ({
  points: generatePoints(initialGeneration),
  easingName: "easeInOutCubic",
  easingStops: 15,
  generation: initialGeneration,

  setEasingName: (easingName) => set({ easingName }),
  setEasingStops: (easingStops) => set({ easingStops }),

  setGeneration: (partial) =>
    set((state) => {
      const generation = { ...state.generation, ...partial };
      return { generation, points: generatePoints(generation) };
    }),

  shuffle: () =>
    set((state) => {
      const generation = { ...state.generation, seed: randomSeed() };
      return { generation, points: generatePoints(generation) };
    }),

  updatePoint: (id, partial) =>
    set((state) => ({
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
      return { points: [...state.points, point] };
    }),

  removePoint: (id) =>
    set((state) => ({
      points: state.points.filter((point) => point.id !== id),
    })),

  movePoint: (from, to) =>
    set((state) => {
      if (from === to) return state;
      const points = [...state.points];
      const [moved] = points.splice(from, 1);
      points.splice(to, 0, moved);
      return { points };
    }),
}));
