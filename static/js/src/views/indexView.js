"use strict";


define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/indexTemplate.html',
], function($, _, Backbone, indexTemplate){

    var IndexView = Backbone.View.extend({

        el: $('#content'),

        initialize: function(){
            console.log('Load IndexView');
            _.bindAll(this, 'render');
        },

        render: function(){
            var context = {};

            var compiledTemplate = _.template(indexTemplate);
            this.$el.html(compiledTemplate(context));
        },
    });

    return IndexView;
});