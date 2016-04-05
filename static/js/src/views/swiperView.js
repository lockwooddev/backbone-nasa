"use strict";


define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/swiperTemplate.html',
    'swiper',
    'collections/flyovers',
    'collections/images',
    'models/image',
], function($, _, Backbone, swiperTemplate, Swiper, FlyoverCollection, ImageCollection, ImageModel){

    var SwiperView = Backbone.View.extend({

        el: '#swiper',

        initialize: function(){
            _.bindAll(this, 'render', 'loadSwiper', 'loadFlyovers', 'loadInitialImages');

            this.lon = $('#show-flyovers').data('lon');
            this.lat = $('#show-flyovers').data('lat');

            this.flyoverCollection = new FlyoverCollection();
            this.flyoverCollection.url = this.flyoverCollection.url(this.lat, this.lon);

            this.loadFlyovers();

            this.imageCollection = new ImageCollection();
        },

        render: function(){
            console.log('Render SwiperView');
            var context = {};

            var compiledTemplate = _.template(swiperTemplate);
            this.$el.html(compiledTemplate(context));

            this.imageSwiper = this.loadSwiper();
        },

        loadSwiper: function(){
            var that = this;

            var swiperObject = {
                mode: 'horizontal',
                loop: false,
                onReachEnd: function(swiper){
                    var imageLen = that.imageCollection.length
                    if (imageLen >= 3) {
                        that.loadImage(imageLen + 1)
                    }
                }
            };

            var ImageSwiper = new Swiper('.swiper-container', swiperObject);
            return ImageSwiper;
        },

        loadFlyovers: function(){
            var that = this;

            this.flyoverCollection.fetch({
                success: function(collection, response, options) {
                    console.log('Fetched flyovers: '+ that.flyoverCollection.url);
                    that.loadInitialImages();
                },

                error: function(collection, response, options){
                    console.log('Error: '+ that.flyoverCollection.url);
                }
            });
        },

        loadInitialImages: function(){
            for (var i = 0; i < 3; i++){
                this.loadImage(i);
            }
        },

        loadImage: function(index){
            var that = this;

            var image = new ImageModel();
            var flyover = this.flyoverCollection.at(index);
            image.url = image.getUrl(this.lat, this.lon, flyover.get('date'));
            this.imageCollection.add(image);

            image.fetch({
                success: function(model, response, options) {
                    console.log('Fetched image: '+ model.url);

                    $('.swiper-wrapper').append(
                        '<div class="swiper-slide">' +
                            '<div>'+model.get('date')+'</div>' +
                            '<img src="'+model.get('url')+'"/>' +
                        '</div>'
                    );

                    that.imageSwiper.update(true);
                },

                error: function(model, response, options){
                    console.log('Error: '+ model.url);
                }
            });
        },
    });

    return SwiperView;
});
