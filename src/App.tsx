import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";
import Header from "./Components/Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/nomflix_clone" element={<Home />} />
        <Route path="/nomflix_clone/tv" element={<Tv />} />
        <Route path="/nomflix_clone/tv/:type/:id" element={<Tv />} />
        <Route path="/nomflix_clone/search" element={<Search />} />
        <Route
          path="/nomflix_clone/search?keyword=:keyword"
          element={<Home />}
        />
        <Route path="/nomflix_clone/movies/:type/:id" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
