var currentZIndex = 1;

var initNavigation = function() {
    /**
     * for each menu element, on mouseenter,
     * we enlarge the image, and show both sdt_active span and
     * sdt_wrap span. If the element has a sub menu (sdt_box),
     * then we slide it - if the element is the last one in the menu
     * we slide it to the left, otherwise to the right
     * http://www.htmldrive.net/items/show/199/jQuery-and-CSS3-Awesome-Slide-Down-Box-Menu
     */
    $('#sdt_menu > li').bind('mouseenter',
        function() {
            var $elem = $(this);
            $elem.find('img')
                .stop(true)
                .animate({
                    'width':'170px',
                    'height':'170px',
                    'left':'0px'
                }, 400, 'easeOutBack')
                .andSelf()
                .find('.sdt_wrap')
                .stop(true)
                .animate({'top':'140px'}, 500, 'easeOutBack')
                .andSelf()
                .find('.sdt_active')
                .stop(true)
                .animate({'height':'170px'}, 300, function() {
                    var $sub_menu = $elem.find('.sdt_box');
                    if ($sub_menu.length) {
                        var left = '170px';
                        if ($elem.parent().children().length == $elem.index() + 1)
                            left = '-170px';
                        $sub_menu.show().animate({'left':left}, 200);
                    }
                });
        }).bind('mouseleave', function() {
            var $elem = $(this);
            var $sub_menu = $elem.find('.sdt_box');
            if ($sub_menu.length)
                $sub_menu.hide().css('left', '0px');

            $elem.find('.sdt_active')
                .stop(true)
                .animate({'height':'0px'}, 300)
                .andSelf().find('img')
                .stop(true)
                .animate({
                    'width':'0px',
                    'height':'0px',
                    'left':'85px'}, 400)
                .andSelf()
                .find('.sdt_wrap')
                .stop(true)
                .animate({'top':'25px'}, 500);
        });
};

var processPolaroidSize = function() {
    $("img", $("#gallery")).each(function() {
        $(this).load(function() {
            var width = $(this).width();
            var height = $(this).height();

            width = width - (width * 0.25);
            height = height - (height * 0.25);

            $(this).width(width);
            $(this).height(height);

            var cssObj = {
                'width': width + "px",
                'height': height + "px"
            };
            $(this).parent().parent().css(cssObj);

        });
    });
};

// Function to get random number upto m
// http://roshanbh.com.np/2008/09/get-random-number-range-two-numbers-javascript.html
var randomXToY = function(minVal, maxVal, floatVal) {
    var randVal = minVal + (Math.random() * (maxVal - minVal));
    return typeof floatVal == 'undefined' ? Math.round(randVal) : randVal.toFixed(floatVal);
};

$(document).ready(function() {
    // Executed once all the page elements are loaded
    initNavigation();
    
    processPolaroidSize();

    $(".polaroid").each(function () {
        var tempVal = Math.round(Math.random());
        if (tempVal == 1) {
            var rotationDegrees = randomXToY(330, 360); // rotate left
        } else {
            var rotationDegrees = randomXToY(0, 30); // rotate right
        }

        var position = $(this).parent().offset();
        var wiw = $(this).parent().width();
        var wih = $(this).parent().height();

        var leftPosition = Math.random() * (wiw - $(this).width()) + position.left;
        var topPosition = Math.random() * (wih - position.top);

        var cssObj = {
            'left' : leftPosition,
            'top' : topPosition,
            '-webkit-transform' : 'rotate(' + rotationDegrees + 'deg)',  // safari only
            '-moz-transform' : 'rotate(' + rotationDegrees + 'deg)',  // firefox only
            'tranform' : 'rotate(' + rotationDegrees + 'deg)' }; // added in case CSS3 is standard
        $(this).css(cssObj);
        $(this).attr("rotationDegrees", rotationDegrees);
    });

    $(".polaroid").mouseover(function(e) {
        // Bring polaroid to the foreground
        currentZIndex = $(this).css("z-index");
        var cssObj = { 'z-index' : 100,
            'transform' : 'rotate(0deg)',     // added in case CSS3 is standard
            '-moz-transform' : 'rotate(0deg)',  // firefox only
            '-webkit-transform' : 'rotate(0deg)' };  // safari only
        $(this).css(cssObj);
    });

    $(".polaroid").mouseout(function(e) {
        // Bring polaroid to the foreground
        var rotationDegrees = $(this).attr("rotationDegrees");
        var cssObj = {
            'z-index': currentZIndex,
            'transform' : 'rotate(' + rotationDegrees + 'deg)',     // added in case CSS3 is standard
            '-moz-transform' : 'rotate(' + rotationDegrees + 'deg)',  // firefox only
            '-webkit-transform' : 'rotate(' + rotationDegrees + 'deg)' // safari only
        };
        $(this).css(cssObj);
    });

});

