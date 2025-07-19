const crypto = require('crypto');

// Valeurs exactes du debug
const applicationSecret = 'ef0df8bbbfb6182914b7783c976b3d78';
const consumerKey = '3db664361401a133ba151d83df4e012e';
const method = 'GET';
const fullUrl = 'https://eu.api.ovh.com/1.0/domain/ascenzia.ch';
const bodyForSignature = '';
const timestamp = 1752934391;

// Notre implémentation
const signatureElements = [
    applicationSecret,
    consumerKey,
    method,
    fullUrl,
    bodyForSignature,
    timestamp,
];

const stringToSign = signatureElements.join('+');
const ourSignature = '$1$' + crypto.createHash('sha1').update(stringToSign).digest('hex');

console.log('=== Verification de la signature ===');
console.log('String to sign:', stringToSign);
console.log('Our signature:', ourSignature);
console.log('Expected from debug:', '$1$5c40449d961e3ffcb531f4f55db70751175fb20d');
console.log('Match?', ourSignature === '$1$5c40449d961e3ffcb531f4f55db70751175fb20d');

// Test avec le SDK officiel OVH pour comparaison
console.log('\n=== Test avec différents encodages ===');

// Test avec UTF-8 explicite
const stringToSignBuffer = Buffer.from(stringToSign, 'utf8');
const signatureUTF8 = '$1$' + crypto.createHash('sha1').update(stringToSignBuffer).digest('hex');
console.log('Signature UTF-8 explicit:', signatureUTF8);

// Test avec le format exact du SDK OVH
console.log('\n=== Verification format SDK OVH ===');
console.log('Application Secret length:', applicationSecret.length);
console.log('Consumer Key length:', consumerKey.length);
console.log('Timestamp type:', typeof timestamp);

// Test SHA1 manuellement
const manualSha1 = crypto.createHash('sha1');
manualSha1.update(applicationSecret);
manualSha1.update('+');
manualSha1.update(consumerKey);
manualSha1.update('+');
manualSha1.update(method);
manualSha1.update('+');
manualSha1.update(fullUrl);
manualSha1.update('+');
manualSha1.update(bodyForSignature);
manualSha1.update('+');
manualSha1.update(timestamp.toString());

const manualSignature = '$1$' + manualSha1.digest('hex');
console.log('Manual signature:', manualSignature);