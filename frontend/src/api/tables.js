
import client from './client';

export const getTables = () => 
    client.get('/api/tables');