/* 
 * Luke -> lukaszgielar.com
 */

//google
google.load('visualization', '1.0', {'packages':['corechart', 'table']});

//magic - google, app settings - globals
var appSettings,
    contributorTable, contributorView, contributorViewChart, contributorChart, contributorChartOptions, contributorResponse,
    gitHubTable, gitHubView, gitHubChart, gitHubChartOptions;

//base object
var XFormation = {              

    data     : null,
    dataSort : null,
    userSearch : null,
    setData: function(data) {
        this.data = data;                                       
    },
    settings : {
        'connection'      : 'default',
        'defaultFilePath' : '../public/files/contributors/contributors.json',
        'filePath'        : '../public/files/contributors/contributors_ext.json',
        'urlPath'         : null,
        'defaultUser'     : null
    },
    init: function(refresh) { 
        
        var that = this;
             
        $(document).ready(function(){             
            that.loadConfiguration();                            
        });                
    },
    initSettings: function() {    
        //@todo do ready.js
        var data = localStorage;
        if(data.menu === 'hidden') {
            $('.settings-top-menu').removeClass('hidden').css('margin-left', '-15px');
            $('.sidebar').css('left', '-500px');
            $('.container-fluid .main').removeClass('col-sm-offset-3 col-md-offset-2 col-sm-9 col-md-10').addClass('col-sm-12 col-md-12');
        } if(data.contributors === 'hidden') {
            var b = $('#contributors_button');
            b.removeClass('hidden');
            $('.'+b.data('rel')).hide();
        } if(data.language === 'en') {
            $('.lang-button').text(data.language);
        }        
    },
    setForms: function(data) {
       
        var connectRadios = $('.contributors-settings-form input[name=connectRadio]');
        connectRadios.filter('[value='+data.defaultConnection+']').prop('checked', true);
        
        //load first all users stored in file then check
        var userRadios = $('.github-user-choose input[name=userRadio]');
        userRadios.filter('[value='+data.defaultUser+']').prop('checked', true);
       
    },   
    loadConfiguration: function() {

        var that = this;
        $.getJSON("libs/config.json").done(function(data) {                        
            that.settings.connection  = data.defaultConnection;
            that.settings.urlPath     = data.url;
            that.settings.defaultUser = data.defaultUser;
            that.setForms(data);
        }).fail(function() {
            //when fail
        }).always(function() {                
            that.getGitHubData();    
            that.getContributorData();
        });
    },
    contributorsData: function() {
    
        var that = this,
            data = {url: '../public/files/contributors/contributors.json', file: true};
    
        switch(that.settings.connection) {
            case 'default' : data  = {url: that.settings.defaultFilePath, file: true}; break;
            case 'file'    : data  = {url: that.settings.filePath, file: true}; break;
            case 'url'     : data  = {url: that.settings.urlPath, file: false}; break;            
        }        
        return data;
    },   
    gitHubUserData: function() {
        var that = this,
            data = { user: 'Dzerard'}; //me ;)
    
        if(that.settings.defaultUser !== undefined) {
            data = { user: that.settings.defaultUser};
        }
        return data;
    },
    getContributorData: function(refresh) {

        var that = this,
            c    = $('#contributors_container');
              
        $.ajax({    
            type: "POST",
            dataType: "json",
            data: that.contributorsData(),
            url: 'ext/get_contributors.php',             
            success: function(data) {
                                
                that.setData(data);                                                             
                that.sortData('asc');  
                
                c.parent().find('.loader').fadeOut('fast', function(){
                    $(this).remove();
                });
                c.parent().find('.alert').remove();
                if(data.status === 'error') {
                    c.before('<div class="alert alert-danger" style="display:none;">'+$translate('TEXT_URL_IS_BROKEN')+'</div>');
                    c.parent().find('.alert').fadeIn('medium').on('click', function(){$(this).slideUp('medium');});;
                } 
                
                if(!$.isEmptyObject(refresh) && refresh === 'refresh') {
                    //@todo
                    contributorResponse = that.data.response;
                    drawContributorChart(that.data.response);
                    return;
                } 
                
                c.hide().removeClass('hidden').fadeIn('medium', function() {
                    if(data.status !== 'error') {
                        contributorResponse = that.data.response;
                        drawContributorChart(that.data.response); 
                    }
                });
            },        
            error: function() {
                //error handling
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
    setSortData: function() {
    
        var that  = this,
            items = $('#github_content_left .list-group-item'),
            arr = [];
            
            $.each(items, function(key, item) {                
                arr.push( {
                    'id'              : $(item).data('id'),
                    'name'            : $(item).find('.repo-link').text(),
                    'description'     : $(item).find('.list-description').text(),
                    'fork'            : $(item).find('.list-fork').text(),
                    'stargazers'      : $(item).find('.list-stargazers').text(),
                    'watchers'        : $(item).find('.list-watchers').text(),
                    'language'        : $(item).find('.list-language').text(),
                    'list-calendar'   : $(item).find('.list-calendar').text()                    
                });
            });
            that.dataSort = arr;
    },            
    initGitHubFunctions: function() {
        
        var that = this;
        //@todo optymalizacja
        $('.btn-more, #github_content_left .default-info').on('click', showMore);                    
        $('.btn-stats').on('click', showGoogleStats);
        $('.btn-clone').on('click', copyTextJS);
        $('#repoSearch').on('input', repoSearch);
        $('#repoSort a').on('click', repoSort);
        $('.search-dropdown a').on('click', setSearchType);
        $('.clear-input').on('click', clearInput);
        $('.btn-hide-panel').on('click', togglePanel);
    
        that.setSortData();       
        
        
        function togglePanel() {
            var b   = $(this),
                c   = b.parents('.panel'),
                id  = c.attr('id'),
                arr = {};
        
                
                b.tooltip('hide');
                c.find('.panel-body').slideToggle('medium', function(){
                    if($(this).is(":visible")) {
                        b.attr('data-original-title', $translate('TEXT_HIDE'));
                        arr = { 'id': id, 'show' : true};                                                                
                    } else {
                        b.attr('data-original-title', $translate('TEXT_SHOW'));
                        arr = { 'id': id, 'show' : false};                        
                    }
                    
                    Storage.setHeadlines(arr);                    
                    setTimeout(function(){resizeGoogle();}, 1); //@todo
                });
                c.find('.list-group').slideToggle('medium');                       
        }
        function repoSort() {
            
            var item     = $(this),
                c        = item.parents('.btn-group'),
                sortable = [],
                sort     = item.parent().data('sort'),
                by       = item.parent().data('rel'),
                t        = item.parent().data('type'),
                cl       = 'name-sort-asc';
            
            item.parents('.dropdown-menu').find('li').removeClass('active');            
            item.parent().addClass('active');
            
            if(t !== undefined) {
                cl = 'number-sort-'+sort;
            } else {
                cl = 'name-sort-'+sort;
            }
            
            c.find('.btn-default').text(item.text()).removeClass('number-sort-asc number-sort-desc name-sort-asc name-sort-desc').addClass(cl);
            
            
            for (var items in that.dataSort) {                        
                sortable.push([items, that.dataSort[items]]);                        
                sortable.sort(function(a, b) {return a[1][by] - b[1][by];});                                     
            } 
            if(sort === 'desc') {
                sortable.reverse();
            }
                       
            $.each(sortable, function(key,item) {
                that.dataSort[key] = item[1];                        
            });

            $.each(that.dataSort, function(key, item) {
               $('[data-id="'+item.id+'"]').appendTo('#github_content_left .list-group'); 
            });
        }
        
        
        function showMore() {
            var c  = $(this).parents('.list-group-item').find('.more-info'),
                cb = c.parents('.list-group-item').find('.default-info');
                      
            if(c.hasClass('active')) {
                c.slideUp("fast", function() {
                    c.removeClass('active');
                    cb.removeClass('active');
                });
                return false;
            }
            c.slideDown("fast", function() {
                c.addClass('active');
                cb.addClass('active');
            });          
        }
        function setSearchType() {
            var item = $(this),            
                c    = item.parents('.search-dropdown'),
                t    = item.parents('.input-group').find('#repoSearchType');
        
                c.find('li').removeClass('active');                
                item.parent().addClass('active');
                t.val(item.parent().data('rel'));
        }
        
        //custom search 
        function repoSearch() {
            
            var s  = $(this).val(),
                t  = $('#repoSearchType'),
                by = $('#github_content_left .repo-link');
           
            if(t.val() !== '') {
               var nBy = $('#github_content_left .'+ t.val());
               
               if(nBy.length > 0) {
                   by = nBy;
               }               
            }
            
            if(s.length > 0) {
                $(this).parent().find('.clear-input').addClass('active');
            } else {
                $(this).parent().find('.clear-input').removeClass('active');
            }
            
            by.each(function() {
                
                var isFound = $(this).text().search(new RegExp(s, "g"));
                var isLike  = $(this).text().indexOf(s);  //taki tam like
                
                $(this).parents('.list-group-item').removeClass('hidden');
                
                if(isFound === 0 || isLike > 0) {
                    $(this).parents('.list-group-item');
                } else {
                    $(this).parents('.list-group-item').addClass('hidden');
                }
            });
        }
        
        function clearInput() {
            //simple @todo better
            var b = $(this);
            b.parent().find('input[type="text"]').val('');
            b.removeClass('active');
            $('#github_content_left .list-group-item').removeClass('hidden');
        }
        
        function showGoogleStats() {            
            alert();
            return false;            
        }
        
        function copyTextJS() {
            
            var b = $(this),
                text = b.parents('.input-group').find('.form-control').val();
            
            window.prompt("Copy to clipboard: Ctrl+C, Enter", text);

        }
        $('[data-toggle="tooltip"], .clear-input').tooltip();
        console.clear();
        console.log('find me at lukaszgielar.com ! :)');
    },
    dummyDate: function(date) {
        if(date !== 'undefined') {
            var newDate  = date.replace(/[TZ]/g, " ");
            return newDate;
        }        
    },
    getGitHubData: function(refresh) {

        var that = this;
        
        $.ajax({    
            type: "POST",
            timeoout: 10000,
            dataType: "json",
            data: that.gitHubUserData(),
            url: 'ext/get_github.php',
            beforeSend: function() {
                if(!$.isEmptyObject(refresh) && refresh === 'refresh') {
                    $('.container-content-gihub .loader').show();
                    $('#github_content_profile, #github_content_left, #github_content_right').hide();
                    $('#github_content_right').html('');
                    $('#github_content_left .list-group, #github_content_profile .panel-body').remove();
                }
            },
            success: function(data) {

                    var wrap = $('<div class="list-group"></div>');
                    
                    $.each(data.response, function(key,item) {                         
                        wrap.append('<div class="list-group-item" data-id="'+item.id+'">\n\
                                        <div class="default-info">\n\
                                            <div class="row">\n\
                                                <div class="col-md-6">\n\
                                                    <a href="'+item.html_url+'" class="repo-link" data-toggle="tooltip" data-placement="top" title="'+$translate('APP_GIT_VISIT_GITHUB')+'">'+item.name+'</a><br>\n\
                                                    <span class="list-desc list-description">'+item.description+'</span>\n\
                                                </div>\n\
                                                <div class="col-md-6">\n\
                                                    <span class="list-desc list-fork" data-toggle="tooltip" data-placement="top" title="'+$translate('APP_GIT_FORK')+'">'+item.forks_count+'</span>\n\
                                                    <span class="list-desc list-stargazers" data-toggle="tooltip" data-placement="top" title="'+$translate('APP_GIT_STARGAZERS')+'">'+item.stargazers_count+'</span>\n\
                                                    <span class="list-desc list-watchers" data-toggle="tooltip" data-placement="top" title="'+$translate('APP_GIT_WATCHERS')+'">'+item.watchers_count+'</span>\n\
                                                    <span class="list-desc bold fs11 list-language">'+item.language+'</span><br>\n\
                                                    <span class="list-desc list-calendar" data-toggle="tooltip" data-placement="top" title="'+$translate('APP_GIT_UPDATED_AT')+'">'+that.dummyDate(item.updated_at)+'</span>\n\
                                                </div>\n\
                                            </div>\n\
                                        </div>\n\
                                        <div class="flip-action">\n\
                                            <button class="btn btn-more" data-toggle="tooltip" data-placement="left" title="'+$translate('APP_GIT_MORE_INFO')+'"></button>\n\
                                            <!--<button class="btn btn-stats" data-toggle="tooltip" data-placement="left" title="'+$translate('APP_GIT_STATS')+'"></button>-->\n\
                                        </div>\n\
                                        <div class="more-info">\n\
                                            <div class="row">\n\
                                                <div class="col-md-6">\n\
                                                    <span class="list-desc bold list-default-branch">'+$translate('APP_GIT_DEFAULT_BRANCH')+'</span><br>\n\
                                                    <span class="list-desc bold list-clone-url">'+$translate('APP_GIT_CLONE_URL')+'</span><br>\n\
                                                    <span class="list-desc bold list-open-issues">'+$translate('APP_GIT_OPEN_ISSUES')+'</span>\n\
                                                </div>\n\
                                                <div class="col-md-6">\n\
                                                    <span class="list-desc">'+item.default_branch+'</span><br>\n\
                                                    <div class="input-group">\n\
                                                        <input type="text" class="form-control" value="'+item.clone_url+'" readonly="">\n\
                                                        <span class="input-group-addon">\n\
                                                            <button class="btn btn-clone"  data-toggle="tooltip" data-placement="top" title="'+$translate('APP_GIT_CLONE_REPO')+'" type="button"></button>\n\
                                                        </span>\n\
                                                    </div>\n\
                                                    <span class="list-desc">'+item.open_issues_count+'</span><br>\n\
                                                </div>\n\
                                            </div>\n\
                                        </div>\n\
                                    </div>');
                        
                        $('#github_content_left').append(wrap);                                                                                                
                    });
                    
                    var src = '\
                            <div class="panel-body">\n\
                                <div class="row">\n\
                                    <div class="col-md-6">\n\
                                        <div class="row">\n\
                                            <div class="col-md-3">\n\
                                                <a href="'+data.user.html_url+'" class="brand-logo"><img alt="'+data.user.name+'" class="img-circle" \n\
                                                 data-user="'+data.user.id+'" itemprop="image" src="'+data.user.avatar_url+'">\n\
                                                <span  data-toggle="tooltip" data-placement="top" title="'+$translate('APP_USER_TYPE_ORG')+'" class="company"></span></a>\n\
                                            </div>\n\
                                            <div class="col-md-9">\n\
                                                <span class="list-desc bold list-default-link blue"><a href="'+data.user.blog+'" target="_blank">'+data.user.blog+'</a></span><br>\n\
                                                <span class="list-desc bold list-email">'+data.user.email+'</span><br>\n\
                                                <span class="list-desc bold list-location">'+data.user.location+'</span><br><br>\n\
                                                <span class="list-desc bold list-followers" data-toggle="tooltip" data-placement="top" title="'+$translate('APP_GIT_FOLLOWERS')+'">'+data.user.followers+'</span>\n\
                                                <span class="list-desc bold list-public-repos" data-toggle="tooltip" data-placement="top" title="'+$translate('APP_GIT_PUBLIC_REPOS')+'">'+data.user.public_repos+'</span>\n\
                                                <span class="list-desc bold list-calendar-o" data-toggle="tooltip" data-placement="top" title="'+$translate('APP_GIT_CREATED_ACCOUNT')+'">'+that.dummyDate(data.user.created_at)+'</span><br>\n\
                                            </div>\n\
                                        </div>\n\
                                        <div class="panel panel-default panel-inside">\n\
                                            <div class="panel-heading">\n\
                                                <span><i class="fa fa-bolt"></i>&ensp;'+data.user.login+'</span>\n\
                                            </div>\n\
                                            <!--<div class="panel-body">\n\
                                            '+data.user.name+'\n\
                                            </div>-->\n\
                                        </div>\n\
                                    </div>\n\
                                    <div class="col-md-6">\n\
                                        <div id="github_map_canvas" data-address="'+data.user.location+'" data-display-type="ROADMAP" data-zoom-level="12" >\n\
                                        <div>\n\
                                    </div>\n\
                                </div>\n\
                            </div>\n\
                            ';
                    
                    $('#github_content_profile').append(src);
                    
                    
                    that.initGitHubFunctions();
                $('.container-content-gihub .loader').fadeOut(function(){                    
                    
                    $('#github_content_profile').hide().removeClass('hidden').fadeIn('medium', function() {
                        that.fireGoogleMap();
                        $('#github_content_left, #github_content_right').hide().removeClass('hidden').fadeIn('medium');
                    });
                        
                });        
                
                console.log(data);       
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);          
            }                     
        });
        
    },
    messages: function(m,t,c) {
        
        var type = 'alert-success';
        
        switch(t) {
            case 'err' : type = 'alert-error'; break;
            case 'inf' : type = 'alert-info'; break;                
        }
        var mess = '<div class="alert '+type+'" role="alert"></div><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><p>'+m+'</p>';

        c.find('.loader').fadeOut(function(){
            c.html(mess);                 
            c.append(mess);
        });
    },
    fireGoogleMap: function() {
        
        var map;
        
        function initialize() {
            
            var c           = $('#github_map_canvas'),
                displayType = c.data('display-type'),
                zoomLevel   = parseInt(c.data('zoom-level')),
                location    = c.data('address');
            
            switch(displayType.toUpperCase()) {
                case 'ROADMAP' : displayType   = google.maps.MapTypeId.ROADMAP; break;
                case 'SATELLITE' : displayType = google.maps.MapTypeId.SATELLITE; break;
                case 'HYBRID' : displayType    = google.maps.MapTypeId.HYBRID; break;
                case 'TERRAIN' : displayType   = google.maps.MapTypeId.TERRAIN; break;
                default : displayType          = google.maps.MapTypeId.ROADMAP; break;
            }
            
            var geocoder = new google.maps.Geocoder();
            var mapOptions = {
                scrollwheel : false,
                zoom : zoomLevel,
                mapTypeId : displayType,
                marker : 'css'
            };
            
            geocoder.geocode({
                'address' : location                
            }, function(results, status) {
                                            
                if (status == google.maps.GeocoderStatus.OK) {                                        
                    
                    if(jQuery.trim(location).length > 0) {
                        
                        map = new google.maps.Map(document.getElementById('github_map_canvas'), mapOptions);
                                                
                        var marker = new google.maps.Marker({
                            map : map,
                            position : results[0].geometry.location,                           
                            draggable:false,
                            icon: 'public/img/marker.png',
                            animation: google.maps.Animation.DROP
                        });
        
                        map.setCenter(results[0].geometry.location);
                    
                    } else {
                        
                        //nie wyswietlam mapy :P 
//                        var marker = new google.maps.Marker({
//                            map : map,
//                            position : { lat: 0, lng: 30}
//                        });
//        
//                        marker.setPosition(latlng); map.setCenter(latlng);
                        
                    }
    
                } else {
                    console.log("Geocode was not successful for the following reason: " + status);
                }
            });
            
        }
        initialize();
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

    data.addColumn('string', $translate('CONTRIBUTORS_NICK'));        
    data.addColumn('number', $translate('CONTRIBUTORS_CONTRIB'));
    data.addColumn('string', $translate('CONTRIBUTORS_TEAM'));

    $.each(response, function( key, item) {                
        arr.push([item.nickname.toString(), item.contributions, item.team.toString()]);                
    }); 

    data.addRows(arr);       
    contributorView = new google.visualization.DataView(data);       
//    contributorView.setColumns([0, 1]);

    contributorTable = new google.visualization.Table(document.getElementById('contributors_table'));
    contributorTable.draw(contributorView);

    contributorChartOptions = {
      title: $translate('CONTRIBUTORS_CHART')
      
    //  vAxis: {title: 'Year',  titleTextStyle: {color: 'red'}}
//        'width':500,'height':400
    };

    contributorViewChart = new google.visualization.DataView(data);       
    contributorViewChart.setColumns([0, 1]);

    contributorChart = new google.visualization.BarChart(document.getElementById('contributors_chart'));   
//        var chart = new google.visualization.AreaChart(document.getElementById('contributors_chart'));
    contributorChart.draw(contributorViewChart, contributorChartOptions);        

    //funkcje
    google.visualization.events.addListener(contributorTable, 'sort',
        function(event) {
            data.sort([{column: event.column, desc: !event.ascending}]);
            contributorChart.draw(contributorViewChart, contributorChartOptions);
    });

    google.visualization.events.addListener(contributorTable, 'select',
        function(event) {
       // console.log(event);
//            data.sort([{column: event.column, desc: !event.ascending}]);
//            chart.draw(view, options);
    });

    function resize () {
        contributorTable.draw(contributorView);
        contributorChart.draw(contributorViewChart, contributorChartOptions);           
    }

    window.onload = resize();
    window.onresize = resize;     
}
       
//@todo lepsza implementacja
function resizeGoogle() {
    
    if(!$.isEmptyObject(contributorTable)) {
        contributorTable.draw(contributorView);
        contributorChart.draw(contributorViewChart, contributorChartOptions);                  
    } else {
        setTimeout(function(){resizeGoogle;},500);
    }
}

var Storage = {
    setItemInfo: function(item, info) {
        localStorage.setItem(item, info);
    },
    setHeadlines: function(arr) {
        var headlines = localStorage.getItem('hide_headlines');
  
        if(headlines) {
        
            var test = headlines.split(",");
          
          
            if($.inArray(arr.id, test) > -1) {
  
                var index = $.inArray(arr.id, test);   
                
                if(arr.show == true) {                                                        
                   test.splice(index, 1);
                }    
            } else {
                test.push(arr.id);
            }
            
            localStorage.setItem('hide_headlines', test.join(','));                
        } else {
            headlines = [];
            if(arr.show == false) {
                headlines.push(arr.id);
                localStorage.setItem('hide_headlines', headlines.join(','));    
            }            
        }                         
    }
      
};