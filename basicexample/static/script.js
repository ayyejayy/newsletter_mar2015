$(document).ready(function(){
    

    $('#form').submit(function(event) {

        $.post('/squarehouse/endpoint', JSON.stringify({"date":$("#formData").val()}), function(d) {

            $("body").append("<div>"+d["result"]+"</div>");

        });
 
        return false;

    });


});