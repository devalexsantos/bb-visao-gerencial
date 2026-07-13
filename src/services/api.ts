import axios, { type AxiosInstance } from "axios"

const baseURL = import.meta.env.VITE_API_URL

const instance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

export default instance
