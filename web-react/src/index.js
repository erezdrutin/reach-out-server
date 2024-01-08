import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import AnotherPage from './pages/userTablePage';
import Dev from './pages/dev';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    isPrivate: false,
  },
  {
    path: "/mainPage",
    element: <AnotherPage/>,
    isPrivate: true,
  },
  {
    path: "/dev",
    element: <Dev/>,
    isPrivate: true,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
