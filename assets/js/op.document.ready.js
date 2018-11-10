$(function() {
    "user strict"
    heightChanged = function() {
        var headOffset = $('#head-height-offset').height();
        var obj = $('#menu-fluid-container');
        obj.css('margin-top', headOffset + 'px');
        obj.css('height', ($(window).height() - headOffset) + 'px');

        var footerContainer = $('#footer-container');
        var bodyContainer = $('#body-container').css('min-height', $(window).height() - footerContainer.height() - 20);
        
    };
    $(window).resize(heightChanged).load(heightChanged);
    $('#button-show-menu').click(function() {
        $('#body').toggleClass('show-fluid');
        if(!$('#body').hasClass('show-fluid')) {
            etCookie.setCookie('imn', 'yes');
        } else {
            etCookie.removeCookie('imn');
        }
    });
    var imnValue = etCookie.getCookie('imn');
    if(imnValue == "yes") {
        $('#body').removeClass('show-fluid');
    }
    
    $overlayObj = $('<div class="ui-widget-overlay data-picker-overlay"></div>').hide().appendTo('body');
    $overlayObj.click(function() {
        if($overlayObj.attr('data-dimis') == 'true') {
            hideDialogOverlay();
            $('#mainEmpTabs').removeClass('open');
        }
    });
    showDialogOverlay = function() {
    }
    hideDialogOverlay = function() {
        $overlayObj.fadeOut();
    }
    showDialogOverlay = function(flag) {
        if($('.ui-widget-overlay').filter(':visible').length > 0) {
            return;
        }
        if(!flag) {
            $overlayObj.attr('data-dimis', false)
        } else {
            $overlayObj.attr('data-dimis', true);
        }
        $overlayObj.fadeIn(); 
    }
    __d('click', '[data-open-panel]', function() {
        var $this = $(this);
        var $target = $($this.attr('data-open-panel'));
        if(!$target) return;
        if(true == $target.attr('open')) {
            $target.removeAttr('open');
            $('#customize-overlay').hide();
        } else {
            $target.attr('open', "true"); 
            $('#customize-overlay').show();
        }
    });
    __d('click', '#customize-overlay', function() {
        $('.customize-panel').removeAttr('open');
        $('#customize-overlay').hide();
    });
    function f_updateMenuActive() {
        var field = 'menuCode';
        var url = window.location.href;
        var index = 0;
        if(url.indexOf('?' + field + '=') != -1)
            index = url.indexOf('?' + field + '=');
        else if(url.indexOf('&' + field + '=') != -1)
            index = url.indexOf('&' + field + '=');
        if(index > 0) {
            var aId = url.substring(index + field.length + 2, url.length);
            try{
                var menuA = $('#menu-fluid-container').find('a#' + aId);
                if(menuA.length > 0) {
                    menuA.addClass('active');
                }
            } catch(e) {
                console.log(e);
            }
        }
        return false
    }
    f_updateMenuActive();
});
__d = function(a, b, c) {
    $('body').on(a, b, c);
};
