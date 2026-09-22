document.addEventListener("DOMContentLoaded" , ()=>{
    const products=[
        {id:1, name:"Gucci Bag", price: 9000},
        {id:2, name:"Ralph Lauren Shirt", price: 2000},
        {id:3, name:"Prada Jacket", price: 4300},
    ];

    let cart=JSON.parse(localStorage.getItem('cart')) || [];

    const productList=document.getElementById("product-list");
    const CartItems=document.getElementById("cart-items");
    const emptyCartMessage =document.getElementById("empty-cart");
    const cartTotalMessage =document.getElementById("cart-total");
    const totalPriceDisplay =document.getElementById("total-price");
    const checkOutBtn =document.getElementById("checkout-btn");;

    products.forEach(product => {
        const productDiv=document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML=`
        <span>${product.name} - $${product.price.toFixed(2)}</span>
        <button data-id="${product.id}">Add to Cart</button>
        `;
        productList.appendChild(productDiv);
    });

    productList.addEventListener("click", (e)=>{
        if(e.target.tagName==="BUTTON"){
            const productId=parseInt(e.target.getAttribute('data-id'));
            const product=products.find(p=> p.id===productId);
            addToCart(product);
        }

    });
    CartItems.addEventListener("click", (e1) => {
      if (e1.target.tagName === "BUTTON") {
        const removeID = parseInt(e1.target.getAttribute("data-id"));
        const cartProduct = cart.find((p) => p.id === removeID);
        removeFromCart(cartProduct);
      }
    });

    function addToCart(product){
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }

    function renderCart(){
        CartItems.innerText="";
        let totalPrice=0;
        if(cart.length>0){
            emptyCartMessage.classList.add('hidden');
            cartTotalMessage.classList.remove('hidden');
            cart.forEach((item,index)=>{
                totalPrice+=item.price;
                const cartItem=document.createElement('div');
                cartItem.classList.add("cart-item");
                cartItem.innerHTML = `
                <span>${item.name} - $${item.price.toFixed(2)}</span>
                <button class="remove-btn" data-id="${item.id}">Remove</button>
                `;
                CartItems.appendChild(cartItem);
                totalPriceDisplay.textContent=`${totalPrice.toFixed(2)}`;


                
                
            });
            
        }
        else{
            emptyCartMessage.classList.remove("hidden");
            totalPriceDisplay.textContent = `$0.00`;
            
        }
        
    }

    checkOutBtn.addEventListener('click',()=>{
        cart.length=0;
        alert("Checkout Successfully")
        renderCart();
    });

    function removeFromCart(cartProduct) {
      cart = cart.filter((p) => p.id !== cartProduct.id);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }

    renderCart();
});
