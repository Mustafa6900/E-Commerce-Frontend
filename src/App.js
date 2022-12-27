import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import './App.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import { useSelector } from 'react-redux';
import RegisterScreen from './screens/RegisterScreen';
import ProductsScreen from './screens/ProductsScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import OrdersScreen from './screens/OrdersScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import Myaddresseswallets from './screens/Myaddresseswallets';

function App() {
  
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategory, setSubSubCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://localhost:3000/categories/maincategories');
      const data = await response.json();
      setCategories(data[0]);
    }

    fetchData();
  }, []);

  function handleCategoryClick(id) {
    setSelectedCategory(id);
    async function fetchsubData() {
      const response = await fetch('http://localhost:3000/categories/subcategories/'+ id);
      const data = await response.json();
      setSubCategories(data[0]);
    }
    
    fetchsubData();
    setSubCategories([]);

  }

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const openMenu = () => {
    document.querySelector('.sidebar').classList.add('open');
  };
  const closeMenu = () => {
    document.querySelector('.sidebar').classList.remove('open');
  };
  return (
    <BrowserRouter>
      <div className="grid-container">
        <header className="header">
          <div className="brand">
            <button onClick={openMenu}>&#9776;</button>
            <Link to="/">KTU ONLINE BAZAAR</Link>
          </div>
          <div className="header-links"> 
          <a href="myaddresseswallets">My Addresses & Wallets</a>
              <a href="cart">Cart</a>
              <a href="favorites">Favorites</a>         
            {userInfo ? (
              
              <Link to="/profile">{userInfo[0][0].name}</Link>
            ) : (
              <Link to="/signin">Sign In</Link>
            )}
            {userInfo && userInfo.isAdmin && (
              <div className="dropdown">
                <a href="#">Admin</a>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/orders">Orders</Link>
                    <Link to="/products">Products</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
          
        </header>
        <aside className="sidebar">
          <h3>Shopping Categories</h3>
          <button className="sidebar-close-button" onClick={closeMenu}>
            x
          </button>
          <tbody>
          <ul className="categories">
  {categories.map(category => (
    <li key={category.id}>
      <button onClick={() => handleCategoryClick(category.id)}>
        {category.name}
      </button>
      {/* Sadece seçilen kategorinin alt kategorilerini gösterin */}
      {category.id === selectedCategory && (
        <ul className="sub-categories">
          {subCategories.map(subCategory => (
            <li key={subCategory.id}>
              <button onClick={()=> handleCategoryClick(subCategory.id)}>
                {subCategory.name}</button>
               {/*sadece seçilen alt kategorinin alt kategorlerini gösterin */}
               {subCategory.id === selectedSubCategory && (
            <ul className="sub-sub-categories">
              {subSubCategory.map(subSubCategory => (
                <li key={subSubCategory.id}>
                  <button>{subSubCategory.name}</button>
                </li>
              ))}
            </ul>
          )}
            </li>
            
          ))}          

</ul>
      )}
    </li>
  ))}
</ul>
        </tbody>

        </aside>
        <main className="main">
          <div className="content">
          <Route path="/myaddresseswallets" component={Myaddresseswallets} />
            <Route path="/orders" component={OrdersScreen} />
            <Route path="/profile" component={ProfileScreen} />
            <Route path="/order/:id" component={OrderScreen} />
            <Route path="/products" component={ProductsScreen} />
            <Route path="/shipping" component={ShippingScreen} />
            <Route path="/payment" component={PaymentScreen} />
            <Route path="/placeorder" component={PlaceOrderScreen} />
            <Route path="/signin" component={SigninScreen} />
            <Route path="/register" component={RegisterScreen} />
            <Route path="/product/:id" component={ProductScreen} />
            <Route path="/favorites" component={FavoritesScreen} />
            <Route path="/cart" component={CartScreen} />
            <Route path="/category/:id" component={HomeScreen} />
            <Route path="/" exact={true} component={HomeScreen} />
          </div>
        </main>
        <footer className="footer">All right reserved.</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
