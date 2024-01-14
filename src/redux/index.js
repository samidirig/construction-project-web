import { configureStore } from "@reduxjs/toolkit";
import auth from "./authSlice";

export const store = configureStore({
    reducer: {
        auth,
    },
    //alttaki güvenli değil ama çözüm bulunur.
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false,
    }),
});