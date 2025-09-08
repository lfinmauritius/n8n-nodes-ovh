import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

export class OvhOrder implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OVH Order',
		name: 'ovhOrder',
		icon: 'file:ovh.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage OVH orders and shopping carts',
		defaults: {
			name: 'OVH Order',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'ovhApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Cart',
						value: 'cart',
					},
					{
						name: 'Cart Assign',
						value: 'cartAssign',
					},
					{
						name: 'Cart Coupon',
						value: 'cartCoupon',
					},
					{
						name: 'Cart Item',
						value: 'cartItem',
					},
					{
						name: 'Checkout',
						value: 'checkout',
					},
				],
				default: 'cart',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['cart'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new order cart',
						action: 'Create a cart',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an order cart',
						action: 'Delete a cart',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a specific order cart',
						action: 'Get a cart',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'List many order carts',
						action: 'Get many carts',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an order cart',
						action: 'Update a cart',
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['cartItem'],
					},
				},
				options: [
					{
						name: 'Add',
						value: 'add',
						description: 'Add an item to cart',
						action: 'Add an item to cart',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Remove an item from cart',
						action: 'Delete an item from cart',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a specific cart item',
						action: 'Get a cart item',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'List many items in a cart',
						action: 'Get many cart items',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a cart item',
						action: 'Update a cart item',
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['checkout'],
					},
				},
				options: [
					{
						name: 'Get Info',
						value: 'getInfo',
						description: 'Get pricing and contract information',
						action: 'Get checkout info',
					},
					{
						name: 'Validate',
						value: 'validate',
						description: 'Validate cart and create order',
						action: 'Validate checkout',
					},
				],
				default: 'getInfo',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['cartAssign'],
					},
				},
				options: [
					{
						name: 'Assign',
						value: 'assign',
						description: 'Assign a cart to a logged in client',
						action: 'Assign cart to client',
					},
				],
				default: 'assign',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['cartCoupon'],
					},
				},
				options: [
					{
						name: 'Add',
						value: 'add',
						description: 'Add a coupon to cart',
						action: 'Add coupon to cart',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Remove a coupon from cart',
						action: 'Remove coupon from cart',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'List many coupons in cart',
						action: 'Get many coupons',
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Cart ID',
				name: 'cartId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['cart'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The ID of the cart',
			},
			{
				displayName: 'Cart ID',
				name: 'cartId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['cartAssign', 'cartCoupon', 'cartItem', 'checkout'],
					},
				},
				default: '',
				description: 'The ID of the cart',
			},
			{
				displayName: 'Item ID',
				name: 'itemId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['cartItem'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The ID of the cart item',
			},
			{
				displayName: 'Coupon',
				name: 'coupon',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['cartCoupon'],
						operation: ['add', 'delete'],
					},
				},
				default: '',
				description: 'The coupon code',
			},
			{
				displayName: 'OVH Subsidiary',
				name: 'ovhSubsidiary',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['cart'],
						operation: ['create'],
					},
				},
				options: [
					{ name: 'Asia', value: 'ASIA' },
					{ name: 'Australia', value: 'AU' },
					{ name: 'Canada (English)', value: 'CA' },
					{ name: 'Czech Republic', value: 'CZ' },
					{ name: 'Finland', value: 'FI' },
					{ name: 'France', value: 'FR' },
					{ name: 'Germany', value: 'DE' },
					{ name: 'Great Britain', value: 'GB' },
					{ name: 'India', value: 'IN' },
					{ name: 'Ireland', value: 'IE' },
					{ name: 'Italy', value: 'IT' },
					{ name: 'Lithuania', value: 'LT' },
					{ name: 'Morocco', value: 'MA' },
					{ name: 'Netherlands', value: 'NL' },
					{ name: 'Poland', value: 'PL' },
					{ name: 'Portugal', value: 'PT' },
					{ name: 'Quebec', value: 'QC' },
					{ name: 'Senegal', value: 'SN' },
					{ name: 'Singapore', value: 'SG' },
					{ name: 'Spain', value: 'ES' },
					{ name: 'Tunisia', value: 'TN' },
					{ name: 'United States', value: 'US' },
					{ name: 'World', value: 'WE' },
					{ name: 'World (Spanish)', value: 'WS' },
				],
				default: 'FR',
				description: 'OVH subsidiary where the cart will be created',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['cart'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Description of the cart',
					},
					{
						displayName: 'Expire',
						name: 'expire',
						type: 'dateTime',
						default: '',
						description: 'Expiration time of the cart',
					},
				],
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['cart'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Description of the cart',
					},
					{
						displayName: 'Expire',
						name: 'expire',
						type: 'dateTime',
						default: '',
						description: 'Expiration time of the cart',
					},
				],
			},
			{
				displayName: 'Product Type',
				name: 'productType',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['cartItem'],
						operation: ['add'],
					},
				},
				options: [
					{ name: 'Cloud', value: 'cloud' },
					{ name: 'Dedicated Server', value: 'dedicated' },
					{ name: 'Domain', value: 'domain' },
					{ name: 'Email Pro', value: 'emailpro' },
					{ name: 'Exchange', value: 'exchange' },
					{ name: 'Hosting', value: 'hosting' },
					{ name: 'IP', value: 'ip' },
					{ name: 'Kubernetes', value: 'kubernetes' },
					{ name: 'License', value: 'license' },
					{ name: 'Private Cloud', value: 'privateCloud' },
					{ name: 'VPS', value: 'vps' },
				],
				default: 'cloud',
				description: 'Type of product to add to cart',
			},
			{
				displayName: 'Product Configuration',
				name: 'productConfig',
				type: 'collection',
				placeholder: 'Add Configuration',
				default: {},
				displayOptions: {
					show: {
						resource: ['cartItem'],
						operation: ['add'],
					},
				},
				options: [
					{
						displayName: 'Configuration',
						name: 'configuration',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						displayOptions: {
							hide: {
								productType: ['domain', 'ip'],
							},
						},
						default: {},
						placeholder: 'Add Configuration Option',
						options: [
							{
								name: 'option',
								displayName: 'Option',
								values: [
									{
										displayName: 'Label',
										name: 'label',
										type: 'string',
										default: '',
										description: 'Configuration option label (e.g., "region", "flavor")',
									},
									{
										displayName: 'Value',
										name: 'value',
										type: 'string',
										default: '',
										description: 'Configuration option value',
									},
								],
							},
						],
					},
					{
						displayName: 'Domain Name',
						name: 'domain',
						type: 'string',
						displayOptions: {
							hide: {
								productType: ['cloud', 'vps', 'dedicated', 'emailpro', 'exchange', 'hosting', 'ip', 'kubernetes', 'license', 'privateCloud'],
							},
						},
						default: '',
						description: 'The domain name to register (e.g., example.com)',
					},
					{
						displayName: 'Duration',
						name: 'duration',
						type: 'options',
						displayOptions: {
							hide: {
								productType: ['ip'],
							},
						},
						options: [
							{ name: '1 Month', value: 'P1M' },
							{ name: '1 Year', value: 'P1Y' },
							{ name: '2 Years', value: 'P2Y' },
							{ name: '3 Months', value: 'P3M' },
							{ name: '3 Years', value: 'P3Y' },
							{ name: '6 Months', value: 'P6M' },
						],
						default: 'P1M',
						description: 'Subscription duration',
					},
					{
						displayName: 'Options',
						name: 'options',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						displayOptions: {
							hide: {
								productType: ['domain'],
							},
						},
						default: {},
						placeholder: 'Add Option',
						options: [
							{
								name: 'option',
								displayName: 'Option',
								values: [
									{
										displayName: 'Duration',
										name: 'duration',
										type: 'string',
										default: 'P1M',
										description: 'Option duration',
									},
									{
										displayName: 'Plan Code',
										name: 'planCode',
										type: 'string',
										default: '',
										description: 'Option plan code',
									},
									{
										displayName: 'Pricing Mode',
										name: 'pricingMode',
										type: 'string',
										default: 'default',
										description: 'Option pricing mode',
									},
									{
										displayName: 'Quantity',
										name: 'quantity',
										type: 'number',
										default: 1,
										description: 'Option quantity',
									},
								],
							},
						],
					},
					{
						displayName: 'Plan Code Name or ID',
						name: 'planCode',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getProductPlans',
							loadOptionsDependsOn: ['productType'],
						},
						displayOptions: {
							hide: {
								productType: ['domain'],
							},
						},
						default: '',
						description: 'The plan code for the product. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
					},
					{
						displayName: 'Pricing Mode',
						name: 'pricingMode',
						type: 'options',
						displayOptions: {
							hide: {
								productType: ['domain', 'ip'],
							},
						},
						options: [
							{ name: 'Default', value: 'default' },
							{ name: 'Degressivity', value: 'degressivity' },
						],
						default: 'default',
						description: 'Pricing mode for the product',
					},
					{
						displayName: 'Quantity',
						name: 'quantity',
						type: 'number',
						default: 1,
						description: 'Number of items to add',
					},
				],
			},
			{
				displayName: 'Item Update Fields',
				name: 'itemUpdateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['cartItem'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Duration',
						name: 'duration',
						type: 'string',
						default: '',
						description: 'Duration for the item',
					},
					{
						displayName: 'Quantity',
						name: 'quantity',
						type: 'number',
						default: 1,
						description: 'Quantity of items',
					},
				],
			},
			{
				displayName: 'Auto Pay With Preferred Payment Method',
				name: 'autoPayWithPreferredPaymentMethod',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['checkout'],
						operation: ['validate'],
					},
				},
				description: 'Whether to automatically pay with preferred payment method',
			},
			{
				displayName: 'Waive Retraction Period',
				name: 'waiveRetractationPeriod',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['checkout'],
						operation: ['validate'],
					},
				},
				description: 'Whether to waive retraction period',
			},
		],
	};

	methods = {
		loadOptions: {
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

					// Create a temporary cart to get available products
					const timestamp = Math.round(Date.now() / 1000);
					const createCartPath = '/order/cart';
					const method = 'POST';
					const body = JSON.stringify({ ovhSubsidiary: 'FR' }); // Default to FR, could be made configurable

					const toSign = applicationSecret + '+' + consumerKey + '+' + method + '+' + endpoint + createCartPath + '+' + body + '+' + timestamp;
					const crypto = require('crypto');
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

					try {
						const products = await this.helpers.httpRequest(getProductsOptions);
						
						if (Array.isArray(products)) {
							for (const product of products) {
								let planCode = '';
								let displayName = '';
								let description = '';
								
								// Handle different response formats
								if (typeof product === 'string') {
									planCode = product;
									
									// For VPS, improve display names
									if (productType === 'vps') {
										// Parse VPS plan codes like "vps-value-1-2-40", "vps-starter-1-2-20", etc.
										const vpsMatch = product.match(/vps-([^-]+)-(\d+)-(\d+)-(\d+)/);
										if (vpsMatch) {
											const [, tier, vcpu, ram, storage] = vpsMatch;
											const tierName = tier.charAt(0).toUpperCase() + tier.slice(1);
											displayName = `VPS ${tierName} - ${vcpu} vCore, ${ram}GB RAM, ${storage}GB SSD`;
										} else {
											displayName = product.replace(/^vps-/, 'VPS ').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
										}
									} else if (productType === 'cloud') {
										// Improve cloud product names
										displayName = product.replace(/^project\./, 'Public Cloud - ').replace(/\./g, ' ').replace(/\b\w/g, c => c.toUpperCase());
									} else if (productType === 'dedicated') {
										// Improve dedicated server names
										displayName = product.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
									} else if (productType === 'domain') {
										// Domain extensions
										displayName = product.toUpperCase();
									} else {
										// Default formatting
										displayName = product.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
									}
								} else {
									// Product is an object
									planCode = product.planCode || product.productId || product;
									displayName = product.productName || product.description || planCode;
									description = product.description || product.longDescription || '';
								}
								
								// Try to get more details about the product
								if (planCode && productType === 'vps') {
									try {
										const detailsTimestamp = Math.round(Date.now() / 1000);
										const detailsPath = `/order/catalog/public/${productType}`;
										const detailsMethod = 'GET';
										
										const detailsToSign = applicationSecret + '+' + consumerKey + '+' + detailsMethod + '+' + endpoint + detailsPath + '++' + detailsTimestamp;
										const detailsHash = crypto.createHash('sha1').update(detailsToSign).digest('hex');
										const detailsSig = '$1$' + detailsHash;
										
										const detailsOptions: any = {
											method: detailsMethod,
											url: endpoint + detailsPath,
											headers: {
												'X-Ovh-Application': applicationKey,
												'X-Ovh-Timestamp': detailsTimestamp.toString(),
												'X-Ovh-Signature': detailsSig,
												'X-Ovh-Consumer': consumerKey,
											},
											json: true,
										};
										
										const catalog = await this.helpers.httpRequest(detailsOptions);
										if (catalog && catalog.plans) {
											const plan = catalog.plans.find((p: any) => p.planCode === planCode);
											if (plan && plan.invoiceName) {
												displayName = plan.invoiceName;
												description = plan.description || '';
											}
										}
									} catch (catalogError) {
										// Ignore catalog errors, use fallback name
									}
								}
								
								returnData.push({
									name: displayName,
									value: planCode,
									description: description || undefined,
								});
							}
						}
					} catch (error) {
						// If no products available for this type, return empty
						console.error('Error loading products:', error);
					}

					// Clean up - delete the temporary cart
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

					try {
						await this.helpers.httpRequest(deleteOptions);
					} catch (error) {
						// Ignore deletion errors
					}

				} catch (error) {
					console.error('Error in getProductPlans:', error);
					return [{
						name: 'Error Loading Plans',
						value: '',
					}];
				}

				return returnData.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
			},

			async getProductConfigurations(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				
				try {
					let productType: string;
					let planCode: string;
					
					try {
						productType = this.getNodeParameter('productType') as string;
						planCode = this.getNodeParameter('productConfig.planCode') as string;
					} catch (error) {
						return returnData;
					}
					
					if (!productType || !planCode) {
						return returnData;
					}

					const credentials = await this.getCredentials('ovhApi');
					const endpoint = credentials.endpoint as string;
					const applicationKey = credentials.applicationKey as string;
					const applicationSecret = credentials.applicationSecret as string;
					const consumerKey = credentials.consumerKey as string;

					// Create a temporary cart
					const timestamp = Math.round(Date.now() / 1000);
					const createCartPath = '/order/cart';
					const method = 'POST';
					const body = JSON.stringify({ ovhSubsidiary: 'FR' });

					const toSign = applicationSecret + '+' + consumerKey + '+' + method + '+' + endpoint + createCartPath + '+' + body + '+' + timestamp;
					const crypto = require('crypto');
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

					// Get configuration requirements for this product
					const getConfigTimestamp = Math.round(Date.now() / 1000);
					const getConfigPath = `/order/cart/${cartId}/${productType}/options`;
					const getConfigBody = JSON.stringify({ planCode });
					const getMethod = 'POST';

					const getToSign = applicationSecret + '+' + consumerKey + '+' + getMethod + '+' + endpoint + getConfigPath + '+' + getConfigBody + '+' + getConfigTimestamp;
					const getHash = crypto.createHash('sha1').update(getToSign).digest('hex');
					const getSig = '$1$' + getHash;

					const getConfigOptions: any = {
						method: getMethod,
						url: endpoint + getConfigPath,
						headers: {
							'X-Ovh-Application': applicationKey,
							'X-Ovh-Timestamp': getConfigTimestamp.toString(),
							'X-Ovh-Signature': getSig,
							'X-Ovh-Consumer': consumerKey,
							'Content-Type': 'application/json',
						},
						body: JSON.parse(getConfigBody),
						json: true,
					};

					try {
						const configurations = await this.helpers.httpRequest(getConfigOptions);
						
						if (Array.isArray(configurations)) {
							for (const config of configurations) {
								returnData.push({
									name: config.label || config.name || config,
									value: config.value || config,
									description: config.description || undefined,
								});
							}
						}
					} catch (error) {
						console.error('Error loading configurations:', error);
					}

					// Clean up - delete the temporary cart
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

					try {
						await this.helpers.httpRequest(deleteOptions);
					} catch (error) {
						// Ignore deletion errors
					}

				} catch (error) {
					console.error('Error in getProductConfigurations:', error);
				}

				return returnData;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('ovhApi');

		const applicationKey = credentials.applicationKey as string;
		const applicationSecret = credentials.applicationSecret as string;
		const consumerKey = credentials.consumerKey as string;
		const endpoint = credentials.endpoint as string;

		// Use the endpoint directly from credentials (it's already the full URL)
		const baseUrl = endpoint;

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let method = 'GET';
				let path = '';
				let body: any = {};

				if (resource === 'cart') {
					if (operation === 'create') {
						method = 'POST';
						path = '/order/cart';
						const ovhSubsidiary = this.getNodeParameter('ovhSubsidiary', i) as string;
						body.ovhSubsidiary = ovhSubsidiary;

						const additionalFields = this.getNodeParameter('additionalFields', i) as any;
						if (additionalFields.description) {
							body.description = additionalFields.description;
						}
						if (additionalFields.expire) {
							body.expire = additionalFields.expire;
						}
					} else if (operation === 'getAll') {
						method = 'GET';
						path = '/order/cart';
					} else if (operation === 'get') {
						method = 'GET';
						const cartId = this.getNodeParameter('cartId', i) as string;
						path = `/order/cart/${cartId}`;
					} else if (operation === 'update') {
						method = 'PUT';
						const cartId = this.getNodeParameter('cartId', i) as string;
						path = `/order/cart/${cartId}`;
						const updateFields = this.getNodeParameter('updateFields', i) as any;
						body = { ...updateFields };
					} else if (operation === 'delete') {
						method = 'DELETE';
						const cartId = this.getNodeParameter('cartId', i) as string;
						path = `/order/cart/${cartId}`;
					}
				} else if (resource === 'cartAssign') {
					const cartId = this.getNodeParameter('cartId', i) as string;
					if (operation === 'assign') {
						method = 'POST';
						path = `/order/cart/${cartId}/assign`;
						body = {};
					}
				} else if (resource === 'cartCoupon') {
					const cartId = this.getNodeParameter('cartId', i) as string;
					if (operation === 'add') {
						method = 'POST';
						path = `/order/cart/${cartId}/coupon`;
						const coupon = this.getNodeParameter('coupon', i) as string;
						body = { coupon };
					} else if (operation === 'getAll') {
						method = 'GET';
						path = `/order/cart/${cartId}/coupon`;
					} else if (operation === 'delete') {
						method = 'DELETE';
						const coupon = this.getNodeParameter('coupon', i) as string;
						path = `/order/cart/${cartId}/coupon/${coupon}`;
					}
				} else if (resource === 'cartItem') {
					const cartId = this.getNodeParameter('cartId', i) as string;

					if (operation === 'add') {
						method = 'POST';
						const productType = this.getNodeParameter('productType', i) as string;
						path = `/order/cart/${cartId}/${productType}`;
						
						const productConfig = this.getNodeParameter('productConfig', i) as any;
						body = {};
						
						// Handle domain products specially
						if (productType === 'domain') {
							if (productConfig.domain) {
								body.domain = productConfig.domain;
							}
							// For domains, duration is typically fixed by the registrar
							if (productConfig.duration) {
								body.duration = productConfig.duration;
							}
						} else {
							// Add basic fields for other product types
							if (productConfig.planCode) {
								body.planCode = productConfig.planCode;
							}
							if (productConfig.quantity !== undefined) {
								body.quantity = productConfig.quantity;
							}
							if (productConfig.duration) {
								body.duration = productConfig.duration;
							}
							if (productConfig.pricingMode) {
								body.pricingMode = productConfig.pricingMode;
							}
						}
						
						// Add configuration options
						if (productConfig.configuration && productConfig.configuration.option) {
							body.configuration = productConfig.configuration.option.map((opt: any) => ({
								label: opt.label,
								value: opt.value,
							}));
						}
						
						// Add options
						if (productConfig.options && productConfig.options.option) {
							body.options = productConfig.options.option;
						}
					} else if (operation === 'getAll') {
						method = 'GET';
						path = `/order/cart/${cartId}/item`;
					} else if (operation === 'get') {
						method = 'GET';
						const itemId = this.getNodeParameter('itemId', i) as string;
						path = `/order/cart/${cartId}/item/${itemId}`;
					} else if (operation === 'update') {
						method = 'PUT';
						const itemId = this.getNodeParameter('itemId', i) as string;
						path = `/order/cart/${cartId}/item/${itemId}`;
						const itemUpdateFields = this.getNodeParameter('itemUpdateFields', i) as any;
						body = { ...itemUpdateFields };
					} else if (operation === 'delete') {
						method = 'DELETE';
						const itemId = this.getNodeParameter('itemId', i) as string;
						path = `/order/cart/${cartId}/item/${itemId}`;
					}
				} else if (resource === 'checkout') {
					const cartId = this.getNodeParameter('cartId', i) as string;

					if (operation === 'getInfo') {
						method = 'GET';
						path = `/order/cart/${cartId}/checkout`;
					} else if (operation === 'validate') {
						method = 'POST';
						path = `/order/cart/${cartId}/checkout`;
						body.autoPayWithPreferredPaymentMethod = this.getNodeParameter(
							'autoPayWithPreferredPaymentMethod',
							i,
						) as boolean;
						body.waiveRetractationPeriod = this.getNodeParameter(
							'waiveRetractationPeriod',
							i,
						) as boolean;
					}
				}

				const timestamp = Math.round(Date.now() / 1000);

				const toSign =
					applicationSecret +
					'+' +
					consumerKey +
					'+' +
					method +
					'+' +
					baseUrl +
					path +
					'+' +
					(method === 'GET' || method === 'DELETE' ? '' : JSON.stringify(body)) +
					'+' +
					timestamp;

				const crypto = require('crypto');
				const hash = crypto.createHash('sha1').update(toSign).digest('hex');
				const sig = '$1$' + hash;

				const options: any = {
					method,
					url: baseUrl + path,
					headers: {
						'X-Ovh-Application': applicationKey,
						'X-Ovh-Timestamp': timestamp.toString(),
						'X-Ovh-Signature': sig,
						'X-Ovh-Consumer': consumerKey,
						'Content-Type': 'application/json',
					},
					json: true,
				};

				if (method !== 'GET' && method !== 'DELETE' && Object.keys(body).length > 0) {
					options.body = body;
				}

				const response = await this.helpers.httpRequest(options);

				returnData.push({
					json: response,
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}