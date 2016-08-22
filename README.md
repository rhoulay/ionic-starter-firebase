Ionic Starter Firebase
=====================

Ionic Starter Firebase is basic angularfire setting and user signin starter. It's make Ionic integrate with firebase quick and simple.

## Install Dependency

you should install these library first:
```
$ bower install angularfire --save
$ bower install angular-messages --save
```

and add at index.html
```
<!-- angular messages -->
<script src="lib/angular-messages/angular-messages.min.js"></script>

<!-- Firebase -->
<script src="lib/firebase/firebase.js"></script>

<!-- AngularFire -->
<script src="lib/angularfire/dist/angularfire.min.js"></script>
```

then, inject to app:
```
angular.module('starter', ['ionic', 'ngMessages', 'firebase', ...
```

## User auth.js and utils.js
add to index.html:
```
<!-- ionic starter firebase -->
<script src="js/auth.js"></script>
<script src="js/utils.js"></script>

```

inject to app:
```
angular.module('starter', ['ionic', 'ngMessages', 'firebase',
'starter.auth', 'starter.utils', ...
```

setting "stateChange" listener so if need redirect, in app.js file:
```
$rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
  // We can catch the error thrown when the $requireSignIn promise is rejected
  // and redirect the user back to the home page
  if (error === "AUTH_REQUIRED") {
    $state.go("sign-in");
  }
});

$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
  if((toState.name === "sign-in" || toState.name === "sign-in-with-email" ) && $rootScope.firebaseUser){
    event.preventDefault();
  }
});


Auth.$onAuthStateChanged(function(firebaseUser) {

  // check user auth state
  if(firebaseUser){
    $rootScope.firebaseUser = firebaseUser;
    console.log("Log In");

  }
  else {
    // logout
    facebookConnectPlugin.logout(
      function(status){
        console.log("logOut success: " + status);
      },
      function(error){
        console.log("logOut error: " + error);
      }
    );
    $rootScope.firebaseUser = 0;
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    $state.go("sign-in");
    console.log("Log Out");
  }
});
```

## Setting router
if state need auth:
```
resolve: {
  // controller will not be loaded until $waitForSignIn resolves
  // Auth refers to our $firebaseAuth wrapper in the example above
  "currentAuth": ["Auth", function(Auth) {
    // $waitForSignIn returns a promise so the resolve waits for it to complete
    return Auth.$requireSignIn();
  }]
}
```
wait for SignIn:
```
resolve: {
  // controller will not be loaded until $waitForSignIn resolves
  // Auth refers to our $firebaseAuth wrapper in the example above
  "auth": ["Auth", function(Auth) {
    // $waitForSignIn returns a promise so the resolve waits for it to complete
    return Auth.$waitForSignIn();
  }]
}
```

## Firebase V3.0 problem
Currently Firebase V3 auth's signInWithPopup/Redirect do not work in cordova apps, you can check discuss at: https://groups.google.com/forum/#!msg/firebase-talk/mC_MlLNCWnI/cL0OnL4hAwAJ

On next firebase version, these problem may fixed. But on this starter, I choose use cordova-plugin-facebook4 for social signin.


## Install cordova-plugin-facebook4
```
$ cordova plugin add cordova-plugin-facebook4 --save --variable APP_ID="581547675358171" --variable APP_NAME="Ionic Starter Firebase Login"
```
