import { createBrowserRouter } from 'react-router-dom'
import Inbox from '../pages/Inbox'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Inbox />,
  },
])
