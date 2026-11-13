import { MotionConfig } from 'motion/react'
import { lazy } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { AppShell, PlainShell } from './components/layout/Shells'
import { ToastProvider } from './components/ui'
import { AppStoreProvider } from './store/AppStore'

// Route-level code splitting: each screen is its own chunk.
const Landing = lazy(() => import('./screens/public/Landing'))
const BlogList = lazy(() => import('./screens/public/Blog').then((m) => ({ default: m.BlogList })))
const BlogPost = lazy(() => import('./screens/public/Blog').then((m) => ({ default: m.BlogPost })))
const ChoosePath = lazy(() => import('./screens/auth/Auth').then((m) => ({ default: m.ChoosePath })))
const CreatePassword = lazy(() => import('./screens/auth/Auth').then((m) => ({ default: m.CreatePassword })))
const Login = lazy(() => import('./screens/auth/Auth').then((m) => ({ default: m.Login })))
const LoginPassword = lazy(() => import('./screens/auth/Auth').then((m) => ({ default: m.LoginPassword })))
const SignUp = lazy(() => import('./screens/auth/Auth').then((m) => ({ default: m.SignUp })))
const Welcome = lazy(() => import('./screens/auth/Auth').then((m) => ({ default: m.Welcome })))
const VerifyIdentity = lazy(() => import('./screens/verify/VerifyIdentity').then((m) => ({ default: m.VerifyIdentity })))
const CreateProject = lazy(() => import('./screens/projects/CreateProject').then((m) => ({ default: m.CreateProject })))
const ProjectCreated = lazy(() => import('./screens/projects/CreateProject').then((m) => ({ default: m.ProjectCreated })))
const Dashboard = lazy(() => import('./screens/app/Dashboard').then((m) => ({ default: m.Dashboard })))
const Discover = lazy(() => import('./screens/app/Discover').then((m) => ({ default: m.Discover })))
const ProjectDetail = lazy(() => import('./screens/app/ProjectDetail').then((m) => ({ default: m.ProjectDetail })))
const Notifications = lazy(() => import('./screens/app/Notifications').then((m) => ({ default: m.Notifications })))
const LancePlus = lazy(() => import('./screens/app/LancePlus').then((m) => ({ default: m.LancePlus })))
const MyProjects = lazy(() => import('./screens/workspace/Workspace').then((m) => ({ default: m.MyProjects })))
const Workspace = lazy(() => import('./screens/workspace/Workspace').then((m) => ({ default: m.Workspace })))
const FreelancerRequests = lazy(() => import('./screens/workspace/Requests').then((m) => ({ default: m.FreelancerRequests })))
const PaymentResult = lazy(() => import('./screens/workspace/Wallet').then((m) => ({ default: m.PaymentResult })))
const Wallet = lazy(() => import('./screens/workspace/Wallet').then((m) => ({ default: m.Wallet })))
const Templates = lazy(() => import('./screens/workspace/Templates').then((m) => ({ default: m.Templates })))
const Chat = lazy(() => import('./screens/messages/Messages').then((m) => ({ default: m.Chat })))
const Messages = lazy(() => import('./screens/messages/Messages').then((m) => ({ default: m.Messages })))
const LancerProfile = lazy(() => import('./screens/profile/Profile').then((m) => ({ default: m.LancerProfile })))
const MyProfile = lazy(() => import('./screens/profile/Profile').then((m) => ({ default: m.MyProfile })))
const AddSkill = lazy(() => import('./screens/profile/AddSkill').then((m) => ({ default: m.AddSkill })))
const EditProfile = lazy(() => import('./screens/profile/EditProfile').then((m) => ({ default: m.EditProfile })))
const About = lazy(() => import('./screens/settings/Settings').then((m) => ({ default: m.About })))
const PersonalInfo = lazy(() => import('./screens/settings/Settings').then((m) => ({ default: m.PersonalInfo })))
const Policy = lazy(() => import('./screens/settings/Settings').then((m) => ({ default: m.Policy })))
const Settings = lazy(() => import('./screens/settings/Settings').then((m) => ({ default: m.Settings })))
const DesignSystem = lazy(() => import('./screens/DesignSystem').then((m) => ({ default: m.DesignSystem })))
const NotFound = lazy(() => import('./screens/NotFound').then((m) => ({ default: m.NotFound })))

const router = createBrowserRouter([
  {
    element: <PlainShell />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/services/:slug', element: <Landing /> },
      { path: '/blog', element: <BlogList /> },
      { path: '/blog/:id', element: <BlogPost /> },
      { path: '/auth', element: <Navigate to="/auth/login" replace /> },
      { path: '/auth/signup', element: <SignUp /> },
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/login/password', element: <LoginPassword /> },
      { path: '/auth/password', element: <CreatePassword /> },
      { path: '/auth/role', element: <ChoosePath /> },
      { path: '/auth/welcome', element: <Welcome /> },
      { path: '/verify', element: <VerifyIdentity /> },
      { path: '/projects/new', element: <CreateProject /> },
      { path: '/projects/new/done', element: <ProjectCreated /> },
      { path: '/app/payment/:status', element: <PaymentResult /> },
      { path: '/design-system', element: <DesignSystem /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/app',
    element: <AppShell />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'discover', element: <Discover /> },
      { path: 'discover/:id', element: <ProjectDetail /> },
      { path: 'lancer/:id', element: <LancerProfile /> },
      { path: 'notifications', element: <Notifications /> },
      { path: 'plus', element: <LancePlus /> },
      { path: 'projects', element: <MyProjects /> },
      { path: 'projects/:id', element: <Workspace /> },
      { path: 'projects/:id/requests', element: <FreelancerRequests /> },
      { path: 'templates', element: <Templates /> },
      { path: 'wallet', element: <Wallet /> },
      { path: 'messages', element: <Messages /> },
      { path: 'messages/:id', element: <Chat /> },
      { path: 'profile', element: <MyProfile /> },
      { path: 'profile/edit', element: <EditProfile /> },
      { path: 'profile/skills', element: <AddSkill /> },
      { path: 'settings', element: <Settings /> },
      { path: 'settings/personal', element: <PersonalInfo /> },
      { path: 'settings/policy', element: <Policy /> },
      { path: 'settings/about', element: <About /> },
    ],
  },
])

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AppStoreProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AppStoreProvider>
    </MotionConfig>
  )
}
