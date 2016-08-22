angular.module('starter.controllers', [])
.controller('AuthCtrl', function($scope, Loading, Error, $state, Auth) {

  $scope.FBLogin = function(){
    Loading.show("Sign in with Facebook...");

    facebookConnectPlugin.login(['public_profile'],
      function(status) {
        facebookConnectPlugin.getAccessToken(function(token) {
            Auth.$signInWithCredential(firebase.auth.FacebookAuthProvider.credential(token)).then(function(authData, error) {
                console.log(authData);
                $state.go('tab.dash');
                Loading.hide();
            }).catch(function(error) {
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

})
.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, Auth) {
  $scope.signOut = function (){
    Auth.$signOut();
    facebookConnectPlugin.logout(
      function(status){
        console.log("logOut success: " + status);
      },
      function(error){
        console.log("logOut error: " + error);
      }
    );
  };
});
