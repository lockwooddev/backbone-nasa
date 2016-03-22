"use strict";


define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/earthIndexTemplate.html',
    'views/geoLocationView',
    'views/searchLocationView',
    'utils/utils',
], function($, _, Backbone, earthIndexTemplate, GeoLocationView, SearchLocationView, utils){

    var EarthView = Backbone.View.extend({

        el: $('#content'),

        events: {
            'click #geolocation': 'showGeolocation',
            'click #search': 'showSearch',
        },

        initialize: function(){
            console.log('Load EarthView');
            _.bindAll(this, 'render', 'handleSubView', 'showGeolocation', 'showSearch', 'close');

            this.subviews = {}
        },

        render: function(){
            var context = {};

            var compiledTemplate = _.template(earthIndexTemplate);
            this.$el.html(compiledTemplate(context));
        },

        handleSubView: function(identifier, View){
            this.subviews[identifier] = new View();
            this.subviews[identifier].render();
        },

        showGeolocation: function(){
            this.handleSubView('GeoLocationView', GeoLocationView);
        },

        showSearch: function(){
            this.handleSubView('SearchLocationView', SearchLocationView);
        },

        close: function(){
            _.each(this.subviews, function(subview){
                utils.deleteView(subview);
            });

            utils.deleteView(this);
        }

    });

    return EarthView;
});