const crypto = require('crypto');
const https = require('https');

// Configuration - Replace with your real OVH API credentials
const CONFIG = {
    endpoint: 'https://eu.api.ovh.com/1.0',
    applicationKey: 'YOUR_APP_KEY_HERE',
    applicationSecret: 'YOUR_APP_SECRET_HERE',
    consumerKey: 'YOUR_CONSUMER_KEY_HERE'
};

async function makeOVHRequest(path, method = 'GET', body = '') {
    const timestamp = Math.round(Date.now() / 1000);
    const toSign = CONFIG.applicationSecret + '+' + CONFIG.consumerKey + '+' + method + '+' + CONFIG.endpoint + path + '+' + body + '+' + timestamp;
    const hash = crypto.createHash('sha1').update(toSign).digest('hex');
    const sig = '$1$' + hash;
    
    return new Promise((resolve, reject) => {
        const url = new URL(CONFIG.endpoint + path);
        const options = {
            hostname: url.hostname,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'X-Ovh-Application': CONFIG.applicationKey,
                'X-Ovh-Timestamp': timestamp.toString(),
                'X-Ovh-Signature': sig,
                'X-Ovh-Consumer': CONFIG.consumerKey,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 400) {
                    const errorData = { statusCode: res.statusCode, data: data };
                    reject(errorData);
                } else {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        resolve(data);
                    }
                }
            });
        });

        req.on('error', reject);
        
        if (body) {
            req.write(body);
        }
        req.end();
    });
}

async function testPrivateCloudPricingModes() {
    console.log('🔍 PRIVATE CLOUD PRICING MODE INVESTIGATION');
    console.log('==========================================\n');
    
    let cartId = null;
    
    try {
        // Step 1: Create cart
        console.log('📦 Step 1: Creating temporary cart...');
        const cart = await makeOVHRequest('/order/cart', 'POST', JSON.stringify({ ovhSubsidiary: 'FR' }));
        cartId = cart.cartId;
        console.log(`✅ Cart created: ${cartId}\n`);
        
        // Step 2: Get Private Cloud products
        console.log('🔍 Step 2: Fetching Private Cloud products...');
        const products = await makeOVHRequest(`/order/cart/${cartId}/privateCloud`);
        
        if (!products || products.length === 0) {
            console.log('❌ No Private Cloud products available');
            return;
        }
        
        console.log(`📋 Found ${products.length} Private Cloud products`);
        const testProduct = products[0];
        console.log(`🎯 Testing with product: ${testProduct}\n`);
        
        // Step 3: Test all pricing modes
        const pricingModes = [
            'default',
            'monthly', 
            'upfront',
            'credit',
            'hourly',
            'degressivity',
            'annual',
            'quarterly',
            'weekly',
            'daily',
            'rental',
            'purchase',
            'subscription'
        ];
        
        console.log('🧪 Step 3: Testing all pricing modes...');
        console.log('─'.repeat(50));
        
        const results = {};
        
        for (const mode of pricingModes) {
            try {
                console.log(`Testing "${mode}"...`);
                
                const testBody = JSON.stringify({
                    planCode: testProduct,
                    quantity: 1,
                    pricingMode: mode
                });
                
                const result = await makeOVHRequest(`/order/cart/${cartId}/privateCloud`, 'POST', testBody);
                
                if (result.itemId) {
                    console.log(`✅ ${mode} WORKS! ItemId: ${result.itemId}`);
                    results[mode] = 'SUCCESS';
                    
                    // Clean up the item
                    await makeOVHRequest(`/order/cart/${cartId}/item/${result.itemId}`, 'DELETE');
                    console.log(`🧹 Item ${result.itemId} cleaned up`);
                } else {
                    console.log(`❌ ${mode} FAILED: No itemId returned`);
                    results[mode] = 'No itemId returned';
                }
                
            } catch (error) {
                let errorMsg = 'Unknown error';
                if (error.data) {
                    try {
                        const errorData = JSON.parse(error.data);
                        errorMsg = errorData.message || errorData.class || error.data;
                    } catch (e) {
                        errorMsg = error.data;
                    }
                } else {
                    errorMsg = error.message;
                }
                
                console.log(`❌ ${mode} FAILED: ${errorMsg}`);
                results[mode] = errorMsg;
            }
            
            // Small delay to avoid rate limiting
            await new Promise(r => setTimeout(r, 200));
        }
        
        // Step 4: Display final results
        console.log('\n🎉 FINAL RESULTS:');
        console.log('================');
        
        const workingModes = [];
        const failedModes = [];
        
        Object.entries(results).forEach(([mode, result]) => {
            const status = result === 'SUCCESS' ? '✅' : '❌';
            console.log(`${status} ${mode.padEnd(12)}: ${result}`);
            
            if (result === 'SUCCESS') {
                workingModes.push(mode);
            } else {
                failedModes.push({ mode, error: result });
            }
        });
        
        console.log('\n📊 SUMMARY:');
        console.log(`✅ Working modes (${workingModes.length}): ${workingModes.join(', ') || 'NONE!'}`);
        console.log(`❌ Failed modes (${failedModes.length}): ${failedModes.map(f => f.mode).join(', ')}`);
        
        if (workingModes.length > 0) {
            console.log(`\n💡 RECOMMENDATION: Use "${workingModes[0]}" as the default pricing mode for Private Cloud`);
            console.log(`🔧 Alternative modes: ${workingModes.slice(1).join(', ') || 'None'}`);
        } else {
            console.log('\n💥 CRITICAL: No pricing modes work for Private Cloud!');
            console.log('🔍 Check if the test product is valid or if there are account restrictions.');
        }
        
        // Step 5: Catalog investigation
        console.log('\n🔍 Step 4: Investigating catalog for additional insights...');
        try {
            const catalog = await makeOVHRequest('/order/catalog/public/privateCloud?ovhSubsidiary=FR');
            
            if (catalog && catalog.plans && catalog.plans.length > 0) {
                const firstPlan = catalog.plans[0];
                console.log(`📖 Sample plan code: ${firstPlan.planCode}`);
                
                if (firstPlan.pricings && firstPlan.pricings.length > 0) {
                    console.log('💰 Available pricing types in catalog:');
                    const catalogModes = [...new Set(firstPlan.pricings.map(p => p.mode).filter(Boolean))];
                    catalogModes.forEach(mode => {
                        const status = workingModes.includes(mode) ? '✅' : '❓';
                        console.log(`   ${status} ${mode}`);
                    });
                } else {
                    console.log('ℹ️  No pricing information in catalog');
                }
            }
        } catch (catalogError) {
            console.log('⚠️  Could not fetch catalog information');
        }
        
    } catch (error) {
        console.error('💥 CRITICAL ERROR:', error);
    } finally {
        // Cleanup
        if (cartId) {
            try {
                await makeOVHRequest(`/order/cart/${cartId}`, 'DELETE');
                console.log('\n🧹 Cart cleaned up successfully');
            } catch (e) {
                console.log('⚠️  Warning: Could not clean up cart:', e.message);
            }
        }
    }
}

// Usage instructions
console.log('⚠️  SETUP REQUIRED:');
console.log('   1. Replace CONFIG values at the top of this script with your real OVH API credentials');
console.log('   2. Run: node test_private_cloud_pricing.js');
console.log('   3. Check the output for working pricing modes\n');

// Run the test if credentials are configured
if (CONFIG.applicationKey !== 'YOUR_APP_KEY_HERE') {
    testPrivateCloudPricingModes().then(() => {
        console.log('\n✨ Test completed!');
    }).catch(error => {
        console.error('💥 Test failed:', error);
    });
} else {
    console.log('❌ Please configure your OVH API credentials in the CONFIG object first!');
}