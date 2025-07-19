const crypto = require('crypto');

// Test signature generation with known values
function testOVHSignature() {
    // Test data - you can replace these with your actual values for debugging
    const applicationSecret = 'test_secret';
    const consumerKey = 'test_consumer';
    const method = 'GET';
    const fullUrl = 'https://eu.api.ovh.com/1.0/domain/example.com';
    const body = '';
    const timestamp = 1234567890;

    // Official OVH SDK method
    const signatureElements = [
        applicationSecret,
        consumerKey,
        method,
        fullUrl,
        body,
        timestamp,
    ];

    const toSign = signatureElements.join('+');
    const signature = '$1$' + crypto.createHash('sha1').update(toSign).digest('hex');

    console.log('=== OVH Signature Debug ===');
    console.log('Application Secret:', applicationSecret);
    console.log('Consumer Key:', consumerKey);
    console.log('Method:', method);
    console.log('Full URL:', fullUrl);
    console.log('Body:', body || '(empty)');
    console.log('Timestamp:', timestamp);
    console.log('---');
    console.log('String to sign:', toSign);
    console.log('Final signature:', signature);
    console.log('===========================');

    return signature;
}

// Test with different scenarios
console.log('Test 1: GET request with empty body');
testOVHSignature();

console.log('\nTest 2: POST request with JSON body');
const postBody = JSON.stringify({test: 'value'}).replace(/[\u0080-\uFFFF]/g, (m) => {
    return '\\u' + ('0000' + m.charCodeAt(0).toString(16)).slice(-4);
});

function testPOSTSignature() {
    const signatureElements = [
        'test_secret',
        'test_consumer', 
        'POST',
        'https://eu.api.ovh.com/1.0/domain/zone/example.com/record',
        postBody,
        1234567890,
    ];

    const toSign = signatureElements.join('+');
    const signature = '$1$' + crypto.createHash('sha1').update(toSign).digest('hex');

    console.log('POST Body:', postBody);
    console.log('String to sign:', toSign);
    console.log('Signature:', signature);
}

testPOSTSignature();