
import client from './client';

export const createReservation = (payload) =>
  client.post('/api/reservations', payload);

export const getMyReservations = () =>
  client.get('/api/reservations/my');