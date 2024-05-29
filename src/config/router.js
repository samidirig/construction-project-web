import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthLayout from "../layout/AuthLayout";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Personnels from "../pages/Personnels";
import Deliveries from "../pages/Deliveries";
import Profile from "../pages/Profile";
import Projects from '../pages/Projects'
import Register from '../pages/Register'
import Worksites from '../pages/Worksites'
import Documents from "../pages/Documents";
import SuperVisorRegister from "../pages/SuperVisorRegister";
import VisorCompanies from "../pages/VisorCompanies";

export default function Router() {

  return (
    <BrowserRouter>
      <Routes>

        <Route element={<AuthLayout />}>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          {/* <Route exact path="/register" element={<SuperVisorRegister />} /> */}
        </Route>
        
        <Route element={<MainLayout />}>
          <Route exact path="/" element={<Home />} />
          {/* <Route exact path="/visors" element={<VisorCompanies />} /> */}
          <Route exact path="/projects" element={<Projects />} />
          <Route exact path="/worksites" element={<Worksites />} />
          <Route exact path="/personnels" element={<Personnels />} />
          <Route exact path="/deliveries" element={<Deliveries />} />
          <Route exact path="/documents" element={<Documents />} />
          <Route exact path="/profile" element={<Profile />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}