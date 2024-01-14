import { initializeApp } from "firebase/app";
import { EmailAuthProvider, createUserWithEmailAndPassword, deleteUser, getAuth, onAuthStateChanged, reauthenticateWithCredential, sendPasswordResetEmail, updatePassword } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, onSnapshot, addDoc, doc, GeoPoint, getDoc, query, where, getDocs, setDoc, deleteDoc, updateDoc, Timestamp, arrayUnion } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";

const firebaseConfig = {
    apiKey: "AIzaSyCb5vBHVNRNRkU0IiJOypt1T_P_kHwLoeQ",
    authDomain: "g04-bitirme.firebaseapp.com",
    projectId: "g04-bitirme",
    storageBucket: "g04-bitirme.appspot.com",
    messagingSenderId: "133543187377",
    appId: "1:133543187377:web:4736440df9498a93c9a390",
    // measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const secondaryApp = initializeApp(firebaseConfig);
getAnalytics(secondaryApp);
export const auth = getAuth(secondaryApp);
export const db = getFirestore(secondaryApp);
export const storage = getStorage(secondaryApp);
export const timeStamp = Timestamp.fromDate(new Date());

// ////////////////////////////////////////////////////////////////

export const addCompanyWithUser = async (userData, companyData) => {
    try {
        const userId = userData.id;
        const companyCollectionRef = collection(db, "companies");
        const companyDocRef = await addDoc(companyCollectionRef, companyData);
        const companyId = companyDocRef.id;
        const updatedUserData = {
            ...userData,
            companyId: companyId,
        };

        const userDocRef = doc(db, "users", userId);
        await setDoc(userDocRef, updatedUserData);

        const updatedCompanyData = {
            ...companyData,
            id: companyId,
        };

        await setDoc(doc(db, "companies", companyId), updatedCompanyData);

        return userData;
    } catch (error) {
        console.error("Kullanıcı eklenirken bir hata oluştu:", error);
        throw new Error("Kullanıcı eklenirken bir hata oluştu.");
    }
};

export const getAuthUserInformation = async () => {
    try {
        const userId = auth.currentUser;
        console.log(userId.uid);
        if (userId) {
            const userRef = doc(db, 'users', userId.uid);
            const userSnapshot = await getDoc(userRef);
            console.log(userSnapshot.data());
            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                console.log(userData);
                return userData;
            } else {
                console.log('User data does not exist');
                return null;
            }
        } else {
            console.log('User is not authenticated');
            return null;
        }
    } catch (error) {
        console.error('Error getting user information:', error);
        return null;
    }
};

export const getCompanyByManagerId = async () => {
    try {
        const user = auth.currentUser;

        if (user) {
            const managerId = user.uid;

            const companiesRef = collection(db, 'companies');
            const querySnapshot = await getDocs(query(companiesRef, where('managerId', '==', managerId)));

            if (!querySnapshot.empty) {
                const companyDoc = querySnapshot.docs[0];
                const companyData = companyDoc.data();
                console.log('Company Data:', companyData);
                return companyData;
            } else {
                console.log('No company found for the given managerId');
                return null;
            }
        } else {
            console.log('User is not authenticated');
            return null;
        }
    } catch (error) {
        console.error('Error getting company information:', error);
        return null;
    }
};

export const getCompanyIdByAuthUser = async () => {
    try {
        const userId = auth.currentUser;

        if (userId) {
            console.log(userId.uid);
            const userRef = doc(db, 'users', userId.uid);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                return userData.companyId;
            } else {
                console.log('User data does not exist');
                return null;
            }
        } else {
            console.log('User is not authenticated');
            return null;
        }
    } catch (error) {
        console.error('Error getting companyId:', error);
        return null;
    }
};

export const getCompanyProjects = async () => {
    try {
        const companyId = localStorage.getItem("companyId");

        if (companyId) {
            const projectsRef = collection(db, 'projects');
            const querySnapshot = await getDocs(query(projectsRef, where('companyId', '==', companyId)));

            if (!querySnapshot.empty) {
                const projectsDocs = querySnapshot.docs;

                const projectsData = projectsDocs.map((doc) => doc.data());

                console.log('Projects Data:', projectsData);
                return projectsData;
            } else {
                console.log('No projects found for the given companyId');
                return null;
            }
        } else {
            console.log('companyId is not available in localStorage');
            return null;
        }
    } catch (error) {
        console.error('Error getting projects information:', error);
        return null;
    }
};

export const getCompanyWorksites = async () => {
    try {
        const companyId = localStorage.getItem("companyId");

        if (companyId) {
            const worksitesRef = collection(db, 'worksites');
            const querySnapshot = await getDocs(query(worksitesRef, where('companyId', '==', companyId)));

            if (!querySnapshot.empty) {
                const worksitesDocs = querySnapshot.docs;

                const worksitesData = worksitesDocs.map((doc) => doc.data());

                console.log('Worksites Data:', worksitesData);
                return worksitesData;
            } else {
                console.log('No worksites found for the given companyId');
                return null;
            }
        } else {
            console.log('companyId is not available in localStorage');
            return null;
        }
    } catch (error) {
        console.error('Error getting worksites information:', error);
        return null;
    }
};

export const getCompanyNameById = async () => {
    try {
        const companyId = localStorage.getItem('companyId');

        if (companyId) {
            const companyDoc = await getDoc(doc(db, 'companies', companyId));

            if (companyDoc.exists()) {
                const companyName = companyDoc.data().name;
                console.log('Company Name:', companyName);
                return companyName;
            } else {
                console.log('Şirket bulunamadı.');
                return null;
            }
        } else {
            console.log('companyId localStorage\'da bulunamadı.');
            return null;
        }
    } catch (error) {
        console.error('Şirket adı alınırken bir hata oluştu:', error);
        return null;
    }
};

export const getUserInformationById = async (userId) => {
    try {
        if (userId) {
            const userRef = doc(db, 'users', userId);
            const userSnapshot = await getDoc(userRef);
            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                return userData;
            } else {
                console.log('User data does not exist');
                return null;
            }
        } else {
            console.log('User is not authenticated');
            return null;
        }
    } catch (error) {
        console.error('Error getting user information:', error);
        return null;
    }
};

export const checkUserByEmail = async (email) => {
    try {
        const q = query(collection(db, 'users'), where('email', '==', email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) return true;
        else return false;
    } catch (error) {
        console.error('Kullanıcı sorgulanırken bir hata oluştu:', error);
        return false;
    }
};

export const checkCompanyByUserEmail = async (email) => {
    try {
        const q = query(collection(db, 'companies'), where('managerEmail', '==', email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) return true;
        else return false;

    } catch (error) {
        console.error('Kullanıcı sorgulanırken bir hata oluştu:', error);
        return false;
    }
};

export const getUserRoleByEmail = async (email) => {
    try {
        const q = query(collection(db, 'users'), where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDocSnapshot = querySnapshot.docs[0];
            const userRole = userDocSnapshot.data().role;
            if (userRole) {
                console.log('Kullanıcı role:', userRole);
                return userRole === 'companyManager' || userRole === "devManager";
            }
        }

        console.log('Kullanıcı bulunamadı veya rol bilgisi eksik.');
        return false;
    } catch (error) {
        console.error('Kullanıcı rolü sorgulanırken bir hata oluştu:', error);
        return false;
    }
};

export const sendPasswordResetEmailToUser = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log('Parola sıfırlama maili gönderildi.');
    } catch (error) {
        console.error('Parola sıfırlama maili gönderirken hata oluştu:', error);
        throw new Error('Parola sıfırlama maili gönderirken bir hata oluştu.');
    }
};