angular.module('starter.auth', [])
.factory('Auth', function( $firebaseAuth ){
  return $firebaseAuth();
})
.controller('AuthCtrl', function($scope, Loading, Error, ModalService, $state, Auth) {

  $scope.googleSignIn = function() {
    Loading.show("Sign in with Google...");

    window.plugins.googleplus.login(
      {},
      function (user_data) {
        Auth.$signInWithCredential(
          firebase.auth.GoogleAuthProvider.credential(user_data.idToken)
        )
        .then(function(authData, error) {
            console.log(authData);
            $state.go('tab.dash');
            Loading.hide();
        })
        .catch(function(error) {
            switch (error.code) {
              case 'USER_CANCELLED':
                  break;
              default:
                  Error("Error", error);
                  break;
            }
            Loading.hide();
        });
      },
      function (msg) {
        console.log(msg);
        Loading.hide();
      }
    );
  };

  $scope.FBLogin = function(){
    Loading.show("Sign in with Facebook...");
    console.log(typeof facebookConnectPlugin);

    if(typeof facebookConnectPlugin === 'object'){
      facebookConnectPlugin.login(['public_profile'],
        function(status) {
          facebookConnectPlugin.getAccessToken(function(token) {
              Auth.$signInWithCredential(
                firebase.auth.FacebookAuthProvider.credential(token)
              )
              .then(function(authData, error) {
                  console.log(authData);
                  $state.go('tab.dash');
                  Loading.hide();
              })
              .catch(function(error) {
                  switch (error.code) {
                    case 'USER_CANCELLED':
                        break;
                    default:
                        Error("Error", error);
                        break;
                  }
                  Loading.hide();
              });
          }),
          function(error) {
              Loading.hide();
              Error("Error", JSON.stringify(error));
          };
      },function(error) {
          Loading.hide();
          Error("Error", JSON.stringify(error));
      });
    }


  };

  $scope.signIn = function (provider){
    Loading.show("Sign in with " + provider + "...");

    Auth.$signInWithPopup(provider).then(function(result) {
      console.log("Signed in as:", result.user.uid);
      $state.go("tab.dash");
      Loading.hide();
    }).catch(function(error) {
      console.error("Authentication failed:", error);
      Loading.hide();
      Error(error.code, error.message);
    });
  }

  $scope.signInWithEmail = function (user) {
    if(angular.isDefined(user)){
      Loading.show("Sign in...");

      Auth.$signInWithEmailAndPassword(user.email, user.password)
      .then(function(currentUser) {
        console.log("Signed in as:", currentUser.uid);
        $state.go("tab.dash");
        Loading.hide();
      }).catch(function(error) {
        Loading.hide();
        console.error("Authentication failed:", error);
        Error(error.code, error.message);
      });
    }
  };

  $scope.signUpWithEmail = function(user) {
    if(angular.isDefined(user)){
      Loading.show("Sign up...");
      Auth.$createUserWithEmailAndPassword(user.email, user.password)
        .then(function(currentUser) {
          console.log("User created with uid: " + currentUser.uid);
          $scope.closeModal();
          $state.go("tab.dash");
          Loading.hide();
        }).catch(function(error) {
          Loading.hide();
          console.log(error);
          Error(error.code, error.message);
        });
    }
  };

  $scope.sendPasswordResetEmail = function(email){
    if(angular.isDefined(email)){
        Loading.show("Sending...");
        Auth.$sendPasswordResetEmail(email).then(function() {
          console.log("Password reset email sent successfully!");
          $scope.closeModal();
          $state.go("tab.dash");
          Loading.hide();
        }).catch(function(error) {
          console.error("Error: ", error);
          Loading.hide();
          Error(error.code, error.message);
        });
      }
  }

  $scope.newSignup = function() {
    ModalService
      .init('templates/auth/sign-up.html', $scope)
      .then(function(modal) {
        modal.show();
      });
  };

  $scope.newPassword = function() {
    ModalService
      .init('templates/auth/forgot-password.html', $scope)
      .then(function(modal) {
        modal.show();
      });
  };

});
