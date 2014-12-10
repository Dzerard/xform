/* 
 * Luke -> lukaszgielar.com
 */

//google
google.load('visualization', '1.0', {'packages':['corechart', 'table']});

//magic - google, app settings - globals
var appSettings,
    contributorTable, contributorView, contributorChart, contributorChartOptions, contributorResponse,
    gitHubTable, gitHubView, gitHubChart, gitHubChartOptions;

//base object
var XFormation = {              

    data: null,
    config: null,
    setData: function(data) {
        this.data = data;                                       
    },
    init: function(refresh) { 
        this.getContributorData(refresh);    
        this.getGitHubData();    
    },
    die: function() {
        //@todo obsługa blędów
        //alert('die!!');
    },
    initSettings: function() {    
        //@todo do ready.js
        var data = localStorage;
        if(data.menu == 'hidden') {
            $('.settings-top-menu').removeClass('hidden').css('margin-left', '-15px');
            $('.sidebar').css('left', '-500px');
            $('.container-fluid .main').removeClass('col-sm-offset-3 col-md-offset-2 col-sm-9 col-md-10').addClass('col-sm-12 col-md-12');
        }    
    },
    getAndSetConfig: function() {
        //@todo config za pierwszym razem odpalny, 
        //bo wszsytko siedzi w localStorage, chyba ze przegladarka nie oblsuguje localStoarage
        //lub localStoarge  zostal wyczyszczony
        
        $.getJSON("libs/config.json", function(data) {                    
            appSettings = data;
        });
    },
    getContributorData: function(refresh) {

        var that = this;
        $.ajax({    
            type: "POST",
            dataType: "json",
            data: {url: '../public/files/contributors/contributors.json', file: true},
            url: 'ext/get_contributors.php',            
            success: function(data) {
                
                that.setData(data);       
                //@todo - sortowanie                                       
                that.sortData('asc'); 
                
                if(!$.isEmptyObject(refresh) && refresh === 'refresh') {
                    contributorResponse = that.data.response;
                    drawContributorChart(that.data.response);
                    return;
                }
                fireContributorChart(that.data.response);
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
    },
    getGitHubData: function() {

        $.ajax({    
            type: "POST",
            dataType: "json",
            data: {name: 'x-formation'},
            url: 'ext/get_github.php',            
            success: function(data) {

                $('.container-content-gihub .loader').fadeOut(function(){
                    $.each(data.response, function(key,item) {
                         console.log(item);
                        $('.container-content-gihub').append(item.name+'<br>');
                    });                
                });        
                      console.log(data);
       
            }         
        });
        
    }
};
XFormation.init();

function fireContributorChart(response) {  
    contributorResponse = response;
    google.setOnLoadCallback(drawContributorChart);      
}

function drawContributorChart() {            
            
    var data = new google.visualization.DataTable(),
        arr = [],
        response = contributorResponse;

    data.addColumn('string', globalTranslations.contributors_nick);        
    data.addColumn('number', globalTranslations.contributors_contrib);
    data.addColumn('string', globalTranslations.contributors_team);

    $.each(response, function( key, item) {                
        arr.push([item.nickname.toString(), item.contributions, item.team.toString()]);                
    }); 

    data.addRows(arr);       
    contributorView = new google.visualization.DataView(data);       
    contributorView.setColumns([0, 1]);

    contributorTable = new google.visualization.Table(document.getElementById('contributors_table'));
    contributorTable.draw(contributorView);

    contributorChartOptions = {
      title: globalTranslations.contributors_chart
    //  vAxis: {title: 'Year',  titleTextStyle: {color: 'red'}}
//        'width':500,'height':400
    };

    contributorChart = new google.visualization.BarChart(document.getElementById('contributors_chart'));   
//        var chart = new google.visualization.AreaChart(document.getElementById('contributors_chart'));
    contributorChart.draw(contributorView, contributorChartOptions);        

    //funkcje
    google.visualization.events.addListener(contributorTable, 'sort',
        function(event) {
            data.sort([{column: event.column, desc: !event.ascending}]);
            contributorChart.draw(contributorView, contributorChartOptions);
    });

    google.visualization.events.addListener(contributorTable, 'select',
        function(event) {
       // console.log(event);
//            data.sort([{column: event.column, desc: !event.ascending}]);
//            chart.draw(view, options);
    });

    function resize () {
        contributorTable.draw(contributorView);
        contributorChart.draw(contributorView, contributorChartOptions);           
    }

    window.onload = resize();
    window.onresize = resize;     
}
       
//@todo lepsza implementacja
function resizeGoogle() {
    
    if(!$.isEmptyObject(contributorTable)) {
        contributorTable.draw(contributorView);
        contributorChart.draw(contributorView, contributorChartOptions);                  
    } else {
        setTimeout(function(){resizeGoogle;},500);
    }
}
        
//$(document).ready(function() {
//    $('.nav-sidebar li').on('click', function() {
//        
//        var button = $(this).children();
//        if(button.data('rel') != 'undefined') {
//            var container = $(this).find('.'+button.data('rel'));
//            container.slideDown(function(){
//                button.addClass('active');
//            });
//        }
//        //detecting funcitons
//        
//        
//    }); 
//});

var Storage = {
    setItemInfo: function(item, info) {
        localStorage.setItem(item, info);
    }
};