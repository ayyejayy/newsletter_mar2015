$(document).ready(function(){
    


















	var parseDate = d3.time.format("%Y-%m-%d");

	convertDate = function(date) {
          
      date = new Date(date);

      var curr_date = date.getUTCDate();
      var curr_month = date.getUTCMonth() + 1;
      var curr_year = date.getFullYear();

      return curr_year + "-" + curr_month + "-" + curr_date;
    }  

	var _chart = rsc.charts.line(document.getElementById('chart'));



	_chart
         .grid(true)            
         .legend(false)
         .interpolate("linear")                       
         .xTickFormat(function (d) { return parseDate(d); })
         .yTickFormat(function (d) { return d.toLocaleString(); })         
         .title('Trials')            
         .margin({left:50,bottom:20})      
         .x(function (d) { return d.date;  })
         .y(function (d) { return d.value; })         
         .yLabel('(Count)')
         .xLabel('(Date)')
         .tooltip(function(d) { return '<font size="5">' + Math.round(d.value).toLocaleString() + '</font>' + '<br>' + '<font size="2">' 
              + convertDate(d.date)+'</font>'; })
         .dispatch.on("click", function(d) {
          }); 





    function display_charts(chartData){

      _chart
           .data(chartData)  
           .yDomain({min: -0.0001, max: d3.max(chartData,function(d) { return d.value; })*1.05})                                      
           .render();  

    }




	var startDate = $.datepicker.formatDate("yy-mm-dd", new Date('1999-01-01'));
    var endDate = $.datepicker.formatDate("yy-mm-dd", new Date());

    $("#startDate").datepicker({dateFormat: 'yy-mm-dd'});

    $("#endDate").datepicker({dateFormat: 'yy-mm-dd', 
                                defaultDate: endDate, 
                                setDate: endDate});




	var pathname = window.location.pathname;

    $('#form').submit(function(event) {

	    if ($("#startDate").val() != ""){
            startDate = $("#startDate").val();
        }
        else if ($("#endDate").val() != ""){
            endDate = $("#endDate").val();
        }

        $.post(pathname + 'chooseSubset', JSON.stringify({"startDate":startDate,"endDate":endDate}), function(d) {

            chartData = [{key : "Trials", values: d.jsonData}]
            display_charts(chartData);

        });
 
        return false;

    });


    $(".spinner").show();
    $.post(pathname + 'loadDataFrame', JSON.stringify({}), function(d) {

        $(".spinner").hide();

    });


});