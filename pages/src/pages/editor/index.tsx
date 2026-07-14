import { useMemo, useState } from "react";
import easyMeshGradient, { easings } from "easy-mesh-gradient";
import { Segmented } from "../../components/controls";
import { useEditorStore } from "./store";
import { Preview } from "./Preview";
import { DesignPanel } from "./DesignPanel";
import { ExportPanel } from "./ExportPanel";

type PanelTab = "design" | "export";

export function EditorPage() {
  const points = useEditorStore((s) => s.points);
  const easingName = useEditorStore((s) => s.easingName);
  const easingStops = useEditorStore((s) => s.easingStops);
  const [tab, setTab] = useState<PanelTab>("design");

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
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4 lg:h-[calc(100vh-3.5rem)] lg:flex-row lg:overflow-hidden">
      <Preview gradient={gradient} />

      <aside className="flex w-full flex-col gap-3 lg:w-[400px] lg:overflow-y-auto lg:pr-1">
        <Segmented<PanelTab>
          options={[
            { value: "design", label: "Design" },
            { value: "export", label: "Export" },
          ]}
          value={tab}
          onChange={setTab}
        />
        {tab === "design" ? (
          <DesignPanel />
        ) : (
          <ExportPanel gradient={gradient} />
        )}
      </aside>
    </div>
  );
}
