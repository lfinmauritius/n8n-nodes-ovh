import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	IHttpRequestMethods,
	IRequestOptions,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';
import { createHash } from 'crypto';


export class OvhDomain implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OVH Domain',
		name: 'ovhDomain',
		icon: 'file:ovh.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage OVH domains',
		defaults: {
			name: 'OVH Domain',
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
						name: 'Domain',
						value: 'domain',
					},
					{
						name: 'DNS Record',
						value: 'record',
					},
					{
						name: 'Zone',
						value: 'zone',
					},
				],
				default: 'domain',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['domain'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get domain information',
						action: 'Get domain information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many domains',
						action: 'Get many domains',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update domain information',
						action: 'Update domain information',
					},
				],
				default: 'get',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['zone'],
					},
				},
				options: [
					{
						name: 'Export',
						value: 'export',
						description: 'Export DNS zone',
						action: 'Export DNS zone',
					},
					{
						name: 'Import',
						value: 'import',
						description: 'Import DNS zone',
						action: 'Import DNS zone',
					},
					{
						name: 'Refresh',
						value: 'refresh',
						description: 'Refresh DNS zone',
						action: 'Refresh DNS zone',
					},
				],
				default: 'export',
			},
			// DNS Record operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['record'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a DNS record',
						action: 'Create a DNS record',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a DNS record',
						action: 'Delete a DNS record',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get DNS record information',
						action: 'Get DNS record information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many DNS records',
						action: 'Get many DNS records',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a DNS record',
						action: 'Update a DNS record',
					},
				],
				default: 'get',
			},
			// Domain operations fields
			{
				displayName: 'Domain Name',
				name: 'domain',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['domain'],
						operation: ['get', 'update'],
					},
				},
				placeholder: 'example.com',
				description: 'The domain name to operate on',
			},
			// DNS Record fields
			{
				displayName: 'Zone Name',
				name: 'zoneName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['record'],
					},
				},
				placeholder: 'example.com',
				description: 'The DNS zone name',
			},
			{
				displayName: 'Record ID',
				name: 'recordId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The DNS record ID',
			},
			{
				displayName: 'Record Type',
				name: 'recordType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['create', 'getAll'],
					},
				},
				options: [
					{
						name: 'A',
						value: 'A',
					},
					{
						name: 'AAAA',
						value: 'AAAA',
					},
					{
						name: 'CNAME',
						value: 'CNAME',
					},
					{
						name: 'MX',
						value: 'MX',
					},
					{
						name: 'NS',
						value: 'NS',
					},
					{
						name: 'PTR',
						value: 'PTR',
					},
					{
						name: 'SRV',
						value: 'SRV',
					},
					{
						name: 'TXT',
						value: 'TXT',
					},
				],
				default: 'A',
				description: 'The type of DNS record to filter by (for Get Many) or create',
			},
			{
				displayName: 'Subdomain',
				name: 'subdomain',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'www',
				description: 'The subdomain (leave empty for root domain)',
			},
			{
				displayName: 'Target',
				name: 'target',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: '192.168.1.1',
				description: 'The target value for the DNS record',
			},
			{
				displayName: 'TTL',
				name: 'ttl',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['create'],
					},
				},
				default: 3600,
				description: 'Time to live in seconds',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['create'],
						recordType: ['MX', 'SRV'],
					},
				},
				default: 10,
				description: 'Priority for MX and SRV records',
			},
			{
				displayName: 'Domain Name',
				name: 'zoneNameForZone',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['zone'],
					},
				},
				placeholder: 'example.com',
				description: 'The domain zone name',
			},
			// DNS Record update fields
			{
				displayName: 'Update Fields',
				name: 'recordUpdateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Subdomain',
						name: 'subdomain',
						type: 'string',
						default: '',
						placeholder: 'www',

					},
					{
						displayName: 'Target',
						name: 'target',
						type: 'string',
						default: '',
						placeholder: '192.168.1.1',
						description: 'The target value',
					},
					{
						displayName: 'TTL',
						name: 'ttl',
						type: 'number',
						default: 3600,
						description: 'Time to live in seconds',
					},
					{
						displayName: 'Priority',
						name: 'priority',
						type: 'number',
						default: 10,
						description: 'Priority for MX and SRV records',
					},
				],
			},
			// Update fields
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['domain'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Transfer Lock Status',
						name: 'transferLockStatus',
						type: 'options',
						options: [
							{
								name: 'Locked',
								value: 'locked',
							},
							{
								name: 'Locking',
								value: 'locking',
							},
							{
								name: 'Unlocked',
								value: 'unlocked',
							},
							{
								name: 'Unlocking',
								value: 'unlocking',
							},
						],
						default: 'locked',
						description: 'Transfer lock status of the domain',
					},
				],
			},
			// Zone import fields
			{
				displayName: 'Zone Content',
				name: 'zoneContent',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['zone'],
						operation: ['import'],
					},
				},
				description: 'The zone file content to import',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const credentials = await this.getCredentials('ovhApi');
		const endpoint = credentials.endpoint as string;
		const applicationKey = credentials.applicationKey as string;
		const applicationSecret = credentials.applicationSecret as string;
		const consumerKey = credentials.consumerKey as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;
				let method: IHttpRequestMethods = 'GET';
				let path = '';
				let body: IDataObject = {};

				if (resource === 'domain') {
					if (operation === 'get') {
						const domain = this.getNodeParameter('domain', i) as string;
						if (!domain || domain.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'Domain name is required', { itemIndex: i });
						}
						path = `/domain/${domain.trim()}`;
					} else if (operation === 'getAll') {
						path = '/domain';
					} else if (operation === 'update') {
						method = 'PUT';
						const domain = this.getNodeParameter('domain', i) as string;
						if (!domain || domain.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'Domain name is required', { itemIndex: i });
						}
						path = `/domain/${domain.trim()}`;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						
						if (updateFields.transferLockStatus) {
							body.transferLockStatus = updateFields.transferLockStatus;
						}
					}
				} else if (resource === 'record') {
					const zoneName = this.getNodeParameter('zoneName', i) as string;
					if (!zoneName || zoneName.trim() === '') {
						throw new NodeOperationError(this.getNode(), 'Zone name is required', { itemIndex: i });
					}
					
					const zoneNameTrimmed = zoneName.trim();
					
					if (operation === 'get') {
						const recordId = this.getNodeParameter('recordId', i) as number;
						path = `/domain/zone/${zoneNameTrimmed}/record/${recordId}`;
					} else if (operation === 'getAll') {
						path = `/domain/zone/${zoneNameTrimmed}/record`;
						const recordType = this.getNodeParameter('recordType', i) as string;
						path += `?fieldType=${recordType}`;
					} else if (operation === 'create') {
						method = 'POST';
						const recordType = this.getNodeParameter('recordType', i) as string;
						const subdomain = this.getNodeParameter('subdomain', i) as string;
						const target = this.getNodeParameter('target', i) as string;
						const ttl = this.getNodeParameter('ttl', i) as number;
						
						path = `/domain/zone/${zoneNameTrimmed}/record`;
						body = {
							fieldType: recordType,
							subDomain: subdomain,
							target,
							ttl,
						};
						
						// Add priority for MX and SRV records
						if (recordType === 'MX' || recordType === 'SRV') {
							const priority = this.getNodeParameter('priority', i) as number;
							body.target = `${priority} ${target}`;
						}
					} else if (operation === 'update') {
						method = 'PUT';
						const recordId = this.getNodeParameter('recordId', i) as number;
						const recordUpdateFields = this.getNodeParameter('recordUpdateFields', i) as IDataObject;
						path = `/domain/zone/${zoneNameTrimmed}/record/${recordId}`;
						
						if (recordUpdateFields.subdomain !== undefined) body.subDomain = recordUpdateFields.subdomain;
						if (recordUpdateFields.target) {
							let target = recordUpdateFields.target as string;
							// Handle priority for MX and SRV records in updates
							if (recordUpdateFields.priority) {
								target = `${recordUpdateFields.priority} ${target}`;
							}
							body.target = target;
						}
						if (recordUpdateFields.ttl) body.ttl = recordUpdateFields.ttl;
					} else if (operation === 'delete') {
						method = 'DELETE';
						const recordId = this.getNodeParameter('recordId', i) as number;
						path = `/domain/zone/${zoneNameTrimmed}/record/${recordId}`;
					}
				} else if (resource === 'zone') {
					const zoneName = this.getNodeParameter('zoneNameForZone', i) as string;
					if (!zoneName || zoneName.trim() === '') {
						throw new NodeOperationError(this.getNode(), 'Domain zone name is required', { itemIndex: i });
					}
					
					const zoneNameTrimmed = zoneName.trim();
					
					if (operation === 'export') {
						path = `/domain/zone/${zoneNameTrimmed}/export`;
					} else if (operation === 'import') {
						method = 'POST';
						path = `/domain/zone/${zoneNameTrimmed}/import`;
						const zoneContent = this.getNodeParameter('zoneContent', i) as string;
						body = { zoneContent };
					} else if (operation === 'refresh') {
						method = 'POST';
						path = `/domain/zone/${zoneNameTrimmed}/refresh`;
					}
				}

				// Build the request
				const timestamp = Math.round(Date.now() / 1000);
				const fullUrl = `${endpoint}${path}`;
				
				// Prepare body for signature exactly like official OVH SDK
				let bodyForSignature = '';
				if (method === 'POST' || method === 'PUT') {
					if (Object.keys(body).length > 0) {
						// Match official OVH SDK: JSON.stringify + unicode escaping
						bodyForSignature = JSON.stringify(body).replace(/[\u0080-\uFFFF]/g, (m) => {
							return '\\u' + ('0000' + m.charCodeAt(0).toString(16)).slice(-4);
						});
					}
				}
				
				// Generate signature exactly like official OVH SDK
				const signatureElements = [
					applicationSecret,
					consumerKey,
					method,
					fullUrl,
					bodyForSignature,
					timestamp,
				];
				
				const signature = '$1$' + createHash('sha1').update(signatureElements.join('+')).digest('hex');

				// Build headers - only add Content-Type for requests with body
				const headers: any = {
					'X-Ovh-Application': applicationKey,
					'X-Ovh-Consumer': consumerKey,
					'X-Ovh-Signature': signature,
					'X-Ovh-Timestamp': timestamp.toString(),
				};

				const options: IRequestOptions = {
					method,
					url: fullUrl,
					headers,
				};

				// Only add body and content-type for POST/PUT requests
				if (method === 'POST' || method === 'PUT') {
					if (Object.keys(body).length > 0) {
						options.body = body;
						options.json = true;
						headers['Content-Type'] = 'application/json';
					}
				}

				responseData = await this.helpers.request(options);

				if (Array.isArray(responseData)) {
					returnData.push(...responseData);
				} else {
					returnData.push(responseData as IDataObject);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
				} else {
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex: i,
					});
				}
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}