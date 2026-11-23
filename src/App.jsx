import { Link, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import Services from "./pages/Services.jsx";
import About from "./pages/About.jsx";
import Book from "./pages/Book.jsx";
import { usePageTitle } from "./components/ui.jsx";

function NotFound() {
  usePageTitle("Page not found, Riah Visuals");
  return (
    <div className="wrap" style={{ padding: "clamp(60px,10vw,140px) 0" }}>
      <h1 className="display h1">This page doesn't exist.</h1>
      <p className="lead" style={{ marginTop: 18 }}>The link may be old. Everything is still here.</p>
      <div className="hero__ctas"><Link className="btn btn--accent" to="/">Go to the home page</Link><Link className="btn btn--line" to="/portfolio">See the portfolio</Link></div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="services" element={<Services />} />
        <Route path="about" element={<About />} />
        <Route path="book" element={<Book />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
