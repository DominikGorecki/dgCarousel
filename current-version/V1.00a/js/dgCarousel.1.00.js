// JavaScript Document
(function( $ ) {
	var methods = {
		/*	init
		*		function that is run on initialization
		*/
		init : function( options ) {	  

		// defaults
		var settings = $.extend( {
		  'width'    :800,
		  'height'	:150,
		  'liWidth'		:150,
		  'liHeight'	: 150,
		  'liPadding'	: 5,
		  'stackDistance' : 3,
		  'backgroundColor': 'blue',
		  'zIndex': 999
		}, options);
		
		
		//return this.each(function(settings) {        
			var $this = $(this);
			var data = $this.data('dgCarousel');
			// Variables that we'll work with in this function
			var $dgElements = $this.children('li'),
				totalElements = $dgElements.length,
				rightElements = ($dgElements.length%2) ? ($dgElements.length-1)/2 : $dgElements.length/2,
				leftElements = Math.floor(($dgElements.length-1)/2);
			
			if(!data)
			{
				$(this).data('dgCarousel', { 
					target: $this,
					items: $this.children('li'),
					activePosition: 0,
					settings: settings,
					visibleElements : Math.floor(0.5*(settings.width-settings.liWidth)/(settings.liWidth+settings.liPadding)),
					middleLocation : (settings.width - settings.liWidth)/2,
					totalElements : totalElements,
					rightElements : rightElements,
					leftElements : leftElements
				});
				data = $this.data('dgCarousel');
			}
			

			
			//var middleLocation = (settings.width - settings.liWidth)/2;
			$this.addClass('dgCarousel');
					
			$this.width(settings.width);
			$this.height(settings.height);
	
			$dgElements.width(settings.liWidth);
			$dgElements.height(settings.liHeight);
			$dgElements.append("<a href='#' class='mask'> </a>");
			
			var $maskElements = $($dgElements).children('.mask');
			$maskElements.bind('click',methods.itemClicked);
			
			// Array of objects that keeps track of the location of the li elements
			var liPositionData = new Array();
			liPositionData[0] =
				{
					leftPosition:  data.middleLocation,
					zIndex: data.settings.zIndex,
					fade: 0
				};
			
			$($dgElements).children('.mask').fadeTo("slow",0.5); // TO DO -- allow custom fade 
			$($dgElements[0]).css('left', data.middleLocation+'px');
			$($dgElements[0]).children('.mask').fadeOut("slow");
			$($dgElements[0]).css('z-index', data.settings.zIndex);
			
			
			
			// Right OF THE CENTRAL ELEMENT ****
			var currentDisplacement = 0;
			
			// Position of the right visible li elements
			for(var i = 1; i <= (data.visibleElements); i++)
			{				
				currentDisplacement += data.settings.liPadding + data.settings.liWidth;
				$($dgElements[i]).css('left', (data.middleLocation+currentDisplacement)+'px');
				$($dgElements[i]).css('z-index', data.settings.zIndex-i);
				
				liPositionData[i] = 
				{ 
					leftPosition: data.middleLocation+currentDisplacement,
					zIndex : data.settings.zIndex-i,
					fade : 0.5 // TO DO -- have a fade gradient between the elements. That is, display each further element fader.
				};
			}
			
			// Calculate how much space there is left between the last visible li element and the end of the carousel. This var is used later.
			var spaceLeft = data.settings.width/2 - (currentDisplacement + 0.5*data.settings.liWidth) - data.settings.liPadding;			
			
			// Calculate the maximum number of pages that can be displaced based on the (min) stackDistance
			var maxStack = Math.floor(spaceLeft / data.settings.stackDistance);
			
			//  Check if we can display the slightly visible "stacked" elements (elements that overlap)
			if(i < data.rightElements && spaceLeft > data.settings.stackDistance)
			{				
				var rightStackDistance = data.settings.stackDistance; 
				
				// If we can have a larger stack distance than the minimum, then set that distance
				if(data.settings.stackDistance*(data.rightElements-i) < spaceLeft)
				{
					rightStackDistance = spaceLeft / (data.rightElements-i+1);
				}

				for(var j=0;i <= data.rightElements && j < maxStack; j++)
				{
					currentDisplacement += rightStackDistance;
					$($dgElements[i]).css('left', (data.middleLocation+currentDisplacement)+'px');
					$($dgElements[i]).css('z-index', data.settings.zIndex-i);
					
					liPositionData[i] = 
					{ 
						leftPosition: data.middleLocation+currentDisplacement,
						zIndex : data.settings.zIndex-i,
						fade : 0.5 // TO DO -- have a fade gradient between the elements. That is, display each further element fader.
					};
					
					i++;	
				}											
			}
			
			// If there are any elements left over that won't fit, place them underneat the last stacked
			for(;i <= data.rightElements; i++)
			{
				$($dgElements[i]).css('left', (data.middleLocation+currentDisplacement)+'px');
				$($dgElements[i]).css('z-index', data.settings.zIndex-i);
				
				liPositionData[i] = 
				{ 
					leftPosition: data.middleLocation+currentDisplacement,
					zIndex : data.settings.zIndex-i,
					fade : 0.5 // TO DO -- have a fade gradient between the elements. That is, display each further element fader.
				};
			}
			
			// Left of the Central Element ***********************
			currentDisplacement = 0;
			
			// Display the visible li elements to the left of the central element
			for(var i = data.totalElements-1; i >= data.totalElements-data.visibleElements; i--)
			{
				currentDisplacement -= data.settings.liPadding + data.settings.liWidth;
				$($dgElements[i]).css('left', (data.middleLocation+currentDisplacement)+'px');
				$($dgElements[i]).css('z-index', data.settings.zIndex+i-data.totalElements);
				
				liPositionData[i] = 
				{ 
					leftPosition: data.middleLocation+currentDisplacement,
					zIndex : data.settings.zIndex+i-data.totalElements,
					fade : 0.5 // TO DO -- have a fade gradient between the elements. That is, display each further element fader.
				};				
				
			}
			
			spaceLeft = data.settings.width/2 - 0.5*data.settings.liWidth + currentDisplacement - data.settings.liPadding;			
			maxStack = Math.floor(spaceLeft / data.settings.stackDistance);
			
			if(i > data.totalElements-1-data.leftElements && spaceLeft > data.settings.stackDistance)
			{
				var leftStackDistance = data.settings.stackDistance;
				
				if(leftStackDistance*(i - (data.totalElements-1-data.leftElements)) < spaceLeft)
				{
					leftStackDistance = spaceLeft / (i-(data.totalElements-1-data.leftElements));
				}
				
				for(var j=0; i > data.totalElements-1-data.leftElements && j < maxStack; j++)
				{
					currentDisplacement -= leftStackDistance;
					$($dgElements[i]).css('left', (data.middleLocation+currentDisplacement)+'px');
					$($dgElements[i]).css('z-index', data.settings.zIndex+i-data.totalElements);

					liPositionData[i] = 
					{ 
						leftPosition: data.middleLocation+currentDisplacement,
						zIndex : data.settings.zIndex+i-data.totalElements,
						fade : 0.5 // TO DO -- have a fade gradient between the elements. That is, display each further element fader.
					};				
					
					i--;
				}

			}
			
			for(;i > data.totalElements-1-data.leftElements; i--)
			{
				$($dgElements[i]).css('left', (data.middleLocation+currentDisplacement)+'px');
				$($dgElements[i]).css('z-index', data.settings.zIndex+i-data.totalElements);
				
				
				liPositionData[i] = 
				{ 
					leftPosition: data.middleLocation+currentDisplacement,
					zIndex : data.settings.zIndex+i-data.totalElements,
					fade : 0.5 // TO DO -- have a fade gradient between the elements. That is, display each further element fader.
				};				
			}		
			
			data.liPositionData = liPositionData;	
			
	
		}, 		
		
		/*	itemClicked
		*		Bound to li element onClick
		*		Moves item to the clicked location. Runs gotoItem function
		*/
		itemClicked : function ()
		{
			data = $(this.parentElement.parentElement).data('dgCarousel');
			$dgCarousel = data.target;

			var foundItem = -1;
			for(var i=0; i < data.items.length; i++)
			{
				if(data.items[i] == this.parentElement)
				{	
					foundItem = i;
					break;
				}
			}
			
			if(foundItem >= 0)
			{
				$dgCarousel.dgCarousel('gotoItem',i);
			} else
			{
				$.error('The item clicked is not found!');
			}
						

			//$(this).fadeOut();

		},
		
		/*	gotoItem(itemNumber)
		*		re-positions all of the elements to display a different li element in the center	
		*
		*	parameter:
		*		itemNumber [integer] - element number to be displayed in the center
		*/
		gotoItem : function(itemNumber)
		{
			var $dgCarousel = $(this);
			var $dgElements = $dgCarousel.children('li');
			
			var data = $dgCarousel.data('dgCarousel');

			var j = itemNumber;
			for(var i = 0; j < data.liPositionData.length ; i++)
			{				
				$($dgElements[j]).animate({"left": data.liPositionData[i].leftPosition+"px"}, "slow");
				$($dgElements[j]).css({"z-index" : data.liPositionData[i].zIndex});
				j++;
			}
			
			for(var leftOver=0; leftOver < itemNumber; leftOver++)
			{

				$($dgElements[leftOver]).animate({"left": data.liPositionData[i].leftPosition+"px"}, "slow");
				$($dgElements[leftOver]).css({"z-index" : data.liPositionData[i].zIndex});
				
				i++;				
			}
			
			$($dgElements).children('.mask').fadeTo("slow",0.5); // TO DO -- allow custom fade 
			
			$($dgElements[itemNumber]).children('.mask').fadeOut('slow');
			
			data.activePosition = itemNumber;
		}
	};
	
	$.fn.dgCarousel = function(method) {
		if ( methods[method] ) {
		  return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
		  return methods.init.apply( this, arguments );
		} else {
		  $.error( 'Method ' +  method + ' does not exist on jQuery.dgCarousel' );
		}  
	};
})( jQuery );