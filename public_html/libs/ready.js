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
    
    function refreshClosestData() {
        var b = $(this);
        XFormation.init('refresh');
        return false;
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
            $('#myModal').modal('show');
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
            c = $(this).parent().find('.'+b.data('rel'));
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
        resizeGoogle();
    }
    
    //bootstrap
    $(function () { $('[data-toggle="tooltip"]').tooltip(); });                    
});