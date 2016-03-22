"use strict";


define([
    'jquery',
    'underscore',
    'backbone',
    'modules/gmaps',
    'text!templates/geoTemplate.html',
], function($, _, Backbone, gmaps, geoTemplate){

    var GeoLocationView = Backbone.View.extend({

        el: '#map-container',

        initialize: function(){
            _.bindAll(this, 'render', 'setupTemplate', 'setupMap');
        },

        render: function(){
            console.log('Render GeoLocationView');
            this.setupTemplate();
            this.setupMap();
        },

        setupTemplate: function(){
            var compiledTemplate = _.template(geoTemplate);
            this.$el.html(compiledTemplate());
        },

        setupMap: function(){
            var that = this;

            this.map = new gmaps.Map($('#map')[0], {
                center: {
                    lat: 52.295627,
                    lng: 5.162350
                },
                zoom: 15,
                disableDefaultUI: true
            });

            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    // success
                    function(position) {
                        var pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };

                        that.map.setCenter(pos);
                    },
                    // error
                    function() {
                        $('.map-errors').append('Your browser likely has geolocation disabled.');
                    }
                );
            } else {
                // not supported
                $('.map-errors').append("Your browser doesn't support geolocation.");
            }
        }
    });

    return GeoLocationView;
});
