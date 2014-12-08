/* 
 * Luke -> lukaszgielar.com
 */



var XFormation = {              

    data: null,
    config: null,
    setData: function(data) {
        this.data = data;                                       
    },
    tooltip: function() {
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        });
    },
    init: function() { 
        this.getData();
        this.tooltip();
    },
    die: function() {
        //alert('die!!');
    },
    getAndSetConfig: function() {


    },
    getData: function(callback) {

        var that = this;

        $.ajax({    
            type: "POST",
            dataType: "json",
            data: {url: 'http://www.lukaszgielar.com/contributors.json'},
            url: 'ext/get_file.php',            
            success: function(data) {
                
                that.setData(data);
                
                if('asc') {                        
                    that.sortData('asc');                        
                }
                
                fireChart(that.data.response);
//                return that.data;                         
            }         
        });
    },
    sortData: function(sort) {

        var that = this,
            sortable = [];

        for (var items in that.data.response) {                        
            sortable.push([items, that.data.response[items]]);                        
            sortable.sort(function(a, b) {return a[1]['contributions'] - b[1]['contributions'];});                      
        } 

        $.each(sortable, function(key,item) {
            that.data.response[key] = item[1];                        
        });
    }
};


google.load('visualization', '1.0', {'packages':['corechart', 'table']});
    
XFormation.init();
      
function fireChart(response) {
  
    google.setOnLoadCallback(drawChart);
  
    function drawChart() {
            
        var data = new google.visualization.DataTable(),
            arr = [];

        
        data.addColumn('string', globalTranslations.contributors_nick);        
        data.addColumn('number', globalTranslations.contributors_contrib);
        data.addColumn('string', globalTranslations.contributors_team);

        $.each(response, function( key, item) {                
            arr.push([item.nickname.toString(), item.contributions, item.team.toString()]);                
        }); 
            
        data.addRows(arr);       
        var view = new google.visualization.DataView(data);       
        view.setColumns([0, 1]);
        
        var table = new google.visualization.Table(document.getElementById('contributors_table'));
        table.draw(view);

        var options = {
          title: globalTranslations.contributors_chart
        //  vAxis: {title: 'Year',  titleTextStyle: {color: 'red'}}
        };
        
        var chart = new google.visualization.BarChart(document.getElementById('contributors_chart'));        
        chart.draw(view, options);        
        
//        
//        var chart = new google.visualization.AreaChart(document.getElementById('contributors_chart'));
//        chart.draw(data);

        google.visualization.events.addListener(table, 'sort',
            function(event) {
            data.sort([{column: event.column, desc: !event.ascending}]);
            chart.draw(view, options);
        });
        
        google.visualization.events.addListener(table, 'select',
            function(event) {
            console.log(event);
//            data.sort([{column: event.column, desc: !event.ascending}]);
//            chart.draw(view, options);
        });
        
        function resize () {
            table.draw(view);
            chart.draw(view, options);
           
        }

    window.onload = resize();
    window.onresize = resize;
        
        
//        var options = {'width':500,'height':400};
//
//        // Instantiate and draw our chart, passing in some options.
//        var chart = new google.visualization.BarChart(document.getElementById('contributors_chart'));
//        chart.draw(data, options);
    }
}

