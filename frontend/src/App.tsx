import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Prelanding from './pages/Prelanding'
import PrelandingB from './pages/PrelandingB'
import { QuizFlow } from './pages/QuizFlow'
import { QuizFlowA } from './pages/QuizFlowA'
import { QuizFlowB } from './pages/QuizFlowB'
import AnalyticsDashboard from './pages/AnalyticsDashboard'
import { quizConfig } from './config/quizConfig'

function App() {
  return (
    <Router>
      <Routes>
        {/* Original route (unchanged) */}
        <Route path="/" element={<Prelanding />} />
        <Route path="/quiz" element={<QuizFlow config={quizConfig} />} />

        {/* A/B test variants */}
        <Route path="/a" element={<Prelanding variant="a" />} />
        <Route path="/b" element={<PrelandingB />} />
        <Route path="/quiz/a" element={<QuizFlowA />} />
        <Route path="/quiz/b" element={<QuizFlowB />} />
        <Route path="/dashboard/analytics" element={<AnalyticsDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
