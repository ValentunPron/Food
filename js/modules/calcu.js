function calcu() {
	const result = document.querySelector('.calculating__result span'); // Вікно результату

	let sex,height, weight, age, ratio; // Перемінні які будуть використовуватися 

	if (localStorage.getItem('sex')) {
		let sex = localStorage.getItem('sex'); // Визначаємо стать, якщо стать зазначенна в локальному сервері, то вибираємо її
	} else {
		sex = 'female'; 
		localStorage.setItem('sex', 'female'); // Якщо не зазначено, то кладемо автоматично, що це жіноча стать
	}
	if (localStorage.getItem('ratio')) {
		let ratio = localStorage.getItem('ratio'); // Визначаємо нагрузку, якщо нагрузка зазначенна в локальному сервері, то вибираємо її
	} else {
		ratio = 1.375;
		localStorage.setItem('ratio', 1.375); // Якщо не зазначено, то кладемо автоматично, що це 1.375 нагрузка
	}

	function initLocalSetting(selector, activeClass) { // Функція яка активує, те що ви нажали 
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
	function calcTotal() { // Калькулятор який визначає за формулов 
		if (!sex || !height || !weight || !age || !ratio) { // Якщо немає всіх перемінних, то вибиває текст який зазначений в цій умові
			result.textContent = 'Введите все данные ___';
			return;
		}

		if (sex === 'female') { // Якщо у вас жіноча стать, то програма рахує за цею формолою
			result.textContent = Math.round((47.6 + (9.2* weight) + (3.1 * height) - (4.3 * age)) * ratio);
		} else { // А якщо у вас чоловіча, а точніше не жіноча, то розраховує за цею формолою
			result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
		}
	}
	function getStaticInfo(parentSelector, activeClass) { //  Полочумаємо інфомрацію, про стать і активність 
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

	function getDynamicInfo(selector) { // Получаємо інформацію про ріст, вагу, рік
		const input = document.querySelector(selector);

		input.addEventListener('input', (e) => {

			if(input.value.match(/\D/g)) { // Якщо буде введено не цифру, то буде підсіченне червоне вікно, як розумію собою, що користувач допустив помилку
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
	//Всі функції які заносять данні 
	getDynamicInfo('#height');
	getDynamicInfo('#weight');
	getDynamicInfo('#age');
	initLocalSetting('#gender div', 'calculating__choose-item_active')
	initLocalSetting('.calculating__choose_big div', 'calculating__choose-item_active')
	getStaticInfo('#gender', 'calculating__choose-item_active');
	getStaticInfo('.calculating__choose_big', 'calculating__choose-item_active')
}

module.exports = calcu;