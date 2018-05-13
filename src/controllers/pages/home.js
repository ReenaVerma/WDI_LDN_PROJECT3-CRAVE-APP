/* global google */
PagesHomeCtrl.$inject = ['$scope', '$auth', 'User', '$timeout'];

function PagesHomeCtrl($scope, $auth, User, $timeout) {

  const vm = this;
  vm.origin = '123 Oxford St, Soho, London W1D 2LT, UK';
  vm.destination = '116 Whitechapel Rd, London E1 1JE, UK';
  vm.travelMode = '';
  vm.bottomnav = null;
  vm.foodType = null;
  vm.loading = false;
  vm.navigationStep = '0';
  // vm.gestureHandling ='cooperative';


  //This function sets the users walking or driving travel mode
  function setTravelMode(mode) {
    vm.travelMode = mode;
    openNav();
  }
  vm.setTravelMode = setTravelMode;

  // SETFOOD TYPE FUNCTION
  function setFoodType(type) {
    console.log('Show ' + type + ' type of restaurants');
    if(type === 'kebab') {
      $scope.hammered = 'chosen-emotion';
      $scope.hungover = '';
      $scope.hangry = '';
      $scope.hardworking = '';
    } else if(type === 'cafe') {
      $scope.hammered = '';
      $scope.hungover = 'chosen-emotion';
      $scope.hangry = '';
      $scope.hardworking = '';
    } else if(type === 'fastfood') {
      $scope.hammered = '';
      $scope.hungover = '';
      $scope.hangry = 'chosen-emotion';
      $scope.hardworking = '';
    } else {
      $scope.hammered = '';
      $scope.hungover = '';
      $scope.hangry = '';
      $scope.hardworking = 'chosen-emotion';
    }
    vm.foodType = type;
  }

  vm.setFoodType = setFoodType;

  //CURRENT LOCATION FUNCTION
  vm.userCurrentAddress = '';
  vm.unsuccessfulLocateMessage = '';
  vm.successfulLocateMessage = '';
  //This function gets the users current position and sets it as the origin
  function userCurrentPosition(){
    openNav();
    vm.loading = true;
    //The below function locates your current position in to lat and lng variables.
    var ops = {
      timeout: 10000,
      maximumAge: 0
    };
    navigator.geolocation.getCurrentPosition(pos => {
      console.log(pos);
      const userCurrentLat = pos.coords.latitude;
      const userCurrentLng = pos.coords.longitude;
      //The below changes them in to an object ready for convering them in to an address string
      const latLng = {lat: userCurrentLat, lng: userCurrentLng};
      //The below uses the latLng object and finds the formatted_address
      const geocoder = new google.maps.Geocoder;
      geocoder.geocode({'location': latLng}, function(results, status) {
        if (status === 'OK') {
          vm.successfulLocateMessage = 'We\'ve located you!';
          openNav();
          if (results[0]) {
            vm.userCurrentAddress = results[0].formatted_address;
            vm.origin = results[0].formatted_address;
            vm.loading = false;
            $scope.$apply();
            console.log('This is your current location:' + vm.userCurrentAddress);
          } else {
            console.log('No results found');
          }
        } else {
          console.log('Geocoder failed due to: ' + status);
        }
      });
    }, err => {
      if (err.TIMEOUT) {
        vm.loading = false;
        openNav();
        console.log('TIMEOUT');
        vm.unsuccessfulLocateMessage = 'Sorry, we couldn\'t locate you this time.';
        $scope.$apply();
      }
    }, ops);

    //here I want to save the lat and lng as seperate variales.
    //then I want to save them as the value in the form with an ng-m
  }
  vm.userCurrentPosition = userCurrentPosition;

  // Home Page navigation open and close toggle function
  function openNav() {
    $scope.navigatebuttons = '';
    console.log('clicked');
    if ($scope.bottomnav === 'active-bottom-nav') {
      console.log('if');
      $scope.bottomnav = '';
      $scope.chevron = 'chevron-image';
      $scope.navigatebuttons = 'navigationhidden';
      console.log($scope.navigatebuttons);
    } else {
      console.log('else');
      $scope.bottomnav = 'active-bottom-nav';
      $scope.navigatebuttons = 'navigationshown';
      $scope.chevron = 'chevron-image active-chevron';
      console.log($scope.navigatebuttons);
    }
  }
  vm.openNav = openNav;


  //This function pulls the current users home address from database when the home button is clicked
  function pullUserHomeOrWork(place){
    vm.userPlace = '';
    if (place === 'home'){
      const payload = $auth.getPayload();
      User.findById(payload.sub)
        .then(output => {
          vm.userPlace = output.data.home;
          vm.destination = output.data.home;
          console.log(vm.userPlace);
        });
    } else if (place === 'work') {
      const payload = $auth.getPayload();
      User.findById(payload.sub)
        .then(output => {
          vm.userPlace = output.data.work;
          vm.destination = output.data.work;
          console.log(vm.userPlace);
        });
    }
  }

  vm.pullUserHomeOrWork = pullUserHomeOrWork;

  // Change steps in the navigation
  function originNextStep() {
    console.log('Clicked');
    $scope.originStep = 'navigationhidden';
    $scope.destinationStep = 'navigationshown';
    $scope.geosuccess = 'navigationhidden';
  }

  function destinationNextStep() {
    console.log('Clicked');
    $scope.destinationStep = 'navigationhidden';
    $scope.emotionStep = 'navigationshown';
  }

  function emotionNextStep() {
    console.log('Clicked');
    $scope.emotionStep = 'navigationhidden';
    $scope.travelStep = 'navigationshown';
  }

  vm.originNextStep = originNextStep;
  vm.destinationNextStep = destinationNextStep;
  vm.emotionNextStep = emotionNextStep;


  // Bounce menu when page loads
  $timeout(() => vm.bottomnav = 'bottom-nav animated infinite bounce', 1500);
  $timeout(() => vm.bottomnav = 'bottom-nav', 3500);

}
export default PagesHomeCtrl;
