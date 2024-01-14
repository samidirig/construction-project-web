import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
//import { auth } from "./firebase";
import { auth } from "./firebase";

export const useCurrentUser = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
    }, []);

    return user;
};

export const useIsLoggedIn = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user);
        });
    }, []);

    return isLoggedIn;
};

export const useIsSignedIn = () => {
    const [isSignedIn, setIsSignedIn] = useState(null);
    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            setIsSignedIn(!!user);
        });
    }, []);

    return isSignedIn;
};

export const useWindowSizeWidth = () => {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)
    useEffect(() => {
      const handleResize = () => {
        setScreenWidth(window.innerWidth);
      };
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [screenWidth]);
    return screenWidth;
  }