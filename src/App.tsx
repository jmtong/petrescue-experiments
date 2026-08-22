import type { ComponentType } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { Home } from './Home.tsx'
import { experiments } from './data/experiments.ts'
import SplitFutures from './experiments/01a-split-futures/index.tsx'
import FollowACat from './experiments/01b-follow-a-cat/index.tsx'
import LearnThenCompare from './experiments/01c-learn-then-compare/index.tsx'
import ManageTheNeighbourhood from './experiments/01d-manage-the-neighbourhood/index.tsx'
import WhereDidTheCatsGo from './experiments/01e-where-did-the-cats-go/index.tsx'
import TwoCounts from './experiments/01f-two-counts/index.tsx'
import TrappingVsSterilising from './experiments/01g-trapping-vs-sterilising/index.tsx'
import BranchingFamilyTree from './experiments/01h-branching-family-tree/index.tsx'
import FillingTheNeighbourhood from './experiments/01i-filling-the-neighbourhood/index.tsx'
import CatDistributionSystem from './experiments/01j-cat-distribution-system/index.tsx'
import IllustratedCatFaces from './experiments/01k-illustrated-cat-faces/index.tsx'
import WhyDesexing from './experiments/01l-why-desexing/index.tsx'

const pages: Record<string, ComponentType> = {
  '01a-split-futures': SplitFutures,
  '01b-follow-a-cat': FollowACat,
  '01c-learn-then-compare': LearnThenCompare,
  '01d-manage-the-neighbourhood': ManageTheNeighbourhood,
  '01e-where-did-the-cats-go': WhereDidTheCatsGo,
  '01f-two-counts': TwoCounts,
  '01g-trapping-vs-sterilising': TrappingVsSterilising,
  '01h-branching-family-tree': BranchingFamilyTree,
  '01i-filling-the-neighbourhood': FillingTheNeighbourhood,
  '01j-cat-distribution-system': CatDistributionSystem,
  '01k-illustrated-cat-faces': IllustratedCatFaces,
  '01l-why-desexing': WhyDesexing,
}

function StripTrailingJunk() {
  const { pathname, search, hash } = useLocation()
  const next = pathname.replace(/[.]+$/, '').replace(/\/+$/, '') || '/'
  if (next !== pathname) {
    return <Navigate to={`${next}${search}${hash}`} replace />
  }
  return <Outlet />
}

export default function App() {
  return (
    <Routes>
      <Route element={<StripTrailingJunk />}>
        <Route path="/" element={<Home />} />
        {experiments.flatMap((experiment) => {
          const Page = pages[experiment.slug]
          return [
            <Route
              key={experiment.slug}
              path={`/experiments/${experiment.slug}`}
              element={<Page />}
            />,
            <Route key={`${experiment.slug}-short`} path={`/${experiment.slug}`} element={<Page />} />,
          ]
        })}
        <Route path="/experiments/01e-two-counts" element={<TwoCounts />} />
        <Route path="/01e-two-counts" element={<TwoCounts />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
