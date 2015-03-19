$(document).ready(function(){
    





	var pathname = window.location.pathname;


    $('#form').submit(function(event) {

        long_url = $('#long_url').val();

        $.post(pathname + 'map_long_to_short', JSON.stringify({"long_url":long_url}), function(d) {

            $('body').append(d.short_url)

        });
 
        return false;


    });



});