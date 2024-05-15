import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  Timestamp,
  arrayUnion,
  GeoPoint,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

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

export const createNewDelivery = async (deliveryData) => {
  try {
    const deliveriesRef = collection(db, "deliveries");
    const deliveryDocRef = await addDoc(deliveriesRef, deliveryData);

    const deliveryId = deliveryDocRef.id;
    const updatedDeliveryData = {
      ...deliveryData,
      id: deliveryId,
    };

    await setDoc(doc(db, "deliveries", deliveryId), updatedDeliveryData);
  } catch (error) {
    console.error("Error while creating new delivery:", error);
    if (error.code) {
      console.error("Error code:", error.code);
    }
  }
};

export const createNewVehicle = async (vehicleData) => {
  try {
    const vehiclesRef = collection(db, "vehicles");
    const vehicleDocRef = await addDoc(vehiclesRef, vehicleData);

    const vehicleId = vehicleDocRef.id;
    const updatedVehicleData = {
      ...vehicleData,
      id: vehicleId,
    };

    await setDoc(doc(db, "vehicles", vehicleId), updatedVehicleData);
  } catch (error) {
    console.error("Error while creating new vehicle:", error);
    if (error.code) {
      console.error("Error code:", error.code);
    }
  }
};

export const createNewSupplier = async (supplierData) => {
  try {
    const suppliersRef = collection(db, "suppliers");
    const supplierDocRef = await addDoc(suppliersRef, supplierData);

    const supplierId = supplierDocRef.id;
    const updatedSupplierData = {
      ...supplierData,
      id: supplierId,
    };

    await setDoc(doc(db, "suppliers", supplierId), updatedSupplierData);
  } catch (error) {
    console.error("Error while creating new supplier:", error);
    if (error.code) {
      console.error("Error code:", error.code);
    }
  }
};

export const createNewProject = async (projectData) => {
  try {
    const projectsRef = collection(db, "projects");
    const projectDocRef = await addDoc(projectsRef, projectData);

    const projectId = projectDocRef.id;
    const updatedProjectData = {
      ...projectData,
      id: projectId,
    };

    await setDoc(doc(db, "projects", projectId), updatedProjectData);
  } catch (error) {
    console.error("Error while creating new project:", error);
    if (error.code) {
      console.error("Error code:", error.code);
    }
  }
};

export const createNewWorksite = async (worksiteData) => {
  try {
    const worksitesRef = collection(db, "worksites");
    const worksiteDocRef = await addDoc(worksitesRef, worksiteData);

    const worksiteId = worksiteDocRef.id;
    const updatedWorksiteData = {
      ...worksiteData,
      id: worksiteId,
    };

    await setDoc(doc(db, "worksites", worksiteId), updatedWorksiteData);
  } catch (error) {
    console.error("Error while creating new worksite:", error);
    if (error.code) {
      console.error("Error code:", error.code);
    }
  }
};

export function createGeoPoint(latitude, longitude) {
  return new GeoPoint(latitude, longitude);
}

export const getAuthUserInformation = async () => {
  try {
    const userId = auth.currentUser;
    console.log(userId.uid);
    if (userId) {
      const userRef = doc(db, "users", userId.uid);
      const userSnapshot = await getDoc(userRef);
      console.log(userSnapshot.data());
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        console.log(userData);
        return userData;
      } else {
        console.log("User data does not exist");
        return null;
      }
    } else {
      console.log("User is not authenticated");
      return null;
    }
  } catch (error) {
    console.error("Error getting user information:", error);
    return null;
  }
};

export const getCompanyByManagerId = async () => {
  try {
    const user = auth.currentUser;

    if (user) {
      const managerId = user.uid;

      const companiesRef = collection(db, "companies");
      const querySnapshot = await getDocs(
        query(companiesRef, where("managerId", "==", managerId))
      );

      if (!querySnapshot.empty) {
        const companyDoc = querySnapshot.docs[0];
        const companyData = companyDoc.data();
        return companyData;
      } else {
        console.log("No company found for the given managerId");
        return null;
      }
    } else {
      console.log("User is not authenticated");
      return null;
    }
  } catch (error) {
    console.error("Error getting company information:", error);
    return null;
  }
};

export const getCompanyIdByAuthUser = async () => {
  try {
    const userId = auth.currentUser;

    if (userId) {
      const userRef = doc(db, "users", userId.uid);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        console.log(userData.companyId);
        return userData.companyId;
      } else {
        console.log("User data does not exist");
        return null;
      }
    } else {
      console.log("User is not authenticated");
      return null;
    }
  } catch (error) {
    console.error("Error getting companyId:", error);
    return null;
  }
};

export const getCompanyProjects = async () => {
  try {
    const company = await getCompanyByManagerId();
    const companyId = company.id;

    if (companyId) {
      const projectsRef = collection(db, "projects");
      const querySnapshot = await getDocs(
        query(projectsRef, where("companyId", "==", companyId))
      );

      if (!querySnapshot.empty) {
        const projectsDocs = querySnapshot.docs;

        const projectsData = projectsDocs.map((doc) => doc.data());

        console.log("Projects Data:", projectsData);
        return projectsData;
      } else {
        console.log("No projects found for the given companyId");
        return null;
      }
    } else {
      console.log("companyId is not available in localStorage");
      return null;
    }
  } catch (error) {
    console.error("Error getting projects information:", error);
    return null;
  }
};

export const getCompanyWorksites = async () => {
  try {
    const company = await getCompanyByManagerId();
    const companyId = company.id;

    if (companyId) {
      const worksitesRef = collection(db, "worksites");
      const querySnapshot = await getDocs(
        query(worksitesRef, where("companyId", "==", companyId))
      );

      if (!querySnapshot.empty) {
        const worksitesDocs = querySnapshot.docs;

        const worksitesData = worksitesDocs.map((doc) => doc.data());

        console.log("Worksites Data:", worksitesData);
        return worksitesData;
      } else {
        console.log("No worksites found for the given companyId");
        return null;
      }
    } else {
      console.log("companyId is not available in localStorage");
      return null;
    }
  } catch (error) {
    console.error("Error getting worksites information:", error);
    return null;
  }
};

export const getCompanyPersonnels = async () => {
  try {
    const company = await getCompanyByManagerId();
    const companyId = company.id;
    // const personnelsIds = company.personnels || [];

    if (companyId) {
      // Bu companyId'li dökümanda personnels array field'ındaki id'leri alıp.
      const personnelsIds = company.personnels || [];

      // companyId'ye ve personnelsIds'ye göre kullanıcıları filtrele
      const usersQuery = query(
        collection(db, "users"),
        where("companyId", "==", companyId),
        where("role", "==", "personnel"),
        where("id", "in", personnelsIds)
      );

      const querySnapshot = await getDocs(usersQuery);

      // Kullanıcı bilgilerini al
      const personnels = querySnapshot.docs.map((doc) => doc.data());

      return personnels;
    } else {
      console.log("companyId is not found");
      return null;
    }
  } catch (error) {
    console.error("Error getting personnels information:", error);
    return null;
  }
};

export const getCompanyFreeDrivers = async () => {
  try {
    const company = await getCompanyByManagerId();
    const companyId = company.id;
    // const personnelsIds = company.personnels || [];

    if (companyId) {
      const personnelsIds = company.personnels || [];

      const usersQuery = query(
        collection(db, "users"),
        where("companyId", "==", companyId),
        where("role", "==", "driver"),
        where("id", "in", personnelsIds)
      );

      const querySnapshot = await getDocs(usersQuery);

      const drivers = querySnapshot.docs
        .map((doc) => doc.data())
        .filter((driver) => !driver.vehicleId); // Filter drivers with empty vehicleId

      return drivers;
    } else {
      console.log("companyId is not found");
      return null;
    }
  } catch (error) {
    console.error("Error getting drivers information:", error);
    return null;
  }
};

export const getCompanyDeliveries = async () => {
  try {
    const company = await getCompanyByManagerId();
    const companyId = company.id;
    // const personnelsIds = company.personnels || [];

    if (companyId) {
      // companyId'ye ve personnelsIds'ye göre kullanıcıları filtrele
      const deliveryQuery = query(
        collection(db, "deliveries"),
        where("receiverId", "==", companyId)
      );

      const querySnapshot = await getDocs(deliveryQuery);

      // Kullanıcı bilgilerini al
      const deliveries = querySnapshot.docs.map((doc) => doc.data());

      // location get
      ///////////////////////
      console.log(deliveries);
      return deliveries;
    } else {
      console.log("companyId is not found");
      return null;
    }
  } catch (error) {
    console.error("Error getting personnels information:", error);
    return null;
  }
};

export const getSupplierCompanies = async () => {
  try {
    const companyId = await getCompanyIdByAuthUser();

    if (companyId) {
      const supplierRef = collection(db, "suppliers");

      const supplierSnapshot = await getDocs(
        query(supplierRef, where("receiverId", "==", companyId))
      );
      if (!supplierSnapshot.empty) {
        const supplierData = supplierSnapshot.docs.map((doc) => doc.data());
        return supplierData;
      } else {
        console.log("No supplier found for the given companyId");
        return [];
      }
    }
  } catch (error) {
    console.error("Supplier bilgilerini alırken hata oluştu:", error);
    return [];
  }
};

export const getSupplierVehicles = async (selectedSupplierId) => {
  try {
    console.log(selectedSupplierId);
    if (selectedSupplierId) {
      const vehiclesRef = collection(db, "vehicles");
      const vehiclesSnapshot = await getDocs(
        query(vehiclesRef, where("supplierId", "==", selectedSupplierId))
      );
      if (!vehiclesSnapshot.empty) {
        const vehiclesData = vehiclesSnapshot.docs.map((doc) => doc.data());
        return vehiclesData;
      } else {
        console.log("No vehicles found for the given supplierId");
        return null;
      }
    }
  } catch (error) {
    console.error("Supplier araçlarını alırken hata oluştu:", error);
    return null;
  }
};

export const getCompanyWaitingPersonnels = async () => {
  try {
    const company = await getCompanyByManagerId();
    const companyId = company.id;

    if (companyId) {
      // companyId ve isConfirmedCompany değerine göre kullanıcıları filtrele
      const usersQuery = query(
        collection(db, "users"),
        where("companyId", "==", companyId),
        where("role", "==", "personnel"),
        where("isConfirmedCompany", "==", false)
      );

      const querySnapshot = await getDocs(usersQuery);

      // Kullanıcı bilgilerini al
      const personnels = querySnapshot.docs.map((doc) => doc.data());

      return personnels;
    } else {
      console.log("companyId is not found");
      return null;
    }
  } catch (error) {
    console.error("Error getting personnels information:", error);
    return null;
  }
};

export const getCompanyNameById = async () => {
  try {
    const companyId = localStorage.getItem("companyId");

    if (companyId) {
      const companyDoc = await getDoc(doc(db, "companies", companyId));

      if (companyDoc.exists()) {
        const companyName = companyDoc.data().name;
        console.log("Company Name:", companyName);
        return companyName;
      } else {
        console.log("Şirket bulunamadı.");
        return null;
      }
    } else {
      console.log("companyId localStorage'da bulunamadı.");
      return null;
    }
  } catch (error) {
    console.error("Şirket adı alınırken bir hata oluştu:", error);
    return null;
  }
};

export const getUserInformationById = async (userId) => {
  try {
    if (userId) {
      const userRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        return userData;
      } else {
        console.log("User data does not exist");
        return null;
      }
    } else {
      console.log("User is not authenticated");
      return null;
    }
  } catch (error) {
    console.error("Error getting user information:", error);
    return null;
  }
};

export const checkUserByEmail = async (email) => {
  try {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) return true;
    else return false;
  } catch (error) {
    console.error("Kullanıcı sorgulanırken bir hata oluştu:", error);
    return false;
  }
};

export const checkCompanyByUserEmail = async (email) => {
  try {
    const q = query(
      collection(db, "companies"),
      where("managerEmail", "==", email)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) return true;
    else return false;
  } catch (error) {
    console.error("Kullanıcı sorgulanırken bir hata oluştu:", error);
    return false;
  }
};

export const getUserRoleByEmail = async (email) => {
  try {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDocSnapshot = querySnapshot.docs[0];
      const userRole = userDocSnapshot.data().role;
      if (userRole) {
        console.log("Kullanıcı role:", userRole);
        return userRole === "companyManager" || userRole === "devManager";
      }
    }

    console.log("Kullanıcı bulunamadı veya rol bilgisi eksik.");
    return false;
  } catch (error) {
    console.error("Kullanıcı rolü sorgulanırken bir hata oluştu:", error);
    return false;
  }
};

export const setPersonnelStatuConfirm = async (personnelId) => {
  console.log(personnelId);
  const company = await getCompanyByManagerId();
  const companyId = company.id;
  try {
    const userDocRef = doc(db, "users", personnelId);
    await updateDoc(userDocRef, {
      isConfirmedCompany: true,
    });

    const companyDocRef = doc(db, "companies", companyId);
    await updateDoc(companyDocRef, {
      personnels: arrayUnion(personnelId),
    });

    return true;
  } catch (error) {
    console.error("Kullanıcı rolü sorgulanırken bir hata oluştu:", error);
    return false;
  }
};

export const sendPasswordResetEmailToUser = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Parola sıfırlama maili gönderildi.");
  } catch (error) {
    console.error("Parola sıfırlama maili gönderirken hata oluştu:", error);
    throw new Error("Parola sıfırlama maili gönderirken bir hata oluştu.");
  }
};

export const updateUserInformation = async (name, surname, phone) => {
  try {
    const userId = auth.currentUser;
    const userRef = doc(db, "users", userId.uid);
    await updateDoc(userRef, {
      name,
      surname,
      phone,
    });
    console.log("User information updated successfully.");
  } catch (error) {
    console.error("Error updating university information:", error);
    throw error;
  }
};

export const updateCompanyInformation = async (
  companyId,
  name,
  email,
  phone
) => {
  try {
    const companyRef = doc(db, "companies", companyId);
    await updateDoc(companyRef, {
      name,
      email,
      phone,
    });
    console.log("Company information updated successfully.");
  } catch (error) {
    console.error("Error updating university information:", error);
    throw error;
  }
};
