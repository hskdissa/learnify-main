import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import LandingPage from "./screens/LandingPage/LandingPage";
import Dashboard from "./screens/Dashboard/Dashboard";
import UploadFile from "./screens/UploadFile/UploadFile";
import SigninScreen from './screens/SigninScreen/SigninScreen';
import SignupScreen from './screens/SignupScreen/SignupScreen';

import SingleStudyNote from "./screens/SingleStudyNote/SingleStudyNote";
import FlashcardDisplay from "./screens/FlashcardDisplay/FlashcardDisplay";
import FlashcardDisplayScreen from "./screens/FlashcardDisplayScreen/FlashcardDisplayScreen";
import FlashcardDetailScreen from './screens/FlashcardDetailScreen/FlashcardDetailScreen';

import QuizGenerate from "./screens/Quiz/QuizGenerate"; 
import QuizDisplay from "./screens/Quiz/QuizDisplay"; 

import QuizConfirmation from "./screens/Quiz/QuizConfirmation"; 
import SingleQuiz from './screens/Quiz/SingleQuiz';
import QuizResult from './screens/Quiz/QuizResult';
import MyProfileScreen from './screens/MyProfileScreen/MyProfileScreen';

const App = () => (
  <Router>
    <Header />
    <main>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<SigninScreen />} />
        <Route path="/my-profile" element={<MyProfileScreen />} />
        <Route path="/register" element={<SignupScreen />} />


        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/uploadfile" element={<UploadFile />} />
        <Route path="/studynote/:id" element={<SingleStudyNote />} />

        <Route path="/quizzes/generate" element={<QuizConfirmation />} /> 
        <Route path="/quiz/generate" element={<QuizGenerate />} />
        <Route path="/quizzes/:studyNoteId" element={<QuizDisplay />} />
        <Route path="/quizzes/studynote/:studyNoteId/quiz/:quizId" element={<SingleQuiz />} />
        <Route path="/quizzes/studynote/:studyNoteId/quiz/:quizId/submit" element={<QuizResult />} />
        
        <Route path="/flashcards/generate" element={<FlashcardDisplay />} />
        <Route path="/studynote/:id/flashcards" element={<FlashcardDisplayScreen />} />
        <Route path="/studynote/:id/flashcards/:flashcardId" element={<FlashcardDetailScreen />} />


      </Routes>
    </main>
    <Footer />
  </Router>
);

export default App;
