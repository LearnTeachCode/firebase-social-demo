// DONE: user can log in, log out, create a user profile with data added to db

// NEXT: test that user can EDIT their profile data

// NEXT: home page listing all users and their data




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

var displayNameElem = document.getElementById('displayname'),
    profilePhotoElem = document.getElementById('profilephoto'),
    favLanguageInput = document.getElementById('favlanguage'),
    loginButton = document.getElementById('login-button'),
    logoutButton = document.getElementById('logout-button'),
    notifElem = document.getElementById('notif');

console.log(firebase.auth().currentUser);

function login() {
  console.log("User clicked LOGIN, summoning Kenny Loggins - king of logins");
  // Use Firebase with GitHub Auth to log in the user
  firebase.auth().signInWithPopup(provider).catch(function(error) {
  // Log any errors to the console
    console.log(error);
  });
  
  // Hide the notif to login once they actually login:
   notifElem.style.display = "none";      
}

function logout() {
  console.log("User clicked LOGOUT");
  // Use Firebase with GitHub Auth to log in the user
  firebase.auth().signOut().catch(function(error) {
  // Log any errors to the console
    console.log(error);
  });
  
  console.log(firebase.auth().currentUser);
    notifElem.textContent = "You must log in first before you can set up your user profile! Click login below:";
    notifElem.style.display = "block";
}

firebase.auth().onAuthStateChanged(function(user){
  
    // docs on currentUser: https://firebase.google.com/docs/auth/web/manage-users
   //update global user object to reflect login status:
  console.log(firebase.auth().currentUser);
  // If user is logged in
  if (firebase.auth().currentUser) {
    var user = firebase.auth().currentUser;
    console.log("User id: " + user.uid);  
    
    console.log('User successfully logged in to Firebase!');
    displayNameElem.textContent = user.displayName;
    profilePhotoElem.src = user.photoURL;
    
    // Register listener for current user's fav language data:
    var userIdRef = firebase.database().ref(firebase.auth().currentUser.uid + "/favLanguage");    
    console.log(userIdRef);
    userIdRef.on("value", function(dataSnapshot) {
      console.log("Language value just updated or on page load");
      //BUG: dataSnapshot.val() not returning value stored in language
      console.log(dataSnapshot.val());
      console.log(dataSnapshot);
      favLanguageInput.value = dataSnapshot.val();      
    });
    
    
  } else {   // If user is not logged in:
    console.log("User is not logged in; displaying notification to log in first!");
    notifElem.textContent = "You must log in first before you can set up your user profile! Click login below:";
    notifElem.style.display = "block";
  }

});

loginButton.addEventListener('click', login);
logoutButton.addEventListener('click', logout);


function updateUser() {
  console.log("button pressed");
  console.log(firebase.auth().currentUser);
  // If user is logged in
  if (firebase.auth().currentUser) {
    var user = firebase.auth().currentUser;
    console.log(user);
    var favLang = document.getElementById('favlanguage').value;
    var newUser = {favLanguage: favLang};
    var userIdRef = firebase.database().ref(user.uid);
    userIdRef.set(newUser);
  }
};

document.getElementById('save').addEventListener('click', updateUser);

