import easyMeshGradient from "easy-mesh-gradient";
import { useState, useMemo } from "react";
import Transitioner from "../../components/Transitioner";
import CasinoIcon from "@mui/icons-material/CasinoOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import libPkg from "../../../../lib/package.json";

export const HomePage = function () {
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
            <div className="tracking-tight text-sm font-light">
              v{libPkg.version}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <a
              href={"https://www.npmjs.com/package/easy-mesh-gradient"}
              target="_blank"
              aria-label="Link to Easy Mesh Gradient on NPM"
            >
              <button
                className="px-4 h-40px border-1px  rounded-xl flex items-center space-x-2 hover:(bg-gray-50 border-gray-300)"
                aria-label="Easy Mesh Gradient on NPM"
              >
                <code className="tracking-tight text-sm">
                  npm install easy-mesh-gradient
                </code>
              </button>
            </a>
            <a
              href={"https://github.com/sFrady20/easy-mesh-gradient"}
              target="_blank"
              aria-label="Link to Easy Mesh Gradient GitHub repo"
            >
              <button
                className="px-3 h-40px border-1px border-transparent rounded-xl flex items-center space-x-2 hover:(bg-gray-50 border-gray-300)"
                aria-label="Easy Mesh Gradient GitHub repo"
              >
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
          <div className="flex items-center justify-end space-x-4 <md:(justify-center)">
            <button
              className={`px-3 h-40px border-1px rounded-xl flex items-center space-x-2 bg-white ${
                state.current > 0
                  ? "hover:(bg-gray-50)"
                  : "opacity-30 cursor-not-allowed"
              }`}
              aria-label={"previous gradient"}
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
              aria-label={"next gradient"}
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
              aria-label={"randomize gradient"}
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
      <div className="container mx-auto max-w-280 border-t-1px pt-4 pb-10 text-center">
        Created by{" "}
        <a
          className="tracking-tighter underline hover:(underline-transparent)"
          href={"https://stevenfrady.com"}
          target={"_blank"}
          aria-label={"Go to Steven Frady's webite"}
        >
          Steven Frady
        </a>
      </div>
    </>
  );
};
