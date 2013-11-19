// All pages in the game
var pages = {};

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
		$('#game').append($box);
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



function Page (id, background, squareMappings) {
	this.enabled = false;
	this.mappings = squareMappings;

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

		$('#game').css({
			background: 'url("' + background + '")'
		});
	}

	// Disables all squares and sets a blank background
	this.disable = function () {
		this.enabled = false;

		for (var i = this.mappings.length - 1; i >= 0; i--) {
			this.mappings[i].square.disable();
		};

		$('#game').css({
			//background: '#FFE'
		});
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
			events: {leave: 'main', click: 'tertiary'}},
		 {square: new Square(321, 238, 247, 148),
			events: {leave: 'main', click: 'tertiary'}},
		 {square: new Square(620, 238, 247, 148),
			events: {leave: 'main', click: 'tertiary'}},
		]);

	pages['tertiary'] =	new Page('tertiary', 'pages/page2.png', [
		 {square: new Square(24, 238, 247, 148),
			events: {enter: 'tertiary-hilight'}},
		 {square: new Square(321, 238, 247, 148),
			events: {enter: 'tertiary-hilight'}},
		 {square: new Square(620, 238, 247, 148),
			events: {enter: 'tertiary-hilight'}},
		]);

	pages['tertiary-hilight'] =	new Page('tertiary-hilight', 'pages/page1.png', [
		 {square: new Square(24, 238, 247, 148),
			events: {leave: 'tertiary', click: 'main'}},
		 {square: new Square(321, 238, 247, 148),
			events: {leave: 'tertiary', click: 'main'}},
		 {square: new Square(620, 238, 247, 148),
			events: {leave: 'tertiary', click: 'main'}},
		]);

	pages['main'].enable();
	showSquares();
});