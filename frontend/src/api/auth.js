
import client from './client';
export const login = (email, password) => client.post('/auth/login', { email, password });
export const register = (payload) => client.post('/auth/register', payload);