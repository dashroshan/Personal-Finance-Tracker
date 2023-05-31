const googleAuthBtn = document.getElementById("googleAuthBtn");
const googleAuthText = document.getElementById("googleAuthText");

var firebaseConfig = {
    apiKey: "AIzaSyAcHe3XUg7sov-w1g2rcgQGQlzlFnDQA5A",
    authDomain: "personal-finance-tracker-7b8c4.firebaseapp.com",
    projectId: "personal-finance-tracker-7b8c4",
    storageBucket: "personal-finance-tracker-7b8c4.appspot.com",
    messagingSenderId: "499863185106",
    appId: "1:499863185106:web:12370a6b86116abd34af0b"
};
const app = firebase.initializeApp(firebaseConfig);
let provider = new firebase.auth.GoogleAuthProvider();

var db = app.firestore();

class User {
    usersRef = db.collection("users");

    async update(email, userData) {
        try {
            await this.usersRef.doc(email).set(userData);
        } catch (error) {
            console.error(error)
        }
    }

    async get(email) {
        try {
            let doc = await this.usersRef.doc(email).get();
            if (doc.exists)
                console.log(doc.data());
        }
        catch (error) {
            console.error(error);
        }
    }
}

function GoogleLogin() {
    firebase.auth().signInWithRedirect(provider).then(res => {
        checkAuthState();
    }).catch(e => {
        console.log(e)
    })
}

function checkAuthState() {
    firebase.auth().onAuthStateChanged(async user => {
        if (user) {
            googleAuthText.innerText = "Signout";
            const userObj = new User();
            console.log(await userObj.get(user.email));
        } else {
            googleAuthText.innerText = "Signin with Google";
        }
    })
}

function LogoutUser() {
    firebase.auth().signOut().then(() => {
        checkAuthState();
    }).catch(e => {
        console.log(e)
    })
}

function handleAuthBtn() {
    if (googleAuthText.innerText === "Signout") LogoutUser();
    else GoogleLogin();
}

googleAuthBtn.addEventListener("click", handleAuthBtn);
checkAuthState();