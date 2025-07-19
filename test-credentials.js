const crypto = require('crypto');
const https = require('https');

// Credentials du debug
const applicationKey = '1a9bc6a95de1a1c6';
const applicationSecret = 'ef0df8bbbfb6182914b7783c976b3d78';
const consumerKey = '3db664361401a133ba151d83df4e012e';
const endpoint = 'https://eu.api.ovh.com/1.0';

// Test 1: Endpoint /me (information sur le compte)
function testEndpoint(path, method = 'GET', body = '') {
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
        console.log('URL:', fullUrl);
        console.log('Method:', method);
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
                console.log('Response:', data);
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
        // Test 1: /me - endpoint basic qui marche toujours
        await testEndpoint('/me');
        
        // Test 2: /auth/time - endpoint public (ne nécessite pas d'auth)
        await testEndpoint('/auth/time');
        
        // Test 3: /domain - liste des domaines (peut nécessiter des permissions spéciales)
        await testEndpoint('/domain');
        
        // Test 4: Le domaine spécifique qui pose problème
        await testEndpoint('/domain/ascenzia.ch');
        
    } catch (error) {
        console.log('Test failed:', error.message);
    }
}

runTests();