// import axios from 'axios';

// const userInfo = JSON.parse(localStorage.getItem('userInfo'));
// let firebaseplayerid;

// const saveFirebaseToken = async (userInfo, client_key) => {
//     try {
//         // const config = {
//         //     headers: {
//         //         'x-cypher-token': userInfo?.token || '',
//         //     },
//         // };

//         const { data } = await axios.post(
//             'http://192.168.11.28:3001/api/v1/save-key-client',
//             { client: client_key },
//             // config,
//         );

//         console.log(data);
//     } catch (error) {
//         saveFirebaseToken(userInfo, 'ERROR >>' + error + '<<');
//     }
// };

// const initializeFirebasePlayerId = () => {
//     try {
//         saveFirebaseToken(
//             userInfo,
//             'initializeFirebasePlayerId' + firebaseplayerid + ' <<',
//         );
//         saveFirebaseToken(userInfo, 'initializeFirebasePlayerId');
//         if (typeof firebaseplayerid === 'undefined') {
//             firebaseplayerid = '';
//         }
//     } catch (error) {
//         saveFirebaseToken(
//             userInfo,
//             'ERROR >>' + error + '<<' + ' firebaseplayerid: ',
//             firebaseplayerid,
//         );
//     }
// };

// document.addEventListener('DOMContentLoaded', () => {
//     saveFirebaseToken(userInfo, 'DOMContentLoaded');

//     try {
//         initializeFirebasePlayerId();
//     } catch (error) {
//         saveFirebaseToken(
//             userInfo,
//             'ERROR >>' + error + '<<' + ' firebaseplayerid: ',
//             firebaseplayerid,
//         );
//     }

//     const createHiddenLink = (href) => {
//         const link = document.createElement('a');
//         link.href = href;
//         link.style.display = 'none';
//         document.body.appendChild(link);
//         return link;
//     };

//     const button = document.createElement('button');
//     button.style.display = 'none';
//     document.body.appendChild(button);

//     const getFirebasePlayerIdLink = createHiddenLink('getfirebaseplayerid://');

//     button.addEventListener('click', () => {
//         saveFirebaseToken(
//             userInfo,
//             'BUTTON CLICKED >>' + firebaseplayerid + '<<',
//         );
//         if (firebaseplayerid) {
//             saveFirebaseToken(userInfo, firebaseplayerid);
//         } else {
//             alert('Firebase player ID is undefined.');
//         }
//     });

//     // Trigger link and button clicks
//     getFirebasePlayerIdLink.click();
//     button.click();
// });
