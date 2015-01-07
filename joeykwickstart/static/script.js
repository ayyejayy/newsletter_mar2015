$(document).ready(function(){
    
	var pathname = window.location.pathname;

    $('#form').submit(function(event) {

        $.post(pathname + 'endpoint', JSON.stringify({"date":$("#formData").val()}), function(d) {

            $("body").append("<div>"+d["result"]+"</div>");

        });
 
        return false;

    });


});