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
  onSnapshot,
  arrayRemove,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  getStorage,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { teamsCardContent } from "../style/utils";

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

export function createGeoPoint(latitude, longitude) {
  return new GeoPoint(latitude, longitude);
}

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

export const getGivenUsersInformationByIds = async (userIds) => {
  try {
    if (userIds && userIds.length > 0) {
      const userInformations = [];
      for (const userId of userIds) {
        if (userId) {
          const userRef = doc(db, "users", userId);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const user = {
              userEmail: userData.email,
              userName: userData.name,
              userSurname: userData.surname,
              userId: userData.id,
              userRole: userData.role,
              userImage: userData.profileImg,
            };
            userInformations.push(user);
          } else {
            console.log("User data not found for userId:", userId);
          }
        }
      }

      return userInformations;
    } else {
      console.log("UserIds not filled");
      return [];
    }
  } catch (error) {
    console.error("Error getting users information:", error);
    return [];
  }
};


// export const getGivenWorksiteIdsInformationByIds = async (worksiteIds) => {
//   try {
//     if (worksiteIds && worksiteIds.length > 0) {
//       const worksiteInformations = [];
//       for (const worksiteId of worksiteIds) {
//         if (worksiteId) {
//           const worksiteRef = doc(db, "worksites", worksiteId);
//           const worksiteDoc = await getDoc(worksiteRef);
//           if (worksiteDoc.exists()) {
//             const worksiteData = worksiteDoc.data();
//             const worksite = {
//               worksiteEmail: worksiteData.email,
//               worksiteName: worksiteData.name,
//               worksiteSurname: worksiteData.surname,
//               worksiteId: worksiteData.id,
//               worksiteRole: worksiteData.role,
//               worksiteImage: worksiteData.profileImg,
//             };
//             worksiteInformations.push(worksite);
//           } else {
//             console.log("User data not found for worksiteId:", worksiteId);
//           }
//         }
//       }

//       return worksiteInformations;
//     } else {
//       console.log("worksiteIds not filled");
//       return [];
//     }
//   } catch (error) {
//     console.error("Error getting worksites information:", error);
//     return [];
//   }
// };

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

// export const updatePhotoInformation = async (companyId, userId, projectId, worksiteId, selectedFile) => {
//   try {
//     const userId = auth.currentUser;
//     const userRef = doc(db, "users", userId.uid);
//     const fileURL = await uploadFileToFirebaseStorage(selectedFile, filePath);
//     await updateDoc(userRef, {
//       profileImage: fileURL,
//     });

//   } catch (error) {
//     console.error("Error updating university information:", error);
//     throw error;
//   }
// };

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

// documents
export const createNewDocument = async (documentData) => {
  try {
    const documentsRef = collection(db, "documents");
    const documentDocRef = await addDoc(documentsRef, documentData);

    const documentId = documentDocRef.id;
    const updatedDocumentData = {
      ...documentData,
      id: documentId,
    };

    await setDoc(doc(db, "documents", documentId), updatedDocumentData);
  } catch (error) {
    console.error("Error while creating new document:", error);
    if (error.code) {
      console.error("Error code:", error.code);
    }
  }
};

export const uploadFileToFirebaseStorage = async (file, filePath) => {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, filePath);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file to Firebase Storage:", error);
    throw error;
  }
};

export const getDocumentType = async (documentTypeName) => {
  try {
    const q = query(
      collection(db, "documentTypes"),
      where("name", "==", documentTypeName)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const typeDocSnapshot = querySnapshot.docs[0];
      const documentType = typeDocSnapshot.id;
      if (documentType) {
        console.log(documentTypeName + ": " + documentType);
        return documentType;
      }
    }
    console.log("DocumentType bulunamadı veya rol bilgisi eksik.");
    return null;
  } catch (error) {
    console.error("DocumentType sorgulanırken bir hata oluştu:", error);
    return null;
  }
};

export const getCompanyAllDocuments = async (callback) => {
  try {
    const company = await getCompanyByManagerId();
    const companyId = company.id;
    const companyName = company.name;

    if (companyId) {
      const documentsRef = collection(db, "documents");
      const q = query(documentsRef, where("companyId", "==", companyId));

      onSnapshot(q, async (querySnapshot) => {
        if (!querySnapshot.empty) {
          const documentsDocs = querySnapshot.docs;

          const documentsData = await Promise.all(
            documentsDocs.map(async (doc) => {
              const docData = doc.data();
              let worksiteData = null;
              let projectData = null;
              let userData = null;

              if (docData.projectId && !docData.worksiteId && !docData.userId) {
                projectData = await getProjectInformationById(
                  docData.projectId
                );
              } else if (
                docData.worksiteId &&
                !docData.projectId &&
                !docData.userId
              ) {
                worksiteData = await getWorksiteInformationById(
                  docData.worksiteId
                );
              } else if (
                docData.userId &&
                !docData.projectId &&
                !docData.worksiteId
              ) {
                userData = await getUserInformationById(docData.userId);
              }

              const newDocumentsData = {
                companyData: {
                  companyId: companyId,
                  companyName: companyName,
                },
                worksiteData: worksiteData
                  ? {
                      worksiteId: worksiteData.id,
                      worksiteCity: worksiteData.city,
                      worksiteDistrict: worksiteData.district,
                      worksiteNeighborhood: worksiteData.neighborhood,
                      worksiteName: worksiteData.name,
                      worksiteStartDate: worksiteData.startDate,
                      worksiteFinishDate: worksiteData.finishDate,
                    }
                  : null,
                projectData: projectData
                  ? {
                      projectId: projectData.id,
                      projectCity: projectData.city,
                      projectName: projectData.name,
                      projectStartDate: projectData.startDate,
                      projectFinishDate: projectData.finishDate,
                    }
                  : null,
                userData: userData
                  ? {
                      userId: userData.id,
                      userName: userData.name,
                      userSurname: userData.surname,
                      userImage: userData.profileImg,
                    }
                  : null,
                documentData: {
                  ...docData,
                },
              };

              return newDocumentsData;
            })
          );

          console.log("documents Data:", documentsData);
          callback(documentsData);
        } else {
          console.log("No documents found for the given companyId");
          callback([]);
        }
      });
    } else {
      console.log("companyId is not available in localStorage");
      callback([]);
    }
  } catch (error) {
    console.error("Error getting documents information:", error);
    callback([]);
  }
};

export const getCompanyTypeDocuments = async (documentTypeName) => {
  try {
    const company = await getCompanyByManagerId();
    const companyId = company.id;

    const documentTypeId = await getDocumentType(documentTypeName);

    if (companyId && documentTypeId) {
      const documentsRef = collection(db, "documents");
      const querySnapshot = await getDocs(
        query(
          documentsRef,
          where("companyId", "==", companyId),
          where("documentType", "==", documentTypeId)
        )
      );

      if (!querySnapshot.empty) {
        const documentsDocs = querySnapshot.docs;

        const documentsData = documentsDocs.map((doc) => doc.data());

        console.log("documents Data:", documentsData);
        return documentsData;
      } else {
        console.log(
          "No documents found for the given companyId and documentType"
        );
        return null;
      }
    } else {
      console.log("Invalid companyId or documentTypeId.");
      return null;
    }
  } catch (error) {
    console.error("Error getting documents information:", error);
    return null;
  }
};

// worksite
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

    const projectDocRef = doc(db, "projects", worksiteData.projectId);
    await updateDoc(projectDocRef, {
      worksites: arrayUnion(worksiteId),
    });
  } catch (error) {
    console.error("Error while creating new worksite:", error);
    if (error.code) {
      console.error("Error code:", error.code);
    }
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

export const getWorksiteNameById = async (worksiteId) => {
  try {
    if (worksiteId) {
      const worksiteRef = doc(db, "worksites", worksiteId);
      const worksiteSnapshot = await getDoc(worksiteRef);
      if (worksiteSnapshot.exists()) {
        const worksiteData = worksiteSnapshot.data();
        return worksiteData.name;
      } else {
        console.log("worksite data does not exist");
        return null;
      }
    } else {
      console.log("worksite is not authenticated");
      return null;
    }
  } catch (error) {
    console.error("Error getting worksite information:", error);
    return null;
  }
};

export const getWorksiteInformationById = async (worksiteId) => {
  try {
    if (worksiteId) {
      const worksiteRef = doc(db, "worksites", worksiteId);
      const worksiteSnapshot = await getDoc(worksiteRef);
      if (worksiteSnapshot.exists()) {
        const worksiteData = worksiteSnapshot.data();
        return worksiteData;
      } else {
        console.log("worksite data does not exist");
        return null;
      }
    } else {
      console.log("worksite is not authenticated");
      return null;
    }
  } catch (error) {
    console.error("Error getting worksite information:", error);
    return null;
  }
};

export const getWorksiteTeams = async (worksiteId) => {
  try {
    if (worksiteId) {
      const teamsRef = collection(db, "teams");
      const querySnapshot = await getDocs(
        query(teamsRef, where("worksiteId", "==", worksiteId))
      );

      if (!querySnapshot.empty) {
        const teamsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          personnels: doc.data().personnels,
          name: doc.data().teamName,
          worksiteId: doc.data().worksiteId,
        }));

        console.log("teams Data:", teamsData);
        return teamsData;
      } else {
        console.log("No teams found for the given worksiteId");
        return [];
      }
    } else {
      console.log("worksiteId is not available in localStorage");
      return [];
    }
  } catch (error) {
    console.error("Error getting teams information:", error);
    return [];
  }
};

export const getWorksiteShifts = async (worksiteId) => {
  try {
    if (worksiteId) {
      const shiftsRef = collection(db, "shifts");

      const shiftsSnapshot = await getDocs(
        query(shiftsRef, where("worksiteId", "==", worksiteId))
      );
      if (!shiftsSnapshot.empty) {
        const shiftsData = [];

        for (const shiftDoc of shiftsSnapshot.docs) {
          const shift = shiftDoc.data();
          const userId = shift.userId;
          if (userId) {
            const userRef = doc(db, "users", userId);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              shift.userName = userData.name;
              shift.userSurname = userData.surname;
              shiftsData.push(shift);
            } else {
              console.log("User data not found for userId:", userId);
            }
          }
        }

        return shiftsData;
      } else {
        console.log("No shift found for the given companyId");
        return [];
      }
    }
  } catch (error) {
    console.error("İzin bilgilerini alırken hata oluştu:", error);
    return [];
  }
};

export const createNewShift = async (shiftData) => {
  try {
    const shiftPersonnels = shiftData.selectedUsers;

    for (const user of shiftPersonnels) {
      const newShiftData = {
        createdTime: shiftData.createdTime,
        finishTime: shiftData.finishTime,
        isFinished: shiftData.isFinished,
        startTime: shiftData.startTime,
        userFinishTime: shiftData.userFinishTime,
        userId: user,
        worksiteId: shiftData.worksiteId,
      };
      const shiftsRef = collection(db, "shifts");
      const shiftsDocRef = await addDoc(shiftsRef, newShiftData);
      const shiftId = shiftsDocRef.id;
      const updatedShiftsData = {
        ...newShiftData,
        id: shiftId,
      };
      await setDoc(doc(db, "shifts", shiftId), updatedShiftsData);
    }
  } catch (error) {
    console.error("Error while creating new shift:", error);
    if (error.code) {
      console.error("Error code:", error.code);
    }
  }
};

export const deleteWorksitePersonnel = async (personnelId, worksiteId) => {
  try {
    if (personnelId && worksiteId) {
      const worksiteDocRef = doc(db, "worksites", worksiteId);
      const worksiteSnapshot = await getDoc(worksiteDocRef);

      if (worksiteSnapshot.exists()) {
        const worksiteData = worksiteSnapshot.data();
        const personnels = worksiteData.personnels;
        const updatedPersonnels = personnels.filter((id) => id !== personnelId);
        await updateDoc(worksiteDocRef, { personnels: updatedPersonnels });
      }
    }
  } catch (error) {
    console.error("Error while deleting personnel from worksite:", error);
    if (error.code) {
      console.error("Error code:", error.code);
    }
  }
};

export const deleteWorksite = async (worksiteId) => {
  try {
    if (worksiteId) {
      // Worksites collection
      const worksiteDocRef = doc(db, "worksites", worksiteId);
      const worksiteSnapshot = await getDoc(worksiteDocRef);
      if (!worksiteSnapshot.exists()) {
        throw new Error("Worksite not found");
      }

      // 1. Projects collection'daki worksites array field'ı içinde worksiteId varsa silinecek
      const projectsQuery = query(
        collection(db, "projects"),
        where("worksites", "array-contains", worksiteId)
      );
      const projectsSnapshot = await getDocs(projectsQuery);
      projectsSnapshot.forEach(async (projectDoc) => {
        await updateDoc(projectDoc.ref, {
          worksites: arrayRemove(worksiteId),
        });
      });

      // 2. Teams collection'undan worksiteId field'ı eşit olan dökümanlar silinecek
      const teamsQuery = query(
        collection(db, "teams"),
        where("worksiteId", "==", worksiteId)
      );
      const teamsSnapshot = await getDocs(teamsQuery);
      teamsSnapshot.forEach(async (teamDoc) => {
        await deleteDoc(teamDoc.ref);
      });

      // 3. Shifts collection'undan worksiteId field'ı eşit olan dökümanlar silinecek
      const shiftsQuery = query(
        collection(db, "shifts"),
        where("worksiteId", "==", worksiteId)
      );
      const shiftsSnapshot = await getDocs(shiftsQuery);
      shiftsSnapshot.forEach(async (shiftDoc) => {
        await deleteDoc(shiftDoc.ref);
      });

      // 4. Documents collection'undan worksiteId field'ı eşit olan dökümanlar silinecek
      const documentsQuery = query(
        collection(db, "documents"),
        where("worksiteId", "==", worksiteId)
      );
      const documentsSnapshot = await getDocs(documentsQuery);
      documentsSnapshot.forEach(async (documentDoc) => {
        await deleteDoc(documentDoc.ref);
      });

      // 5. getDocumentType("worksite") fonksiyonundan bir documentTypeId dönecek ve ilgili klasör silinecek
      const documentTypeId = await getDocumentType("worksite");
      const storageRef = ref(
        storage,
        `documents/${documentTypeId}/${worksiteId}`
      );

      // Klasör içeriğini sil
      const deleteFolderContents = async (folderRef) => {
        const list = await listAll(folderRef);
        const deletePromises = list.items.map((itemRef) =>
          deleteObject(itemRef)
        );
        await Promise.all(deletePromises);

        const subFolderDeletePromises = list.prefixes.map((subFolderRef) =>
          deleteFolderContents(subFolderRef)
        );
        await Promise.all(subFolderDeletePromises);
      };

      // Klasörü ve içeriğini sil
      await deleteFolderContents(storageRef);

      // 6. Users collection'undaki worksites array field'ı içinde worksiteId varsa silinecek
      const usersQuery = query(
        collection(db, "users"),
        where("worksiteIds", "array-contains", worksiteId)
      );
      const usersSnapshot = await getDocs(usersQuery);
      usersSnapshot.forEach(async (userDoc) => {
        await updateDoc(userDoc.ref, {
          worksiteIds: arrayRemove(worksiteId),
        });
      });

      // 7. En son worksites collection'undan id field'ı eşit olan döküman silinecek
      await deleteDoc(worksiteDocRef);

      console.log("Worksite successfully deleted");
    } else {
      throw new Error("Invalid worksiteId");
    }
  } catch (error) {
    console.error("Error while deleting worksite:", error);
    if (error.code) {
      console.error("Error code:", error.code);
    }
  }
};

export const getGivenWorksitesInformationByIds = (worksiteIds, callback) => {
  try {
    if (worksiteIds && worksiteIds.length > 0) {
      const worksiteInformations = [];

      worksiteIds.forEach((worksiteId) => {
        if (worksiteId) {
          const worksiteRef = doc(db, "worksites", worksiteId);

          onSnapshot(worksiteRef, (worksiteDoc) => {
            if (worksiteDoc.exists()) {
              const worksiteData = worksiteDoc.data();
              const worksite = {
                id: worksiteId,
                name: worksiteData.name,
                createdTime: worksiteData.createdTime,
                city: worksiteData.city,
                district: worksiteData.district,
                neighborhood: worksiteData.neighborhood,
                worksiteImage: worksiteData.worksiteImage,
                startDate: worksiteData.startDate,
                finishDate: worksiteData.finishDate,
              };

              // Update or add the worksite information in the array
              const existingIndex = worksiteInformations.findIndex(w => w.worksiteId === worksiteId);
              if (existingIndex > -1) {
                worksiteInformations[existingIndex] = worksite;
              } else {
                worksiteInformations.push(worksite);
              }

              // Trigger the callback with the updated data
              callback([...worksiteInformations]);
            } else {
              console.log(
                "Worksite data not found for worksiteId:",
                worksiteId
              );
            }
          });
        }
      });
    } else {
      console.log("WorksiteIds not filled");
      callback([]);
    }
  } catch (error) {
    console.error("Error getting Worksites information:", error);
    callback([]);
  }
};

// deliveries
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
        .filter((driver) => !driver.vehicleId);

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

export const getCompanyDeliveries = (callback) => {
  try {
    const fetchDeliveries = async () => {
      const company = await getCompanyByManagerId();
      const companyId = company.id;

      if (companyId) {
        const deliveryQuery = query(
          collection(db, "deliveries"),
          where("receiverId", "==", companyId)
        );

        onSnapshot(deliveryQuery, (querySnapshot) => {
          const deliveries = querySnapshot.docs.map((doc) => doc.data());
          console.log(deliveries);
          callback(deliveries);
        });
      } else {
        console.log("companyId is not found");
        callback([]);
      }
    };

    fetchDeliveries();
  } catch (error) {
    console.error("Error getting deliveries information:", error);
    callback([]);
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

// projects
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

export const getProjectInformationById = async (projectId) => {
  try {
    if (projectId) {
      const projectRef = doc(db, "projects", projectId);
      const projectSnapshot = await getDoc(projectRef);
      if (projectSnapshot.exists()) {
        const projectData = projectSnapshot.data();
        return projectData;
      } else {
        console.log("project data does not exist");
        return null;
      }
    } else {
      console.log("project is not authenticated");
      return null;
    }
  } catch (error) {
    console.error("Error getting project information:", error);
    return null;
  }
};

export const getProjectNameById = async (projectId) => {
  try {
    if (projectId) {
      const projectRef = doc(db, "projects", projectId);
      const projectSnapshot = await getDoc(projectRef);
      if (projectSnapshot.exists()) {
        const projectData = projectSnapshot.data();
        return projectData.name;
      } else {
        console.log("project data does not exist");
        return null;
      }
    } else {
      console.log("project is not authenticated");
      return null;
    }
  } catch (error) {
    console.error("Error getting project information:", error);
    return null;
  }
};

// personnels
export const getCompanyPersonnels = (callback) => {
  try {
    const fetchPersonnels = async () => {
      const company = await getCompanyByManagerId();
      const companyId = company.id;

      if (companyId) {
        const personnelsIds = company.personnels || [];

        const usersQuery = query(
          collection(db, "users"),
          where("companyId", "==", companyId),
          where("role", "in", ["personnel", "driver"])
        );

        onSnapshot(usersQuery, (querySnapshot) => {
          const personnels = querySnapshot.docs.map((doc) => doc.data());
          callback(personnels); // Callback ile frontend'e verileri gönder
        });
      } else {
        console.log("companyId is not found");
        callback([]); // Callback ile frontend'e boş liste gönder
      }
    };

    fetchPersonnels();
  } catch (error) {
    console.error("Error getting personnels information:", error);
    callback([]); // Callback ile frontend'e boş liste gönder
  }
};

export const createNewTeam = async (teamData) => {
  try {
    const teamsRef = collection(db, "teams");
    const teamDocRef = await addDoc(teamsRef, teamData);

    const teamId = teamDocRef.id;
    const updatedTeamData = {
      ...teamData,
      id: teamId,
    };

    await setDoc(doc(db, "teams", teamId), updatedTeamData);
  } catch (error) {
    console.error("Error while creating new team:", error);
    if (error.code) {
      console.error("Error code:", error.code);
    }
  }
};

export const getCompanyTeams = async () => {
  try {
    const company = await getCompanyByManagerId();
    const companyId = company.id;

    if (companyId) {
      const teamsRef = collection(db, "teams");
      const querySnapshot = await getDocs(
        query(teamsRef, where("companyId", "==", companyId))
      );

      if (!querySnapshot.empty) {
        const teamsDocs = querySnapshot.docs;
        const teamsData = [];

        for (const doc of teamsDocs) {
          const teamData = doc.data();
          const worksiteId = teamData.worksiteId;
          const teamUsers = teamData.personnels;

          if (worksiteId) {
            const worksiteName = await getWorksiteNameById(worksiteId);
            teamData.worksiteName = worksiteName;
          }

          if (teamUsers && teamUsers.length > 0) {
            const personnels = await getGivenUsersInformationByIds(teamUsers);
            teamData.personnels = personnels;
          } else {
            teamData.personnels = [];
          }

          teamsData.push(teamData);
        }

        console.log("teams Data:", teamsData);
        return teamsData;
      } else {
        console.log("No teams found for the given companyId");
        return null;
      }
    } else {
      console.log("companyId is not available in localStorage");
      return null;
    }
  } catch (error) {
    console.error("Error getting teams information:", error);
    return null;
  }
};

export const getPermitsCompanies = (callback) => {
  try {
    const fetchPermits = async () => {
      const companyId = await getCompanyIdByAuthUser();

      if (companyId) {
        const permitRef = collection(db, "permits");

        const permitsQuery = query(
          permitRef,
          where("companyId", "==", companyId)
        );

        onSnapshot(permitsQuery, async (permitSnapshot) => {
          if (!permitSnapshot.empty) {
            const permitData = [];

            for (const permitDoc of permitSnapshot.docs) {
              const permit = permitDoc.data();
              const userId = permit.userId;
              if (userId) {
                const userRef = doc(db, "users", userId);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                  const userData = userDoc.data();
                  permit.userName = userData.name;
                  permit.userSurname = userData.surname;
                  permit.userId = userData.id;
                  permitData.push(permit);
                } else {
                  console.log("User data not found for userId:", userId);
                }
              }
            }

            callback(permitData); // Callback ile frontend'e verileri gönder
          } else {
            console.log("No permit found for the given companyId");
            callback([]); // Callback ile frontend'e boş liste gönder
          }
        });
      }
    };

    fetchPermits();
  } catch (error) {
    console.error("İzin bilgilerini alırken hata oluştu:", error);
    callback([]); // Callback ile frontend'e boş liste gönder
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

export const setPersonnelPermitConfirm = async (permitId) => {
  console.log(permitId);
  try {
    const permitDocRef = doc(db, "permits", permitId);
    await updateDoc(permitDocRef, {
      isApproved: true,
    });
    return true;
  } catch (error) {
    console.error("Kullanıcı izin sorgulanırken bir hata oluştu:", error);
    return false;
  }
};

export const setPersonelActiveWorksite = async (personnelId, worksiteId) => {
  console.log(personnelId);
  console.log(worksiteId);

  if (!worksiteId) {
    console.error("Hata: worksiteId undefined veya null");
    return false;
  }
  try {
    const userDocRef = doc(db, "users", personnelId);
    await updateDoc(userDocRef, {
      activeWorksite: worksiteId,
    });

    return true;
  } catch (error) {
    console.error(
      "Kullanıcı aktif şantiye sorgulanırken bir hata oluştu:",
      error
    );
    return false;
  }
};

export const setPersonelRole = async (personnelId, selectedRole) => {
  console.log(personnelId);
  console.log(selectedRole);

  if (!selectedRole) {
    console.error("Hata: selectedRole undefined veya null");
    return false;
  }
  try {
    const userDocRef = doc(db, "users", personnelId);
    await updateDoc(userDocRef, {
      role: selectedRole,
    });

    return true;
  } catch (error) {
    console.error("setPersonelRole sorgulanırken bir hata oluştu:", error);
    return false;
  }
};

export const deletePersonelActiveWorksite = async (personnelId) => {
  if (!personnelId) {
    console.error("Hata: personnelId undefined veya null");
    return false;
  }
  try {
    const userDocRef = doc(db, "users", personnelId);
    await updateDoc(userDocRef, {
      activeWorksite: null,
    });

    return true;
  } catch (error) {
    console.error(
      "Kullanıcı aktif şantiye sorgulanırken bir hata oluştu:",
      error
    );
    return false;
  }
};

//worksite personel atamak için, usersda worksites collectionuna worksiteId, worksitesda da personnels collectionuna user eklenmeli
