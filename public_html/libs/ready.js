/* 
 * Luke -> lukaszgielar.com
 */

$(document).ready(function() {
    
    XFormation.initSettings();      
    
    $('.toogle-sidebar').on('click', hideSettings);
    $('.settings-top-menu').on('click', showSettings);
    $('.activate-settings-button').on('click', activateSettingsMenu);
    $('.show-settings > li > a').on('click', settingsMenuOptions);    
    $('#contributors_refresh').on('click', refreshClosestData);    
    $('#contributors_button').on('click', showHideContent);
    $('.page-header').on('click', hideShowContent);
    $('.contributors-upload').on('submit', saveAndRefreshList);
    $('.contributors-url').on('submit', saveContributorsUrl);
    $('.contributors-settings-form').on('submit', saveContributorSettings);
    $('.github-user-choose').on('submit', loadGitHubProfile);
    $('.lang-switch li a').on('click', switchLangAndSave);
    
    //@todo wyniesc funkcje do obiektu ;)
    function showHideContent() {
        var b  = $(this),
            c  = $('.'+b.data('rel'));            
    
        b.fadeOut('fast', function(){
            b.addClass('hidden').removeClass('a-f-b').show();
            c.slideDown('fast');
            
            Storage.setItemInfo('contributors', 'visible');            
            resizeGoogleCharts();
        });       
    }
    
    function switchLangAndSave() {
        
        var b    = $(this),
            lang = b.data('lang'),
            c    = b.parents('.lang-switch').find('.lang-button');
                    
        c.text(lang);
        Storage.setItemInfo('language', lang);      
        XFormation.getContributorData('refresh');                
        
        return false;
    }
    
    function loadGitHubProfile() {
        var form = $(this);
                
        form.parent().find('.alert').remove(); 
        form.parent().find('.loader').remove(); 
       
        $.ajax({
            type: "POST",
            dataType: "json",
            data: form.serialize(),
            url: form.attr('action'),                          
            beforeSend: function() {
                form.hide().before('<div class="loader"></div>');                                
            },
            success : function(result) {

                form.parent().find('.loader').fadeOut('medium', function() {
                    form.before('<div class="alert alert-success">'+$translate('TEXT_OK_GITHUB_USER_SETTINGS_SAVED')+'</div>');
                });    
                
                var user = form.find('input[name=userRadio]:checked').val();
                refreshGitHubUser(user);
  
                setTimeout(function() {
                    form.parent().find('.alert').fadeOut(function() {                
                        form.slideDown('fast');                        
                    });
                }, 2000);
            },
            error : function(xmlHttpRequest, textStatus, errorThrown) {
//                    console.log(errorThrown);
            }
        });                                                           
        return false;   
    }
    function saveContributorSettings() {
        var form = $(this);
                
        form.parent().find('.alert').remove(); 
        form.parent().find('.loader').remove(); 
        
        $.ajax({
            type: "POST",
            dataType: "json",
            data: form.serialize(),
            url: form.attr('action'),                          
            beforeSend: function() {
                form.hide().before('<div class="loader"></div>');                                
            },
            success : function(result) {

                form.parent().find('.loader').fadeOut('medium', function() {
                    form.before('<div class="alert alert-success">'+$translate('TEXT_OK_C_SETTINGS_SAVED')+'</div>');
                });    
                
                var by = form.find('input[name=connectRadio]:checked').val();
                refreshContributors(by);
                
                setTimeout(function() {
                    form.parent().find('.alert').fadeOut(function() {                
                        form.slideDown('fast');                        
                    });
                }, 2000);
            },
            error : function(xmlHttpRequest, textStatus, errorThrown) {
//                    console.log(errorThrown);
            }
        });                                                           
        return false;           
    }
    
    function saveContributorsUrl() {
        var form = $(this),
            url  = form.find('input').val();
                
        form.parent().find('.alert').remove(); 
        form.parent().find('.loader').remove(); 
        
        if(url === '') {
          form.before('<div class="alert alert-danger">'+$translate('TEXT_URL_CANT_EMPTY')+'</div>');              
        } else {
        
            $.ajax({
                type: "POST",
                dataType: "json",
                data: {url: form.find('input').val()},
                url: form.attr('action'),                          
                beforeSend: function() {
                    form.hide().before('<div class="loader"></div>');                                
                },
                success : function(result) {
            
                    form.parent().find('.loader').fadeOut('medium', function() {
                        form.before('<div class="alert alert-success">'+$translate('TEXT_OK_URL_SAVED')+'</div>');
                    });    
                    
                    XFormation.settings.urlPath = form.find('input').val();
                    
                    setTimeout(function() {
                        form.parent().find('.alert').fadeOut(function() {
                            form[0].reset();
                            form.slideDown('fast');                            
                        });
                    }, 2000);
                },
                error : function(xmlHttpRequest, textStatus, errorThrown) {
    //                    console.log(errorThrown);
                }
            });                                                           
            return false;   
        }
            
            return false;
        }
    
    function saveAndRefreshList() {
        
        var form = $(this);
        var filename  = $('#contibutorsFileUpload').val(),
            extension = filename.replace(/^.*\./, '');

        if (extension == filename) {
            extension = '';
        } else {
            extension = extension.toLowerCase();
        }
        
        //clear alerts
        form.parent().find('.alert').remove(); 
        
        if(extension !== 'json') {
            form.before('<div class="alert alert-danger">'+$translate('TEXT_WRONG_FILE')+'</div>');            
        } else {
           
            var formData = new FormData(form[0]);
            
            $.ajax({
                type : 'POST',                       
                url : form.attr('action'),
                data : formData,
                async: false,  
                cache: false,
                contentType: false,
                processData: false,
                dataType: "json",
                
                beforeSend: function() {
                    form.hide().before('<div class="loader"></div>');                                
                },
                success : function(result) {
                                                        
                    if(!$.isEmptyObject(result.response)) {
                        form.parent().find('.loader').fadeOut('medium', function() {
                            form.before('<div class="alert alert-success">'+$translate('TEXT_OK_FILE')+'</div>');
                        });    
                    } else {
                       form.parent().find('.loader').fadeOut('medium', function() {
                            form.before('<div class="alert alert-danger">'+$translate('ERROR_BAD_EXTENSION')+'</div>');
                        });  
                    }
                },
                error : function(xmlHttpRequest, textStatus, errorThrown) {
//                    console.log(errorThrown);
                }
            });                                                           
            return false;            
        }
        
        return false;
    }
   
    function hideShowContent() {
        var b  = $(this),
            c  = $('.'+b.data('rel')),
            cb = $('#'+b.data('button'));
    
        c.slideUp('fast', function(){
            cb.removeClass('hidden').fadeIn('medium', function() {
                cb.addClass('a-f-b');
                Storage.setItemInfo('contributors', 'hidden');
                resizeGoogleCharts();
            });
        });
    }
    
    function refreshClosestData() {
        //@todo
        XFormation.getContributorData('refresh');
        return false;
    }
    
    function refreshContributors(by) {        
        XFormation.settings.connection = by;
        XFormation.getContributorData('refresh');
        return false;
    }
    
    function refreshGitHubUser(user) {
        XFormation.settings.defaultUser = user;
        XFormation.getGitHubData('refresh');
    }
    
        
    function settingsMenuOptions() {      
        var b = $(this);       
        
        if(b.data('rel') !== 'undefined') {
            var c = $(this).parent().find('.'+b.data('rel'));
            if(b.hasClass('active')) {
                c.slideUp('fast',function(){
                    b.removeClass('active');
                });
                return;
            } 
            c.slideDown('fast',function(){
                b.addClass('active');
            });
        }
    }
    
    function hideSettings(button) {
        
        var b = $(this);
        if(button != 'undefined' && (button instanceof $)) { b = button; }        
        var width = b.parent().width()+100;

        b.tooltip('hide');
        b.parent().animate({left: -width},'medium', function(){            
            $('.settings-top-menu').removeClass('hidden').animate({marginLeft: '-15px'},'medium', function(){
                //$('.settings-top-menu').focus();
                resizeGoogleCharts();
            });
            $('.container-fluid .main').removeClass('col-sm-offset-3 col-md-offset-2 col-sm-9 col-md-10').addClass('col-sm-12 col-md-12');
            Storage.setItemInfo('menu', 'hidden');
        });
    }   
    
    function showSettings() {
        
        var b = $(this),
            c = $('.toogle-sidebar').parent();

            b.tooltip('hide');
            //$('#myModal').modal('show');
            b.animate({marginLeft: '-65px'},'medium', function(){
                b.addClass('hidden');
                $('.container-fluid .main').removeClass('col-sm-12 col-md-12').addClass('col-sm-offset-3 col-md-offset-2 col-sm-9 col-md-10');
                c.animate({left: 0},'medium', function(){
                Storage.setItemInfo('menu', 'visible');
                resizeGoogleCharts();
                });  
            });               
    }
   
    function activateSettingsMenu() {    
        var b = $(this),
            c = $(this).parent().find('#'+b.data('rel'));
            if(b.hasClass('active')) {
                c.slideUp('fast',function(){
                    b.removeClass('active');
                });
                return;
            } 
            c.slideDown('fast',function(){
                b.addClass('active');
            });
        return false;
    }
    
    function resizeGoogleCharts() {
        setTimeout(function(){resizeGoogle();},300);
    }
    
    //bootstrap
    $(function () { $('[data-toggle="tooltip"]').tooltip(); });                    
    
    function log( message ) {
      $( "<div>" ).text( message ).prependTo( "#log" );
      $( "#log" ).scrollTop( 0 );
    }
 
    $( "#searchGitUser" ).autocomplete({
      source: function( request, response ) {
        $.ajax({
          url: 'ext/get_github_user.php',
          dataType: "json",
          type: "POST",
          data: {
            q: request.term
          },
          success: function( data ) {
              //console.log(data);
              response( data.users );
            
          }
        });
      },
      minLength: 3,
      select: function( event, ui ) {
          //open dialog bedzie :P 
        log( ui.item ?
          "Selected: " + ui.item.label :
          "Nothing selected, input was " + this.value);
      },
      open: function() {
        $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
      },
      close: function() {
        $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
      }
    }).data("ui-autocomplete")._renderItem = function( ul, item ) {
      return $( "<li>" )
        .append( "<a>"+ item.username +"</a>" )
        .appendTo( ul );
    };
});