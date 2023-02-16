let popCanvas
let ctx
let popCanvas1080
let ctx1080
let popCanvasA2
let ctxA2
let popCanvas10801920
let ctxA210801920


const popBox = document.querySelector('#account-pop-download-box')

function init () {

    
     // Get reports Data

     $.ajax({ url: '/account?view=dashboard-reports-json' }).done(function(data) {

    var dataJson = JSON.parse(data.replace(/<!--[\s\S]*?-->/g, ""));

    let cName = dataJson.customer_name.toLocaleString();

    
    // if (!dataJson.reports.length) {
    //     return;
    // }
        

    // -- A4 landscape asset -- //
        
    // Initialise the canvas
    popCanvas = document.querySelector('#popCanvas')
    
    // Initialise canvas context
    ctx = popCanvas.getContext('2d')
    
    // Set Background Image A$ 
    
    let background = new Image();
    background.crossOrigin = "anonymous"
    background.src = "https://cdn.shopify.com/s/files/1/0110/2037/0020/files/pop-2022-a4.png?v=1668459921";
    
    // Image smoothing
    ctx.imageSmoothingEnabled = true;


    // convert number to string so that it formats with commas.
    let popText = dataJson.pieces_of_plastic_purchased.toLocaleString()
    
        // Make sure the image is loaded first otherwise nothing will draw.
        background.onload = function(){
            ctx.drawImage(background,0,0,popCanvas.width, popCanvas.height);   
            
            // Text Font & size styling
            ctx.font = '700 30px proxima-nova';
            ctx.fillStyle = 'white';
            
            // Text Alignment
            ctx.textBaseline = 'top'; 
            ctx.textAlign = 'left'; 

            // Add Text
            ctx.fillText(cName, 197, 118);

            let text = ctx.measureText(cName);
            ctx.strokeStyle = "white";
            ctx.lineWidth = 3;
            ctx.strokeRect(187, 108, text.width + 20, 50);

            ctx.font = '800 120px proxima-nova';
            ctx.fillText(popText, 187, 224);
        }


    // -- 1080 X 1080 asset -- //

    // Initialise the canvas
    popCanvas1080 = document.querySelector('#popCanvas1080')

    // Initialise canvas context
    ctx1080 = popCanvas1080.getContext('2d')
    
    // Set Background Image A$ 
    
    let background1080 = new Image();
    background1080.crossOrigin = "anonymous"
    background1080.src = "https://cdn.shopify.com/s/files/1/0110/2037/0020/files/pop-2022-1080x1080.png?v=1668459921";
    
    // Image smoothing
    ctx1080.imageSmoothingEnabled = true;


    // convert number to string so that it formats with commas.
    let popText1080 = dataJson.pieces_of_plastic_purchased.toLocaleString()
    
        // Make sure the image is loaded first otherwise nothing will draw.
        background1080.onload = function(){
            ctx1080.drawImage(background1080,0,0,popCanvas1080.width, popCanvas1080.height);   
            
            // Text Font & size styling
            ctx1080.font = '700 56px proxima-nova';
            ctx1080.fillStyle = 'white';
            
            // Text Alignment
            ctx1080.textBaseline = 'top'; 
            ctx1080.textAlign = 'left'; 

            // Add Text
            ctx1080.fillText(cName, 154, 226);

            let text1080 = ctx1080.measureText(cName);
            ctx1080.strokeStyle = "white";
            ctx1080.lineWidth = 3;
            ctx1080.strokeRect(144, 216, text1080.width + 20, 76);

            ctx1080.font = '800 216px proxima-nova';
            ctx1080.fillText(popText1080, 144, 407);
        }


    // -- A2 Portrait asset -- //

    
     // Initialise the canvas
     popCanvasA2 = document.querySelector('#popCanvasA2')

     // Initialise canvas context
     ctxA2 = popCanvasA2.getContext('2d')
     
     // Set Background Image A$ 
     
     let backgroundA2 = new Image();
     backgroundA2.crossOrigin = "anonymous"
     backgroundA2.src = "https://cdn.shopify.com/s/files/1/0110/2037/0020/files/pop-2022-a2.png?v=1668459921";
     
     // Image smoothing
     ctxA2.imageSmoothingEnabled = true;
 
 
     // convert number to string so that it formats with commas.
     let popTextA2 = dataJson.pieces_of_plastic_purchased.toLocaleString()
     
         // Make sure the image is loaded first otherwise nothing will draw.
         backgroundA2.onload = function(){
            ctxA2.drawImage(backgroundA2,0,0,popCanvasA2.width, popCanvasA2.height);   
             
            // Text Font & size styling
            ctxA2.font = '700 62px proxima-nova';
            ctxA2.fillStyle = 'white';
            
            // Text Alignment
            ctxA2.textBaseline = 'top'; 
            ctxA2.textAlign = 'left'; 

            // Add Text
            ctxA2.fillText(cName, 167, 495);

            let textA2 = ctxA2.measureText(cName);
            ctxA2.strokeStyle = "white";
            ctxA2.lineWidth = 3;
            ctxA2.strokeRect(157, 485, textA2.width + 20, 82);

            ctxA2.font = '800 239px proxima-nova';
            ctxA2.fillText(popTextA2, 157, 697);
         }


    // -- 1080 X 1920 asset -- //

        
     // Initialise the canvas
     popCanvas10801920 = document.querySelector('#popCanvas10801920')

     // Initialise canvas context
     ctx210801920 = popCanvas10801920.getContext('2d')
     
     // Set Background Image A
     
     let background10801920 = new Image();
     background10801920.crossOrigin = "anonymous"
     background10801920.src = "https://cdn.shopify.com/s/files/1/0110/2037/0020/files/pop-2022-1080x1920.png?v=1668459921";
     
     // Image smoothing
     ctx210801920.imageSmoothingEnabled = true;
 
 
     // convert number to string so that it formats with commas.
     let popText10801920 = dataJson.pieces_of_plastic_purchased.toLocaleString()
     
         // Make sure the image is loaded first otherwise nothing will draw.
         background10801920.onload = function(){
            ctx210801920.drawImage(background10801920,0,0,popCanvas10801920.width, popCanvas10801920.height);   
            
            // Text Font & size styling
            ctx210801920.font = '700 56px proxima-nova';
            ctx210801920.fillStyle = 'white';
            
            // Text Alignment
            ctx210801920.textBaseline = 'top'; 
            ctx210801920.textAlign = 'left'; 

            // Add Text
            ctx210801920.fillText(cName, 152, 645);

            let text210801920 = ctx210801920.measureText(cName);
            ctx210801920.strokeStyle = "white";
            ctx210801920.lineWidth = 3;
            ctx210801920.strokeRect(142, 635, text210801920.width + 20, 76);

            ctx210801920.font = '800 216px proxima-nova';
            ctx210801920.fillText(popText10801920, 142, 828);
         }

    /* ============================================
    CARBON ASSETS
    ============================================ */

    // -- A2 Portrait asset -- //

    
     // Initialise the canvas
     CARBON_popCanvasA2 = document.querySelector('#CARBON_popCanvasA2')

     // Initialise canvas context
     CARBON_ctxA2 = CARBON_popCanvasA2.getContext('2d')
     
     // Set Background Image A$ 
     
     let CARBON_backgroundA2 = new Image();
     CARBON_backgroundA2.crossOrigin = "anonymous"
     CARBON_backgroundA2.src = "https://cdn.shopify.com/s/files/1/0110/2037/0020/files/1080x1080_POPdownloadableassets-decent-01_8be819ad-15ee-47dc-86e3-afc13e21a76e.jpg?v=1627624456";
     
     // Image smoothing
     CARBON_ctxA2.imageSmoothingEnabled = true;
 
 
     // convert number to string so that it formats with commas.
     let CARBON_popTextA2 = dataJson.tonnes_of_carbon_emissions_saved.toFixed(4)
     
         // Make sure the image is loaded first otherwise nothing will draw.
         CARBON_backgroundA2.onload = function(){
             CARBON_ctxA2.drawImage(CARBON_backgroundA2,0,0,CARBON_popCanvasA2.width, CARBON_popCanvasA2.height);   
             
             // Text Font & size styling
             CARBON_ctxA2.font = '700 180px proxima-nova';
             
             // Text Alignment
             CARBON_ctxA2.textBaseline = 'middle'; 
             CARBON_ctxA2.textAlign = 'center'; 
 
             // Add Text
             CARBON_ctxA2.fillText(CARBON_popTextA2, CARBON_popCanvasA2.width/2, CARBON_popCanvasA2.height/2 + 40);
         
         }


        // -- Buttons + converting canvas to downloadable assets -- //

        // JPEG BUTTON

        const popBtn = document.querySelector('#downloadBtn')

        popBtn.addEventListener('click', () => {

            // IE / Edge support (PNG ONLY)
            if (window.navigator.msSaveBlob) {
                window.navigator.msSaveBlob(popCanvas.msToBlob(), "decentpackaging-PoP.png")
                window.navigator.msSaveBlob(popCanvas1080.msToBlob(), "decentpackaging-PoP-IGfeed.png")
                window.navigator.msSaveBlob(popCanvas1080.msToBlob(), "decentpackaging-PoP-a2poster.png")


            } else {
                const a = document.createElement("a");
                const a1080 = document.createElement("a");
                const a2 = document.createElement("a");
                const a10801920 = document.createElement("a");


                // Carbon Download
                const CARBON_a2 = document.createElement("a");

                // Anchor Element for first asset

                // document.body.appendChild(a) -- Security on chrome : might need for Moz
                a.href = popCanvas.toDataURL("image/jpeg")
                a.target = '_blank'
                a.download = "decentpackaging-PoP.jpeg"
                a.click()
                // document.body.removeChild(a)
                
                // Anchor Element for 1080 asset

                // document.body.appendChild(a1080) -- Security on chrome : might need for Moz
                a1080.href = popCanvas1080.toDataURL("image/jpeg")
                a1080.target = '_blank'
                a1080.download = "decentpackaging-PoP-IGfeed.jpeg"
                a1080.click()
                // document.body.removeChild(a1080)


                // Anchor Element for A2 asset

                // document.body.appendChild(a2) -- Security on chrome : might need for Moz
                a2.href = popCanvasA2.toDataURL("image/jpeg")
                a2.target = '_blank'
                a2.download = "decentpackaging-PoP-a2poster.jpeg"
                a2.click()
                // document.body.removeChild(a2)
                CARBON_a2.href = CARBON_popCanvasA2.toDataURL("image/jpeg")
                CARBON_a2.target = '_blank'
                CARBON_a2.download = "decentpackaging-carbon-a2poster.jpeg"
                CARBON_a2.click()
                // Anchor Element for 1080 X 1920 Asset

                // document.body.appendChild(a10801920) -- Security on chrome : might need for Moz
                a10801920.href = popCanvas10801920.toDataURL("image/jpeg")
                a10801920.target = '_blank'
                a10801920.download = "decentpackaging-PoP-IGstory.jpeg"
                a10801920.click()
                // document.body.removeChild(a10801920)
    
                        }
                    })
                
        // PNG BUTTON

        const popBtnPNG = document.querySelector('#downloadBtnPNG')

        popBtnPNG.addEventListener('click', () => {

            // IE / Edge support (PNG ONLY)
            if (window.navigator.msSaveBlob) {
                window.navigator.msSaveBlob(popCanvas.msToBlob(), "decentpackaging-PoP.png")
                window.navigator.msSaveBlob(popCanvas1080.msToBlob(), "decentpackaging-PoP-IGfeed.png")
                window.navigator.msSaveBlob(popCanvas1080.msToBlob(), "decentpackaging-PoP-a2poster.png")


            } else {
                const png_a = document.createElement("a");
                const png_a1080 = document.createElement("a");
                const png_a2 = document.createElement("a");
                const png_a10801920 = document.createElement("a");


                // Carbon Download
                const CARBON_png_a2 = document.createElement("a");



                // Anchor Element for first asset

                // document.body.appendChild(a) -- Security on chrome : might need for Moz
                png_a.href = popCanvas.toDataURL("image/png")
                png_a.target = '_blank'
                png_a.download = "decentpackaging-PoP.png"
                png_a.click()
                // document.body.removeChild(a)
                
                // Anchor Element for 1080 asset

                // document.body.appendChild( png_a1080) -- Security on chrome : might need for Moz
                png_a1080.href = popCanvas1080.toDataURL("image/png")
                png_a1080.target = '_blank'
                png_a1080.download = "decentpackaging-PoP-IGfeed.png"
                png_a1080.click()
                // document.body.removeChild(a1080)


                // Anchor Element for A2 asset

                // document.body.appendChild(a2) -- Security on chrome : might need for Moz
                png_a2.href = popCanvasA2.toDataURL("image/png")
                png_a2.target = '_blank'
                png_a2.download = "decentpackaging-PoP-a2poster.png"
                png_a2.click()
                // document.body.removeChild(a2)
                CARBON_png_a2.href = CARBON_popCanvasA2.toDataURL("image/png")
                CARBON_png_a2.target = '_blank'
                CARBON_png_a2.download = "decentpackaging-carbon-a2poster.png"
                CARBON_png_a2.click()


                // Anchor Element for 1080 X 1920 Asset

                // document.body.appendChild(a10801920) -- Security on chrome : might need for Moz
                png_a10801920.href = popCanvas10801920.toDataURL("image/png")
                png_a10801920.target = '_blank'
                png_a10801920.download = "decentpackaging-PoP-IGstory.png"
                png_a10801920.click()
                // document.body.removeChild(a10801920)

    
                        }
                    })
    

            });


                

    
}
 




if(!!popBox) {

document.addEventListener('DOMContentLoaded', init)

}
    