import easyMeshGradient from "easy-mesh-gradient";
import { useState, useMemo } from "react";
import Transitioner from "./components/Transitioner";
import CasinoIcon from "@mui/icons-material/CasinoOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Tooltip } from "@mui/material";

//1.of9aom2sgo
//features - seeding (deterministic), easing, pure css

function App() {
  const [state, setState] = useState<{ history: string[]; current: number }>({
    history: [(Math.random() + 1).toString(36)],
    current: 0,
  });

  const backgroundImage = useMemo(
    () => easyMeshGradient({ seed: state.history[state.current] }),
    [state]
  );

  return (
    <>
      <div className="container mx-auto text-center py-15 px-10 max-w-280 space-y-13 <md:(px-5)">
        <div className="flex items-center justify-between <lg:(flex-col space-y-6)">
          <div className="flex items-baseline space-x-4 <md:(flex-col items-center space-y-1)">
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
            <a
              href={"https://github.com/sFrady20/easy-mesh-gradient"}
              target="_blank"
            >
              <button className="px-4 h-40px border-1px  rounded-xl flex items-center space-x-2 hover:(bg-gray-50 border-gray-300)">
                <code className="tracking-tight text-sm">
                  npm install easy-mesh-gradient
                </code>
              </button>
            </a>
            <a
              href={"https://github.com/sFrady20/easy-mesh-gradient"}
              target="_blank"
            >
              <button className="px-3 h-40px border-1px border-transparent rounded-xl flex items-center space-x-2 hover:(bg-gray-50 border-gray-300)">
                <GitHubIcon />
              </button>
            </a>
          </div>
        </div>
        <div></div>
        <div className={"space-y-8"}>
          <div className="pb-[56%] relative">
            <Transitioner seed={state.history[state.current]}>
              <div
                className="absolute inset-0 rounded-2xl shadow-2xl shadow-gray-500"
                style={{
                  backgroundImage,
                }}
              />
            </Transitioner>
          </div>
          <div className="flex items-center justify-end space-x-4">
            <button
              className={`px-3 h-40px border-1px rounded-xl flex items-center space-x-2 bg-white ${
                state.current > 0
                  ? "hover:(bg-gray-50)"
                  : "opacity-30 cursor-not-allowed"
              }`}
              onClick={
                state.current > 0
                  ? () => setState((x) => ({ ...x, current: x.current - 1 }))
                  : undefined
              }
            >
              <ArrowBackIcon />
            </button>
            <button
              className={`px-3 h-40px border-1px rounded-xl flex items-center space-x-2 bg-white ${
                state.current < state.history.length - 1
                  ? "hover:(bg-gray-50)"
                  : "opacity-30 cursor-not-allowed"
              }`}
              onClick={
                state.current < state.history.length - 1
                  ? () => setState((x) => ({ ...x, current: x.current + 1 }))
                  : undefined
              }
            >
              <ArrowForwardIcon />
            </button>
            <button
              className="px-6 h-50px border-1px rounded-full flex items-center space-x-2 bg-black text-white hover:(bg-gray-900)"
              onClick={() => {
                setState((x) => ({
                  ...x,
                  history: [
                    ...x.history.slice(0, x.current + 1),
                    (Math.random() + 1).toString(36),
                  ],
                  current: x.current + 1,
                }));
              }}
            >
              <CasinoIcon />
              <div className="tracking-tighter">Randomize</div>
            </button>
          </div>
        </div>
      </div>
      <div className="container mx-auto max-w-280 border-t-1px pt-4 pb-20 text-center">
        Created by{" "}
        <a
          className="tracking-tighter underline hover:(underline-transparent)"
          href={"https://stevenfrady.com"}
          target={"_blank"}
        >
          Steven Frady
        </a>
      </div>
    </>
  );
}

export default App;
