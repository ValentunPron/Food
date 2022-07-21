function openModalContent (modalSelector, modalTimerID) {
	const modal = document.querySelector(modalSelector);
	modal.style.display = 'block';
	document.body.style.overflow = 'hidden';
	console.log(modalTimerID)
	if(modalTimerID) {
		clearInterval(modalTimerID);
	}
}

function closeModalContent (modalSelector) {
	const modal = document.querySelector(modalSelector);
	modal.style.display = 'none';
	document.body.style.overflow = '';
}

function modal(triggerSelector, modalSelector, modalTimerID) {
	const modalTrigger = document.querySelectorAll(triggerSelector),
	modal = document.querySelector(modalSelector);

	modalTrigger.forEach(item => {
	item.addEventListener('click', () => openModalContent(modalSelector, modalTimerID))
	})

	modal.addEventListener('click', (event) => {
	if (event.target === modal || event.target.getAttribute('data-close') == '') {
		closeModalContent(modalSelector);
	}
	});

	document.addEventListener('keydown', (e) => {
	if (e.code === 'Escape' && modal.style.display === 'block') {
		closeModalContent(modalSelector);
	}
	});

	function showModalByScroll() {
	if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
		openModalContent(modalSelector, modalTimerID);
		window.removeEventListener('scroll', closeModalContent);
	}
	}
	window.addEventListener('scroll', closeModalContent);
}

export default modal;
export {closeModalContent};
export {openModalContent};