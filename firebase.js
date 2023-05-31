import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";


const firebaseConfig = {
    apiKey: "AIzaSyAcHe3XUg7sov-w1g2rcgQGQlzlFnDQA5A",
    authDomain: "personal-finance-tracker-7b8c4.firebaseapp.com",
    projectId: "personal-finance-tracker-7b8c4",
    storageBucket: "personal-finance-tracker-7b8c4.appspot.com",
    messagingSenderId: "499863185106",
    appId: "1:499863185106:web:12370a6b86116abd34af0b"
};
const app = initializeApp(firebaseConfig);


const provider = new GoogleAuthProvider();
const auth = getAuth();

const googleAuthBtn = document.getElementById("googleAuthBtn");

googleAuthBtn.addEventListener("click", () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            console.log(user);
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
        });
})

function Check() {
    onAuthStateChanged((user) => {
        if (user) {
            // User Signed In
            console.log("User Signed In!!");
        } else {
            // User is signed out
            console.log("User Signed out!!");
            // ...
        }
    });
}

Check();