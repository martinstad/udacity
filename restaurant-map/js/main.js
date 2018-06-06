var viewModel;
// These are the restaurants listings that will be shown to the user.

function initMap() {

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 47.379333,
            lng: 8.543476
        },
        zoom: 12,
        styles: styles,
        mapTypeControl: false
    });

    // Create a new blank array for all the listing markers.
    var markers = [];

    var infoWindow = new google.maps.InfoWindow();

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Style the markers a bit. This will be our listing marker icon.
        var defaultIcon = makeMarkerIcon('45B39D');
        // Create a "highlighted location" marker color for when the user
        // mouses over the marker.
        var highlightedIcon = makeMarkerIcon('117A65');
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            icon: defaultIcon,
            // Show markers from start through map: map
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            //contentString
        });

        // Two event listeners - one for mouseover and one for mouseout,
        // to change the colors back and forth.   
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });

        // Push the marker to our array of markers.
        markers.push(marker);

        // Iterate through restaurants
        viewModel.allRestaurants()[i].marker = marker;


        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, infoWindow);

            // displays all data retrieved from foursquare api down below
            infoWindow.setContent(contentString);

        });

    }


    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    function populateInfoWindow(marker, infoWindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infoWindow.marker != marker) {
            // Clear the infowindow content to give the streetview time to load.
            infoWindow.setContent('');
            infoWindow.marker = marker;

            infoWindow.setContent(

                marker.contentString
            );

            // Set animation for markers: when clicked, they bounce twice
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 1300);

            infoWindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infoWindow.addListener('closeclick', function() {
                infoWindow.marker = null;
            });


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


    // foursquare client-id and client-secret
    var client_id = "RDZYCSSKVK4GIJDTA0OA45SSR2DA2A2ELHI00EWPNPS3DGPD";
    var client_secret = "MXFIPAWJDDKEDWFPMRGBQ0FTC3M0CQHCJQSIQ0FYGYQUTO3O";

    // foursquare api url
    var foursquareUrl = "https://api.foursquare.com/v2/venues/search";
    // creating variables outside of the for ajax request for faster loading
    var venue, address, category, foursquareId, contentString;

    // ajax request - foursquare api data (https://developer.foursquare.com/docs/)
    $.ajax({
        url: foursquareUrl,
        dataType: "json",
        data: {
            client_id: client_id,
            client_secret: client_secret,
            query: marker.title, // gets data from marker.title (array of object)
            near: "Zurich",
            v: 20180603 // version equals date
        },
        success: function(data) {
            // console.log(data);
            // get venue info
            venue = data.response.venues[0];
            // get venue address info
            address = venue.location.formattedAddress[0];
            // get venue category info
            category = venue.categories[0].name;
            // gets link of place
            foursquareId = "https://foursquare.com/v/" + venue.id;
            // populates infowindow with api info
            contentString =
                "<div class='name'>" +
                "Restaurant " +
                "<span class='info'>" +
                title +
                "</span></div>" +
                "<div class='category'>" +
                "<span class='info'>" +
                address +
                "</span></div>" +
                "Type of Restaurant: " +
                "<span class='info'>" +
                category +
                "</span></div>" +
                "<div class='address'>" +
                "<div class='information'>" +
                "Find more information " +
                "<a href='" +
                foursquareId +
                "'>" +
                "here." +
                "</a></div>";

            marker.contentString;

        },
        error: function() {
            contentString =
                "<div class='name'>Data cannot be displayed.</div>";
        },

    });

};

// Build location
var Location = function(data) {
    var self = this;
    this.title = data.title;
    this.location = data.location;
    this.show = ko.observable(true);
};

// Initializing the view model
var ViewModel = function() {
    var self = this;
    // Definition of Restaurant observable array 
    this.allRestaurants = ko.observableArray();
    this.filter = ko.observable("");


    for (i = 0; i < locations.length; i++) {
        var place = new Location(locations[i]);
        self.allRestaurants.push(place);
    }

    // Initializing the filter and iterates through the restaurants
    this.searchFilter = ko.computed(function() {
        var filter = self.filter().toLowerCase();

        for (i = 0; i < self.allRestaurants().length; i++) {
            // Filtering restuarants dependent on input
            if (
                self
                .allRestaurants()[i].title.toLowerCase()
                .indexOf(filter) > -1
            ) {
                // Matching user input with listed restaurants
                self.allRestaurants()[i].show(true);
                if (self.allRestaurants()[i].marker) {
                    // Matching user input with visible restaurants on map
                    self.allRestaurants()[i].marker.setVisible(true);
                }
            } else {
                self.allRestaurants()[i].show(false);
                if (self.allRestaurants()[i].marker) {
                    self.allRestaurants()[i].marker.setVisible(false);
                }
            }
        }
    });

    // map marker bounces when location is clicked on list

    this.listRestaurant = function(locations) {
        google.maps.event.trigger(locations.marker, "click");
    };
};

viewModel = new ViewModel();

//apply binding
ko.applyBindings(viewModel);