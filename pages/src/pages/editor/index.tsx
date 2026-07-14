import { useMemo, useState } from "react";
import easyMeshGradient, { easings } from "easy-mesh-gradient";
import { DownloadIcon } from "../../components/icons";
import { useEditorStore } from "./store";
import { Preview } from "./Preview";
import { DesignPanel } from "./DesignPanel";
import { ExportModal } from "./ExportModal";

export function EditorPage() {
  const points = useEditorStore((s) => s.points);
  const easingName = useEditorStore((s) => s.easingName);
  const easingStops = useEditorStore((s) => s.easingStops);
  const [exportOpen, setExportOpen] = useState(false);

  const gradient = useMemo(
    () =>
      easyMeshGradient({
        points,
        easing: easings[easingName],
        easingStops,
      }),
    [points, easingName, easingStops]
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col lg:h-[calc(100dvh-3.5rem)] lg:min-h-0 lg:flex-none lg:flex-row lg:gap-4 lg:overflow-hidden lg:p-4">
      {/* Sticky on mobile so edits stay visible; locked to the viewport on desktop */}
      <div className="sticky top-14 z-30 h-[38dvh] shrink-0 bg-gray-50 px-3 pt-3 pb-1.5 lg:static lg:z-auto lg:h-full lg:flex-1 lg:p-0">
        <Preview gradient={gradient} />
      </div>

      <aside className="flex w-full flex-col px-3 pt-2 lg:w-[400px] lg:overflow-y-auto lg:p-0 lg:pr-1">
        <DesignPanel />

        {/* Sticks to the bottom of the panel's scroll area */}
        <div className="sticky bottom-0 mt-auto bg-gradient-to-t from-gray-50 via-gray-50/90 to-transparent pt-6 pb-3 lg:pb-1">
          <button
            onClick={() => setExportOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-gray-700 active:scale-[0.98]"
          >
            <DownloadIcon size={15} />
            Export
          </button>
        </div>
      </aside>

      {exportOpen && <ExportModal onClose={() => setExportOpen(false)} />}
    </div>
  );
}
