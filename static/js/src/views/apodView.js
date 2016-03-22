"use strict";


define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/apodTemplate.html',
], function($, _, Backbone, apodTemplate){

    var ApodView = Backbone.View.extend({

        el: $('#content'),

        initialize: function(){
            console.log('Load ApodView');
            _.bindAll(this, 'render');
        },

        render: function(){
            var context = {};

            var compiledTemplate = _.template(apodTemplate);
            this.$el.html(compiledTemplate(context));
        },
    });

    return ApodView;
});
