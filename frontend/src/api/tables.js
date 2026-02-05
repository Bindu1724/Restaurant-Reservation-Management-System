
import client from './client';

export const getTables = () => 
    client.get('/api/tables');

export const addTable = (data) =>
    client.post('/api/tables', data);

export const updateTable = (id, data) =>
    client.patch(`/api/tables/${id}`, data);

export const deleteTable = (id) =>
    client.delete(`/api/tables/${id}`);