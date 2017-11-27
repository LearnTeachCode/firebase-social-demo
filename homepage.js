// Initialize Firebase
var config = {
  apiKey: "AIzaSyAaV3E2u0cfrnLl6FubzJxyZnI4w7THGP8",
  authDomain: "fir-test-d0038.firebaseapp.com",
  databaseURL: "https://fir-test-d0038.firebaseio.com",
  projectId: "fir-test-d0038",
  storageBucket: "",
  messagingSenderId: "85016100458"
};

firebase.initializeApp(config);

var provider = new firebase.auth.GithubAuthProvider();

var firebaseGreetElem = document.getElementById('firebase-greeting'),
    userLoginStatus = document.getElementById('user-info'),
    loginButton = document.getElementById('login-button'),
    logoutButton = document.getElementById('logout-button');

var dbGreetingRef = firebase.database().ref("greeting");


dbGreetingRef.on("value", function(dataSnapshot) { firebaseGreetElem.textContent = dataSnapshot.val(); });

function login() {
  console.log("User clicked LOGIN, summoning Kenny Loggins - king of logins");
  // Use Firebase with GitHub Auth to log in the user
  firebase.auth().signInWithPopup(provider).catch(function(error) {
  // Log any errors to the console
    console.log(error);
  });
}

function logout() {
  console.log("User clicked LOGOUT");
  // Use Firebase with GitHub Auth to log in the user
  firebase.auth().signOut().catch(function(error) {
  // Log any errors to the console
    console.log(error);
  });
}

firebase.auth().onAuthStateChanged(function(user){
  // If user is now logged in:
  if (user) {
    console.log('User successfully logged in to Firebase!');
    var username = user.displayName,
        profPic = user.photoURL;
    userLoginStatus.innerHTML = 'Logged in as <strong>' + username + '</strong><img src="' + profPic + '">';
  // Otherwise, if no user currently logged in:
  } else {
    console.log('User is logged OUT from Firebase!');
    userLoginStatus.textContent = 'Logged Out';
  }
});

loginButton.addEventListener('click', login);
logoutButton.addEventListener('click', logout);

