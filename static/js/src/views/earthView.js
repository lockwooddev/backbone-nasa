"use strict";


define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/earthIndexTemplate.html',
    'views/MapView',
    'utils/utils',
    'views/SwiperView',
], function($, _, Backbone, earthIndexTemplate, MapView, utils, SwiperView){

    var EarthView = Backbone.View.extend({

        el: $('#content'),

        events: {
            'click #geolocation': 'showMapView',
            'click #search': 'showMapView',
            'click #show-flyovers': 'showSwiperView',
        },

        initialize: function(){
            console.log('Load EarthView');
            _.bindAll(this, 'render', 'handleSubView', 'showMapView', 'close');

            this.subviews = {}
        },

        render: function(){
            var context = {};

            var compiledTemplate = _.template(earthIndexTemplate);
            this.$el.html(compiledTemplate(context));
        },

        handleSubView: function(identifier, View){
            this.subviews[identifier] = new View(arguments);
            this.subviews[identifier].render();
        },

        showMapView: function(el){
            var choice = $(el.currentTarget).data('choice');
            this.handleSubView('MapView', MapView, choice);
        },

        showSwiperView: function(){
            this.handleSubView('SwiperView', SwiperView);
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