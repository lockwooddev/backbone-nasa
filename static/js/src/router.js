"use strict";


define([
    'jquery',
    'underscore',
    'backbone',
    'views/indexView',
    'views/earthView',
    'views/apodView',
], function($, _, Backbone, IndexView, EarthView, ApodView){

    var AppRouter = Backbone.Router.extend({
        routes: {
            '':  'indexRoute',
            'earth': 'earthRoute',
            'apod': 'apodRoute',
        },

        initialize: function(){
            _.bindAll(
                this, 'events', 'loadView', 'removeView', 'indexRoute', 'earthRoute', 'apodRoute');
        },

        events: function(){
            var that = this;

            // disable default action for anchor tags
            // enable router to nagivate on anchors
            $('a').click(function(e){
                e.preventDefault();

                var url = $(e.target).attr('href');
                that.navigate(url, true);
                // console.log($(e.target).attr('href'));
            });
        },

        removeView: function(){
            this.view.$el.empty();
            this.view.stopListening();
            return this.view;
        },

        loadView: function(view){
            this.view && (this.view.close ? this.view.close() : this.removeView());
            this.view = view;
            this.view.render();
        },

        activeNav: function(id){
            $('.nav').parents().removeClass('active');
            if(id){
                $(id).parent().addClass('active');
            }
        },

        indexRoute: function(){
            this.activeNav();
            this.loadView(new IndexView());
        },

        earthRoute: function(){
            this.activeNav('#nav-earth');
            this.loadView(new EarthView());
        },

        apodRoute: function(){
            this.activeNav('#nav-apod');
            this.loadView(new ApodView());
        }
    });

    var init = function(){
        console.log('Start app and routing');
        var appRouter = new AppRouter();
        Backbone.history.start();
        appRouter.events();
    };

    return {
        initialize: init
    };
});
