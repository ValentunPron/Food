window.addEventListener('DOMContentLoaded', () => {
	const tabs = require('./modules/tabs'),
		  calcu = require('./modules/calcu'),
		  modal = require('./modules/modal'),
		  cards = require('./modules/cards'),
		  slider = require('./modules/slider'),
		  tellMe = require('./modules/tellMe'),
		  timer = require('./modules/timer');

	tabs();
	calcu();
	modal();
	cards()
	slider();
	tellMe();
	timer();
	
});
