// this can be run locally in the dev docker image for the appserver but requires the private key for the admin sdk access in this folder in the file named .seviceAccountKey.json which is gitignored.
// a new key can be obtained here:
// https://console.firebase.google.com/u/0/project/moz-fx-future-products-prod/settings/serviceaccounts/adminsdk
//
// the UID can be obtained from the web console under the authentication area:
// https://console.firebase.google.com/u/0/project/moz-fx-future-products-prod/authentication/users

const admin = require('firebase-admin');
const readline = require('readline');

const serviceAccount = require('./.serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function updateUserEmail() {
  try {
    const uid = await question("Enter the user's UID: ");
    const newEmail = await question("Enter the new email address: ");

    await admin.auth().updateUser(uid, { email: newEmail });
    console.log(`Successfully updated email for user ${uid} to ${newEmail}`);
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    rl.close();
  }
}

updateUserEmail();
