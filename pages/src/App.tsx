import { HashRouter, Route, Routes } from "react-router";
import { PageLayout } from "./components/layout";
import { HomePage } from "./pages/home";
import { EditorPage } from "./pages/editor";

function App() {
  return (
    <HashRouter>
      <PageLayout>
        <Routes>
          <Route path="/editor" Component={EditorPage} />
          <Route path="*" Component={HomePage} />
        </Routes>
      </PageLayout>
    </HashRouter>
  );
}

export default App;
