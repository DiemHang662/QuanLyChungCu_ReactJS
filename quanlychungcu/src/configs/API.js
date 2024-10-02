import axios from 'axios';

const BASE_URL = 'http://10.17.48.211:8000';

export const endpoints = {
  residents: '/api/residents/',
  createNewAccount: '/api/residents/create-new-account/',
  lockAccount: (id) => `/api/residents/${id}/lock-account/`,
  deleteResident: (id) => `/api/residents/${id}/delete-resident/`,
  updateResident: (id) => `/api/residents/${id}/`,
  currentUser: '/api/residents/current-user/',
  residentDetail: (id) => `/api/residents/${id}/`,
  staffCount:'/api/residents/staff-count/',
  residentStatistics:'/api/residents/resident-statistics/',
  totalBills:'/api/bills/total-bills/',
  surveyCount:'/api/surveyresult/survey-count/',
  flatCount:'/api/flats/flat-count/',
  changePassword: '/api/residents/change-password/',
  login: '/o/token/',

  product: '/api/product/',
  addProduct:'/api/cart/add-product/',
  cartSummary: '/api/cart/cart-summary/',
  updateProductQuantity: '/api/cart/update-product-quantity/',
  deleteProduct: (id) => `/api/cart/${id}/delete-product/`,
  createOrderFromCart: '/api/order/create-order-from-cart/',
  orderDetail: (id) => `/api/order/${id}/`,
  confirmOrder: (id) => `/api/order/${id}/confirm-order/`, 

  bills: '/api/bills/',
  billDetail: (id) => `/api/bills/${id}/`,
  createBill: '/api/bills/create-bill/',
  deleteBill: (id) => `/api/bills/${id}/delete-bill/`,
  updateBill: (id) => `/api/bills/${id}/`,
  createBillFromCart: (id) => `/api/bills/create-bill-from-cart/${id}/`,
  updateStatus: (id) => `/api/bills/${id}/`,
  billStatistics: '/api/bills/bill-statistics/',
  momo: '/payment/',
  payment: '/api/payment/',

  flats: '/api/flats/',

  items: '/api/items/',
  createItem: '/api/items/create-item/',
  updateReceived: (id) => `/api/items/${id}/mark_received/`,

  feedback: '/api/feedback/',
  feedbackDetail: (id) => `/api/feedback/${id}/`,
  updateResolved: (id) => `/api/feedback/${id}/mark_as_resolved/`,

  famembers: '/api/famembers/',

  survey: '/api/survey/',
  surveyID: (id) => `/api/survey/${id}/`,
  createSurvey: '/api/survey/',
  deleteResult: (id) => `/api/surveyresult/${id}/delete-result/`,
  updateResult: (id) => `/api/surveyresult/${id}/`,
  surveyresult: '/api/surveyresult/',
  surveyresultID: (id) => `/api/surveyresult/${id}/`,

  statistics: (id) => `/api/statistics/${id}/`,
};

export const setAuthToken = (token) => {
  try {
    localStorage.setItem('access_token', token);
    console.log('Token set successfully:', token);
  } catch (error) {
    console.error('Error setting token:', error);
  }
};

export const getAuthToken = () => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No token found in localStorage');
    } else {
      console.log('Token retrieved successfully:', token);
    }
    return token; 
  } catch (error) {
    console.error('Error retrieving token:', error);
    throw error;
  }
};

export const authApi = () => {
  try {
    const token = getAuthToken();
    return axios.create({
      baseURL: BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error creating auth API instance:', error);
    throw error;
  }
};

export default axios.create({
  baseURL: BASE_URL,
});