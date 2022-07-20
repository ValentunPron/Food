function tellMe() {
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
}

module.exports = tellMe;