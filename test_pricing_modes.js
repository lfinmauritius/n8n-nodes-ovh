const crypto = require('crypto');
const https = require('https');

// Configuration - REMPLACE PAR TES VRAIES CREDENTIALS
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
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed);
                } catch (e) {
                    resolve(data);
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

async function testAllPricingModes() {
    console.log('🔍 INVESTIGATION COMPLÈTE DES PRICING MODES OVH\n');
    console.log('================================================\n');
    
    let cartId = null;
    
    try {
        // 1. Créer un cart
        console.log('📦 1. Création du cart temporaire...');
        const cartBody = JSON.stringify({ ovhSubsidiary: 'FR' });
        const cart = await makeOVHRequest('/order/cart', 'POST', cartBody);
        cartId = cart.cartId;
        console.log(`   ✅ Cart créé: ${cartId}\n`);
        
        // 2. Tester différents types de produits
        const productTypes = ['privateCloud', 'cloud', 'vps', 'hosting'];
        
        for (const productType of productTypes) {
            console.log(`🧪 2. Test du type de produit: ${productType.toUpperCase()}`);
            console.log('─'.repeat(50));
            
            try {
                // Obtenir les produits disponibles
                const products = await makeOVHRequest(`/order/cart/${cartId}/${productType}`, 'GET');
                
                if (!products || products.length === 0) {
                    console.log(`   ❌ Aucun produit ${productType} disponible\n`);
                    continue;
                }
                
                console.log(`   📋 ${products.length} produits ${productType} trouvés`);
                const testProduct = products[0];
                console.log(`   🎯 Test avec: ${testProduct}\n`);
                
                // 3. Tester tous les pricing modes possibles
                const allPricingModes = [
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
                
                const workingModes = [];
                const failedModes = [];
                
                for (const pricingMode of allPricingModes) {
                    try {
                        console.log(`      🧪 Test pricing mode: "${pricingMode}"`);
                        
                        const testBody = JSON.stringify({
                            planCode: testProduct,
                            quantity: 1,
                            pricingMode: pricingMode
                        });
                        
                        const result = await makeOVHRequest(`/order/cart/${cartId}/${productType}`, 'POST', testBody);
                        
                        if (result && result.itemId) {
                            console.log(`         ✅ SUCCESS! ItemId: ${result.itemId}`);
                            workingModes.push(pricingMode);
                            
                            // Nettoyer immédiatement l'item ajouté
                            try {
                                await makeOVHRequest(`/order/cart/${cartId}/item/${result.itemId}`, 'DELETE');
                                console.log(`         🧹 Item ${result.itemId} supprimé`);
                            } catch (deleteError) {
                                console.log(`         ⚠️  Erreur suppression: ${deleteError.message}`);
                            }
                        } else {
                            console.log(`         ❌ Pas d'itemId retourné`);
                            failedModes.push({ mode: pricingMode, reason: 'No itemId' });
                        }
                        
                    } catch (error) {
                        const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
                        console.log(`         ❌ FAILED: ${errorMsg}`);
                        failedModes.push({ mode: pricingMode, reason: errorMsg });
                    }
                    
                    // Petit délai pour éviter le rate limiting
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                
                // 4. Résumé pour ce type de produit
                console.log(`\n   📊 RÉSULTATS pour ${productType.toUpperCase()}:`);
                console.log(`      ✅ Modes qui MARCHENT (${workingModes.length}): ${workingModes.join(', ') || 'AUCUN!'}`);
                console.log(`      ❌ Modes qui ÉCHOUENT (${failedModes.length}): ${failedModes.map(f => f.mode).join(', ')}\n`);
                
                if (workingModes.length > 0) {
                    console.log(`   🎉 BINGO! Pour ${productType}, utilise: ${workingModes[0]}`);
                } else {
                    console.log(`   💥 PROBLÈME! Aucun pricing mode ne marche pour ${productType}`);
                }
                console.log('\n' + '='.repeat(60) + '\n');
                
            } catch (productError) {
                console.log(`   ❌ Erreur produits ${productType}: ${productError.message}\n`);
            }
        }
        
    } catch (error) {
        console.error('💥 ERREUR CRITIQUE:', error.message);
    } finally {
        // 5. Nettoyage final
        if (cartId) {
            try {
                console.log('🧹 Nettoyage final du cart...');
                await makeOVHRequest(`/order/cart/${cartId}`, 'DELETE');
                console.log('✅ Cart supprimé avec succès');
            } catch (cleanupError) {
                console.log('⚠️ Erreur nettoyage cart:', cleanupError.message);
            }
        }
    }
}

console.log('⚠️  ATTENTION: Ce script utilise des credentials placeholder!');
console.log('   Modifie les valeurs CONFIG en haut du script avec tes vraies credentials OVH');
console.log('   Puis lance: node test_pricing_modes.js\n');

// Lancer le test si les credentials sont configurées
if (CONFIG.applicationKey !== 'YOUR_APP_KEY_HERE') {
    testAllPricingModes();
} else {
    console.log('❌ Configure d\'abord tes credentials dans CONFIG avant de lancer le test!');
}