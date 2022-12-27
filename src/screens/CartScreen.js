import React, { useState, useEffect } from 'react';
import Cookie from 'js-cookie';
function CartScreen() {

const [cart, setCart] = useState([]);
const [quantity, setQuantity] = useState('');
const [address, setAddress] = useState([]);
const [wallets, setWallets] = useState([]);
const [selectedAddress, setSelectedAddress] = useState('');
const [selectedWallet, setSelectedWallet] = useState('');

useEffect(() => {

  async function fetchcartData() {
    const userInfo = JSON.parse(Cookie.get('userInfo'));
    console.log(userInfo[0][0].id, "  user id");
    const response = await fetch("http://localhost:3000/cart", {
      method: 'POST',
      body: JSON.stringify({ 
        user_id: userInfo[0][0].id
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    setCart(data[0]);
  }
  fetchcartData();
  async function fetchData() {
    const userInfo = JSON.parse(Cookie.get('userInfo'));
    const response = await fetch('http://localhost:3000/myAddresses',{
        method: 'POST',
        body: JSON.stringify({
            user_id: userInfo[0][0].id
        }),
        headers: {
            'Content-Type': 'application/json'
            
    }
    });
    const data = await response.json();
    setAddress(data[0]);
    console.log(data[0], " addreses")
    const response2 = await fetch('http://localhost:3000/myWallets',{
        method: 'POST',
        body: JSON.stringify({
            user_id: userInfo[0][0].id
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data2 = await response2.json();
    setWallets(data2[0]);
    console.log(data2[0], " wallets")
}
fetchData();
}, []);

function deleteCartItem(id){
  async function fetchdeletecartData() {
    const userInfo = JSON.parse(Cookie.get('userInfo'));
    try {
      const response = await fetch('http://localhost:3000/cart/deleteCart', {
        method: 'DELETE',
        body: JSON.stringify({
          product_id: id,
          user_id: userInfo[0][0].id,
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
          // İstek başarılı olduğunda bir başarı mesajı gösterin
          alert('Ürün başarıyla silindi!');
        } else {
          // İstek başarısız olduğunda bir hata mesajı gösterin
          alert('Ürün silinirken hata oluştu!');
        }
    } catch (error) {
      console.error(error);
    }
  }
  fetchdeletecartData();
  setCart([]);
  window.location.reload();

}

function updateCartItem(id,quantity){
  async function fetchupdatecartData() {
    const userInfo = JSON.parse(Cookie.get('userInfo'));
    try {
      const response = await fetch('http://localhost:3000/cart/updateCart', {
        method: 'PUT',
        body: JSON.stringify({
          product_id: id,
          user_id: userInfo[0][0].id,
          quantity: quantity
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
          // İstek başarılı olduğunda bir başarı mesajı gösterin
          alert('Ürün başarıyla güncellendi!');
        } else {
          // İstek başarısız olduğunda bir hata mesajı gösterin
          alert('Ürün güncellenirken hata oluştu!');
        }
    } catch (error) {
      console.error(error);
    }
  }
  fetchupdatecartData();
  setQuantity([]);
  window.location.reload();

}

function buyProduct(){
  async function fetchbuyProductData() {
    const userInfo = JSON.parse(Cookie.get('userInfo'));
    try {
      const response = await fetch('http://localhost:3000/order/buyproduct', {
        method: 'POST',
        body: JSON.stringify({
          user_id: userInfo[0][0].id,
          address_id: selectedAddress.id,
          wallet_name: selectedWallet,
          total_price: totalPrice,
          order_date: new Date(),
          order_status: 0
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
          // İstek başarılı olduğunda bir başarı mesajı gösterin
          alert('Ürün başarıyla satın alındı!');
        } else {
          // İstek başarısız olduğunda bir hata mesajı gösterin
          alert('Ürün satın alınırken hata oluştu!');
        }
    } catch (error) {
      console.error(error);
    }
  }
  fetchbuyProductData();
  setCart([]);
  window.location.reload();
}

var totalPrice=0;
cart.forEach(item => {
  totalPrice += item.quantity * item.price;
});

return (
<div>
<h1>Sepet</h1>
<table>
<thead>
<tr>
<th>User_id</th>
<th>Product_id</th>
<th>Quantity</th>
<th>Price</th>
</tr>
</thead>
<tbody>
{cart.map(item => (

<tr key={item.user_id}>
<td >{item.user_id}</td>
<td>{item.product_id}</td>
<td>{item.quantity}</td>
<td>{item.quantity*item.price} TL</td>
<td></td>
<td></td>
{
  <li>
  <button onClick={() => deleteCartItem(item.product_id)}>Sil</button>
  
  </li>
  
}
{
  <li>
    <input type="text" name="quantity" onChange={(e) => setQuantity(e.target.value)} />
      
    <button onClick={() => updateCartItem(item.product_id,quantity)}>
      Güncelle
      </button>
   </li>
}
</tr>
))}
</tbody>
</table>
<h3>Satin Al</h3>
<div>
<select onChange={(e) => setSelectedAddress(e.target.value)}>
  <option value="0">Adres Seçiniz</option>
  {address.map(item => (
    <option value={item.id}>{item.address}</option>
  ))}
</select>
<select onChange={(e) => setSelectedWallet(e.target.value)}>
  <option value="0">Cüzdan Seçiniz</option>
  {wallets.map(item => (
    <option value={item.card_name}>{item.card_name}</option>
  ))}
</select>
</div>
<div>-</div>
<div>-</div>
<button onClick={() => buyProduct()}>Satın Al</button>
<h3>Toplam Tutar: {totalPrice} TL</h3>
</div>
);
}

export default CartScreen;