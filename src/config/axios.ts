import axios from 'axios'
import { BASE_API_URL } from '../config/env';
const instance = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})
export default instance
