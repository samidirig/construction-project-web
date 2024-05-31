import { configureStore } from "@reduxjs/toolkit";
import auth from "./authSlice";
// import visorAuth from "./visorAuthSlice";

export const store = configureStore({
    reducer: {
        auth,
        // visorAuth,
    },
    //alttaki güvenli değil ama çözüm bulunur.
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false,
    }),
});