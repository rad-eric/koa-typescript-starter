const axios = require('axios')
const lineItems = []
function addProduct  (variantId,quantity) {
  axios.patch('/store/cart/',{lineItems:[{variantId,quantity}]})
  .then(response=>{
    console.log(response.data,'xx');
    const checkout = response.data
    document.getElementById('cart-items').innerHTML = checkout.lineItems.map(item=>`<li>${item.title}${item.variant ? " - "+item.variant.title : null} (${item.quantity})</li>`)
    document.getElementById('totalPrice').innerHTML = checkout.totalPrice
  })
}

const checkout = () =>{
  
  axios
  .post('/store/checkout',{lineItems})
  .then(function(response) {        
    debugger
    window.location.href = response.data
  })
  .catch(function(error) {
    // handle error
    console.log(error,'Error for  checkout');
  })
}

window.addProduct = addProduct;
window.checkout = checkout;