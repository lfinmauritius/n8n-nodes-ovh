		async getProductPlans(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
			const returnData: INodePropertyOptions[] = [];
			
			try {
				let productType: string;
				try {
					productType = this.getNodeParameter('productType') as string;
				} catch (error) {
					return [{
						name: 'Please Select a Product Type First',
						value: '',
					}];
				}
				
				if (!productType || productType.trim() === '') {
					return [{
						name: 'Please Select a Product Type First',
						value: '',
					}];
				}

				const credentials = await this.getCredentials('ovhApi');
				const endpoint = credentials.endpoint as string;
				const applicationKey = credentials.applicationKey as string;
				const applicationSecret = credentials.applicationSecret as string;
				const consumerKey = credentials.consumerKey as string;

				const subsidiary = 'FR'; // Default to FR for now

				if (productType === 'dedicated') {
					try {
						const catalogTimestamp = Math.round(Date.now() / 1000);
						const catalogPath = `/order/catalog/public/baremetalServers?ovhSubsidiary=${subsidiary}`;
						const catalogMethod = 'GET';
						
						const catalogToSign = applicationSecret + '+' + consumerKey + '+' + catalogMethod + '+' + endpoint + catalogPath + '++' + catalogTimestamp;
						const catalogHash = crypto.createHash('sha1').update(catalogToSign).digest('hex');
						const catalogSig = '$1$' + catalogHash;
						
						const catalogOptions: any = {
							method: catalogMethod,
							url: endpoint + catalogPath,
							headers: {
								'X-Ovh-Application': applicationKey,
								'X-Ovh-Timestamp': catalogTimestamp.toString(),
								'X-Ovh-Signature': catalogSig,
								'X-Ovh-Consumer': consumerKey,
							},
							json: true,
						};
						
						const catalog = await this.helpers.httpRequest(catalogOptions);
						
						if (catalog && catalog.plans && Array.isArray(catalog.plans)) {
							for (const plan of catalog.plans) {
								const planCode = plan.planCode || '';
								const displayName = plan.invoiceName || plan.productName || planCode;
								
								if (!planCode) continue;
								
								// Format the display name
								let enhancedName = displayName;
								if (planCode.includes('kimsufi') || planCode.includes('ks')) {
									enhancedName = `Kimsufi - ${displayName}`;
								} else if (planCode.includes('soyoustart') || planCode.includes('sys')) {
									enhancedName = `So you Start - ${displayName}`;
								} else if (planCode.includes('scale')) {
									enhancedName = `Scale - ${displayName}`;
								} else if (planCode.includes('hgr')) {
									enhancedName = `High Grade - ${displayName}`;
								} else if (planCode.includes('adv')) {
									enhancedName = `Advance - ${displayName}`;
								} else {
									enhancedName = `Dedicated - ${displayName}`;
								}
								
								// Add warning for potentially unavailable plans
								if (planCode.includes('adv')) {
									enhancedName += ' (May require special region)';
								}
								
								returnData.push({
									name: enhancedName,
									value: planCode,
								});
							}
						}
					} catch (catalogError) {
						// Dedicated catalog failed, return empty for now
					}
				} else if (productType === 'vps') {
					try {
						const catalogTimestamp = Math.round(Date.now() / 1000);
						const catalogPath = `/order/catalog/public/vps?ovhSubsidiary=${subsidiary}`;
						const catalogMethod = 'GET';
						
						const catalogToSign = applicationSecret + '+' + consumerKey + '+' + catalogMethod + '+' + endpoint + catalogPath + '++' + catalogTimestamp;
						const catalogHash = crypto.createHash('sha1').update(catalogToSign).digest('hex');
						const catalogSig = '$1$' + catalogHash;
						
						const catalogOptions: any = {
							method: catalogMethod,
							url: endpoint + catalogPath,
							headers: {
								'X-Ovh-Application': applicationKey,
								'X-Ovh-Timestamp': catalogTimestamp.toString(),
								'X-Ovh-Signature': catalogSig,
								'X-Ovh-Consumer': consumerKey,
							},
							json: true,
						};
						
						const catalog = await this.helpers.httpRequest(catalogOptions);
						
						if (catalog && catalog.plans && Array.isArray(catalog.plans)) {
							for (const plan of catalog.plans) {
								const planCode = plan.planCode || '';
								const displayName = plan.invoiceName || plan.productName || planCode;
								
								if (!planCode) continue;
								
								let enhancedName = displayName;
								const vpsMatch = planCode.match(/^vps([a-z]+)-(\d+)-(\d+)-(\d+)$/);
								if (vpsMatch) {
									const [, tier, vcpu, ram, storage] = vpsMatch;
									const tierName = tier.charAt(0).toUpperCase() + tier.slice(1);
									enhancedName = `VPS ${tierName} - ${vcpu} vCore, ${ram}GB RAM, ${storage}GB SSD`;
								} else if (displayName !== planCode) {
									enhancedName = `VPS - ${displayName}`;
								} else {
									enhancedName = displayName.replace(/^vps[-_]?/i, 'VPS ').replace(/[-_]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
								}
								
								returnData.push({
									name: enhancedName,
									value: planCode,
								});
							}
						}
					} catch (catalogError) {
						// VPS catalog failed, return empty for now
					}
				} else {
					// For other product types (domain, cloud, etc), try cart API for plan codes
					try {
						// Create temporary cart to get available plans
						const timestamp = Math.round(Date.now() / 1000);
						const createCartPath = '/order/cart';
						const method = 'POST';
						const body = JSON.stringify({
							ovhSubsidiary: subsidiary,
						});

						const toSign = applicationSecret + '+' + consumerKey + '+' + method + '+' + endpoint + createCartPath + '+' + body + '+' + timestamp;
						const hash = crypto.createHash('sha1').update(toSign).digest('hex');
						const sig = '$1$' + hash;

						const createCartOptions: any = {
							method,
							url: endpoint + createCartPath,
							headers: {
								'X-Ovh-Application': applicationKey,
								'X-Ovh-Timestamp': timestamp.toString(),
								'X-Ovh-Signature': sig,
								'X-Ovh-Consumer': consumerKey,
								'Content-Type': 'application/json',
							},
							body: JSON.parse(body),
							json: true,
						};

						const cartResponse = await this.helpers.httpRequest(createCartOptions);
						const cartId = cartResponse.cartId;

						// Get available products for this cart
						const getProductsTimestamp = Math.round(Date.now() / 1000);
						const getProductsPath = `/order/cart/${cartId}/${productType}`;
						const getMethod = 'GET';

						const getToSign = applicationSecret + '+' + consumerKey + '+' + getMethod + '+' + endpoint + getProductsPath + '++' + getProductsTimestamp;
						const getHash = crypto.createHash('sha1').update(getToSign).digest('hex');
						const getSig = '$1$' + getHash;

						const getProductsOptions: any = {
							method: getMethod,
							url: endpoint + getProductsPath,
							headers: {
								'X-Ovh-Application': applicationKey,
								'X-Ovh-Timestamp': getProductsTimestamp.toString(),
								'X-Ovh-Signature': getSig,
								'X-Ovh-Consumer': consumerKey,
								'Content-Type': 'application/json',
							},
							json: true,
						};

						const products = await this.helpers.httpRequest(getProductsOptions);
						
						if (Array.isArray(products)) {
							for (const product of products) {
								let planCode = '';
								let displayName = '';
								
								if (typeof product === 'string') {
									planCode = product;
									if (productType === 'cloud') {
										displayName = product.replace(/^project\./, 'Public Cloud - ').replace(/\./g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
									} else if (productType === 'domain') {
										displayName = product.toUpperCase();
									} else {
										displayName = product.replace(/[-_]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
									}
								} else {
									planCode = product.planCode || product.productId || product;
									displayName = product.productName || product.description || planCode;
								}
								
								if (planCode) {
									returnData.push({
										name: displayName,
										value: planCode,
									});
								}
							}
						}

						// Clean up - delete the temporary cart
						try {
							const deleteTimestamp = Math.round(Date.now() / 1000);
							const deletePath = `/order/cart/${cartId}`;
							const deleteMethod = 'DELETE';

							const deleteToSign = applicationSecret + '+' + consumerKey + '+' + deleteMethod + '+' + endpoint + deletePath + '++' + deleteTimestamp;
							const deleteHash = crypto.createHash('sha1').update(deleteToSign).digest('hex');
							const deleteSig = '$1$' + deleteHash;

							const deleteOptions: any = {
								method: deleteMethod,
								url: endpoint + deletePath,
								headers: {
									'X-Ovh-Application': applicationKey,
									'X-Ovh-Timestamp': deleteTimestamp.toString(),
									'X-Ovh-Signature': deleteSig,
									'X-Ovh-Consumer': consumerKey,
								},
								json: true,
							};

							await this.helpers.httpRequest(deleteOptions);
						} catch (deleteError) {
							// Ignore cleanup errors
						}
					} catch (cartError) {
						// Cart API failed for other product types
					}
				}

				// Handle empty results
				if (returnData.length === 0) {
					return [{
						name: 'No Plans Available for This Product Type',
						value: '',
					}];
				}

				// Remove duplicates based on both name and value (plan code), keeping unique combinations
				const seenPlans = new Set<string>();
				const uniquePlans = returnData.filter(plan => {
					const planKey = `${plan.name || ''}|${plan.value || ''}`;
					if (seenPlans.has(planKey)) {
						return false;
					}
					seenPlans.add(planKey);
					return true;
				});

				return uniquePlans.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
			} catch (error) {
				return [{
					name: 'Error Loading Plans',
					value: '',
				}];
			}
		},