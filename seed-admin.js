const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('Admin123!', 12);
global._imrUsers = global._imrUsers || [];
global._imrUsers.push({ id: '1', email: 'admin@imr.com', password: hash, role: 'admin', created_at: new Date().toISOString() });
console.log('done');
