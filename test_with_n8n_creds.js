// Script pour tester les pricing modes avec les credentials n8n existantes
// Utilise le même système que dans le node n8n

const crypto = require('crypto');
const https = require('https');

// Cette fonction sera appelée avec les vraies credentials depuis n8n
async function testPricingModesWithCredentials(credentials) {
    const endpoint = credentials.endpoint;
    const applicationKey = credentials.applicationKey;
    const applicationSecret = credentials.applicationSecret;
    const consumerKey = credentials.consumerKey;
    
    console.log('🔍 TEST DES PRICING MODES AVEC CREDENTIALS N8N');
    console.log('===============================================\n');
    
    async function makeRequest(path, method = 'GET', body = '') {
        const timestamp = Math.round(Date.now() / 1000);
        const toSign = applicationSecret + '+' + consumerKey + '+' + method + '+' + endpoint + path + '+' + body + '+' + timestamp;
        const hash = crypto.createHash('sha1').update(toSign).digest('hex');
        const sig = '$1$' + hash;
        
        return new Promise((resolve, reject) => {
            const url = new URL(endpoint + path);
            const options = {
                hostname: url.hostname,
                path: url.pathname + url.search,
                method: method,
                headers: {
                    'X-Ovh-Application': applicationKey,
                    'X-Ovh-Timestamp': timestamp.toString(),
                    'X-Ovh-Signature': sig,
                    'X-Ovh-Consumer': consumerKey,
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
    
    let cartId = null;
    
    try {
        // Créer cart
        console.log('📦 Création du cart...');
        const cart = await makeRequest('/order/cart', 'POST', JSON.stringify({ ovhSubsidiary: 'FR' }));
        cartId = cart.cartId;
        console.log(`Cart: ${cartId}\n`);
        
        // Test Private Cloud spécifiquement
        console.log('🎯 TEST PRIVATE CLOUD:');
        const privateCloudProducts = await makeRequest(`/order/cart/${cartId}/privateCloud`);
        
        if (privateCloudProducts && privateCloudProducts.length > 0) {
            const product = privateCloudProducts[0];
            console.log(`Produit de test: ${product}\n`);
            
            const modes = ['default', 'monthly', 'upfront', 'credit', 'hourly', 'degressivity'];
            const results = {};
            
            for (const mode of modes) {
                try {
                    console.log(`Testing ${mode}...`);
                    const testBody = JSON.stringify({
                        planCode: product,
                        quantity: 1,
                        pricingMode: mode
                    });
                    
                    const result = await makeRequest(`/order/cart/${cartId}/privateCloud`, 'POST', testBody);
                    
                    if (result.itemId) {
                        console.log(`✅ ${mode} WORKS! ItemId: ${result.itemId}`);
                        results[mode] = 'SUCCESS';
                        
                        // Nettoyer
                        await makeRequest(`/order/cart/${cartId}/item/${result.itemId}`, 'DELETE');
                    }
                    
                } catch (error) {
                    const errorMsg = error.data ? JSON.parse(error.data).message : error.message;
                    console.log(`❌ ${mode} FAILED: ${errorMsg}`);
                    results[mode] = errorMsg;
                }
                
                await new Promise(r => setTimeout(r, 200)); // Délai anti-spam
            }
            
            console.log('\n🎉 RÉSULTATS FINAUX:');
            console.log('===================');
            Object.entries(results).forEach(([mode, result]) => {
                const status = result === 'SUCCESS' ? '✅' : '❌';
                console.log(`${status} ${mode}: ${result}`);
            });
            
            const workingModes = Object.entries(results)
                .filter(([mode, result]) => result === 'SUCCESS')
                .map(([mode, result]) => mode);
            
            if (workingModes.length > 0) {
                console.log(`\n🎊 MODES QUI MARCHENT: ${workingModes.join(', ')}`);
                console.log(`💡 UTILISE: ${workingModes[0]} par défaut`);
            } else {
                console.log('\n💥 AUCUN MODE NE MARCHE!');
            }
            
        } else {
            console.log('❌ Aucun produit privateCloud trouvé');
        }
        
    } catch (error) {
        console.error('💥 ERREUR:', error);
    } finally {
        // Nettoyage
        if (cartId) {
            try {
                await makeRequest(`/order/cart/${cartId}`, 'DELETE');
                console.log('\n🧹 Cart nettoyé');
            } catch (e) {
                console.log('⚠️ Erreur nettoyage:', e.message);
            }
        }
    }
}

module.exports = { testPricingModesWithCredentials };