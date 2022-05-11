window.addEventListener('DOMContentLoaded', () => {
	//Tabs
	const tabs = document.querySelectorAll('.tabheader__item'),
		  tabsContent = document.querySelectorAll('.tabcontent'),
		  tabsParent = document.querySelector('.tabheader__items');

	function hideTabContent() {
		tabsContent.forEach(item => {
			item.style.display = 'none';
		});

		tabs.forEach(item => {
			item.classList.remove('tabheader__item_active');
		});
	}

	function showTabContent(i = 0) {
		tabsContent[i].style.display = 'block';
		tabs[i].classList.add('tabheader__item_active');
	}

	hideTabContent();
	showTabContent();

	tabsParent.addEventListener('click', (event) => {
		const target = event.target;

		if (target && target.classList.contains('tabheader__item')){
			tabs.forEach((item, i) => {
				if (target == item) {
					hideTabContent();
					showTabContent(i);
				}
			});
		}
	});

	//Timer

	const deadline = new Date('2022-06-02')

	function checkTime(deadline) {
		const t = deadline - new Date(),
			  day = Math.floor(t / (1000 * 60 * 60 * 24)),
			  hour = Math.floor((t / (1000 * 60 * 60) % 24)),
			  minut = Math.floor((t / 1000 /60) % 60),
			  second = Math.floor((t / 1000) % 60);

		return {
			'time': t,
			'd': day,
			'h': hour,
			'm': minut,
			's': second
		};
	}

	function zeroNumber(num) {
		if (num >= 0 && num < 10) {
			return `0${num}`;
		} else {
			return num;
		}
	}

	function setTimer(selector, deadline) {
		const timer = document.querySelector(selector),
			  days = timer.querySelector('#days'),
			  hours = timer.querySelector('#hours'),
 			  minuts = timer.querySelector('#minutes'),
			  seconds = timer.querySelector('#seconds'),
			  timeInterval = setInterval(updateClock, 1000);

		updateClock();

		function updateClock() {
			const t = checkTime(deadline);

			days.innerHTML =  zeroNumber(t.d);
			hours.innerHTML = zeroNumber(t.h);
			minuts.innerHTML = zeroNumber(t.m);
			seconds.innerHTML = zeroNumber(t.s);

			if (t.total <= 0) {
				clearInterval(timeInterval);
			}
		}
	}

	setTimer('.timer', deadline);
});