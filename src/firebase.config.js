// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyCsTuVMo8yQLoS7oXWR2MQf9UgQGG7VNbA',
    authDomain: 'talkie-e0b66.firebaseapp.com',
    projectId: 'talkie-e0b66',
    storageBucket: 'talkie-e0b66.appspot.com',
    messagingSenderId: '1098018991546',
    appId: '1:1098018991546:web:35ce17fcbbcb099d2c8183',
    measurementId: 'G-SGQVK4XZTJ',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
