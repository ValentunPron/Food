function slider(){
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

}

module.exports = slider;