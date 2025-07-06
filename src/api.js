import axios from 'axios'

const api = axios.create({
	baseURL: 'http://127.0.0.1:8000', // адрес сервака
})

export const getUsers = () => api.get('/users')
export const getMessages = () => api.get('/messages')
export const sendMessage = (payload) => api.post('/messages', payload)
export const clearMessages = () => api.post('/messages/clear')