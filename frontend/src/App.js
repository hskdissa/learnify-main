import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Header/Header"; // Import Header
import Footer from "./components/Footer/Footer"; // Import Footer
import LandingPage from "./screens/LandingPage/LandingPage";
import Dashboard from "./screens/Dashboard/Dashboard";
import UploadFile from "./screens/UploadFile/UploadFile";
import SigninScreen from './screens/SigninScreen/SigninScreen';
import SignupScreen from './screens/SignupScreen/SignupScreen';

const App = () => (
  <Router>
    <Header />
    <main>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<SigninScreen />} />
        <Route path="/register" element={<SignupScreen />} />
        
        {/* Protect routes like dashboard and upload */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/uploadfile" element={<UploadFile />} />
      </Routes>
    </main>
    <Footer />
  </Router>
);

export default App;
