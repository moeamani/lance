import { MotionConfig } from 'motion/react'
import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { preferredLang } from './i18n/locale'
import { LangShell } from './layout/Shell'
import { ToastProvider } from './ui/overlay'

// Each section is its own chunk; routes mirror docs/information-architecture.md.
const Home = lazy(() => import('./pages/Home'))
const pick = <T extends Record<string, unknown>>(p: Promise<T>, k: keyof T) => p.then((m) => ({ default: m[k] as React.ComponentType }))
const Work = lazy(() => pick(import('./pages/Work'), 'Work'))
const JobDetail = lazy(() => pick(import('./pages/Work'), 'JobDetail'))
const Hire = lazy(() => pick(import('./pages/Hire'), 'Hire'))
const PostProject = lazy(() => pick(import('./pages/Hire'), 'PostProject'))
const OfferDetail = lazy(() => pick(import('./pages/Hire'), 'OfferDetail'))
const Agents = lazy(() => pick(import('./pages/Agents'), 'Agents'))
const AgentDetail = lazy(() => pick(import('./pages/Agents'), 'AgentDetail'))
const Learn = lazy(() => pick(import('./pages/Learn'), 'Learn'))
const CourseDetail = lazy(() => pick(import('./pages/Learn'), 'CourseDetail'))
const Teach = lazy(() => pick(import('./pages/Learn'), 'Teach'))
const Showcase = lazy(() => pick(import('./pages/Showcase'), 'Showcase'))
const PieceDetail = lazy(() => pick(import('./pages/Showcase'), 'PieceDetail'))
const Merlin = lazy(() => import('./pages/Merlin'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Plus = lazy(() => pick(import('./pages/Plus'), 'Plus'))
const CvTailor = lazy(() => pick(import('./pages/Plus'), 'CvTailor'))
const Scrum = lazy(() => pick(import('./pages/Plus'), 'Scrum'))
const Start = lazy(() => pick(import('./pages/Start'), 'Start'))
const SignIn = lazy(() => pick(import('./pages/Start'), 'SignIn'))
const Brand = lazy(() => pick(import('./pages/Brand'), 'Brand'))
const Docs = lazy(() => pick(import('./pages/Docs'), 'Docs'))
const NotFound = lazy(() => pick(import('./pages/Docs'), 'NotFound'))

const S = (el: React.ReactNode) => <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>{el}</Suspense>

const router = createBrowserRouter([
  { path: '/', element: <Navigate to={`/${preferredLang()}`} replace /> },
  {
    path: '/:lang',
    element: <LangShell />,
    children: [
      { index: true, element: S(<Home />) },
      { path: 'work', element: S(<Work />) },
      { path: 'work/:id', element: S(<JobDetail />) },
      { path: 'hire', element: S(<Hire />) },
      { path: 'hire/new', element: S(<PostProject />) },
      { path: 'hire/offers/:slug', element: S(<OfferDetail />) },
      { path: 'agents', element: S(<Agents />) },
      { path: 'agents/:slug', element: S(<AgentDetail />) },
      { path: 'merlin', element: S(<Merlin />) },
      { path: 'learn', element: S(<Learn />) },
      { path: 'learn/teach', element: S(<Teach />) },
      { path: 'learn/:slug', element: S(<CourseDetail />) },
      { path: 'showcase', element: S(<Showcase />) },
      { path: 'showcase/:slug', element: S(<PieceDetail />) },
      { path: 'plus', element: S(<Plus />) },
      { path: 'plus/cv', element: S(<CvTailor />) },
      { path: 'plus/scrum', element: S(<Scrum />) },
      { path: 'start', element: S(<Start />) },
      { path: 'sign-in', element: S(<SignIn />) },
      { path: 'dashboard', element: S(<Dashboard />) },
      { path: 'brand', element: S(<Brand />) },
      { path: 'docs', element: S(<Docs />) },
      { path: '*', element: S(<NotFound />) },
    ],
  },
])

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </MotionConfig>
  )
}
