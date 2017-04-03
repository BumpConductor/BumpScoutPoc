const fs = require('fs');
const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');
const config = require('../config/local.json').config;

const file = process.argv[2];
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.databaseURL,
});

const database = admin.database();
const ref = database.ref();
ref.set(data)
.then(() => {
  console.log(`${file}: uploaded`);
  process.exit();
})
.catch((error) => {
  console.error(error.trace);
  process.exit(1);
});
