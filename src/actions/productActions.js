import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_SAVE_REQUEST,
  PRODUCT_SAVE_SUCCESS,
  PRODUCT_SAVE_FAIL,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_REVIEW_SAVE_REQUEST,
  PRODUCT_REVIEW_SAVE_FAIL,
  PRODUCT_REVIEW_SAVE_SUCCESS,
} from '../constants/productConstants';
import axios from 'axios';
import Axios from 'axios';

const listProducts = (
  category = '',
  barcode = '',
) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });
    const { data  } = await axios.get(
      'http://localhost:3000/products/category-barcode?' +
        'barcode=' +
        barcode +
        'category=' +
        category
    );
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data[0] });
    console.log(data +" -- data");
  } catch (error) {
    dispatch({ type: PRODUCT_LIST_FAIL, payload: error.message });
  }
};

const saveProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_SAVE_REQUEST, payload: product });
    const {
      userSignin: { userInfo },
    } = getState();
    if (!product._id) {
      const { data } = await Axios.post('/api/products', product, {
        headers: {
          Authorization:   userInfo.id,
        },
      });
      dispatch({ type: PRODUCT_SAVE_SUCCESS, payload: data });
    } else {
      const { data } = await Axios.put(
        '/api/products/' + product._id,
        product,
        {
          headers: {
            Authorization:   userInfo.id,
          },
        }
      );
      dispatch({ type: PRODUCT_SAVE_SUCCESS, payload: data });
    }
  } catch (error) {
    dispatch({ type: PRODUCT_SAVE_FAIL, payload: error.message });
  }
};

const detailsProduct = (productId) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST, payload: productId });
    const { data } = await axios.get('/api/products/' + productId);
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PRODUCT_DETAILS_FAIL, payload: error.message });
  }
};

const deleteProdcut = (productId) => async (dispatch, getState) => {
  try {
    const {
      userSignin: { userInfo },
    } = getState();
    dispatch({ type: PRODUCT_DELETE_REQUEST, payload: productId });
    const { data } = await axios.delete('/api/products/' + productId, {
      headers: {
        Authorization:   userInfo.id,
      },
    });
    dispatch({ type: PRODUCT_DELETE_SUCCESS, payload: data, success: true });
  } catch (error) {
    dispatch({ type: PRODUCT_DELETE_FAIL, payload: error.message });
  }
};

const saveProductReview = (productId, review) => async (dispatch, getState) => {
  try {
    const {
      userSignin: {
        userInfo: { token },
      },
    } = getState();
    dispatch({ type: PRODUCT_REVIEW_SAVE_REQUEST, payload: review });
    const { data } = await axios.post(
      `/api/products/${productId}/reviews`,
      review,
      {
        headers: {
          Authorization:   token,
        },
      }
    );
    dispatch({ type: PRODUCT_REVIEW_SAVE_SUCCESS, payload: data });
  } catch (error) {
    // report error
    dispatch({ type: PRODUCT_REVIEW_SAVE_FAIL, payload: error.message });
  }
};

export {
  listProducts,
  detailsProduct,
  saveProduct,
  deleteProdcut,
  saveProductReview,
};