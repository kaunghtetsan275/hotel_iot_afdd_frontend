import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'; // or './App.css' if still needed
import MainPage from './pages/MainPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
