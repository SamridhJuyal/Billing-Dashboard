import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/structure/Layout";
import Dashboard from "./pages/Dashboard";
import Billing from "./pages/Billing";
import Masters from "./pages/Masters";
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="billing" element={<Billing />} />
          <Route path="masters" element={<Masters />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;