const { exec } = require('child_process');

exec('firebase deploy --only firestore:rules', (error, stdout, stderr) => {
  if (error) {
    console.error('Error deploying rules:', error);
    return;
  }
  if (stderr) {
    console.error('Stderr:', stderr);
    return;
  }
});
