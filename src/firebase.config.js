// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyCsTuVMo8yQLoS7oXWR2MQf9UgQGG7VNbA',
    authDomain: 'http://localhost:5173', //"talkie-e0b66.firebaseapp.com"
    projectId: 'talkie-e0b66',
    storageBucket: 'talkie-e0b66.appspot.com',
    messagingSenderId: '1098018991546',
    appId: '1:1098018991546:web:35ce17fcbbcb099d2c8183',
    measurementId: 'G-SGQVK4XZTJ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
