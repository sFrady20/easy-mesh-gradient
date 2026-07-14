import { useRef, type RefObject } from "react";
import { pointToHex } from "easy-mesh-gradient";
import { ShuffleIcon } from "../../components/icons";
import { useEditorStore, type EditorPoint } from "./store";

function PointHandle({
  point,
  containerRef,
}: {
  point: EditorPoint;
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const updatePoint = useEditorStore((s) => s.updatePoint);

  const handleDrag = (e: React.PointerEvent<HTMLButtonElement>) => {
    const container = containerRef.current;
    if (!container) return;
    e.currentTarget.setPointerCapture(e.pointerId);

    const box = container.getBoundingClientRect();
    const move = (ev: PointerEvent) => {
      updatePoint(point.id, {
        x: Math.max(0, Math.min(1, (ev.clientX - box.x) / box.width)),
        y: Math.max(0, Math.min(1, (ev.clientY - box.y) / box.height)),
      });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <button
      className="group absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 cursor-move touch-none rounded-full border-2 border-white bg-white/90 shadow-[0_2px_10px_rgba(0,0,0,0.3)] transition-transform hover:scale-110 active:scale-125"
      style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%` }}
      onPointerDown={handleDrag}
      aria-label="Drag to move point"
    >
      <span
        className="absolute inset-1 rounded-full"
        style={{ backgroundColor: pointToHex(point) }}
      />
    </button>
  );
}

export function Preview({ gradient }: { gradient: string }) {
  const points = useEditorStore((s) => s.points);
  const shuffle = useEditorStore((s) => s.shuffle);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative h-full w-full">
      <div
        ref={containerRef}
        className="relative h-full w-full overflow-visible rounded-3xl shadow-xl"
        style={{ backgroundImage: gradient }}
      >
        {points.map((point) => (
          <PointHandle
            key={point.id}
            point={point}
            containerRef={containerRef}
          />
        ))}

        <button
          onClick={shuffle}
          className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/40 bg-white/70 px-4 py-2 text-sm font-medium text-gray-900 shadow-lg backdrop-blur-md transition-all hover:bg-white/90 active:scale-95"
        >
          <ShuffleIcon size={15} />
          Shuffle
        </button>
      </div>
    </div>
  );
}
