import { Route, Routes } from 'react-router-dom'
import { Home } from './Home.tsx'
import SplitFutures from './experiments/01a-split-futures/index.tsx'
import FollowACat from './experiments/01b-follow-a-cat/index.tsx'
import LearnThenCompare from './experiments/01c-learn-then-compare/index.tsx'
import ManageTheNeighbourhood from './experiments/01d-manage-the-neighbourhood/index.tsx'
import TwoCounts from './experiments/01f-two-counts/index.tsx'
import WhereDidTheCatsGo from './experiments/01e-where-did-the-cats-go/index.tsx'
import TrappingVsSterilising from './experiments/01g-trapping-vs-sterilising/index.tsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/01a-split-futures" element={<SplitFutures />} />
      <Route path="/experiments/01b-follow-a-cat" element={<FollowACat />} />
      <Route path="/01b-follow-a-cat" element={<FollowACat />} />
      <Route path="/experiments/01c-learn-then-compare" element={<LearnThenCompare />} />
      <Route path="/01c-learn-then-compare" element={<LearnThenCompare />} />
      <Route path="/experiments/01d-manage-the-neighbourhood" element={<ManageTheNeighbourhood />} />
      <Route path="/01d-manage-the-neighbourhood" element={<ManageTheNeighbourhood />} />
      <Route path="/experiments/01f-two-counts" element={<TwoCounts />} />
      <Route path="/01f-two-counts" element={<TwoCounts />} />
      <Route path="/experiments/01e-two-counts" element={<TwoCounts />} />
      <Route path="/01e-two-counts" element={<TwoCounts />} />
      <Route path="/experiments/01e-where-did-the-cats-go" element={<WhereDidTheCatsGo />} />
      <Route path="/01e-where-did-the-cats-go" element={<WhereDidTheCatsGo />} />
      <Route path="/experiments/01g-trapping-vs-sterilising" element={<TrappingVsSterilising />} />
      <Route path="/01g-trapping-vs-sterilising" element={<TrappingVsSterilising />} />
    </Routes>
  )
}
