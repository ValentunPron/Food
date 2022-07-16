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
	
	const slides = document.querySelectorAll('.offer__slide'),
		  slider = document.querySelector('.offer__slider'),
		  prev = document.querySelector('.offer__slider-prev'),
		  next = document.querySelector('.offer__slider-next'),
		  total = document.querySelector('#total'),
		  current = document.querySelector('#current'),
		  slidesWrapper = document.querySelector('.offer__slider-wrapper'),
		  slidesField = document.querySelector('.offer__slider-inner'),
		  width = window.getComputedStyle(slidesWrapper).width;

	let slideIndex = 1, // Число слайда
		offset = 0; // Розмір сторінки

	/*Визначає кількість слайдів. Якщо кількість слайдів не перевищує 10 штук, 
	то на початку кожної цифри добавляється 0.Але якщо більше 10, то просто добавляє кількість слайдів
	*/
	if (slides.length < 10){
		total.textContent = `0${slides.length}`;
		current.textContent = `0${slideIndex}`; 
	} else {
		total.textContent = slides.length;
		current.textContent = slideIndex;
	}
	//Стилі для батіківського блока.
	slidesField.style.width = 100 * slides.length + '%'; //Розраховує ширину вікон
	slidesField.style.display = 'flex'; //Добавляє в стилі флекс елемент (якщо цього не буде,то блоки будуть розташовані вертикально)
	slidesField.style.transition = '0.75s all' //Плавна анімація переходу
	slidesWrapper.style.overflow = 'hidden'; //Приховує всі слайді, які розташовані за екраном

	//Цей цикл, добавляє для кожного слайду, фіксовану ширину
	slides.forEach(slide => {
		slide.style.width = width;
	});
	//Позоциніровання слайда (потрібно для додсів)
	slider.style.position  = 'relative';
	//Створюємо список. Для того, щоб в майбутньому поміститит туда дотси
	const indicators = document.createElement('ol'),
		  dots = [];
	//Стилі списка
	indicators.classList.add('carousel-indicators');
	indicators.style.cssText = `
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 15;
		display: flex;
		justify-content: center;
		margin-right: 15%;
		margin-left: 15%;
		list-style: none;
	`;
	slider.append(indicators); //Добавляємо список в блок slider

	for (let i = 0; i < slides.length; i++) {
		const dot = document.createElement('li');
		dot.setAttribute('data-slide-to', i + 1);
		dot.style.cssText = `
			box-sizing: content-box;
			flex: 0 1 auto;
			width: 30px;
			height: 6px;
			margin-right: 3px;
			margin-left: 3px;
			cursor: pointer;
			background-color: #fff;
			background-clip: padding-box;
			border-top: 10px solid transparent;
			border-bottom: 10px solid transparent;
			opacity: .5;
			transition: opacity .6s ease;
		`
		if (i == 0){
			dot.style.opacity = 1;
		}
		indicators.append(dot);
		dots.push(dot);
	}

	next.addEventListener('click', () => {
		if (offset === deleteNotDigits(width) * (slides.length -1)) {
			offset = 0;
		} else {
			offset += deleteNotDigits(width) ;
		}

		slidesField.style.transform = `translateX(-${offset}px)`;

		if(slideIndex == slides.length) {
			slideIndex = 1;
		} else {
			slideIndex++;
		}
		slideDots();
	});

	prev.addEventListener('click', () => {
		if (offset == 0) {
			offset = deleteNotDigits(width)  * (slides.length -1)
		} else {
			offset -= deleteNotDigits(width) ;
		}

		slidesField.style.transform = `translateX(-${offset}px)`;

		if(slideIndex == 1) {
			slideIndex = slides.length;
		} else {
			slideIndex--;
		}
		slideDots();
	});

	dots.forEach(dot => {
		dot.addEventListener('click', (e) => {
			const slideTo = e.target.getAttribute('data-slide-to');

			slideIndex = slideTo;
			offset = deleteNotDigits(width)  * (slideTo - 1);

			slidesField.style.transform = `translateX(-${offset}px)`;
			slideDots(); 
		});
	});
	function deleteNotDigits(str) {
		return +str.replace( /\D/g, '');
	}
	function slideDots() {
		if(slides.length < 10) {
			current.textContent = `0${slideIndex}`;
		} else {
			current.textContent = slideIndex;
		}
		dots.forEach(dot => dot.style.opacity = `.5`);
		dots[slideIndex - 1].style.opacity = 1;
	}
	
	//Calc

	const result = document.querySelector('.calculating__result span');

	let sex,height, weight, age, ratio;

	if (localStorage.getItem('sex')) {
		let sex = localStorage.getItem('sex');
	} else {
		sex = 'female';
		localStorage.setItem('sex', 'female');
	}
	if (localStorage.getItem('ratio')) {
		let ratio = localStorage.getItem('ratio');
	} else {
		ratio = 1.375;
		localStorage.setItem('ratio', 1.375);
	}

	function initLocalSetting(selector, activeClass) {
		const elements = document.querySelectorAll(selector);
		
		elements.forEach(element => {
			element.classList.remove(activeClass);
			if (element.getAttribute('id') === localStorage.getItem('sex')) {
				sex = localStorage.getItem('sex');
				element.classList.add(activeClass);
			} 
			if (element.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
				ratio = localStorage.getItem('ratio');
				element.classList.add(activeClass);
			}
		});
	}
	function calcTotal() {
		if (!sex || !height || !weight || !age || !ratio) {
			result.textContent = 'Введите все данные ___';
			return;
		}

		if (sex === 'female') {
			result.textContent = Math.round((47.6 + (9.2* weight) + (3.1 * height) - (4.3 * age)) * ratio);
		} else {
			result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
		}
	}
	function getStaticInfo(parentSelector, activeClass) {
		const element = document.querySelectorAll(`${parentSelector} div`);

		element.forEach(elem => {
			elem.addEventListener('click', (event) => {
				if (event.target.getAttribute('data-ratio')) {
					ratio =+ event.target.getAttribute('data-ratio');
					localStorage.setItem('ratio', event.target.getAttribute('data-ratio'));
				} else {
					sex = event.target.getAttribute('id');
					localStorage.setItem('sex', event.target.getAttribute('id'));
				}
				element.forEach(elem => {
					elem.classList.remove(activeClass);
				});
	
				event.target.classList.add(activeClass);
	
				calcTotal();
			});
		})
	}

	function getDynamicInfo(selector) {
		const input = document.querySelector(selector);

		input.addEventListener('input', (e) => {

			if(input.value.match(/\D/g)) {
				input.style.border = '1px solid red';
			} else {
				input.style.border = `none`;
			}
			switch(input.getAttribute('id')) {
				case 'height':
					height = +input.value;
					break;
				case 'weight':
					weight = +input.value;
					break;
				case 'age':
					age = +input.value;
					break;
			}
			calcTotal();	
		});
	}

	getDynamicInfo('#height');
	getDynamicInfo('#weight');
	getDynamicInfo('#age');
	initLocalSetting('#gender div', 'calculating__choose-item_active')
	initLocalSetting('.calculating__choose_big div', 'calculating__choose-item_active')
	getStaticInfo('#gender', 'calculating__choose-item_active');
	getStaticInfo('.calculating__choose_big', 'calculating__choose-item_active')
})
