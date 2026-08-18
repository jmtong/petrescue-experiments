import { Route, Routes } from 'react-router-dom'
import { Home } from './Home.tsx'
import PopulationVsIntake from './experiments/01-population-vs-intake/index.tsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/01-population-vs-intake" element={<PopulationVsIntake />} />
    </Routes>
  )
}
