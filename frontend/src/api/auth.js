
import client from './client';
import axios from 'axios';

export async function login(email, password) {
    try{
        const res = await axios.post('http://localhost:5000/api/auth/login', {email,password,});
        return res.data;
    }catch(error){
        console.error("Login error:", error);
        throw error;
    };
}

export const register = (payload) => 
    client.post('http://localhost:5000/api/auth/register', payload);