import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Header/Header"; // Import Header
import Footer from "./components/Footer/Footer"; // Import Footer
import LandingPage from "./screens/LandingPage/LandingPage";
import Dashboard from "./screens/Dashboard/Dashboard";
import UploadFile from "./screens/UploadFile/UploadFile";
import SigninScreen from './screens/SigninScreen/SigninScreen';
import SignupScreen from './screens/SignupScreen/SignupScreen';
import CreateNote from './screens/CreateNote/CreateNote';
import UpdateNote from './screens/UpdateNote/UpdateNote';
import SingleStudyNote from "./screens/SingleStudyNote/SingleStudyNote";




console.log("API URL:", import.meta.env.VITE_API_URL);


const App = () => (
  <Router>
    <Header />
    <main>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<SigninScreen />} />
        <Route path="/register" element={<SignupScreen />} />
        <Route path="/createnote" element={<CreateNote />} />
        <Route path="/note/:id" element={<UpdateNote />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/uploadfile" element={<UploadFile />} />
        <Route path="/studynote/:id" element={<SingleStudyNote />} />

      </Routes>
    </main>
    <Footer />
  </Router>
);

export default App;
