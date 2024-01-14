import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthLayout from "../layout/AuthLayout";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Personnels from "../pages/Personnels";
import Profile from "../pages/Profile";
import Projects from '../pages/Projects'
import Register from '../pages/Register'
import Worksites from '../pages/Worksites'

export default function Router() {

  return (
    <BrowserRouter>
      <Routes>

        <Route element={<AuthLayout />}>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
        </Route>
        
        <Route element={<MainLayout />}>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/personnels" element={<Personnels />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/projects" element={<Projects />} />
          <Route exact path="/worksites" element={<Worksites />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}