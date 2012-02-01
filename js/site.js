var currentZIndex;
var draggingZIndex = 1;
var dragging = false;

/**
 * Function to get random number upto m
 * http://roshanbh.com.np/2008/09/get-random-number-range-two-numbers-javascript.html
 */
var randomXToY = function(minVal, maxVal, floatVal) {
    var randVal = minVal + (Math.random() * (maxVal - minVal));
    return typeof floatVal == 'undefined' ? Math.round(randVal) : randVal.toFixed(floatVal);
};

/**
 * Inits the navigation (animation, text, etc.)
 * http://www.htmldrive.net/items/show/199/jQuery-and-CSS3-Awesome-Slide-Down-Box-Menu
 */
var initNavigation = function() {
    /**
     * For each menu element, on mouseenter,
     * we enlarge the image, and show both sdt_active span and
     * sdt_wrap span. If the element has a sub menu (sdt_box),
     * then we slide it - if the element is the last one in the menu
     * we slide it to the left, otherwise to the right
     * http://www.htmldrive.net/items/show/199/jQuery-and-CSS3-Awesome-Slide-Down-Box-Menu
     */
    $('#sdt_menu > li').bind('mouseenter',
        function() {
            $('html, body').animate({ scrollTop: 0 }, 0);
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

/**
 * I am using my Flickr Images for this, however the size that is better is the small,
 * but it is still a big too big, so I resize it by reducing the image and the div
 * by 25%.
 */
var processImageSize = function(resizeImage, container) {
    $("img", $("#" + container)).each(function() {
        $(this).load(function() {
            var width = $(this).width();
            var height = $(this).height();

            if (resizeImage) {
                width = width - (width * 0.25);
                height = height - (height * 0.25);
                $(this).width(width);
                $(this).height(height);
            }

            var cssObj = {
                'width': width + "px",
                'height': height + "px"
            };
            $(this).parent().parent().css(cssObj);

        });
    });
};

/**
 * It rotates and randomly position each image in the gallery container.
 */
var rotatePictures = function() {
    $(".polaroid").each(function () {
        if (Math.round(Math.random()) == 1) {
            var rotationDegrees = randomXToY(330, 360); // rotate left
        } else {
            var rotationDegrees = randomXToY(0, 30); // rotate right
        }
        $(this).attr("rotationDegrees", rotationDegrees);

        var position = $(this).parent().offset();
        var wiw = $(this).parent().width();
        var wih = $(this).parent().height();

        var leftPosition = Math.round(Math.random() * (wiw - $(this).width()) + position.left);
        var topPosition = Math.round(Math.random() * (wih - position.top));

        var cssObj = {
            'left' : leftPosition + 'px',
            'top' : topPosition + 'px',
            '-webkit-transform' : 'rotate(' + rotationDegrees + 'deg)',  // safari only
            '-moz-transform' : 'rotate(' + rotationDegrees + 'deg)',  // firefox only
            'tranform' : 'rotate(' + rotationDegrees + 'deg)' // added in case CSS3 is standard
        };
        $(this).css(cssObj);
    });
};

/**
 * Inits each poloroid image, rotating, positioning them and setting different events
 * like mouseover, mouseout and dragging.
 */
var initPictures = function(resizeImage, container) {
    processImageSize(resizeImage, container);
    rotatePictures();

    $(".polaroid").each(function() {
        $(this).mouseover(function(e) {
            if (!dragging) {
                // Bring polaroid to the foreground
                currentZIndex = $(this).css("z-index");
                var cssObj = {
                    'z-index' : draggingZIndex + 1,
                    'transform' : 'rotate(0deg)',     // added in case CSS3 is standard
                    '-moz-transform' : 'rotate(0deg)',  // firefox only
                    '-webkit-transform' : 'rotate(0deg)', // safari only
                    'box-shadow' : '#888 3px 5px 5px', // added in case CSS3 is standard
                    '-webkit-box-shadow' : '#888 3px 5px 5px', // safari only
                    '-moz-box-shadow' : '#888 3px 5px 5px', // firefox only
                    'padding-left' : '-5px',
                    'padding-top' : '-5px'
                };
                $(this).css(cssObj);
            }
        });

        $(this).mouseout(function(e) {
            if (!dragging) {
                // Bring polaroid to the foreground
                var rotationDegrees = $(this).attr("rotationDegrees");
                var cssObj = {
                    'box-shadow' : '', // added in case CSS3 is standard
                    '-webkit-box-shadow' : '', // safari only
                    '-moz-box-shadow' : '', // firefox only
                    'z-index': currentZIndex,
                    'transform' : 'rotate(' + rotationDegrees + 'deg)',     // added in case CSS3 is standard
                    '-moz-transform' : 'rotate(' + rotationDegrees + 'deg)',  // firefox only
                    '-webkit-transform' : 'rotate(' + rotationDegrees + 'deg)' // safari only
                };
                $(this).css(cssObj);
            }
        });

        // Make the polaroid draggable & display a shadow when dragging
        $(this).draggable({
            containment: 'parent',
            cursor: 'crosshair',

            start: function(event, ui) {
                dragging = true;
                draggingZIndex++;
                currentZIndex = draggingZIndex;
                var cssObj = {
                    'box-shadow' : '#888 3px 5px 5px', // added in case CSS3 is standard
                    '-webkit-box-shadow' : '#888 3px 5px 5px', // safari only
                    '-moz-box-shadow' : '#888 3px 5px 5px', // firefox only
                    'padding-left' : '-5px',
                    'padding-top' : '-5px',
                    'z-index' : draggingZIndex
                };
                $(this).css(cssObj);
            },

            stop: function(event, ui) {
                var tempVal = Math.round(Math.random());
                if (tempVal == 1) {
                    var rotationDegrees = randomXToY(330, 360); // rotate left
                } else {
                    var rotationDegrees = randomXToY(0, 30); // rotate right
                }
                $(this).attr("rotationDegrees", rotationDegrees);
                var cssObj = {
                    'box-shadow' : '', // added in case CSS3 is standard
                    '-webkit-box-shadow' : '', // safari only
                    '-moz-box-shadow' : '', // firefox only
                    'transform' : 'rotate(' + rotationDegrees + 'deg)', // added in case CSS3 is standard
                    '-webkit-transform' : 'rotate(' + rotationDegrees + 'deg)', // safari only
                    '-moz-transform' : 'rotate(' + rotationDegrees + 'deg)', // firefox only
                    'margin-left' : '0px',
                    'margin-top' : '0px',
                    'z-index': draggingZIndex
                };
                $(this).css(cssObj);
                dragging = false;
            }
        });

    });
};

/**
 * Method to shuffle the images again.
 */
var shuffle = function() {
    if (!dragging) {
        rotatePictures();
        draggingZIndex = 1;
    }
};

var getURLParameter = function(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [,null])[1]
    );
};

var apiKey = "cb6ebb8677771edd1fc882540576c44c";
var initMainGalleria = function() {
    var setName = getURLParameter("n");
    $("#set-name").html(setName);

    var setId = getURLParameter("id");

    var flickrApiUrl = "http://api.flickr.com/services/rest/?format=json&method=flickr.photosets.getPhotos&photoset_id=" + setId + "&api_key=" + apiKey + "&jsoncallback=?&extras=url_t,url_m";
    $.getJSON(flickrApiUrl, function(data) {
        var imgThumbs = new Array();
        var imgLinks = new Array();
        $.each(data.photoset.photo, function(i, photo) {
            imgThumbs[i] = photo.url_t;
            imgLinks[i] = photo.url_m;
        });

        $.preload(imgThumbs, {
            loaded_all: function(loaded, total) {

                $.each(data.photoset.photo, function(i, photo) {
                    var li = $("<li/>");
                    var aHref = $("<a href='" + photo.url_m + "'></a>");
                    var img = $("<img/>").attr("src", photo.url_t).attr("title", photo.title);
                    img.appendTo(aHref);
                    aHref.appendTo(li);
                    li.appendTo($(".ad-thumb-list"));
                });

                $(".ad-loader").hide();

                // Init the gallery
                var galleries = $('.ad-gallery').adGallery({
                    loader_image: 'images/loader.gif',
                    width: 750, // Width of the image, set to false and it will read the CSS width
                    height: 450, // Height of the image, set to false and it will read the CSS height
                    thumb_opacity: 0.7, // Opacity that the thumbs fades to/from, (1 removes fade effect)
                    // Note that this effect combined with other effects might be resource intensive
                    // and make animations lag
                    start_at_index: 0, // Which image should be displayed at first? 0 is the first image
                    // to be placed somewhere else than on top of the image
                    slideshow: {
                        enable: true,
                        autostart: false,
                        speed: 2000,
                        start_label: 'Start',
                        stop_label: 'Stop',
                        stop_on_scroll: true, // Should the slideshow stop if the user scrolls the thumb list?
                        countdown_prefix: '(', // Wrap around the countdown
                        countdown_sufix: ')',
                        onStart: function() {
                            // Do something wild when the slideshow starts
                        },
                        onStop: function() {
                            // Do something wild when the slideshow stops
                        }
                    },
                    effect: 'slide-hori', // or 'slide-vert', 'resize', 'fade', 'none' or false
                    enable_keyboard_move: true, // Move to next/previous image with keyboard arrows?
                    cycle: true  // If set to false, you can't go from the last image to the first, and vice versa
                });

            }
        });

        $.preload(imgLinks);

    });
};

var showAlbumSelected = function() {
    var setId = getURLParameter("id");
    var photo = $("#pId" + setId);
    if (photo && photo.parent()) {
        // Bring polaroid to the foreground
        currentZIndex = photo.css("z-index");
        var cssObj = {
            'z-index' : draggingZIndex + 1,
            'transform' : 'rotate(0deg)',     // added in case CSS3 is standard
            '-moz-transform' : 'rotate(0deg)',  // firefox only
            '-webkit-transform' : 'rotate(0deg)', // safari only
            'box-shadow' : '#888 3px 5px 5px', // added in case CSS3 is standard
            '-webkit-box-shadow' : '#888 3px 5px 5px', // safari only
            '-moz-box-shadow' : '#888 3px 5px 5px', // firefox only
            'padding-left' : '-5px',
            'padding-top' : '-5px',
            'top': photo.parent().offset().top - 300,
            'left': photo.parent().offset().left
        };
        photo.css(cssObj);
        photo.unbind('mouseover');
        photo.unbind('mouseout');
    }
};