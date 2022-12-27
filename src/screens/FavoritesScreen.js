import React, { useState, useEffect } from 'react';
import Cookie from 'js-cookie';
function CartScreen() {

const [favorites, setFavorites] = useState([]);

useEffect(() => {

  async function fetchcartData() {
    const userInfo = JSON.parse(Cookie.get('userInfo'));
    console.log(userInfo[0][0].id, "  user id");
    const response = await fetch("http://localhost:3000/favorites", {
      method: 'POST',
      body: JSON.stringify({ 
        user_id: userInfo[0][0].id,
        
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    setFavorites(data[0]);
  }
  fetchcartData();
}, []);
function deleteFavoritesItem(id){
    async function fetchdeletefavoritesData() {
      const userInfo = JSON.parse(Cookie.get('userInfo'));
      try {
        const response = await fetch('http://localhost:3000/favorites/deletefavorites', {
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
    fetchdeletefavoritesData();
    setFavorites([]);
    window.location.reload();

  }

return (
<div>
<h1>Favoriler</h1>
<table>
<thead>
<tr>
<th>User_id</th>
<th>Product_id</th>
</tr>
</thead>
<tbody>
{favorites.map(item => (
<tr key={item.user_id}>
<td>{item.user_id}</td>
<td>{item.product_id}</td>
{
    <li>
        <button onClick={() => deleteFavoritesItem(item.product_id)}>Sil</button>
    </li>
}
</tr>
))}
</tbody>
</table>
</div>
);
}

export default CartScreen;