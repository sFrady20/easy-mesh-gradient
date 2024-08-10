import { HashRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/home";
import { EditorPage } from "./pages/editor";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/editor" Component={EditorPage} />
        <Route path="*" Component={HomePage} />
      </Routes>
    </HashRouter>
  );
}

export default App;
