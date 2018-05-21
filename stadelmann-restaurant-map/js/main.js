/* ?? not sure how to use foursquare api, here is my client id and client secret, below the ids per venue

var ViewModel = function() {
    var self = this;
    var foursquareUrl = 'https://api.foursquare.com/v2/venues/';
    var foursquareParams = $.param({
        'client_id': 'RDZYCSSKVK4GIJDTA0OA45SSR2DA2A2ELHI00EWPNPS3DGPD',
        'client_secret': 'MXFIPAWJDDKEDWFPMRGBQ0FTC3M0CQHCJQSIQ0FYGYQUTO3O',
        'v': '201800521'
    });
*/

function filterRestaurants() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  ul = document.getElementById("myUL");
  li = ul.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";

    }
  }
}

// Create a new blank array for all the listing markers.
var markers = [];


function initMap() {

  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 47.379333,
      lng: 8.543476
    },
    zoom: 13,
    styles: styles,
    mapTypeControl: false
  });

  
  // These are the restaurants listings that will be shown to the user.
  var locations = [{
      title: "Didi's Frieden",
      location: {
        lat: 47.379333,
        lng: 8.543476
      },
      fsId: "4b44a898f964a520c3f825e3"
    },
    {
      title: 'Bebek',
      location: {
        lat: 47.374499,
        lng: 8.520690
      },
      fsId: "53c575ba498e118a698bf109"
    },
    {
      title: 'Gartenhof',
      location: {
        lat: 47.371911,
        lng: 8.525576
      },
      fsId: "4c588269d12a20a1933569bd"
    },
    {
      title: 'Rosso',
      location: {
        lat: 47.385600,
        lng: 8.518322
      },
      fsId: "4b561189f964a520c1fe27e3"
    },
    {
      title: 'Giesserei',
      location: {
        lat: 47.408567,
        lng: 8.537670
      },
      fsId: "4b6e8820f964a520efc02ce3"
    },
    {
      title: 'Maison Blunt',
      location: {
        lat: 47.383701,
        lng: 8.528404
      },
      fsId: "4b091b4ef964a520421423e3"
    },
    {
      title: 'Les Halles',
      location: {
        lat: 47.387888,
        lng: 8.518644
      },
      fsId: "4b24117bf964a520576024e3"
    },
    {
      title: "Fischer's Fritz",
      location: {
        lat: 47.335746,
        lng: 8.541247
      },
      fsId: "4dc6605c52b1e8f9f7ebcd59"
    }
  ];


  var largeInfowindow = new google.maps.InfoWindow();

  // Style the markers a bit. This will be our listing marker icon.
  var defaultIcon = makeMarkerIcon('45B39D');

  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  var highlightedIcon = makeMarkerIcon('117A65');

  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
    // Show markers from start through map: map
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i
    });

    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open the large infowindow at each marker.
    marker.addListener('click', function () {
      populateInfoWindow(this, largeInfowindow);
    });
    // Three event listeners - one for click, one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('click', function () {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseover', function () {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function () {
      this.setIcon(defaultIcon);
    });
  }

  document.getElementById('show-listings').addEventListener('click', showListings);
  document.getElementById('hide-listings').addEventListener('click', hideListings);
  document.getElementById('zoom-to-area').addEventListener('click', function () {
    zoomToArea();
  });
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    // Clear the infowindow content to give the streetview time to load.
    infowindow.setContent('');
    infowindow.marker = marker;
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function () {
      infowindow.marker = null;
    });
    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;
    // In case the status is OK, which means the pano was found, compute the
    // position of the streetview image, then calculate the heading, then get a
    // panorama from that and set the options
    function getStreetView(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);
        infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
        var panoramaOptions = {
          position: nearStreetViewLocation,
          pov: {
            heading: heading,
            pitch: 30
          }
        };
        var panorama = new google.maps.StreetViewPanorama(
          document.getElementById('pano'), panoramaOptions);
      } else {
        infowindow.setContent('<div>' + marker.title + '</div>' +
          '<div>No Street View Found</div>');
      }
    }
    // Use streetview service to get the closest streetview image within
    // 50 meters of the markers position
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    // Open the infowindow on the correct marker.
    infowindow.open(map, marker);
  }
}

// This function will loop through the markers array and display them all.

function showListings() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}

// This function will loop through the listings and hide them all.
function hideListings() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21, 34));
  return markerImage;
}


// This function takes the input value in the find nearby area text input
// locates it, and then zooms into that area. This is so that the user can
// show all listings, then decide to focus on one area of the map.
function zoomToArea() {
  // Initialize the geocoder.
  var geocoder = new google.maps.Geocoder();
  // Get the address or place that the user entered.
  var address = document.getElementById('zoom-to-area-text').value;
  // Make sure the address isn't blank.
  if (address == '') {
    window.alert('You must enter an area, or address.');
  } else {
    // Geocode the address/area entered to get the center. Then, center the map
    // on it and zoom in
    geocoder.geocode({
      address: address,
      componentRestrictions: {
        locality: 'New York'
      }
    }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        map.setZoom(15);
      } else {
        window.alert('We could not find that location - try entering a more' +
          ' specific place.');
      }
    });
  }
}