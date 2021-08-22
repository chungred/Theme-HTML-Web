(function($){

    $.fn.extend({ 

        lightninBox : function(options){


            var settings = {
                    padding: 20,
                    margin: 20,
                    gallery: true,
                    loaderSource: 'img/loader.gif'
                };

            $.extend(settings, options);

            var trigger;
            var src;
            var $lightninBox;
            var $screen;
            var $loader;
            var $close;
            var gallery = {};
            var $content;


            function init() {

                size.init(options);
                build.init(function() {

                    size.setOriginal();
                    size.set(openLightninBox);
                });

            }

            function isImage() {

                return src.indexOf("jpg") >-1 || src.indexOf("gif") >-1 || src.indexOf("png") >-1 || src.indexOf("bmp") >-1;
            }

            window.browserInformation = {
                isOs : ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false ),
                isAndroid: ((navigator.userAgent.indexOf('Mozilla/5.0') > -1 && navigator.userAgent.indexOf('Android ') > -1 && navigator.userAgent.indexOf('AppleWebKit') > -1) && (navigator.userAgent.indexOf('Version') > -1))
            };

            var build = {

                init: function(callback) {
                    if (!document.getElementById("lightninBox-screen")) {
                        $("body").append("<div id='lightninBox-screen' />");
                    }
                    if (!document.getElementById("lightninBox")) {
                        $("body").append("<div id='lightninBox'></div>");
                    }
                    if (!document.getElementById("lightninBox-loader")) {
                        $("body").append("<img id='lightninBox-loader' src='"+settings.loaderSource+"'></div>");
                    }
                    $screen = $("#lightninBox-screen");
                    $lightninBox = $("#lightninBox");
                    $lightninBox.append("<button class='lb-close'>Close</button>");
                    $loader = $("#lightninBox-loader");
                    $close = $lightninBox.children(".lb-close");

                    addCloseListeners();

                    var _build = isImage() ? this.image : this.player,
                        $slides = gallery.slides();

                    if ($slides && settings.gallery) gallery.init($slides);
                    $loader.addClass("lb-visible");
                    _build(function(_file) {
                        $loader.removeClass("lb-visible");
                        $content = $(_file);
                        $lightninBox.append($content);
                        callback();

                    });
                },

                image: function(callback) {
                    var _image = new Image();

                    _image.onload = function() { 
                        _image.onload = null; 
                        callback(_image); 
                    };

                    _image.src = src;
                },

                player: function(callback) {
                    var _video = document.createElement("video");
                    _video.preload = "auto";
                    _video.autoplay = true;
                    _video.controls = true;

                    if (!window.browserInformation.isOs && !window.browserInformation.isAndroid ) {
                        _video.onloadedmetadata = function() {
                            _video.onload = null; 
                            callback(_video);
                        };
                    } else {
                        setTimeout(callback(_video),0);
                    }

                    _video.src = src;
                }

            };

            var size = {

                padding: 0,
                margin: 0,
                outerMargin: 0,
                height: 0,
                width: 0,
                init: function(options) {

                    this.padding = settings.padding;
                    this.margin = settings.margin;
                    this.outerMargin = size.padding * 2 + size.margin * 2;

                },

                set: function(callback) {
                    if (!$screen.add($lightninBox).hasClass("lb-invisible"))$screen.add($lightninBox).addClass("lb-invisible");
                    this.height = this.original.height;
                    this.width = this.original.width;

                    this.setHeight();
                    this.setWidth();
                    $screen.add($lightninBox).removeClass("lb-invisible");
                    if (callback) callback();

                },

                setOriginal: function() {
                    $screen.add($lightninBox).addClass("lb-invisible");
                    size.original = {
                        height: $content.height(),
                        width: $content.width()
                    };
                },

                setHeight: function() {
                    if (this.height + this.outerMargin > window.innerHeight) {

                        var newHeight = window.innerHeight - this.outerMargin;
                        var percentage = Math.round(newHeight * 1 / this.height *100)/100;
                        var newWidth = this.width*percentage;

                        if(this.width*percentage + this.outerMargin > window.innerWidth) {
                            newWidth = window.innerWidth - this.outerMargin;
                            percentage = Math.round(newWidth * 1 / this.width *100)/100;
                            newHeight = this.height*percentage;
                        }

                        this.height = newHeight;
                        this.width = newWidth;

                        $content.css({
                            height: newHeight,
                            width: newWidth
                        });

                    }

                },

                setWidth: function() {
                    if (this.width + this.outerMargin > window.innerWidth) {

                        var newWidth = window.innerWidth - this.outerMargin;
                        var percentage = Math.round(newWidth * 1 / this.width *100)/100;
                        var newHeight = this.height*percentage;

                        if(this.height*percentage + this.outerMargin > window.innerHeight) {
                            newHeight = window.innerHeight - this.outerMargin;
                            percentage = Math.round(newHeight * 1 / this.height *100)/100;
                            newWidth = this.width*percentage;
                        }

                        this.height = newHeight;
                        this.width = newWidth;

                        $content.css({
                            height: newHeight,
                            width: newWidth
                        });

                    }
                }
            };



            function addCloseListeners() {

                $screen.add($close).on("click", function(e) {

                    e.preventDefault();

                    closeLightninBox();
                    $screen.off("click");
                    $close.off("click");

                });
            }

            function openLightninBox() {
                trigger.opened = 1;
                $screen.add($lightninBox).addClass("lb-visible");
            }

            function closeLightninBox() {
                trigger.opened = 0;
                $lightninBox.addClass("lb-lightbox-fade-out");
                $screen.addClass("lb-screen-fade-out");
                $lightninBox.on('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function () {
                    $lightninBox.removeClass("lb-visible lb-lightbox-fade-out");
                    $lightninBox.off('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd').empty();
                    $screen.removeClass("lb-visible lb-screen-fade-out");
                });
            }

            gallery = {

                active: 0,

                init: function($group) {

                    var _this = this;
                    _this.sources= [];
                    _this.$prev = $("<button class='lb-prev'></button>");
                    _this.$next = $("<button class='lb-next'></button>");

                   $group.each(function(i) {

                        _this.sources.push($(this).attr('href'));
                        if ($(this).attr('href') === src) _this.active = i;
                   });
                   _this.displayArrows();
                   $lightninBox.append(_this.$prev).append(_this.$next);

                   _this.$prev.on("click", $.proxy(_this.goToPrev, _this));
                   _this.$next.on("click", $.proxy(_this.goToNext, _this));

                },

                slides: function() {
                    _lbGroup = $(trigger).attr("data-lb-group");
                    if (!_lbGroup || $(".lightninBox[data-lb-group="+_lbGroup+"]").length<=1) return false;
                    else return $(".lightninBox[data-lb-group="+_lbGroup+"]");
                },

                goToPrev: function() {

                    if (this.active>0) {
                        --this.active;
                        this.setSrc();
                    }
                },

                goToNext: function() {
                    if (this.active<this.sources.length-1) {
                        ++this.active;
                        this.setSrc();
                    }
                },

                setSrc: function() {
                    var _this = this;
                    src = _this.sources[_this.active];
                    var _build = isImage() ? build.image : build.player;

                    _build(function(_file) {

                        $content.fadeOut(function() {
                            $content.remove();
                            $lightninBox.prepend($(_file));
                            $content = $lightninBox.find("img,video");
                            size.set(function() {
                                $content.hide().fadeIn();
                                _this.displayArrows();
                            });
                        });

                    });

                },

                displayArrows: function() {
                    if (this.active>0) this.$prev.addClass("lb-enabled");
                    else this.$prev.removeClass("lb-enabled");
                    if (this.active<this.sources.length-1) this.$next.addClass("lb-enabled");
                    else this.$next.removeClass("lb-enabled");
                }

            };

            $(this).on("click", function(e) {

                e.preventDefault();
                trigger = this;
                src = $(this).attr('href');
                trigger.opened = 0;
                init();

            });

            $(window).on("resize", function() {
                if (trigger.opened) {
                    size.set();
                }
            });

        }

    });

})(jQuery);