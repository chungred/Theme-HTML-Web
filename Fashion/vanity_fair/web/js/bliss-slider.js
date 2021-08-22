;(function ( $, window, document, undefined ) {

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "blissSlider",
			defaults = {
			  	auto: 1,
      			transitionTime: 500,
      			timeBetweenSlides: 4000
		};


		// The actual plugin constructor
		function Plugin ( element, options ) {
			this.element = element;
			// jQuery has an extend method which merges the contents of two or
			// more objects, storing the result in the first object. The first object
			// is generally empty as we don't want to alter the default options for
			// future instances of the plugin
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;

			this.sliderArray = [ $sliderContainer = $(this.element),
									$slider = $sliderContainer.find('.slider'),
		                        	$slide = $slider.find('.slide'), 
		                        	$slidebg = $slide.find('.slide-bg img'), 
		                        	$slidemarkers = $sliderContainer.find('.slide-list'),
		                        	$slidemarker = $slidemarkers.find('li'),
		                        	$nextslide = $sliderContainer.find('.slide-nav .next'),
		                       		$prevslide = $sliderContainer.find('.slide-nav .prev') ];

			this.init();
		}

		Plugin.prototype = {
			init: function () {

				$sliderContainer.css({
	        		height: $slidebg.height()+'px'
	        	});

		        $slide.fadeOut()
		              .first()
		                .addClass('active')
		                .fadeIn(this.settings.transitionTime);

		        $slidemarker.first().addClass('active');

		        $sliderContainer.hover(function() {
		            $(this).addClass('hover');
		        }, function() {
		            $(this).removeClass('hover');
		        });

		        this.sliderAutoPlay(this.settings.auto);

		        var self = this;
		        
		        $($slidemarker).click(function(e) {
		        	e.preventDefault();
		            var index = $(this).index();
		            clearInterval($interval);
		            self.displaySlide(self.sliderArray, index);
		        });

		        $($nextslide).click(function(e) {
		        	e.preventDefault();
		            clearInterval($interval);
		            self.nextSlide(self.sliderArray);
		        });

		        $($prevslide).click(function(e) {
		        	e.preventDefault();
		            clearInterval($interval);
		            self.prevSlide(self.sliderArray);
		        });

		        $(window).resize(function() {
	        		clearInterval($interval);
	        		$sliderContainer.css({
		        		height: $slide.height()+'px'
		        	});
		        });

			},

			sliderAutoPlay: function(auto) {
				var self = this;
		        if(auto) {
		            $interval = setInterval(function() {
		                //Auto play the slider if the cursor isn't hovered over the slide image
		                if($sliderContainer.hasClass('hover')) self.nextSlide(self.sliderArray);
		            }, self.settings.transitionTime + self.settings.timeBetweenSlides);
		        }
				if(auto) {
					$interval = setInterval(function() {
		                //Auto play the slider if the cursor isn't hovered over the slide image
		                if(!$sliderContainer.hasClass('hover')) self.nextSlide(self.sliderArray);
		            }, self.settings.transitionTime + self.settings.timeBetweenSlides);
				}
		    },

			slideNav: function(sliderArray, direction) {

		        //Get the index of the active slide
		        var i = $slider.find('li.active').index();

		        //Remove active class of said slide and fade out
		        $slide.eq(i).removeClass('active').fadeOut(this.settings.transitionTime);
		        
		        //Do the same with markers -fade out
		        $slidemarker.eq(i).removeClass('active');

		        //A little logic for sliding
		        if(direction == 'next') {
		            if(!(i++ < $slide.last().index())) i = 0;
		        } else if(direction == 'prev') {
		            if(!(i-- > 0)) i = 2;
		        }

		        //Fade in the next slide and add the active class
		        $slide.eq(i).fadeIn(this.settings.transitionTime);
		        $slide.eq(i).addClass('active');
		        $slidemarker.eq(i).addClass('active');
		    },

		    nextSlide: function(sliderArray) {
		        this.slideNav(sliderArray, 'next');
		    },

		    prevSlide: function(sliderArray) {
		        this.slideNav(sliderArray, 'prev');
		    },

		    displaySlide: function(sliderArray, slideid) {
		        //Disable autoplay
		        clearInterval($interval);
		        
		        $slide.removeClass('active');
		        $slidemarker.removeClass('active');

		        $slide.fadeOut();

		        $slidemarker.eq(slideid).addClass('active');
		        $slide.eq(slideid).addClass('active').fadeIn(this.settings.transitionTime);
		    }

		};

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {
			this.each(function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
				}
			});

			// chain jQuery functions
			return this;
		};

})( jQuery, window, document );