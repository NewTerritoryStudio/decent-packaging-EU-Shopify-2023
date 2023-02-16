const customBrandingBtns = document.querySelectorAll('.customize_btn')
const productUploadPopups = document.querySelectorAll('.product-upload--popup')
const popUpCloses = document.querySelectorAll('.pop-up--close')
const brandingForms = document.querySelector('#branding_form')




for (let index = 0; index < customBrandingBtns.length; index++) {
	let element = customBrandingBtns[index];

	element.addEventListener("change", function () {
		let pattern = window.URL.createObjectURL(this.files[0])

		console.log(pattern)

		let image = document.querySelector('.prod_overlay__pattern_' + index)
		let imageOverlay = document.querySelector('.prod_overlay_' + index)

		console.log(image)

		image.style.backgroundImage = "url(" + pattern + ")"
		imageOverlay.style.display = "flex"

		productUploadPopups[index].classList.add('open')
	})
	
	popUpCloses[index].addEventListener('click', () => {
		productUploadPopups[index].classList.remove('open')
	})

}

