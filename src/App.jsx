import "./App.css";
import { Route, Routes} from "react-router-dom";
import BookingPage from "./pages/BookingPage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import HomePage from "./pages/HomePage";








function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
      <Route path="/booking/:movieId" element={<BookingPage />} />
    </Routes>
  );
}

export default App;