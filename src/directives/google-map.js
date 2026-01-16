// 'use strict';
/* global google */
googleMap.$inject = [];
function googleMap() {

  return {
    restrict: 'E',
    template: '<div class="google-map"></div>',
    replace: true,
    scope: {
      center: '=',
      zoom: '=',
      origin: '=',
      destination: '=',
      travelMode: '=',
      foodType: '='
    },

    link($scope, $element) {
      const map = new google.maps.Map($element[0], {
        zoom: $scope.zoom,
        center: $scope.center,
        styles: [{
          'featureType': 'all',
          'elementType': 'all',
          'stylers': [
            { 'invert_lightness': true },
            { 'saturation': 10 },
            { 'lightness': 30 },
            { 'gamma': 0.5 },
            { 'hue': '#435158'}
          ]
        }]
      });

      const directionsService = new google.maps.DirectionsService();
      const directionsDisplay = new google.maps.DirectionsRenderer();
      const placesService = new google.maps.places.PlacesService(map);
      const directionsShow = document.getElementById('bottom-panel');


      const image = {
        url: '/assets/images/marker.gif', // url
        scaledSize: new google.maps.Size(60, 60), // scaled size
        origin: new google.maps.Point(0,0) // origin
        // anchor: new google.maps.Point(0, 0) // anchor
      };

      // const infoWindows = [];
      // const infowindow = new google.maps.InfoWindow();
      // let marker = new google.maps.Marker;

      directionsDisplay.setMap(map);


      $scope.$watch('center', () => map.setCenter($scope.center), true);

      $scope.$watchGroup(['origin', 'destination', 'travelMode'], displayRoute);

      // DISPLAY ROUTE
      function displayRoute() {
        if(!$scope.origin || !$scope.destination || !$scope.travelMode) return false;

        directionsService.route({
          origin: $scope.origin,
          destination: $scope.destination,
          travelMode: $scope.travelMode
        }, (response) => {
          console.log(response.routes);
          // console.log($scope.origin);

          directionsDisplay.setDirections(response);

          response.routes[0].legs[0].steps.forEach(step => {
            placesService.nearbySearch({
              location: step.start_location,
              radius: 50,
              type: 'restaurant',
              keyword: $scope.foodType,
              openNow: true
            }, (results, status) => {
              if (status !== google.maps.places.PlacesServiceStatus.OK || !results) return;

              results.forEach(place => {
                const marker = new google.maps.Marker({
                  map: map,
                  position: place.geometry.location,
                  icon: image
                });

                const photo = place.photos && place.photos.length
                  ? place.photos[0].getUrl({ maxWidth: 250, maxHeight: 200 })
                  : '';

                const infoContent = `
                  <strong>${place.name}</strong><br/>
                  Address: ${place.vicinity}<br/>
                  Rating: ${place.rating || 'N/A'}<br/>
                  Type: ${place.types.slice(0, 2)}<br/>
                  ${photo ? `<img src="${photo}">` : ''}
                `;

                const infoWindow = new google.maps.InfoWindow({ content: infoContent });
                marker.addListener('click', () => infoWindow.open(map, marker));
              });
            });
          });


        });  //end return directionsdisplay
      }  //display route ends


    } //link scope ends
  };
}

export default googleMap;
