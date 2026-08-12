const { usersStore } = require('./lib/users-store');
const result = usersStore.promoteToAdmin('admin@imr.com');
console.log(result ? 'SUCCESS - admin@imr.com is now admin' : 'User not found');
