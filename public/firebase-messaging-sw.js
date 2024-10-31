// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');
const firebaseConfig = {
    apiKey: 'AIzaSyCsTuVMo8yQLoS7oXWR2MQf9UgQGG7VNbA',
    authDomain: 'talkie-e0b66.firebaseapp.com',
    projectId: 'talkie-e0b66',
    storageBucket: 'talkie-e0b66.appspot.com',
    messagingSenderId: '1098018991546',
    appId: '1:1098018991546:web:35ce17fcbbcb099d2c8183',
    measurementId: 'G-SGQVK4XZTJ',
};
firebase.initializeApp(firebaseConfig);
// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('Received background message', payload);
});
