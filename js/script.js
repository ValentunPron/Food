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
	//Shop

	class BannerMenu {
		constructor (src, alt, subTitle, info, cost, parentSelector, ...classes) {
			this.src = src;
			this.alt = alt;
			this.subTitle = subTitle;
			this.classes = classes
			this.parent = document.querySelector(parentSelector);
			this.info = info;
			this.cost = cost;
		}

		addBanner() {
			const element = document.createElement('div');
			element.classList.add('menu__item');
			this.classes.forEach(className => element.classList.add(className));
			element.innerHTML = `
			   <img src="${this.src}" alt="${this.alt}">
			   <h3 class="menu__item-subtitle">Меню "${this.subTitle}"</h3>
			   <div class="menu__item-descr">${this.info}</div>
			   <div class="menu__item-divider"></div>
			   <div class="menu__item-price">
			      <div class="menu__item-cost">Цена:</div>
			      <div class="menu__item-total"><span>${this.cost}</span> грн/день</div>
			   </div>
		`;
		this.parent.append(element);
		}
	}
	const getResourse = async(url) => {
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status ${res.status}`);
		}
		return await res.json();
	};
	axios.get('http://localhost:3000/menu')
		.then(data => {
			data.data.forEach(({img, altimg, title, descr, price}) => {
				new BannerMenu(img, altimg, title, descr, price, '.menu .container').addBanner();
			}); 
		});
	//Timer

	const deadline = new Date('2022-06-12')

	function checkTime(d) {
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

	function setTimer(selector, d) {
		const timer = document.querySelector(selector),
			  days = timer.querySelector('#days'),
			  hours = timer.querySelector('#hours'),
 			  minuts = timer.querySelector('#minutes'),
			  seconds = timer.querySelector('#seconds'),
			  timeInterval = setInterval(updateClock, 1000);

		updateClock();

		function updateClock() {
			const t = checkTime(d);

			days.innerHTML =  zeroNumber(t.d);
			hours.innerHTML = zeroNumber(t.h);
			minuts.innerHTML = zeroNumber(t.m);
			seconds.innerHTML = zeroNumber(t.s);

			if (t.time <= 0) {
				document.querySelector('#end').textContent = `Акция закончилася ${(+-t.d)} дня назад`;
				clearInterval(timeInterval);
				days.innerHTML =  '0';
				hours.innerHTML = '0';
				minuts.innerHTML = '0';
				seconds.innerHTML = '0';
			}
		}
	}

	setTimer('.timer', deadline);

	//Modal

	const modalTrigger = document.querySelectorAll('[data-modal]'),
		  modal = document.querySelector('.modal');

	function openModalContent () {
		modal.style.display = 'block';
		document.body.style.overflow = 'hidden';
		clearInterval(modalTimerID);
	}

	function closeModalContent () {
		modal.style.display = 'none';
		document.body.style.overflow = '';
	}

	modalTrigger.forEach(item => {
		item.addEventListener('click', openModalContent)
	})

	modal.addEventListener('click', (event) => {
		if (event.target === modal || event.target.getAttribute('data-close') == '') {
			closeModalContent();
		}
	});

	document.addEventListener('keydown', (e) => {
		if (e.code === 'Escape' && modal.style.display === 'block') {
			closeModalContent();
		}
	});

	const modalTimerID = setTimeout(openModalContent, 30000)

	function showModalByScroll() {
		if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
			openModalContent();
			window.removeEventListener('scroll', closeModalContent);
		}
	}
	window.addEventListener('scroll', closeModalContent);

	// tell Me

	const forms = document.querySelectorAll('form'); // виділяємо всі форми, які находяться в хмтл

	const message = {
		loading: 'img/form/spinner.svg',
		success: 'Спасибо! Скоро мы с вами свяжемся',
		failure: 'Что-по пошло не так...'
	}; // Об'єкт з можливими повідомленнями

	forms.forEach(item => {
		bindPostData(item); // Функція яка бере наші дані, і відправляє їх до сервера. 
	}); // Обробляє всі форми, які у нас є

	const postData = async(url, data) => {
		const res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: data
		});

		return await res.json();
	};

	function bindPostData(form) { 
		form.addEventListener('submit', (event) => {
			event.preventDefault(); // Збиває всі настройки кнопки або силки

			const statusMessage = document.createElement('div'); // створюємо блок div
			statusMessage.src = message.loading; // 
			statusMessage.textContent = message.loading; // Відображає повідомлення загрузки.
			form.append(statusMessage); // добавляє в нашу форму повідомлення 

			const formData = new FormData(form); // присвуюємо перімінну formData до баз данних

			const json = JSON.stringify(Object.fromEntries(formData.entries()));

			const object = {}; // пустий об'єкт. Потрібен буде для заповнення данних
			formData.forEach(function(value, key){
				object[key] = value;
			}) // перебираємо всі варіанти баз данних 
			 postData('http://localhost:3000/requests', json)

			.then(data => {
				console.log(data)
				showThanksModal(message.success); // Добавляє допоміжне помідомлення
				statusMessage.remove(); // Видаляє допоміжне повідомлення 
			}).catch( () => {
				showThanksModal(message.failure); // При якісь помилці повідомляє користувача. Находить помилку задопомогою .catch
			}).finally(() => {
				form.reset(); // За допомогою .finally, буде виконуватти завжди в кінці, незалежно чи код пішов правельно чи ні
			})
		});
	}

	function showThanksModal(message) {
		const prevModalDialog = document.querySelector('.modal__dialog');
		prevModalDialog.classList.add('hide');
		openModalContent();

		const thanksModal = document.createElement('div');
		thanksModal.classList.add('modal__dialog');
		thanksModal.innerHTML = `
			<div class="modal__content"> 
				<div class="modal__close data-close">x</div>
				<div class="modal__title">${message}</div>
			</div>
		`;

		document.querySelector('.modal').append(thanksModal);

		setTimeout(() => {
			thanksModal.remove();
			prevModalDialog.classList.add('show');
			prevModalDialog.classList.remove('hide');
			closeModalContent();
		}, 4000);
	}

	// slider 

	const sliderParent = document.querySelector('.offer__slider-counter'),
		  slideNumber = document.querySelector('#current'),
		  slideBlock = document.querySelector('.offer__slider-wrapper'),
		  slideItem = document.querySelectorAll('.offer__slide');

	function slideHide() {
		slideItem.forEach(i => {
			i.classList.add('hide');
		})
	}

	function slideShow(n = 2) {
		slideItem[n].classList.remove('hide');
		slideNumber.innerHTML = `0${n+1}`;
	}

	slideHide();
	slideShow();
	let n = 2;
	sliderParent.addEventListener('click', (event) => {
		const target = event.target;
		if ((target && target.classList.contains('offer__slider-prev')) || (target.classList.contains('offer__slider-prev').tagName === "IMG")){
			if(n != 0) {
				n--;
				slideHide();
				slideShow(n);
			}
		} else if ((target && target.classList.contains('offer__slider-next')) || (target.classList.contains('offer__slider-next').tagName === "IMG")) {
			if(n != 3){
				n++;
				slideHide();
				slideShow(n);
			}
		}
	});
})
