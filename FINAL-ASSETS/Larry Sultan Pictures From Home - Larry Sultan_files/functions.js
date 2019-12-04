
jQuery(function ($) {
	
	// things to do on page load
	var currentSlide = 0,									// set initial slide index to 0
		slideTimer,											// instantiate timer for slideshow
		fadeTime = 1000,									// set slideshow crossfade time (in ms)
		slideShowAmt = 5000,								// set amount of time to show each slide (in ms)
		
		slideshowGutter = 30,								// max distance slideshow can be from edge of page
		slideMaxHeight,										// this is set automatically based on window height
		
		collapseTime = 500;									// time it takes to slide accordion content up or down
		
	$(document).ready(function() {
		$.hisrc.speedTest();
		$('#slideshow > div:gt(0), #menu-content-wrap > div:gt(0), #statement, #statement-title, #thumbnails, .sub-menu, .accordion').hide();
		$('#slideshow').css('opacity', 0);
		$('.current-menu-item').parent('ul.sub-menu').show();
		$('.current-menu-parent').addClass('open');
		
		slideMaxHeight = $(window).height();
		var offset = ($('#slideshow').length > 0)? $('#slideshow').offset() : $('#content').offset();
		
		slideMaxHeight -= offset.top;
		slideMaxHeight -= slideshowGutter;
		
		$('#slideshow, #statement').height(slideMaxHeight);
		
		if($('#content .eightcol blockquote').length > 0){
			$('#content .eightcol strong').wrap('<a href="#" class="accordion-link"></a>');
			$('#content .eightcol blockquote').addClass('accordion').hide();
		}
		
		$('a').each( function(){
			if($(this).attr('href').substr(-3) == 'pdf'){
				$(this).attr('target', '_blank');
			}
		});
		
		$('#content .eightcol').fitVids();
		
	});
	
	
	$(window).load(function(){
		
		var newHeight = $('#slideshow > div:first img').height();
	    

		if($('#slideshow div').length > 1){
			slideTimer = window.setInterval(function() {												// do this every . . .
			  currentSlide = (currentSlide < $('#slideshow > div').length-1)? currentSlide+1 : 0;		// add one to current slide index to advance slideshow, loop if at end	
			  goToSlide(currentSlide);																	// move slideshow to current slide index
			},  slideShowAmt);																			// . . . 8 seconds, or however long the slideShowAmt is set for
		}
		
		$("img.responsive").hisrc();
		
		
		setTimeout(function(){ $('#slideshow').animate({opacity: 1}, fadeTime); }, fadeTime/2);
		
		$('img[data-src!=""]').each(function(){
			var $this = $(this),
				src   = $this.attr('data-url');
				
			$this.attr('src', src).removeAttr('data-url');
		});
		
		wordsMaxHeight = $(window).height();
		var offset = $('#words-body').offset();
		wordsMaxHeight -= offset.top;
		wordsMaxHeight -= slideshowGutter;
		$('#words-body, #statement').height(wordsMaxHeight);
		
	});
	
	$(window).resize(function(){
		slideMaxHeight = $(window).height();
		var offset = ($('#slideshow').length > 0)? $('#slideshow').offset() : $('#content').offset();
		
		slideMaxHeight -= offset.top;
		slideMaxHeight -= slideshowGutter;
		
		$('#slideshow, #statement').height(slideMaxHeight);
		
		offset = $('#words-body').offset();
			
		var wordsMaxHeight = slideMaxHeight-offset.top;
			wordsMaxHeight -= slideshowGutter;
		$('#words-body').height(wordsMaxHeight);
		
	});
	
/*----------------- CLICK EVENTS --------------*/


	$('#statement-toggle').click(function(e){
			e.preventDefault();
			var thisButton = $(this);
			
			
			if(slideTimer){
				window.clearInterval(slideTimer);
				slideTimer = false;
			}
			
			var delay = fadeTime/2;
			
			if(!$('#statement').is(':visible')){ delay = 0; }
			$('#slideshow').delay(delay).fadeToggle(fadeTime/2, function(){
				 $(this).css('overflow', 'visible');
			});
			$('#thumbnails').fadeOut(fadeTime/2);
			
			if($('#statement').is(':visible')){ delay = 0; }else{ delay = fadeTime/2; }
			$('#statement').delay(delay).fadeToggle(fadeTime/2, function(){
				if($('#statement').is(':visible')){ 
					thisButton.html('Images');
					var statementHeight = $('#statement').height();
					$('#statement').css('min-height', statementHeight );
				}else{
					thisButton.html('Statement + History');
				}
			});
			
			slideTimer = false;
			
			$('#statement-title, #slideshow-controls').fadeToggle(fadeTime/2);
		
	});
	
	//slideshow-control
	$('#slideshow-next, #slideshow > div.slide:visible').click( // next link
		function(e){
			e.preventDefault();
			if(slideTimer){ window.clearInterval(slideTimer); slideTimer = false; }
			currentSlide = (currentSlide < $('#slideshow > div').length-1)? currentSlide+1 : 0;
			goToSlide(currentSlide);
		}
	);
	$('#slideshow-prev').click(	// prev link
		function(e){
			e.preventDefault();
			if(slideTimer){ window.clearInterval(slideTimer); slideTimer = false; }
			currentSlide = (currentSlide > 0)? currentSlide-1 : $('#slideshow > div').length-1;
			goToSlide(currentSlide);
		}
	);
	
	$('#slideshow-thumbs').click( function(e){
		e.preventDefault();
		$('#thumbnails').fadeToggle(fadeTime);
	});
	
	$('.slideshow-control').click(	// a list of slides    ( must be equal in size to the number of slides )
		function(e){
			e.preventDefault();
			var $this = $(this),
				controlCont = $('#thumbnails'),
				indexID = $('.slideshow-control').index($this);
				
				
			if(indexID != currentSlide){
				console.log('gotoslide');	
				if(slideTimer){ window.clearInterval(slideTimer); slideTimer = false; }
				goToSlide(indexID);
				currentSlide = indexID;
			}
			
			controlCont.fadeOut(fadeTime);
		}
	);
	
	// accordion content
	
	$(document).on('click', '.accordion-link', function(e){
			e.preventDefault();
			var isHighlighted = false;
			var accordionIndex = $('.accordion-link').index(this);
			if($(this).hasClass('highlight')){ isHighlighted = true; }
			$('.accordion-link').removeClass('highlight');
			if(!isHighlighted){ $(this).addClass('highlight'); }
			
			if(!jQuery.browser.mobile){ $('.accordion').not(':eq('+accordionIndex+')').slideUp(collapseTime); }
			
			$('.accordion:eq('+accordionIndex+')').slideToggle(collapseTime);
			
			return false;
		});
		
	$(document).on('click', '.menu > .menu-item', function(e){
		var $this = $(e.target).parent('.menu-item');
		
		
		if($this.find('.sub-menu').length > 0){
			e.preventDefault();
			
			$this.parent('.menu').find('.sub-menu').slideUp(500);
			
			if(!$this.hasClass('open')){
				$this.parent('.menu').find('.menu-item').removeClass('open');
				$this.addClass('open').find('.sub-menu').slideDown(500);
			}
			
		}
	
	});
	
	
			
	$('#menu-button').click( function(e){
		e.preventDefault();

		$('.menu-cont').slideToggle(fadeTime/2, function(){
			if($('.menu-cont').is(':visible')){ $('.menu-cont').css('display', 'inline-block'); }
			
		});
	
		
	});

	
	
	
		
/*------------------- Helper Functions -----------------*/
		
		function goToSlide(slideNum){
			var nextSlide = $('#slideshow > div:eq('+slideNum+')');
		
			// make sure image is loaded...
			if(typeof nextSlide.find('img').attr('src') === undefined){
				var src = nextSlide.find('img').attr('data-url');
				nextSlide.find('img').attr('src', src).removeAttr('data-url');
				console.log('NOSRC!');
			}
		
		
	        var lastSlide = $('#slideshow > div:visible');							// get visible slide
	        if(slideTimer){															// if slideshow is active
	            nextSlide.fadeIn(fadeTime);			// fade in new image with slideTime (default 1sec)
	        }else{																	// if we are changing because of user input
	            nextSlide.fadeIn(fadeTime/2);			// fade in new image 2x as fast as slideshow fade because when people click things, they want immediate feedback
	        }
	      
		    $(lastSlide).fadeOut(fadeTime);	// wait for new image to be faded in and then fade out old one
		 }
		 
	
});


/*global jQuery */
/*jshint multistr:true browser:true */
/*!
* FitVids 1.0.3
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
* Date: Thu Sept 01 18:00:00 2011 -0500
*/

(function($){"use strict";$.fn.fitVids=function(options){var settings={customSelector:null};if(!document.getElementById('fit-vids-style')){var div=document.createElement('div'),ref=document.getElementsByTagName('base')[0]||document.getElementsByTagName('script')[0],cssStyles='&shy;<style>.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}</style>';div.className='fit-vids-style';div.id='fit-vids-style';div.style.display='none';div.innerHTML=cssStyles;ref.parentNode.insertBefore(div,ref);}if(options){$.extend(settings,options);}return this.each(function(){var selectors=["iframe[src*='player.vimeo.com']","iframe[src*='youtube.com']","iframe[src*='youtube-nocookie.com']","iframe[src*='kickstarter.com'][src*='video.html']","object","embed"];if(settings.customSelector){selectors.push(settings.customSelector);}var $allVideos=$(this).find(selectors.join(','));$allVideos=$allVideos.not("object object");$allVideos.each(function(){var $this=$(this);if(this.tagName.toLowerCase()==='embed'&&$this.parent('object').length||$this.parent('.fluid-width-video-wrapper').length){return;}var height=(this.tagName.toLowerCase()==='object'||($this.attr('height')&&!isNaN(parseInt($this.attr('height'),10))))?parseInt($this.attr('height'),10):$this.height(),width=!isNaN(parseInt($this.attr('width'),10))?parseInt($this.attr('width'),10):$this.width(),aspectRatio=height/width;if(!$this.attr('id')){var videoID='fitvid'+Math.floor(Math.random()*999999);$this.attr('id',videoID);}$this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top',(aspectRatio*100)+"%");$this.removeAttr('height').removeAttr('width');});});};})(window.jQuery||window.Zepto);



/**
 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
 * jQuery.browser.mobile will be true if the browser is a mobile device
 **/
(function(a){jQuery.browser.mobile=/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);