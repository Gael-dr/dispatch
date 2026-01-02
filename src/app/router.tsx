import Dashboard from '@/pages/Dashboard'
import Decisions from '@/pages/Decisions'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/decisions',
    element: <Decisions />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/login',
    element: <Login />,
  },
])
