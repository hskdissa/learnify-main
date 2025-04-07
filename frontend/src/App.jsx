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
import FlashcardDisplay from "./screens/FlashcardDisplay/FlashcardDisplay";
import FlashcardDisplayScreen from "./screens/FlashcardDisplayScreen/FlashcardDisplayScreen";
import FlashcardDetailScreen from './screens/FlashcardDetailScreen/FlashcardDetailScreen';

import QuizGenerate from "./screens/Quiz/QuizGenerate"; // Path for QuizGenerate page
import QuizDisplay from "./screens/Quiz/QuizDisplay"; // Path for QuizDisplay page

import QuizConfirmation from "./screens/Quiz/QuizConfirmation"; // Import the confirmation page








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

        <Route path="/quizzes/generate" element={<QuizConfirmation />} /> 
        <Route path="/quiz/generate" element={<QuizGenerate />} />
        <Route path="/quiz/display/:quizId" element={<QuizDisplay />} />
        
        <Route path="/flashcards/generate" element={<FlashcardDisplay />} />

        <Route path="/studynote/:id/flashcards" element={<FlashcardDisplayScreen />} />
        <Route path="/studynote/:id/flashcards/:flashcardId" element={<FlashcardDetailScreen />} />




      </Routes>
    </main>
    <Footer />
  </Router>
);

export default App;
