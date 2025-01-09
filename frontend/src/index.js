import "./index.css"
import {StrictMode} from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import QuizList from './QuizList';
import Quiz from './Quiz';
import { Navbar, NavbarAuth } from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login'
import Register from './pages/Register'
import DashBoard from "./pages/DashBoard";
import PrivateRoute from "./utils/PrivateRoute"

import CreateQuiz from "./pages/CreateQuiz";

const router = createBrowserRouter([
  {
    path: "/",
    element: 
      <div>
        <AuthProvider>
          <Navbar/><Outlet/><Footer/>
        </AuthProvider>
      </div>,
    children: [
      {
        path: "/",
        element: <QuizList />
      },
      {
        path: "/create-new-quizz",
        element: <PrivateRoute><CreateQuiz/></PrivateRoute>
      },
      {
        path: "/quiz/:quizId",
        element: <Quiz />
      },
      {
        path: "/:username",
        element: <PrivateRoute><DashBoard /></PrivateRoute>
      },
    ],
  },
  {
    path: "/auth",
    element:
      <div>
        <AuthProvider>
        <NavbarAuth />
        <div className="background">
          <Outlet/>
        </div>
        <Footer/>
        </AuthProvider>
      </div>,
    children: [
      {
        path: "/auth/login",
        element: <Login />
      },
      {
        path: "/auth/register",
        element: <Register/>
      }
    ]
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
