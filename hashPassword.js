const bcrypt = require('bcrypt');

async function hashPassword() {
  const hash = await bcrypt.hash('TestPassword123', 10);
  console.log(hash);
}

hashPassword();