import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../config/firebase";

const initialState = {
    name: "",
    surname: "",
    email: "",
    role: "",
    createTime: null,
    isLoading: false,
    error: null,
};

// export const register = createAsyncThunk("auth/register", async ({ name, surname, email, password, companyName, companyEmail, phone }, { rejectWithValue }) => {
//     try {
//         const companyData = {
//             email: companyEmail,
//             name: companyName,
//             managerEmail: email,
//             phone: phone,
//         };

//         const companyCollectionRef = collection(db, "companies");
//         const companyDocRef = await addDoc(companyCollectionRef, companyData);

//         const companyId = companyDocRef.id;

//         const res = await createUserWithEmailAndPassword(auth, email, password);
//         const { user } = res;
//         const signupDate = new Date(user.metadata.creationTime);

//         const userData = {
//             name,
//             surname,
//             id: user.uid,
//             createTime: signupDate,
//             email,
//             role: "companyManager",
//             companyId: companyId,
//         };

//         const userDocRef = doc(db, "users", user.uid);
//         await setDoc(userDocRef, userData);

//         const updatedCompanyData = {
//             ...companyData,
//             id: companyId,
//         };

//         await setDoc(doc(db, "companies", companyId), updatedCompanyData);

//         return null;
//     } catch (e) {
//         return rejectWithValue(e.code);
//     }
// });

export const register = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
    try {
        const { email, password } = userData;
        const { name, surname } = userData;
        const authUser = await createUserWithEmailAndPassword(auth, email, password);
        const signupDate = new Date();
        const { user } = authUser;
        const setUser = {
            email,
            name,
            surname,
            id: user.uid,
            createdTime: signupDate,
            role: 'visor'
        };
        console.log(setUser);
        console.log(user);
        return setUser;
    } catch (e) {
        return rejectWithValue(e.code);
    }
});

export const logIn = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
        return rejectWithValue(e.code);
    }
});

export const logOut = createAsyncThunk("auth/logout", async () => {
    await signOut(auth);
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        changeName: (state, action) => {
            state.name = action.payload;
        },
        changeSurname: (state, action) => {
            state.surname = action.payload;
        },
        changeEmail: (state, action) => {
            state.email = action.payload;
        },
        changePassword: (state, action) => {
            state.password = action.payload;
        },
    }, extraReducers: builder => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = false;
            })
            .addCase(register.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(register.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })
            .addCase(logIn.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logIn.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(logIn.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            });
    },
});

export const { changeName, changeSurname, changeEmail, changePassword } = authSlice.actions;
export default authSlice.reducer;