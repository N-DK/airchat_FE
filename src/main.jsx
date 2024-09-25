import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AppProvider } from './AppContext.jsx';
import { Provider } from 'react-redux';
import store from './redux/store';
import React from 'react';

// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register("/service-worker.js")
//       .then((registration) => {
//         console.log("Service Worker registered: ", registration);
//       })
//       .catch((registrationError) => {
//         console.log("Service Worker registration failed: ", registrationError);
//       });
//   });
// }

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
    <Provider store={store}>
        <AppProvider>
            <App />
        </AppProvider>
    </Provider>,
    // </React.StrictMode>,
);
