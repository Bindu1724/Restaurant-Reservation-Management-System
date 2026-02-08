
import client from './client';
import axios from 'axios';

export async function login(email, password) {
    try{
        const res = await axios.post('https://restaurant-reservation-management-system-y27e.onrender.com/api/auth/login', {email,password,});
        return res.data;
    }catch(error){
        console.error("Login error:", error);
        throw error;
    };
}

export const register = (payload) => 
    client.post('https://restaurant-reservation-management-system-y27e.onrender.com/api/auth/register', payload);