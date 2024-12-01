// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // เพิ่ม Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGE_SENDING_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app); // เพิ่มบรรทัดนี้สำหรับ Firebase Storage

// Export app as default
export default app;

// import { storage } from "../firebase"; // นำเข้า storage

// // ตัวอย่างการอัปโหลดรูปภาพ
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// // ฟังก์ชันสำหรับอัปโหลดรูปภาพ
// const uploadImage = (file) => {
//   const storageRef = ref(storage, `images/${file.name}`);
//   uploadBytes(storageRef, file).then((snapshot) => {
//     console.log("Uploaded a blob or file!");

//     // ดึง URL ของไฟล์ที่อัปโหลด
//     getDownloadURL(snapshot.ref).then((downloadURL) => {
//       console.log("File available at", downloadURL);
//     });
//   });
// };
