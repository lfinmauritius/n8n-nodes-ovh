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
					{
						name: 'Domain Check',
						value: 'domainCheck',
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
						name: 'Assign',
						value: 'assign',
						description: 'Assign cart to your account (required before checkout)',
						action: 'Assign cart to account',
					},
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
						name: 'Update',
						value: 'update',
						description: 'Update an order cart',
						action: 'Update a cart',
					},
				],
				default: 'create',
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
						resource: ['domainCheck'],
					},
				},
				options: [
					{
						name: 'Check Availability',
						value: 'checkAvailability',
						description: 'Check if a domain name is available',
						action: 'Check domain availability',
					},
				],
				default: 'checkAvailability',
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
						operation: ['get', 'assign', 'update', 'delete'],
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
						resource: ['cartCoupon', 'cartItem', 'checkout'],
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
				displayName: 'Domain Name',
				name: 'domainNameCheck',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['domainCheck'],
						operation: ['checkAvailability'],
					},
				},
				default: '',
				placeholder: 'example.com',
				description: 'The domain name to check availability for',
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
				displayName: 'OVH Subsidiary',
				name: 'ovhSubsidiary',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['cartItem'],
						operation: ['add'],
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
				description: 'OVH subsidiary for loading products and plans',
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
					{ name: 'Domain', value: 'domain' },
					{ name: 'Email Pro', value: 'emailpro' },
					{ name: 'Exchange', value: 'exchange' },
					{ name: 'Hosting', value: 'hosting' },
					{ name: 'IP', value: 'ip' },
					{ name: 'JSON Custom', value: 'jsonCustom' },
					{ name: 'Private Cloud', value: 'privateCloud' },
					{ name: 'VPS', value: 'vps' },
				],
				default: 'cloud',
				description: 'Type of product to add to cart',
			},
			{
				displayName: 'Domain Name',
				name: 'domainName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['cartItem'],
						operation: ['add'],
						productType: ['domain'],
					},
				},
				description: 'The domain name to register (e.g., example.com)',
			},
			{
				displayName: 'Domain Configuration',
				name: 'domainConfig',
				type: 'collection',
				placeholder: 'Add Configuration',
				default: {},
				displayOptions: {
					show: {
						resource: ['cartItem'],
						operation: ['add'],
						productType: ['domain'],
					},
				},
				options: [
					{
						displayName: 'Duration',
						name: 'duration',
						type: 'options',
						options: [
							{ name: '1 Year', value: 'P1Y' },
							{ name: '10 Years', value: 'P10Y' },
							{ name: '2 Years', value: 'P2Y' },
							{ name: '3 Years', value: 'P3Y' },
							{ name: '5 Years', value: 'P5Y' },
						],
						default: 'P1Y',
						description: 'Domain registration duration',
					},
					{
						displayName: 'Quantity',
						name: 'quantity',
						type: 'number',
						default: 1,
						description: 'Number of years to register',
					},
				],
			},
			{
				displayName: 'VPS Configuration',
				name: 'vpsConfig',
				type: 'collection',
				placeholder: 'Add VPS Configuration',
				default: {},
				displayOptions: {
					show: {
						resource: ['cartItem'],
						operation: ['add'],
						productType: ['vps'],
					},
				},
				options: [
					{
						displayName: 'Datacenter',
						name: 'vps_datacenter',
						type: 'options',
						options: [
							{ name: 'Beauharnois (Canada)', value: 'BHS' },
							{ name: 'Frankfurt (Germany)', value: 'DE' },
							{ name: 'Gravelines (France)', value: 'GRA' },
							{ name: 'London (UK)', value: 'UK' },
							{ name: 'Roubaix (France)', value: 'RBX' },
							{ name: 'Singapore', value: 'SG' },
							{ name: 'Strasbourg (France)', value: 'SBG' },
							{ name: 'Sydney (Australia)', value: 'SYD' },
							{ name: 'Warsaw (Poland)', value: 'WAW' },
						],
						default: 'GRA',
						description: 'Datacenter location for the VPS',
					},
					{
						displayName: 'Duration',
						name: 'duration',
						type: 'options',
						options: [
							{ name: '1 Month', value: 'P1M' },
							{ name: '1 Year', value: 'P1Y' },
							{ name: '2 Years', value: 'P2Y' },
							{ name: '3 Months', value: 'P3M' },
							{ name: '6 Months', value: 'P6M' },
						],
						default: 'P1M',
						description: 'Subscription duration',
					},
					{
						displayName: 'Operating System',
						name: 'vps_os',
						type: 'options',
						options: [
							{ name: 'AlmaLinux 8', value: 'almalinux_8' },
							{ name: 'AlmaLinux 9', value: 'almalinux_9' },
							{ name: 'CentOS 7', value: 'centos_7' },
							{ name: 'Debian 11', value: 'debian_11' },
							{ name: 'Debian 12', value: 'debian_12' },
							{ name: 'Rocky Linux 8', value: 'rockylinux_8' },
							{ name: 'Rocky Linux 9', value: 'rockylinux_9' },
							{ name: 'Ubuntu 20.04', value: 'ubuntu_20_04' },
							{ name: 'Ubuntu 22.04', value: 'ubuntu_22_04' },
							{ name: 'Ubuntu 24.04', value: 'ubuntu_24_04' },
							{ name: 'Windows Server 2019', value: 'windows_server_2019' },
							{ name: 'Windows Server 2022', value: 'windows_server_2022' },
						],
						default: 'debian_12',
						description: 'Operating system to install on the VPS',
					},
					{
						displayName: 'Plan Code Name or ID',
						name: 'planCode',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getProductPlans',
							loadOptionsDependsOn: ['productType'],
						},
						default: '',
						description: 'The VPS plan to order. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
					},
					{
						displayName: 'Quantity',
						name: 'quantity',
						type: 'number',
						default: 1,
						description: 'Number of VPS to order',
					},
				],
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
					hide: {
						productType: ['domain', 'vps'],
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
						displayName: 'Duration',
						name: 'duration',
						type: 'options',
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
						default: '',
						description: 'The plan code for the product. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
					},
					{
						displayName: 'Pricing Mode',
						name: 'pricingMode',
						type: 'options',
						options: [
							{ name: 'Create - Premium Price', value: 'create-premium' },
							{ name: 'Create - Standard Price', value: 'create-default' },
							{ name: 'Generic - Credit', value: 'credit' },
							{ name: 'Generic - Default', value: 'default' },
							{ name: 'Generic - Hourly', value: 'hourly' },
							{ name: 'Generic - Monthly', value: 'monthly' },
							{ name: 'Generic - Rental', value: 'rental' },
							{ name: 'Generic - Upfront', value: 'upfront' },
							{ name: 'Transfer - Aftermarket 1', value: 'transfer-aftermarket1' },
							{ name: 'Transfer - Aftermarket 2', value: 'transfer-aftermarket2' },
							{ name: 'Transfer - Premium Price', value: 'transfer-premium' },
							{ name: 'Transfer - Standard Price', value: 'transfer-default' },
						],
						default: 'create-default',
						description: 'Pricing mode - Domain-specific modes (create-*, transfer-*) for domains, Generic modes for other products',
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
				displayName: 'Custom JSON Configuration',
				name: 'customJson',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['cartItem'],
						operation: ['add'],
						productType: ['jsonCustom'],
					},
				},
				default: '{\n  "planCode": "",\n  "duration": "P1M",\n  "pricingMode": "default",\n  "quantity": 1,\n  "configuration": [],\n  "options": []\n}',
				description: 'Custom JSON configuration for advanced product orders. Should contain planCode, duration, quantity, and any required configuration/options.',
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
					
					console.log(`DEBUG: getProductPlans called for productType: "${productType}"`);
					

					const credentials = await this.getCredentials('ovhApi');
					const endpoint = credentials.endpoint as string;
					const applicationKey = credentials.applicationKey as string;
					const applicationSecret = credentials.applicationSecret as string;
					const consumerKey = credentials.consumerKey as string;

					const crypto = require('crypto');

					const subsidiary = 'FR'; // Default to FR for now

					if (productType === 'vps') {
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


				} catch (error) {
					console.error('Error in getProductPlans:', error);
					return [{
						name: 'Error Loading Plans',
						value: '',
					}];
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
							// Convert to OVH ISO 8601 format (without milliseconds)
							const expireDate = new Date(additionalFields.expire);
							// OVH expects format like 2024-01-01T00:00:00+00:00 (no milliseconds)
							const isoString = expireDate.toISOString();
							// Remove milliseconds and replace Z with +00:00
							body.expire = isoString.slice(0, 19) + '+00:00';
						}
					} else if (operation === 'get') {
						method = 'GET';
						const cartId = this.getNodeParameter('cartId', i) as string;
						path = `/order/cart/${cartId}`;
					} else if (operation === 'assign') {
						method = 'POST';
						const cartId = this.getNodeParameter('cartId', i) as string;
						path = `/order/cart/${cartId}/assign`;
						// No body for assign operation - it should be empty in signature
					} else if (operation === 'update') {
						method = 'PUT';
						const cartId = this.getNodeParameter('cartId', i) as string;
						path = `/order/cart/${cartId}`;
						const updateFields = this.getNodeParameter('updateFields', i) as any;
						body = { ...updateFields };
						
						// Convert expire to OVH ISO 8601 format if present (without milliseconds)
						if (body.expire) {
							const expireDate = new Date(body.expire);
							// OVH expects format like 2024-01-01T00:00:00+00:00 (no milliseconds)
							const isoString = expireDate.toISOString();
							// Remove milliseconds and replace Z with +00:00
							body.expire = isoString.slice(0, 19) + '+00:00';
						}
					} else if (operation === 'delete') {
						method = 'DELETE';
						const cartId = this.getNodeParameter('cartId', i) as string;
						path = `/order/cart/${cartId}`;
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
						
						body = {};
						
						// Handle domain products specially
						if (productType === 'domain') {
							const domainName = this.getNodeParameter('domainName', i) as string;
							const domainConfig = this.getNodeParameter('domainConfig', i) as any;
							
							// Validation for domain
							if (!domainName) {
								throw new NodeOperationError(this.getNode(), 'Domain name is required for domain products', { itemIndex: i });
							}
							
							body.domain = domainName;
							body.duration = domainConfig.duration || 'P1Y';
							body.quantity = domainConfig.quantity || 1;
							
						} else if (productType === 'vps') {
							// Handle VPS products with required configurations
							const vpsConfig = this.getNodeParameter('vpsConfig', i) as any;
							
							// Validation - planCode is required
							if (!vpsConfig || !vpsConfig.planCode) {
								throw new NodeOperationError(this.getNode(), `Plan Code is required for VPS products. Please select a plan code from the dropdown.`, { itemIndex: i });
							}
							
							console.log(`DEBUG: About to use planCode for VPS: "${vpsConfig.planCode}"`);
							console.log(`DEBUG: Full vpsConfig:`, JSON.stringify(vpsConfig, null, 2));
							
							// Add basic required fields
							body.planCode = vpsConfig.planCode;
							console.log(`DEBUG: VPS Body planCode set to: "${body.planCode}"`);
							
							body.quantity = vpsConfig.quantity !== undefined ? vpsConfig.quantity : 1;
							body.duration = vpsConfig.duration || 'P1M';
							
							// Add required VPS configurations
							body.configuration = [];
							
							// Add OS configuration (required)
							if (vpsConfig.vps_os) {
								body.configuration.push({
									label: 'vps_os',
									value: vpsConfig.vps_os,
								});
							} else {
								// Default OS if not specified
								body.configuration.push({
									label: 'vps_os',
									value: 'debian_12',
								});
							}
							
							// Add datacenter configuration (required)
							if (vpsConfig.vps_datacenter) {
								body.configuration.push({
									label: 'vps_datacenter',
									value: vpsConfig.vps_datacenter,
								});
							} else {
								// Default datacenter if not specified
								body.configuration.push({
									label: 'vps_datacenter',
									value: 'GRA',
								});
							}
							
						} else if (productType === 'jsonCustom') {
							// Handle JSON Custom product type
							const customJson = this.getNodeParameter('customJson', i) as string;
							try {
								const parsedJson = JSON.parse(customJson);
								
								// Validation for JSON Custom
								if (!parsedJson.planCode) {
									throw new NodeOperationError(this.getNode(), 'planCode is required in Custom JSON Configuration', { itemIndex: i });
								}
								
								Object.assign(body, parsedJson);
							} catch (error) {
								throw new NodeOperationError(this.getNode(), `Invalid JSON in Custom JSON Configuration: ${error.message}`, { itemIndex: i });
							}
							
						} else {
							// Handle other product types
							const productConfig = this.getNodeParameter('productConfig', i) as any;
							
							// Validation - planCode is required
							if (!productConfig || !productConfig.planCode) {
								throw new NodeOperationError(this.getNode(), `Plan Code is required for ${productType} products. Please select a plan code from the dropdown.`, { itemIndex: i });
							}
							
							console.log(`DEBUG: About to use planCode for ${productType}: "${productConfig.planCode}"`);
							console.log(`DEBUG: Full productConfig:`, JSON.stringify(productConfig, null, 2));
							
							// Add basic required fields
							body.planCode = productConfig.planCode;
							console.log(`DEBUG: Body planCode set to: "${body.planCode}"`);
							
							body.quantity = productConfig.quantity !== undefined ? productConfig.quantity : 1;
							
							// Add optional fields if provided
							if (productConfig.duration) {
								body.duration = productConfig.duration;
							}
							// Set pricing mode with enhanced debugging
							if (productType === 'privateCloud') {
								// Private Cloud: use "default" pricingMode (confirmed from OVH Python SDK examples)
								body.pricingMode = 'default';
								console.log(`DEBUG: Private Cloud using pricingMode: "default" (from OVH SDK examples)`);
								console.log(`DEBUG: Full body before request:`, JSON.stringify(body, null, 2));
							} else if (productType === 'domain' && productConfig.pricingMode) {
								// Domain: use domain-specific pricing modes (create-default, transfer-default, etc.)
								body.pricingMode = productConfig.pricingMode;
								console.log(`DEBUG: Domain using pricing mode: "${productConfig.pricingMode}"`);
								console.log(`DEBUG: Full body before request:`, JSON.stringify(body, null, 2));
							} else if (productType !== 'privateCloud' && productType !== 'domain' && productConfig.pricingMode) {
								// Other products: use generic pricing modes
								body.pricingMode = productConfig.pricingMode;
								console.log(`DEBUG: ${productType} using pricing mode: "${productConfig.pricingMode}"`);
							}
							
							// Add configuration options
							if (productConfig.configuration && productConfig.configuration.option && productConfig.configuration.option.length > 0) {
								body.configuration = productConfig.configuration.option.map((opt: any) => ({
									label: opt.label,
									value: opt.value,
								}));
							}
							
							// Add options
							if (productConfig.options && productConfig.options.option && productConfig.options.option.length > 0) {
								body.options = productConfig.options.option;
							}
						}
						
						// Log the request body for debugging
						console.log('Cart Item Add - Product Type:', productType);
						console.log('Cart Item Add - Request Path:', path);
						console.log('Cart Item Add - Request Body:', JSON.stringify(body, null, 2));
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
				} else if (resource === 'domainCheck') {
					if (operation === 'checkAvailability') {
						const domainName = this.getNodeParameter('domainNameCheck', i) as string;
						
						// First, create a temporary cart to check domain availability
						const createTimestamp = Math.round(Date.now() / 1000);
						const createCartPath = '/order/cart';
						const createMethod = 'POST';
						const createBody = JSON.stringify({ ovhSubsidiary: 'FR' });
						
						const createToSign = applicationSecret + '+' + consumerKey + '+' + createMethod + '+' + baseUrl + createCartPath + '+' + createBody + '+' + createTimestamp;
						const crypto = require('crypto');
						const createHash = crypto.createHash('sha1').update(createToSign).digest('hex');
						const createSig = '$1$' + createHash;
						
						const createCartOptions: any = {
							method: createMethod,
							url: baseUrl + createCartPath,
							headers: {
								'X-Ovh-Application': applicationKey,
								'X-Ovh-Timestamp': createTimestamp.toString(),
								'X-Ovh-Signature': createSig,
								'X-Ovh-Consumer': consumerKey,
								'Content-Type': 'application/json',
							},
							body: JSON.parse(createBody),
							json: true,
						};
						
						const cartResponse = await this.helpers.httpRequest(createCartOptions);
						const tempCartId = cartResponse.cartId;
						
						// Check domain availability
						method = 'GET';
						path = `/order/cart/${tempCartId}/domain?domain=${encodeURIComponent(domainName)}`;
						
						// Clean up - delete the temporary cart after checking
						const deleteTimestamp = Math.round(Date.now() / 1000);
						const deletePath = `/order/cart/${tempCartId}`;
						const deleteMethod = 'DELETE';
						
						const deleteToSign = applicationSecret + '+' + consumerKey + '+' + deleteMethod + '+' + baseUrl + deletePath + '++' + deleteTimestamp;
						const deleteHash = crypto.createHash('sha1').update(deleteToSign).digest('hex');
						const deleteSig = '$1$' + deleteHash;
						
						const deleteOptions: any = {
							method: deleteMethod,
							url: baseUrl + deletePath,
							headers: {
								'X-Ovh-Application': applicationKey,
								'X-Ovh-Timestamp': deleteTimestamp.toString(),
								'X-Ovh-Signature': deleteSig,
								'X-Ovh-Consumer': consumerKey,
							},
							json: true,
						};
						
						// Schedule cleanup for after the check
						setTimeout(async () => {
							try {
								await this.helpers.httpRequest(deleteOptions);
							} catch (error) {
								// Ignore cleanup errors
							}
						}, 1000);
					}
				}

				const timestamp = Math.round(Date.now() / 1000);

				// For signature: empty string for GET/DELETE or POST without body, JSON string otherwise
				let bodyForSignature = '';
				if (method !== 'GET' && method !== 'DELETE' && Object.keys(body).length > 0) {
					bodyForSignature = JSON.stringify(body);
				}
				
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
					bodyForSignature +
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

				console.log(`DEBUG: About to make HTTP request to OVH API`);
				console.log(`DEBUG: Method: ${method}`);
				console.log(`DEBUG: Path: ${path}`);
				console.log(`DEBUG: Full URL: ${options.url}`);
				console.log(`DEBUG: Request body:`, JSON.stringify(body, null, 2));
				if (body && body.planCode) {
					console.log(`DEBUG: Plan Code being sent to API: "${body.planCode}"`);
				}

				try {
					const response = await this.helpers.httpRequest(options);

					// Handle empty responses (like 204 No Content from assign operation)
					const jsonResponse = response || { success: true, operation: operation, resource: resource };
					
					returnData.push({
						json: jsonResponse,
						pairedItem: { item: i },
					});
				} catch (httpError: any) {
					// Special handling for Private Cloud pricing mode errors
					if (resource === 'cartItem' && operation === 'add' && 
						this.getNodeParameter('productType', i) === 'privateCloud' &&
						httpError.response?.data?.message?.includes('pricingMode')) {
						
						console.log('🚨 DEBUG: Private Cloud pricing mode failed, trying alternatives...');
						const currentMode = body.pricingMode || 'undefined';
						console.log(`🚨 Original mode "${currentMode}" failed with error: ${httpError.response?.data?.message}`);
						console.log(`🚨 Plan Code: ${body.planCode}`);
						console.log(`🚨 Full body that failed:`, JSON.stringify(body, null, 2));
						
						// Try alternatives: 'default' is confirmed from OVH SDK examples  
						const alternativeModes = [
							'default', 'monthly', 'upfront', 'credit', 'hourly', 'rental', null
						];
						let retrySucceeded = false;
						
						for (const altMode of alternativeModes) {
							if (altMode === currentMode) continue; // Skip the one that just failed
							
							try {
								console.log(`🧪 DEBUG: Trying alternative pricing mode: ${altMode || 'OMITTED'}`);
								const altBody = { ...body };
								if (altMode !== null) {
									altBody.pricingMode = altMode;
								} else {
									// Remove pricingMode completely
									delete altBody.pricingMode;
								}
								console.log(`🧪 Testing with body:`, JSON.stringify(altBody, null, 2));
								
								// Recalculate signature for new body
								const altBodyForSignature = JSON.stringify(altBody);
								const altTimestamp = Math.round(Date.now() / 1000);
								const altToSign = applicationSecret + '+' + consumerKey + '+' + method + '+' + baseUrl + path + '+' + altBodyForSignature + '+' + altTimestamp;
								const altHash = crypto.createHash('sha1').update(altToSign).digest('hex');
								const altSig = '$1$' + altHash;
								
								const altOptions = {
									...options,
									headers: {
										...options.headers,
										'X-Ovh-Timestamp': altTimestamp.toString(),
										'X-Ovh-Signature': altSig,
									},
									body: altBody,
								};
								
								const altResponse = await this.helpers.httpRequest(altOptions);
								console.log(`🎉 DEBUG: SUCCESS with pricing mode: ${altMode}`);
								console.log(`🎉 Response:`, JSON.stringify(altResponse, null, 2));
								
								const jsonResponse = altResponse || { success: true, operation: operation, resource: resource };
								returnData.push({
									json: jsonResponse,
									pairedItem: { item: i },
								});
								
								// Success! Mark retry as succeeded and exit
								retrySucceeded = true;
								break;
								
							} catch (altError) {
								const altErrorMsg = altError.response?.data?.message || altError.message;
								console.log(`❌ DEBUG: Failed with pricing mode ${altMode}: ${altErrorMsg}`);
								if (altError.response?.data) {
									console.log(`❌ Full error response:`, JSON.stringify(altError.response.data, null, 2));
								}
							}
						}
						
						// If retry succeeded, skip the regular error handling
						if (retrySucceeded) {
							continue; // Continue to next item in the main loop
						}
						
						// If we get here, all pricing modes failed
						console.error('DEBUG: All Private Cloud pricing modes failed');
					}
					// Enhanced error handling with OVH API response details
					let errorMessage = httpError.message || 'Unknown error';
					let errorDetails: any = {};
					
					// Extract OVH API error details
					if (httpError.response) {
						errorDetails.status = httpError.response.status;
						errorDetails.statusText = httpError.response.statusText;
						if (httpError.response.data) {
							errorDetails.apiResponse = httpError.response.data;
							if (typeof httpError.response.data === 'object' && httpError.response.data.message) {
								errorMessage = httpError.response.data.message;
							}
						}
					}
					
					// Add request details for debugging
					errorDetails.request = {
						method: method,
						url: baseUrl + path,
						body: body,
					};
					
					console.error('OVH API Error Details:', {
						message: errorMessage,
						details: errorDetails,
					});
					
					// Re-throw with enhanced error message
					const enhancedError = new Error(`OVH API Error: ${errorMessage}${errorDetails.apiResponse ? ` | API Response: ${JSON.stringify(errorDetails.apiResponse)}` : ''}`);
					enhancedError.cause = httpError;
					throw enhancedError;
				}
			} catch (error: any) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
							details: error.cause?.response?.data || undefined,
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