import { HashRouter, Route, Routes } from "react-router-dom";
import { PageLayout } from "./components/layout";
import { HomePage } from "./pages/home";
import { EditorPage } from "./pages/editor";
import { EasingVisualizerPage } from "./pages/tools/easing";
import { GradientExportPage } from "./pages/tools/export";
import { ColorPalettePage } from "./pages/tools/palette";

function App() {
  return (
    <HashRouter>
      <PageLayout>
        <Routes>
          <Route path="/editor" Component={EditorPage} />
          <Route path="/tools/easing" Component={EasingVisualizerPage} />
          <Route path="/tools/export" Component={GradientExportPage} />
          <Route path="/tools/palette" Component={ColorPalettePage} />
          <Route path="*" Component={HomePage} />
        </Routes>
      </PageLayout>
    </HashRouter>
  );
}

export default App;
