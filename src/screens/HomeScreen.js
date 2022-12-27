import React, { useState, useEffect } from 'react';
import Cookie from 'js-cookie';
function HomeScreen() {

  const [subProduct, setsubProducts] = useState([]);
  const [selectedProduct, setSelectedCategory] = useState([]);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://localhost:3000/products');
      const data = await response.json();
      setProducts(data[0]);
    }

    fetchData();}, []);
  function handleCategoryClick(id) {
      setSelectedCategory(id);
      async function fetchsubData() {
        const response = await fetch('http://localhost:3000/products/'+ id);
        const data = await response.json();
        setsubProducts(data[0]);
      }
      fetchsubData();
    setsubProducts([]);}
  function handleReviewClick(id) { setSelectedCategory(id);
          async function fetchreviewData() {
          const response = await fetch('http://localhost:3000/reviews/'+ id);
          const data = await response.json();
    setReviews(data[0]); }fetchreviewData();setReviews([]); }
  function handlePostReviewClick(id) { 
       setSelectedCategory(id);
       async function fetchpostreviewData() {
        const userInfo = JSON.parse(Cookie.get('userInfo'));
        try {
          const response = await fetch('http://localhost:3000/reviews/addreview/', {
            method: 'POST',
            body: JSON.stringify({
              product_id: id,
              user_id: userInfo[0][0].id,
              comment: comment,
              rating: rating
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          });
          const data = await response.json();
          console.log(data);
        } catch (error) {
          console.error(error);
        }
      }
        fetchpostreviewData();
        setReviews([]);
  }
  function handleAddCartClick(id){
    console.log(id, "  id");
    async function fetchaddcartData() {
      const userInfo = JSON.parse(Cookie.get('userInfo'));
      try {
        const response = await fetch('http://localhost:3000/cart/addCart', {
          method: 'POST',
          body: JSON.stringify({
            product_id: id,
            user_id: userInfo[0][0].id,
            quantity: quantity,
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
      fetchaddcartData();
      setReviews([]);
  }
  function handleAddFavoritesClick(id){
    setSelectedCategory(id);
    async function fetchaddfavoritesData() {
      const userInfo = JSON.parse(Cookie.get('userInfo'));
      try {
        const response = await fetch('http://localhost:3000/favorites/addfavorites', {
          method: 'POST',
          body: JSON.stringify({
            product_id: id,
            user_id: userInfo[0][0].id,
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
      fetchaddfavoritesData();
      setReviews([]);
  }
return (
<div>
  <h1>Ürünler</h1>
  <table>
    <thead>
      <tr>
        <th>Ürün Adı</th>
      </tr>
  <tr>
    {products.map(product => (
    <li key={product.id}>
      <button onClick={() => { handleCategoryClick(product.id); handleReviewClick(product.id); }}>
        {product.name}
      </button>
      {/* Sadece seçilen kategorinin alt kategorilerini gösterin */}
      {product.id === selectedProduct && (
        <ul className="sub-product">
          <table>
  <thead>
    <tr>
      <th>Ürün Adı</th>
      <th>Fiyat</th>
      <th>Boyut</th>
      <th>Renk</th>
      <th>Stok</th>
      <th>Görsel</th>
    </tr>
  </thead>
  <tbody>
    {subProduct.map(subProducts => (
      <tr key={subProducts.id}>
        <td>{subProducts.name}</td>
        <td>{subProducts.price}</td>
        <td>{subProducts.size}</td>
        <td>{subProducts.color}</td>
        <td>{subProducts.stock}</td>
        <td>{subProducts.image}</td>
      </tr>
    ))}
  </tbody>
</table>
    {reviews.map(review => (
            <li key={review.id}>
              <tr>
              <td>Comment : {review.comment}</td>
              <td>--------</td>
              <td>Rating : {review.rating}</td>
              </tr>
            </li>
          ))}{ <li>
            <tr>
              <td>
              <form onSubmit={() => { handleAddCartClick(product.id); }}>
                <ul className="form-container">
                  <li>
                    <label htmlFor="quantity">Quantity</label>
                    <input
                      type="text"
                      name="quantity"
                      id="quantity"
                      onChange={e => setQuantity(e.target.value)}
                      
                    ></input>
                  </li>
                  <li>
                    <button type="submit" className="button primary">
                      Add Cart
                    </button>
                  </li>
                </ul>
              </form>
              <form onSubmit={() => { handlePostReviewClick(product.id); }}>
                  <ul className="form-container">
                    <li>
                      <label htmlFor="rating">Rating</label>
                      <input
                        type="text"
                        name="rating"
                        id="rating"
                        onChange={e => setRating(e.target.value)}
                      ></input>
                    </li>
                    <li>
                      <label htmlFor="comment">Comment</label>
                      <input
                        type="text"
                        name="comment"
                        id="comment"
                        onChange={e => setComment(e.target.value)}
                      ></input>
                    </li>
                    <li>
                      <button type="submit" className="button primary">
                        Post Review
                      </button>
                    </li>
                  </ul>
                </form>
                <form onSubmit={() => { handleAddFavoritesClick(product.id); }}>
                  <ul className="form-container">
                    <li>
                      <button type="submit" className="button primary">
                        Add Favorites
                      </button>
                    </li>
                  </ul>
                </form>
              </td>
            </tr>
          </li>}
        </ul>
      )}
    </li>
  ))}
  </tr>
</thead>
</table>
</div>
);
}
export default HomeScreen;
