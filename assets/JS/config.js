import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, onSnapshot, deleteDoc, doc, updateDoc} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getStorage, ref, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyD8yQ9fj9VhNLd8jQuCMuoMWXeTxhzCfeM",
    authDomain: "starshub-5b5b4.firebaseapp.com",
    projectId: "starshub-5b5b4",
    storageBucket: "starshub-5b5b4.firebasestorage.app",
    messagingSenderId: "733227792498",
    appId: "1:733227792498:web:63d8e55cfd3d170f0baaeb",
    measurementId: "G-J93W3H3EWN"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

export function registerUser(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
        .then(() => window.location.href = 'redsocial.html')
        .catch((error) => alert("Error al registrar: " + error.message));
}

export function loginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
        .then(() => window.location.href = 'redsocial.html')
        .catch((error) => alert("Error al inicisar sesión: " + error.message));
}

export function loginWithGoogle() {
    return signInWithPopup(auth, provider)
        .then(() => window.location.href = 'redsocial.html')
        .catch((error) => alert("Error al iniciar sesión con Google: " + error.message));
}
export function createTask(title, description, uid, userName, userAvatar, image) {
    if (image) {
        const storageRef = ref(storage, `images/${image.name}`);
        return uploadBytes(storageRef, image)
            .then(snapshot => getDownloadURL(snapshot.ref))
            .then(url => savePost(title, description, uid, userName, userAvatar, url));
    } else {
        return savePost(title, description, uid, userName, userAvatar, null);
    }
}

function savePost(title, description, uid, userName, userAvatar, imageUrl ) {
    const post = {
        title: title,
        description: description,
        uid: uid,
        userName: userName,
        userAvatar: userAvatar,
        imageUrl: imageUrl,
        createdAt: new Date(),
        likes: []
    };
    return addDoc(collection(db, 'tasks'), post);
}

export function toggleLike(taskId, userId) {
    const taskRef = doc(db, "tasks", taskId);

    return getDoc(taskRef).then((docSnapshot) => {
        if (!docSnapshot.exists()) {
            throw new Error("Tarea no encontrada");
        }

        const taskData = docSnapshot.data();
        const likes = taskData.likes || []; // Obtiene el array de likes

        // Alterna el like
        const newLikes = likes.includes(userId)
            ? likes.filter((id) => id !== userId) // Quitar el like
            : [...likes, userId]; // Añadir el like

        return updateDoc(taskRef, {
            likes: newLikes
        });
    });
}

export function getTasks() {
    return getDocs(collection(db, 'tasks'));
}

export function onGetTasks(callback) {
    return onSnapshot(collection(db, 'tasks'), callback);
}

export function getTask(id) {
    return getDoc(doc(db, 'tasks', id));
}

export function updateTask(id, newFields) {
    return updateDoc(doc(db, 'tasks', id), newFields);
}

export function deleteTask(id) {
    return deleteDoc(doc(db, "tasks", id));
}




export { auth, db, storage };





// likes: []