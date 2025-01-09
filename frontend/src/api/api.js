import axios from 'axios';


const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const url = "http://127.0.0.1:8000"

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
    console.log("cleared")
  }
};


export default api;

