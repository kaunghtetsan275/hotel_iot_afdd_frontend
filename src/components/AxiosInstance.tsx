import axios from 'axios';

const DJANGO_URL = import.meta.env.VITE_DJANGO_BASE_URL || '';
const GET_THRESH = import.meta.env.VITE_DJANGO_CONFIG_GET_THRESH || '';
const SET_THRESH = import.meta.env.VITE_DJANGO_CONFIG_SET_THRESH || '';
const axiosInstance = axios.create({
  baseURL: DJANGO_URL,
});

export default axiosInstance;
export {GET_THRESH, SET_THRESH};