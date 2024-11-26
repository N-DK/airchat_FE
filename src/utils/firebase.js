import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: 'AIzaSyCsTuVMo8yQLoS7oXWR2MQf9UgQGG7VNbA',
    authDomain: 'talkie-e0b66.firebaseapp.com',
    projectId: 'talkie-e0b66',
    storageBucket: 'talkie-e0b66.appspot.com',
    messagingSenderId: '1098018991546',
    appId: '1:1098018991546:web:35ce17fcbbcb099d2c8183',
    measurementId: 'G-SGQVK4XZTJ',
};

const vapidKey =
    'BNjlnFBKwztPWvGpIjVyVgCP8aTVN3z9nHuFp1JWABOfpK-LFZIq5b5_w1ygSYkq5Jrk95598jOuHBB40hPp5tI';

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('./firebase-messaging-sw.js')
        .then(function (registration) {
            // console.log("Registration successful, scope is:", registration.scope);
        })
        .catch(function (err) {
            console.log('Service worker registration failed, error:', err);
        });
}

export const requestFCMToken = async () => {
    return Notification.requestPermission()
        .then((permission) => {
            if (permission === 'granted') {
                return getToken(messaging, {
                    vapidKey: vapidKey,
                });
            } else {
                console.log('Unable to get permission to notify.');
            }
        })
        .catch((err) => console.log(err));
};

export const onMessageListener = (callback) => {
    onMessage(messaging, (payload) => {
        console.log('Received message payload:', payload);
        callback(payload); // Gọi callback mỗi khi nhận được thông báo
    });
};
