import { initializeApp } from 'firebase/app';
import { getAyth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection } from 'firebase/firestore';
const firebaseApp = initializeApp({
    apiKey: "AIzaSyDCi97vgUzaR-TXpFvmv5vMKG7cdm7vNhU",
    authDomain: "base-de-datos-del-tfg-1.firebaseapp.com",
    projectId: "base-de-datos-del-tfg-1",
    storageBucket: "base-de-datos-del-tfg-1.appspot.com",
    messagingSenderId: "322269238228",
    appId: "1:322269238228:android:90de023599f3f7f7157c41"
});

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
db.collection("user").getDocs();
const usersCollection = collection(db, 'users');
const snapshot = await getDocs(usersCollection);


async function cargarUsuarios() {
    const snapshot = await getDocs(usersCollection);
    snapshot.forEach(doc => {
        console.log(doc.id, "=>", doc.data());
    });
}

cargarUsuarios();
