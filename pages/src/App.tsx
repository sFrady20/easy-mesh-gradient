import easyMeshGradient from "easy-mesh-gradient";
import { useState, useMemo } from "react";
import Transitioner from "./components/Transitioner";
import CasinoIcon from "@mui/icons-material/CasinoOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Tooltip } from "@mui/material";

//1.of9aom2sgo
//features - seeding (deterministic), easing, pure css

function App() {
  const [history, setHistory] = useState<string[]>([
    (Math.random() + 1).toString(36),
  ]);

  const backgroundImage = useMemo(
    () => easyMeshGradient({ seed: history[0] }),
    [history]
  );

  return (
    <div className="container mx-auto text-center py-15 px-10 max-w-280 space-y-13 <md:(px-5)">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline space-x-4">
          <a href={"/"}>
            <div
              className="tracking-tighter font-semibold text-5xl text-transparent bg-clip-text"
              style={{ backgroundImage }}
            >
              Easy Mesh Gradient
            </div>
          </a>
          <div className="tracking-tight text-sm font-light">v0.0.1</div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-3 h-40px border-1px rounded-xl flex items-center space-x-2 bg-white hover:(bg-gray-50)">
            <GitHubIcon />
            <div className="tracking-tighter">@sfrady20/easy-mesh-gradient</div>
          </button>
        </div>
      </div>
      <div className={"space-y-8"}>
        <div className="pb-[56%] relative">
          <Transitioner seed={history[0]}>
            <div
              className="absolute inset-0 rounded-2xl shadow-2xl shadow-gray-500"
              style={{
                backgroundImage,
              }}
            />
          </Transitioner>
        </div>
        <div className="flex items-center justify-end space-x-4">
          <Tooltip title={"Previous gradient"}>
            <button
              className={`px-6 h-50px border-1px rounded-xl flex items-center space-x-2 bg-white ${
                history.length > 1
                  ? "hover:(bg-gray-50)"
                  : "opacity-30 cursor-not-allowed"
              }`}
              onClick={
                history.length > 1
                  ? () => setHistory(([f, ...x]) => x)
                  : undefined
              }
            >
              <ArrowBackIcon />
            </button>
          </Tooltip>
          <button
            className="px-6 h-50px border-1px rounded-xl flex items-center space-x-2 bg-white hover:(bg-gray-50)"
            onClick={() =>
              setHistory((x) => [(Math.random() + 1).toString(36), ...x])
            }
          >
            <CasinoIcon />
            <div className="tracking-tighter">Randomize</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
