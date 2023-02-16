
/* 

OLD IMPLEMENTATION


cart = shop.cart;
const spent = cart.total_price / 500;
const toSpend = (50000 - cart.total_price) / 50000 * 100;
document.querySelector('.progress-banner__spent').style.width = spent + '%';
document.querySelector('.progress-banner__tospend').style.width = toSpend + '%';

TO BE RECONFIGURED

*/

// window.addEventListener('load', (event) => {


//     cart = shop.cart;

//     console.log(cart)

//     // if(document.body.contains(document.querySelector('.progress-banner__spent'))) {

//         function progressBannerInit() {

//             const spent = cart.total_price / 500;
//             const toSpend = (50000 - cart.total_price) / 50000 * 100;
//             const bannerSpent = document.querySelector('.progress-banner__spent')
//             const bannerToSpend = document.querySelector('.progress-banner__tospend')
    
//             bannerSpent.style.width = spent + '%';
//             bannerToSpend.style.width = toSpend + '%';
//         }

//         progressBannerInit()
//     // }
// })


