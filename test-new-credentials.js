const crypto = require('crypto');
const https = require('https');

// Nouvelles credentials du debug
const applicationKey = 'cb69459d70f404af';
const applicationSecret = 'c58d3dd62c46d80c44267d74d7a1ac77';
const consumerKey = 'df487757ea46270b669774d05cfdf4e7';
const endpoint = 'https://eu.api.ovh.com/1.0';

// Test de la signature avec les nouvelles valeurs
const method = 'GET';
const fullUrl = 'https://eu.api.ovh.com/1.0/domain/ascenzia.ch';
const bodyForSignature = '';
const timestamp = 1752934665;

const signatureElements = [
    applicationSecret,
    consumerKey,
    method,
    fullUrl,
    bodyForSignature,
    timestamp,
];

const stringToSign = signatureElements.join('+');
const signature = '$1$' + crypto.createHash('sha1').update(stringToSign).digest('hex');

console.log('=== Verification nouvelle signature ===');
console.log('String to sign:', stringToSign);
console.log('Our signature:', signature);
console.log('Expected from debug:', '$1$0d325c1e450640837dccee830bb32cb18e6ebd5a');
console.log('Match?', signature === '$1$0d325c1e450640837dccee830bb32cb18e6ebd5a');

// Test avec différents endpoints pour vérifier les permissions
async function testEndpoint(path, method = 'GET', body = '') {
    return new Promise((resolve, reject) => {
        const timestamp = Math.round(Date.now() / 1000);
        const fullUrl = `${endpoint}${path}`;
        
        const signatureElements = [
            applicationSecret,
            consumerKey,
            method,
            fullUrl,
            body,
            timestamp,
        ];
        
        const signature = '$1$' + crypto.createHash('sha1').update(signatureElements.join('+')).digest('hex');
        
        console.log(`\n=== Test ${path} ===`);
        console.log('Timestamp:', timestamp);
        console.log('Signature:', signature);
        
        const url = new URL(fullUrl);
        const options = {
            hostname: url.hostname,
            port: 443,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'X-Ovh-Application': applicationKey,
                'X-Ovh-Consumer': consumerKey,
                'X-Ovh-Signature': signature,
                'X-Ovh-Timestamp': timestamp.toString(),
                'Content-Type': 'application/json',
            }
        };
        
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log('Status:', res.statusCode);
                console.log('Response:', data.substring(0, 200) + (data.length > 200 ? '...' : ''));
                resolve({ status: res.statusCode, data: data });
            });
        });
        
        req.on('error', (err) => {
            console.log('Error:', err.message);
            reject(err);
        });
        
        if (body) {
            req.write(body);
        }
        req.end();
    });
}

async function runTests() {
    try {
        // Test 1: /me - endpoint basic
        await testEndpoint('/me');
        
        // Test 2: /auth/time - endpoint public
        await testEndpoint('/auth/time');
        
        // Test 3: /domain - liste des domaines
        await testEndpoint('/domain');
        
        // Test 4: Le domaine spécifique
        await testEndpoint('/domain/ascenzia.ch');
        
    } catch (error) {
        console.log('Test failed:', error.message);
    }
}

runTests();