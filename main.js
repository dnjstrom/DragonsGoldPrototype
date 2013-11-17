// All pages in the game
var pages = [];

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
}



function Page (background, squareMappings) {
	this.enabled = false;
	this.mappings = squareMappings;

	var self = this,
	showingSquares = false;

	// Disables itself and enables page
	var handleClick = function (page) {
		return function () {
			self.disable();
			pages[self.mappings[page].page].enable();
		}
	}

	// Enables all squares and sets the background
	this.enable = function () {
		for (var i = this.mappings.length - 1; i >= 0; i--) {
			this.mappings[i].square.enable();
			this.mappings[i].square.click(handleClick(i));
		};

		console.log('url("' + background + '")');

		$('#game').css({
			background: 'url("' + background + '")'
		});
	}

	// Disables all squares and sets a blank background
	this.disable = function () {
		for (var i = this.mappings.length - 1; i >= 0; i--) {
			this.mappings[i].square.disable();
		};

		$('#game').css({
			background: '#FFE'
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
	pages = [
		new Page('pages/page0.png', [
			{square: new Square(24, 238, 247, 148), page: 0 },
			{square: new Square(321, 237, 247, 148), page: 1 },
			{square: new Square(620, 238, 247, 148), page: 2 }
			]),
		new Page('pages/page1.png', [
			{square: new Square(24, 238, 247, 148), page: 1 },
			{square: new Square(321, 237, 247, 148), page: 2 },
			{square: new Square(620, 238, 247, 148), page: 0 }
			]),
		new Page('pages/page2.png', [
			{square: new Square(24, 238, 247, 148), page: 2 },
			{square: new Square(321, 237, 247, 148), page: 0 },
			{square: new Square(620, 238, 247, 148), page: 1 }
			])
	];


	pages[0].enable();
});