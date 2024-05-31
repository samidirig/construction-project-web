import { Navigate, Outlet } from "react-router-dom";
import { useVisorIsLoggedIn } from "./hooks";

const PrivateRoute = ({ isVisorRoute, element: Element, ...rest }) => {
  const isVisorLoggedIn = useVisorIsLoggedIn();

  if (isVisorLoggedIn === null) return null; // Veya bir yükleniyor göstergesi

  if (isVisorRoute) {
    return isVisorLoggedIn ? <Element {...rest} /> : <Navigate to="/visorLogin" />;
  } else {
    return isVisorLoggedIn ? <Navigate to="/visorHome" /> : <Element {...rest} />;
  }
};

export default PrivateRoute;