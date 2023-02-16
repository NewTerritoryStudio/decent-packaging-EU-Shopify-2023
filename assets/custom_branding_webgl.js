const customBrandingBtns = document.querySelectorAll('.customize_btn')
const productUploadPopups = document.querySelectorAll('.product-upload--popup')
const popUpCloses = document.querySelectorAll('.pop-up--close')



for (let index = 0; index < customBrandingBtns.length; index++) {
	let element = customBrandingBtns[index];

	element.addEventListener("change", function () {

        // Add Image URLS to form
        // let form = document.getElementById('branding_form_' + index)

        //  Uploaded Image

		let pattern = window.URL.createObjectURL(this.files[0])

        //  product Image

		let image = document.querySelector('.prod_overlay__pattern_' + index).getAttribute('data-image')

        // Canvas

		let canvasTarget = document.getElementById('glCanvas_' + index)

        console.log(pattern)
		console.log(image)
        console.log(canvasTarget)



        let canvas = new fabric.Canvas(canvasTarget)

        canvas.setWidth(window.innerWidth / 2);
        canvas.setHeight(window.innerHeight);
    

        fabric.Image.fromURL(image, function(img) {
            
            img1 = img
            
            img1.crossOrigin = "Anonymous";

            fabric.Image.fromURL(pattern, function(img){
                
                

                img1.scaleToWidth(canvas.getWidth());
                img1.left = 20
                img1.rigt = 20
                img1.top = 20
                img1.bottom = 20


                
                img1.selectable = false;
                img2 = img;
                img2.crossOrigin = "Anonymous";

                img2.scaleToHeight(canvas.getHeight() / 2);
                img2.left =  canvas.width / 2
                img2.top = 50;
                img2.globalCompositeOperation = 'source-atop'
                canvas.add(img1);
                canvas.add(img2);
                canvas.centerObject(img1)
                canvas.centerObject(img2)
    
                img2.set({
                    borderColor: '#000',
                    cornerColor: '#000',
                    cornerSize: 6,
                    transparentCorners: false
                  });

            
                  
            }, { crossOrigin: 'Anonymous'});

        }, { crossOrigin: 'Anonymous'})



        let save_btn = document.querySelector('.save_image_' + index) 
        
        window.addEventListener('DOMContentLoaded', function(event){
            var newWidth = window.innerWidth;
            var newHeight = window.innerHeight; 

            if (newWidth < 768) {
                canvas.setHeight(500);
                canvas.setWidth(newWidth);
            } else {
                canvas.setHeight(window.innerHeight);
                canvas.setWidth(window.innerWidth / 2);
            }

            console.log(newWidth)
            console.log(newHeight)
            console.log(canvas)

            console.log('Canvas Width:' + canvas.width)




            img1.scaleToWidth(canvas.getWidth())

            canvas.centerObject(img1)
            canvas.centerObject(img2)

            canvas.renderAll()


        })

         //listen for window resize event
         window.addEventListener('resize', function(event){
            var newWidth = window.innerWidth;
            var newHeight = window.innerHeight; 

            if (newWidth < 768) {
                canvas.setHeight(500);
                canvas.setWidth(newWidth);
            } else {
                canvas.setHeight(window.innerHeight);
                canvas.setWidth(window.innerWidth / 2);
            }

            console.log(newWidth)
            console.log(newHeight)
            console.log(canvas)

            console.log('Canvas Width:' + canvas.width)




            img1.scaleToWidth(canvas.getWidth())

            canvas.centerObject(img1)
            canvas.centerObject(img2)

            canvas.renderAll()

        });

        if (save_btn) {
        save_btn.addEventListener('click', (e) => {


            // Download Image

            let fakeA = document.createElement("a")

            fakeA.href = canvas.toDataURL("image/jpeg")
            fakeA.target = '_blank'
            fakeA.download = "custom-branding.jpeg"
            fakeA.click()

        })
    }

		productUploadPopups[index].classList.add('open')
	})
	
	popUpCloses[index].addEventListener('click', () => {
		productUploadPopups[index].classList.remove('open')
	})


}

