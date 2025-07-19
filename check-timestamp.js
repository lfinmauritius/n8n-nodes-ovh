// Vérification du timestamp OVH
const requestTimestamp = 1752934391;
const currentTimestamp = Math.round(Date.now() / 1000);

console.log('=== Verification du Timestamp ===');
console.log('Request timestamp:', requestTimestamp);
console.log('Current timestamp:', currentTimestamp);
console.log('Difference (seconds):', Math.abs(currentTimestamp - requestTimestamp));
console.log('Request date:', new Date(requestTimestamp * 1000).toISOString());
console.log('Current date:', new Date(currentTimestamp * 1000).toISOString());

// OVH tolerance is ±300 seconds (5 minutes)
const timeDiff = Math.abs(currentTimestamp - requestTimestamp);
const isWithinTolerance = timeDiff <= 300;

console.log('Within OVH tolerance (±300s)?', isWithinTolerance);

if (!isWithinTolerance) {
    console.log('❌ TIMESTAMP ISSUE: Time difference is', timeDiff, 'seconds');
    console.log('This could cause "Invalid signature" error on OVH API');
} else {
    console.log('✅ Timestamp is acceptable');
}

// Test avec l'endpoint OVH time pour vérifier la synchronisation
const https = require('https');

console.log('\n=== Test OVH Time Endpoint ===');
https.get('https://eu.api.ovh.com/1.0/auth/time', (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        const ovhTime = parseInt(data.trim());
        console.log('OVH server time:', ovhTime);
        console.log('OVH server date:', new Date(ovhTime * 1000).toISOString());
        console.log('Difference with request:', Math.abs(ovhTime - requestTimestamp), 'seconds');
        console.log('Difference with local:', Math.abs(ovhTime - currentTimestamp), 'seconds');
        
        if (Math.abs(ovhTime - requestTimestamp) > 300) {
            console.log('❌ REQUEST WAS TOO OLD/FUTURE compared to OVH server');
        } else {
            console.log('✅ Request timestamp was acceptable to OVH server');
        }
    });
}).on('error', (err) => {
    console.log('Error getting OVH time:', err.message);
});