// REPO SAVED HERE: https://github.com/LearnTeachCode/firebase-social-demo/tree/master

///////////////////////   Initialize Firebase   //////////////////////////////
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
let profileElem = document.getElementById('profile'),
    displayNameElem = document.getElementById('displayname'),
    emailElem =  document.getElementById('email'),
    profilePhotoElem = document.getElementById('profilephoto'),
    favLanguageInput = document.getElementById('favlanguage'),
    loginButton = document.getElementById('login-button'),
    logoutButton = document.getElementById('logout-button'),    
    updateButton = document.getElementById('update'),
    notifElem = document.getElementById('notif'),
    notifSuccessElem = document.getElementById('notif-success');

// Set event listeners for logging in, logging out, and updating profile
// NOTE: the login and logout functions trigger the onAuthStateChanged event (see below)
loginButton.addEventListener('click', login);
logoutButton.addEventListener('click', logout);
updateButton.addEventListener('click', updateUser);

// This function runs only when user clicks loginButton:
function login() {
  console.log("User clicked LOGIN, summoning Kenny Loggins - king of logins");
  
  // Login with Firebase + GitHub Auth
  firebase.auth().signInWithPopup(provider).catch(function(error) {
    // Log any errors to the console
    console.log(error);
  });
     
}

// This function runs only when user clicks logoutButton:
function logout() {
  console.log("User clicked LOGOUT");
  
  // Use Firebase with GitHub Auth to log in the user
  firebase.auth().signOut().catch(function(error) {
  // Log any errors to the console
    console.log(error);
  });
  
}

// This is triggered when the user either logs in or logs out
// (when authentication state has changed):
firebase.auth().onAuthStateChanged(function(){
  
  // Create variable as shorter name for currently logged in user
  let currentUser = firebase.auth().currentUser;
  
  // If current user exists (user is now logged in), display their info and update the page accordingly
  if (currentUser) {
    
    console.log('User successfully logged in to Firebase!', currentUser);   
    
    // Hide login notification UI and login button; show logout button
    notifElem.style.display = "none"; 
    logoutButton.style.display = "inline";
    // Make the whole profile HTML element visible on the page
    profileElem.style.display = "block";
        
    // Save a reference object that represents the current user's location in our database:
    var currentUserRef = firebase.database().ref("users/" + currentUser.uid);  

    // Listen for current user's profile info (initialize it and also update in real-time when it changes!)
    currentUserRef.on("value", function(dataSnapshot) {
      
      // Extract user's raw data into an object we can easily use, with the Firebase data snapshot's .val() function
      var userDataSnapshot = dataSnapshot.val();
            
      // If current user DOES exist in the database (this is their 2nd+ time logging in)
      if (userDataSnapshot) {
        console.log("Current user is already in our database:", userDataSnapshot);
        
        // Show the profile info that's stored in our database:
        displayNameElem.value = userDataSnapshot.displayName;
        emailElem.value = userDataSnapshot.email;
        profilePhotoElem.src = userDataSnapshot.photoURL;
        favLanguageInput.value = userDataSnapshot.favLanguage;
        
      // If current user does NOT yet exist in the database (this is their first time logging in)
      } else {
        console.log("Current user is new, and NOT already in our database:", userDataSnapshot);
        
        // Show the profile info that's TEMPORARILY saved by Firebase GitHub authentication:
        displayNameElem.value = currentUser.displayName;
        emailElem.value = currentUser.email;
        profilePhotoElem.src = currentUser.photoURL;
        favLanguageInput.value = "";
        
      }      
 
    }); // end of the function that runs for the currentUserRef.on() event listener
    
  // Otherwise, if user has logged out:
  } else {   
    console.log("User is not logged in; displaying notification to log in first!");
    
    // Show login notification UI and login button; hide logout button and profile info
    notifElem.style.display = "block";    
    logoutButton.style.display = "none";
    profileElem.style.display = "none"; 
  }

}); // end of onAuthStateChanged section


// When user clicks "update", create/update their profile
function updateUser() {
  
  console.log("Update button clicked!");
  
  // Create variable as shorter name for currently logged in user
  let currentUser = firebase.auth().currentUser;
  
  // If current user exists (user is now logged in), display their info and update the page accordingly
  if (currentUser) {
    
    // Create object for this user's data
    // (pulling values from input boxes and from Firebase user object)
    var newUserData = {
      displayName: displayNameElem.value,
      email: emailElem.value,
      photoURL: user.photoURL,
      favLanguage: favLanguageInput.value
    };
    
    // Save a reference object that represents the current user's location in our database
    var userIdRef = firebase.database().ref("users/" + currentUser.uid);
    
    // Create or update this user's data in Firebase, and then
    // after that happens, run our function named finishUpdatingProfile
    userIdRef.set(newUserData, finishUpdatingProfile);
    
  }
}

// This function is triggered when Firebase has finished updating the user's profile
// (or if there was an error in doing so)
function finishUpdatingProfile (error) {
  
  console.log("Finished updating profile.");
  
  // If there was an error while trying to update the database,
  if (error) {
    // Log any errors to the console
    console.log(error);
    
    // *** To do later: display error message on the page for the user!
  
  // Otherwise if no errors and profile updated successfully,
  } else {
    // Display success message:
    notifSuccessElem.style.display = "block";
  }
}
