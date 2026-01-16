/* global google */
MainCtrl.$inject = ['$rootScope','User','$auth', '$state', '$timeout', '$scope'];

function MainCtrl($rootScope, User,$auth, $state, $timeout, $scope) {

  // $scope.navigatebuttons
  const vm = this;
  vm.flashMessage = null;
  vm.isAuthenticated = $auth.isAuthenticated;

  vm.formattedOrigin = '';

  // This changeClass function enables the mobile burger menu in index.html
  $scope.class = '';
  $scope.bottomnav = '';
  $scope.chevron = '';

  $scope.changeClass = function(){
    if ($scope.class === 'is-active') {
      $scope.class = '';
      console.log($scope.class);
    } else {
      $scope.class = 'is-active';
      console.log($scope.class);
    }

  };



  function logout(){
    $rootScope.$broadcast('flashMessage', {
      type: 'warning',
      content: 'Come back soon!'
    });
    $auth.logout();
    $state.go('craveIndex');
  }

  $rootScope.$on('flashMessage', (e, data) => {
    vm.flashMessage = data;
    $timeout(() => vm.flashMessage = null, 4000);
  });

  vm.logout = logout;
}


export default MainCtrl;
