// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { deleteDoc, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
const firebaseConfig = {
  apiKey: "AIzaSyCmKKy494eYGSnNXogoqfyNV48hS8IfAaw",
  authDomain: "project-manager-58910.firebaseapp.com",
  projectId: "project-manager-58910",
  storageBucket: "project-manager-58910.appspot.com",
  messagingSenderId: "54095788855",
  appId: "1:54095788855:web:88a67439a356a7bec278b2",
  measurementId: "G-F6MNTP3SMB"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

//save the data into firebase database
export const updateUserDB = async (user, uid) => {
  if (typeof user !== "object") return;
  const docRef = doc(db, 'users', uid);
  await setDoc(docRef, { ...user, uid })
}

//get data from the database
export const getUserDB = async (uid) => {
  const docRef = doc(db, 'users', uid);
  const result = await getDoc(docRef);
  if (!result.exists()) return null;
  return result.data();
}
export const uploadeAccountimgs = (file, progressCB, urlCB, errorCB) => {
  const fileSize = file.size / 1024 / 1024;
  if (fileSize > 2) {
    errorCB("Image must smaller than 2MB");
    return;
  }
  const storageRef = ref(storage, `images/${file.name}`);
  const task = uploadBytesResumable(storageRef, file);
  task.on("state_changed", (snapshot) => {//.on mtlb firebase ka listner
    // console.log("snap-shot", snapshot) //kitna state abhi tk change ho rha hai
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; //kitna complete hua uska % de rha h
    progressCB(progress);
  }, (err) => {
    errorCB(err.message)
  }, () => {
    getDownloadURL(storageRef).then(url => urlCB(url)) //image comppletly upload hone k baad uska url milega 
  })

}
//save the data into firebase database
export const AddUserProject = async (project) => {
  if (typeof project !== "object") return;

  const collectionRef = collection(db, "projects");
  await addDoc(collectionRef, { ...project });
}

export const updateDbInProjects = async(projects, pid) => {
  if (typeof projects !== "object") return;
  const docRef = doc(db, "projects", pid); // doc refrence leta hai collection ya DB ka that we need to get the data from.
  await setDoc(docRef, { ...projects })
}

export const getAllProjects = async () => {
  return await getDocs(collection(db, "projects"))
}
export const getUserProject = async (uid) => {
  if(!uid) return;

  const collectionRef = collection(db, "projects");
  const condition = where("refUser", "==", uid);
  const queryref = query(collectionRef, condition)
  
  return await getDocs(queryref) //getDocs data lakr data hai collection based refrence se jo doc() method  mai hum banate hai
}
export const deleteProject = async (pid) => {
  const docRef = doc(db, "projects", pid);
  await deleteDoc(docRef);
};
export const auth = getAuth(app);
