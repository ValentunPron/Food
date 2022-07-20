function modal() {
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
}

module.exports = modal;