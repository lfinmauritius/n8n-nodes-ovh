import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

export class OvhOrder implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OVH Order',
		name: 'ovhOrder',
		icon: 'file:ovhOrder.svg',
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
				displayName: 'Product Details',
				name: 'productDetails',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						resource: ['cartItem'],
						operation: ['add'],
					},
				},
				default: '{}',
				description: 'Product configuration as JSON object',
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
						const productDetails = this.getNodeParameter('productDetails', i) as string;
						try {
							body = JSON.parse(productDetails);
						} catch (error) {
							body = productDetails;
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