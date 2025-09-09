const crypto = require('crypto');
const https = require('https');

async function makeOVHRequest(endpoint, path, method = 'GET', body = '') {
    const applicationKey = 'YOUR_APP_KEY'; // Placeholder - sera remplacé
    const applicationSecret = 'YOUR_APP_SECRET'; // Placeholder - sera remplacé  
    const consumerKey = 'YOUR_CONSUMER_KEY'; // Placeholder - sera remplacé
    
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
                try {
                    resolve(JSON.parse(data));
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

async function investigatePrivateCloud() {
    const endpoint = 'https://eu.api.ovh.com/1.0';
    
    try {
        console.log('=== Investigation des modes de pricing pour Private Cloud ===\n');
        
        // 1. Créer un cart temporaire
        console.log('1. Création d\'un cart temporaire...');
        const cartBody = JSON.stringify({ ovhSubsidiary: 'FR' });
        const cart = await makeOVHRequest(endpoint, '/order/cart', 'POST', cartBody);
        console.log('Cart créé:', cart.cartId);
        
        // 2. Explorer les produits privateCloud
        console.log('\n2. Récupération des produits privateCloud...');
        const products = await makeOVHRequest(endpoint, `/order/cart/${cart.cartId}/privateCloud`, 'GET');
        console.log('Produits privateCloud trouvés:', products.slice(0, 3)); // Premiers 3 produits
        
        if (products && products.length > 0) {
            const firstProduct = products[0];
            console.log('\n3. Investigation du premier produit:', firstProduct);
            
            // 3. Essayer d'obtenir des infos sur le produit
            console.log('\n4. Tentative d\'ajout avec différents pricing modes...');
            
            const testPricingModes = ['default', 'upfront', 'monthly', 'hourly', 'credit'];
            
            for (const pricingMode of testPricingModes) {
                try {
                    console.log(`\n--- Test avec pricingMode: "${pricingMode}" ---`);
                    const testBody = JSON.stringify({
                        planCode: firstProduct,
                        quantity: 1,
                        pricingMode: pricingMode
                    });
                    
                    const result = await makeOVHRequest(endpoint, `/order/cart/${cart.cartId}/privateCloud`, 'POST', testBody);
                    console.log(`✅ SUCCESS avec "${pricingMode}":`, result);
                    
                    // Si succès, nettoyer l'item ajouté
                    if (result && result.itemId) {
                        await makeOVHRequest(endpoint, `/order/cart/${cart.cartId}/item/${result.itemId}`, 'DELETE');
                    }
                    
                } catch (error) {
                    console.log(`❌ FAILED avec "${pricingMode}":`, error.message || error);
                }
            }
        }
        
        // 5. Explorer le catalogue private cloud
        console.log('\n5. Exploration du catalogue privateCloud...');
        try {
            const catalog = await makeOVHRequest(endpoint, '/order/catalog/public/privateCloud?ovhSubsidiary=FR', 'GET');
            if (catalog && catalog.plans && catalog.plans.length > 0) {
                const firstPlan = catalog.plans[0];
                console.log('Premier plan du catalogue:', JSON.stringify(firstPlan, null, 2));
                
                if (firstPlan.pricings) {
                    console.log('\nModes de pricing disponibles:');
                    firstPlan.pricings.forEach((pricing, index) => {
                        console.log(`${index + 1}. Mode: ${pricing.mode || 'N/A'}, Type: ${pricing.type || 'N/A'}`);
                    });
                }
            }
        } catch (catalogError) {
            console.log('Erreur catalogue:', catalogError.message);
        }
        
        // Nettoyage
        console.log('\n6. Nettoyage du cart...');
        await makeOVHRequest(endpoint, `/order/cart/${cart.cartId}`, 'DELETE');
        console.log('Cart supprimé.');
        
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Ce script sera modifié pour utiliser de vraies credentials
console.log('Script créé - il faudra remplacer les credentials placeholder par de vraies valeurs.');