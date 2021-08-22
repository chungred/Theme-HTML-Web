// socialCircle, an animated circular display of icons
// by Carrie Short
// http://carrieshort.com
// Version 1.0.0
// Copyright (c) 2015 Carrie Short
// MIT License

(function ( $ ) {
 	
    $.fn.socialCircle = function( options ) {
		// Make everything a circle and center
		$(this).siblings().andSelf().each( function() {
			var iconRadius = $( this ).width() / 2;
			 $( this ).css({
			  	"border-radius": iconRadius + "px",
				"top": "-" + iconRadius + "px",
				"left": "-" + iconRadius + "px",
				"line-height": $( this ).width() + "px"
			});
		});
		var centerCircle = $(this)
        // Default Options
        var settings = $.extend({
            // Rotate in degrees around the circle 0 to 360
            rotate: 0,
			// Distance of icons from the center
			radius:200,
			// Divide circle by
            circleSize: 2,
			// Animation speed
			speed:500
        }, options );
 
	// Click handling for socialCircle       
	$(this).click(function(event){
		
		if ($(this).hasClass("closed")) {
			$(this).removeClass( "closed" ).addClass( "open" );
			expand();
		}else{
			$(this).removeClass( "open" ).addClass( "closed" );
			retract();
		}
		event.preventDefault();
	});		
	
	//add handling for 0 values to avoid division error	     
	if (settings.rotate == 0) {
			var rotate = 0;
		}else{
			var rotate = (Math.PI)*2*settings.rotate/360;
		}
		if (settings.circleSize == 0) {
			var rotate = 0;
		}else{
			var circleSize = settings.circleSize;
		}
	function expand() {
	// variables for expand function	
		var radius = settings.radius,
		icons = centerCircle.siblings(), 
		container = centerCircle.parent(),
		width = container.width(), 
		height = container.height(),
		step = (2*Math.PI) / icons.length /settings.circleSize,
		angle = rotate + (step/2);
		// Determine placement of icons	
		icons.each(function() {
			var x = Math.round(width/2 + radius * Math.cos(angle) - $(this).width()/2);
			var y = Math.round(height/2 + radius * Math.sin(angle) - $(this).height()/2);
			// Animate Expansion
			$(this).animate({
				left: x + 'px',
				top: y + 'px',
				margin: '0px'
			}, {
			duration: settings.speed,
			queue: false
			});
		angle += step;
		});
	}

    function retract() {
		var radius = 0,
		icons = centerCircle.siblings(), 
		container = centerCircle.parent(),
		width = container.width(), 
		height = container.height(),
		angle = rotate, 
		step = (2*Math.PI) / icons.length/settings.circleSize;
		// Determine placement of icons	
        icons.each(function() {
		var x = Math.round(width/2 + radius * Math.cos(angle) - $(this).width()/2);
		var y = Math.round(height/2 + radius * Math.sin(angle) - $(this).height()/2);
		// Animate Retractions
		$(this).animate({
			left: x + 'px',
			top: y + 'px',
			margin: '0px'
			}, {
			duration: settings.speed,
			queue: false
			});
		angle += step;
		});
    }
	};
 
}( jQuery ));