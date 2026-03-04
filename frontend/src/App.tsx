import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Prelanding from './pages/Prelanding'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Prelanding />} />
      </Routes>
    </Router>
  )
}

export default App
