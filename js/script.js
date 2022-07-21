import tabs from './modules/tabs';
import calcu from './modules/calcu';
import modal from './modules/modal';
import cards from './modules/cards';
import slider from './modules/slider';
import tellMe from './modules/tellMe';
import timer from './modules/timer';
import {openModalContent} from './modules/modal'

window.addEventListener('DOMContentLoaded', () => {
	const modalTimerID = setTimeout(() => openModalContent('.modal', modalTimerID), 30000);

	tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
	calcu();
	modal('[data-modal]', '.modal', modalTimerID);
	cards()
	slider();
	tellMe('.form', modalTimerID);
	timer('.timer', '2023-02-24');
	
});
