import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Prelanding from './pages/Prelanding'
import { QuizFlow } from './pages/QuizFlow'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Prelanding />} />
        <Route path="/quiz" element={<QuizFlow />} />
      </Routes>
    </Router>
  )
}

export default App
