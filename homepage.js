// REPO SAVED HERE: https://github.com/LearnTeachCode/firebase-social-demo/tree/master

///////////////////////   Initialize Firebase   //////////////////////////////
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDT03tSsnQ81nI-Se4lcEFDeYHbfcIoqvQ",
    authDomain: "test-12-93e5b.firebaseapp.com",
    databaseURL: "https://test-12-93e5b.firebaseio.com",
    projectId: "test-12-93e5b",
    storageBucket: "test-12-93e5b.appspot.com",
    messagingSenderId: "333239247273"
  };

firebase.initializeApp(config);

var provider = new firebase.auth.GithubAuthProvider();

/////////////////////////////////////////////////////////////////////////////

// Convert HTML elements to JS objects
var usersListElement = document.getElementById('userslist'),
    loginButton = document.getElementById('login-button'),
    logoutButton = document.getElementById('logout-button'),
    profileButton = document.getElementById('profile-button'),
    headerElem = document.getElementById('header');

// Set event listeners: run "login" function when user clicks loginButton,
// and logout when user clicks logoutButton.
// NOTE: the login and logout functions trigger the onAuthStateChanged event (see below)
loginButton.addEventListener('click', login);
logoutButton.addEventListener('click', logout);

// This function runs only when user clicks loginButton:
function login() {
  console.log("User clicked LOGIN, summoning Kenny Loggins - king of logins");
  
  // Login this user with Firebase GitHub Authentication
  firebase.auth().signInWithPopup(provider).catch(function(error) {
    // Log any errors to the console
    console.log(error);
  });
     
}

// This function runs only when user clicks logoutButton:
function logout() {
  console.log("User clicked LOGOUT");
  
  // Use Firebase GitHub Authentication to log out the user
  firebase.auth().signOut().catch(function(error) {
  // Log any errors to the console
    console.log(error);
  });
  
}


// This is triggered when the user either logs in or logs out
// (when authentication state has changed):
firebase.auth().onAuthStateChanged(function(currentUser){
  
  // If user has just logged in, then update user interface accordingly:
  if (firebase.auth().currentUser) {
    
    console.log('User successfully logged in to Firebase!');
    
    // Display the list of all users, which also updates in real-time
    setupUsersList();
    
    // Hide login button; show logout button and edit profile button
    loginButton.style.display = "none"; 
    logoutButton.style.display = "inline";
    profileButton.style.display = "inline";
    usersListElement.style.display = "block";
    // Also reset the header section to its original size
    headerElem.style.height = "20vh";
    
  // Otherwise if the user has just logged out, update user interface accordingly:
  } else {   // If user has logged out:
    console.log("User is not logged in.");
    
    // Show login button; hide logout button and edit profile button and users list
    loginButton.style.display = "inline";  
    logoutButton.style.display = "none";
    profileButton.style.display = "none";
    usersListElement.style.display = "none";
    // Also make the title and buttons full-screen!
    headerElem.style.height = "100vh";
  
  }

});

// Display list of all users (once when the page loads, and then it updates in real time if there are any updates!)
function setupUsersList() {
  
  // Set up Firebase event listener for updates to all users in our database
  firebase.database().ref("users").on('value', function(dataSnapshot) {

    console.log("Fetching data from Firebase dB");

    // Delete contents of usersListElement before updating with the latest list of users (to avoid duplicates)
    // NOTE: replacing the WHOLE list every time is not the best way to do this (especially with a big list),
    // but fine for a first prototype just to test things out.
    usersListElement.textContent = '';

    // For each user retrieved from Firebase, run the displayUser function!
    dataSnapshot.forEach(displayUser);

  });
}

// This function is called inside setupUsersList(), repeated once for each user retrieved from our database
function displayUser(userSnapshot) {
    
   // Extract our JSON style user data from Firebase's data snapshot using the Firebase .val() method
   var user = userSnapshot.val();
  
    // CREATE NEW HTML ELEMENTS:
    // <section> 
    //   <h2 class="displayname">...</h2>
    //   <img class="profilephoto" src="...">
    //   <p class="favlanguage">...</p>
    // </section>

    var userSectionElement = document.createElement("section");
    var userNameElement = document.createElement("h2");
    var userEmailElement = document.createElement("p");
    var userImageElement = document.createElement("img");
    var userLangElement = document.createElement("p");
    
    // Set class names on the HTML elements (we use these to apply CSS rules from styles.css file based on class names)
    userSectionElement.className = "profile-section";
    userNameElement.className = "displayname";
    userEmailElement.className = "email";
    userImageElement.className = "profilephoto";
    userLangElement.className = "favlanguage";

    // Put user data inside the elements accordingly
    userNameElement.textContent = user.displayName;
    userEmailElement.textContent = user.email;
    userLangElement.textContent = "Favorite language: " + user.favLanguage; 
    userImageElement.src = user.photoURL;

    // Put these HTML elements all inside the <section> element
    userSectionElement.appendChild(userNameElement);
    userSectionElement.appendChild(userEmailElement);
    userSectionElement.appendChild(userImageElement);
    userSectionElement.appendChild(userLangElement);
    
    // Put the <section> element inside usersListElement (<div id="userslist> ... </div>)
    usersListElement.appendChild(userSectionElement);
}
