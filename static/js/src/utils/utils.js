/*
Removes view event listeners and empties $el contents
*/


define(function(){

    return {
        deleteView: function(view){
            view.$el.empty();
            view.stopListening();
        }
    };
});
