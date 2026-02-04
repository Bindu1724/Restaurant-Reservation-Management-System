const api = 'http://localhost:5000';

async function run() {
  try {
    // create a unique email
    const email = `testuser_${Date.now()}@example.com`;
    const registerResp = await fetch(`${api}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email, password: 'pass1234', role: 'customer' })
    });
    const reg = await registerResp.json();
    console.log('register status', registerResp.status, reg);

    // login
    const loginResp = await fetch(`${api}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'pass1234' })
    });
    const login = await loginResp.json();
    console.log('login status', loginResp.status, login);
    const token = login.token;

    // call tables
    const tablesResp = await fetch(`${api}/api/tables`, { headers: { Authorization: `Bearer ${token}` } });
    const tables = await tablesResp.json();
    console.log('/api/tables', tablesResp.status, tables);

    // call test role endpoint
    const roleResp = await fetch(`${api}/api/test/role`, { headers: { Authorization: `Bearer ${token}` } });
    let roleInfo;
    try { roleInfo = await roleResp.json(); }
    catch (e) { roleInfo = await roleResp.text(); }
    console.log('/api/test/role', roleResp.status, roleInfo);

    // call my reservations
    const myResp = await fetch(`${api}/api/reservations/my`, { headers: { Authorization: `Bearer ${token}` } });
    const my = await myResp.json();
    console.log('/reservations/my', myResp.status, my);

    // attempt to create a reservation
    // reuse the tables we already loaded above
    console.log('/api/tables for create', Array.isArray(tables) ? tables.map(t=>t._id) : tables);
    if (Array.isArray(tables) && tables.length>0) {
      const createResp = await fetch(`${api}/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tableId: tables[0]._id, date: '2026-02-05', timeSlot: '20:00-22:00', guests: 2 })
      });
      let createBody;
      try { createBody = await createResp.json(); } catch (e) { createBody = await createResp.text(); }
      console.log('POST /api/reservations', createResp.status, createBody);
    }

  } catch (err) {
    console.error('error running checks', err);
  }
}

run();
