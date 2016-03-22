"use strict";


define([
    'jquery',
    'underscore',
    'backbone',
    'modules/gmaps',
    'text!templates/searchTemplate.html',
], function($, _, Backbone, gmaps, searchTemplate){

    var SearchLocationView = Backbone.View.extend({

        el: '#map-container',

        initialize: function(){
            _.bindAll(this, 'render', 'setupTemplate', 'setupMap');
        },

        render: function(){
            console.log('Render SearchLocationView');
            this.setupTemplate();
            this.setupMap();
        },

        setupTemplate: function(){
            var compiledTemplate = _.template(searchTemplate);
            this.$el.html(compiledTemplate());
        },

        setupMap: function(){
            var map = new gmaps.Map($('#map')[0], {
                center: {
                    lat: 52.295627,
                    lng: 5.162350
                },
                zoom: 15,
                disableDefaultUI: true
            });

            var input = $('#search-input');
            var searchBox = new gmaps.places.SearchBox(input[0]);
            map.controls[gmaps.ControlPosition.TOP_LEFT].push(input[0]);

            map.addListener('bounds_changed', function(){
                searchBox.setBounds(map.getBounds());
            });

            var markers = [];
            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            searchBox.addListener('places_changed', function() {
                var places = searchBox.getPlaces();

                if (places.length == 0) {
                    return;
                }

                // Clear out the old markers.
                markers.forEach(function(marker) {
                    marker.setMap(null);
                });
                markers = [];

                // For each place, get the icon, name and location.
                var bounds = new google.maps.LatLngBounds();
                places.forEach(function(place) {
                    var icon = {
                        url: place.icon,
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(25, 25)
                    };

                    // Create a marker for each place.
                    markers.push(new google.maps.Marker({
                        map: map,
                        icon: icon,
                        title: place.name,
                        position: place.geometry.location
                    }));

                    if (place.geometry.viewport) {
                        // Only geocodes have viewport.
                        bounds.union(place.geometry.viewport);
                    } else {
                        bounds.extend(place.geometry.location);
                    }
                });
                map.fitBounds(bounds);
            });
        }
    });

    return SearchLocationView;
});
