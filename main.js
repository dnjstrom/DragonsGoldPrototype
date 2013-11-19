// All pages in the game
var pages = {};
var images = 0;
var loadedImages = 0;

function start () {
	if (loadedImages == images) {
		console.log('Start!');

		pages['main'].enable();
		showSquares();
	}
}

// A clickable square area
function Square (x, y, dx, dy) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;

	// Insert a div that can listen for click events
	var $box = $('<div />');

	$box.css({
		position: 'absolute',
		top: y,
		left: x,
		width: this.dx,
		height: this.dy,
		background: 'cyan',
		cursor: 'pointer',
		opacity: 0
	});


	this.enable = function () {
		$('#container').append($box);
	}

	this.disable = function () {
		$box.remove();
	}

	// Check if x and y is contained in the square
	this.contains = function (x, y) {
		return (x >= this.x && x <= (this.x + this.dx)) && (y >= this.y && y <= (this.y + this.dy));
	}

	// Paint a marker for the square in the game
	this.paint = function () {
		$box.css({opacity: 0.3 });
	}

	// Remove the square marker
	this.clear = function () {
		$box.css({opacity: 0 });
	}

	// Delegate click function to jquery
	this.click = function (handler) {
		$box.click(handler);
	}

	this.enter = function (handler) {
		$box.mouseenter(handler);
	}

	this.leave = function (handler) {
		$box.mouseleave(handler);
	}
}



function Page (id, imgPath, squareMappings) {
	this.enabled = false;
	this.mappings = squareMappings;
	this.image = new Image();
	this.image.onload = function () {
		console.log('Loaded image: ' + imgPath);
		loadedImages++;
		start();
	}
	this.image.src = 'data:image/gif;base64,R0lGODlhCwALAIAAAAAA3pn/ZiH5BAEAAAEALAAAAAALAAsAAAIUhA+hkcuO4lmNVindo7qyrIXiGBYAOw==';	
	//this.image.src = imgPath;
	//this.image.src = 'http://lorempixel.com/g/900/650'
	images++;

	var self = this,
	showingSquares = false;

	// Disables itself and enables page
	var handleEvent = function (event, page) {
		return function () {
			if (self.enabled) {
				self.disable();
				pages[page].enable();
				console.log(event + ' - ' + id + ' -> ' + page);
			}
		}
	}

	// Enables all squares and sets the background
	this.enable = function () {
		this.enabled = true;

		for (var i = this.mappings.length - 1; i >= 0; i--) {
			this.mappings[i].square.enable();

			if (this.mappings[i].events.hasOwnProperty('click')) {
				this.mappings[i].square.click(handleEvent('click', this.mappings[i].events.click));
			}
			if (this.mappings[i].events.hasOwnProperty('enter')) {
				this.mappings[i].square.enter(handleEvent('enter', this.mappings[i].events.enter));
			}
			if (this.mappings[i].events.hasOwnProperty('leave')) {
				this.mappings[i].square.leave(handleEvent('leave', this.mappings[i].events.leave));
			}
		};

		this.paintBackground();
	}

	this.paintBackground = function () {
		var ctx = document.getElementById('game').getContext('2d');	
		ctx.fillStyle = "#FFE";
		ctx.fillRect(0,0,900,650);
		ctx.drawImage(this.image, 0, 0, 900, 650);
		console.log('Drawing: ' + imgPath);
	}

	// Disables all squares and sets a blank background
	this.disable = function () {
		this.enabled = false;

		for (var i = this.mappings.length - 1; i >= 0; i--) {
			this.mappings[i].square.disable();
		};
	}

	// Toggles the display of clickable areas
	this.toggleSquares = function () {
		if (this.showingSquares) {
			for (var i = this.mappings.length - 1; i >= 0; i--) {
				this.mappings[i].square.clear();
			};
		} else {
			for (var i = this.mappings.length - 1; i >= 0; i--) {
				this.mappings[i].square.paint();
			};
		}

		this.showingSquares = !this.showingSquares;
	}
}

// Debug functions
function showSquares () {
	for (var i = pages.length - 1; i >= 0; i--) {
		pages[i].toggleSquares();
	};
}

$(function() {

	pages['main'] =	new Page('main', 'pages/page0.png', [
		 {square: new Square(24, 238, 247, 148),
			events: {enter: 'main-hilight'}},
		 {square: new Square(321, 238, 247, 148),
			events: {enter: 'main-hilight'}},
		 {square: new Square(620, 238, 247, 148),
			events: {enter: 'main-hilight'}},
		]);

	pages['main-hilight'] =	new Page('main-hilight', 'pages/page1.png', [
		 {square: new Square(24, 238, 247, 148),
			events: {leave: 'main', click: 'secondary'}},
		 {square: new Square(321, 238, 247, 148),
			events: {leave: 'main', click: 'secondary'}},
		 {square: new Square(620, 238, 247, 148),
			events: {leave: 'main', click: 'secondary'}},
		]);

	pages['secondary'] =	new Page('secondary', 'pages/page2.png', [
		 {square: new Square(24, 238, 247, 148),
			events: {enter: 'secondary-hilight'}},
		 {square: new Square(321, 238, 247, 148),
			events: {enter: 'secondary-hilight'}},
		 {square: new Square(620, 238, 247, 148),
			events: {enter: 'secondary-hilight'}},
		]);

	pages['secondary-hilight'] =	new Page('secondary-hilight', 'pages/page1.png', [
		 {square: new Square(24, 238, 247, 148),
			events: {leave: 'secondary', click: 'main'}},
		 {square: new Square(321, 238, 247, 148),
			events: {leave: 'secondary', click: 'main'}},
		 {square: new Square(620, 238, 247, 148),
			events: {leave: 'secondary', click: 'main'}},
		]);
});
