import axios from "axios";

const API = axios.create({
   baseURL: "https://move2earn-app.onrender.com/api"
  //baseURL: "http://localhost:5000/api"

});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;