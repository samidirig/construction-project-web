import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthLayout from "../layout/AuthLayout";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Personnels from "../pages/Personnels";
import Deliveries from "../pages/Deliveries";
import Profile from "../pages/Profile";
import Projects from "../pages/Projects";
import Register from "../pages/Register";
import Worksites from "../pages/Worksites";
import Documents from "../pages/Documents";
import VisorAuthLayout from "../layout/VisorAuthLayout";
import VisorMainLayout from "../layout/VisorMainLayout";
import VisorHome from "../pages/VisorHome";
import VisorLogin from "../pages/VisorLogin";
import VisorRegister from "../pages/VisorRegister";
import VisorProfile from "../pages/VisorProfile";
import PrivateRoute from "./privateRoute";
import ErrorPage from "../pages/ErrorPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route exact path="/" element={<PrivateRoute element={Home} />} />
          <Route exact path="/projects" element={<PrivateRoute element={Projects} />} />
          <Route exact path="/worksites" element={<PrivateRoute element={Worksites} />} />
          <Route exact path="/personnels" element={<PrivateRoute element={Personnels} />} />
          <Route exact path="/deliveries" element={<PrivateRoute element={Deliveries} />} />
          <Route exact path="/documents" element={<PrivateRoute element={Documents} />} />
          <Route exact path="/profile" element={<PrivateRoute element={Profile} />} />
        </Route>

        <Route element={<VisorAuthLayout />}>
          <Route exact path="/visorLogin" element={<VisorLogin />} />
          <Route exact path="/visorRegister" element={<VisorRegister />} />
        </Route>

        <Route element={<VisorMainLayout />}>
          <Route exact path="/visorHome" element={<PrivateRoute isVisorRoute={true} element={VisorHome} />} />
          <Route exact path="/visorProfile" element={<PrivateRoute isVisorRoute={true} element={VisorProfile} />} />
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}
