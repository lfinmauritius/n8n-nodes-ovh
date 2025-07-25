import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	IHttpRequestMethods,
	IRequestOptions,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';
import * as crypto from 'crypto';

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
						name: 'Contact',
						value: 'contact',
					},
					{
						name: 'DNS Record',
						value: 'record',
					},
					{
						name: 'Domain',
						value: 'domain',
					},
					{
						name: 'Nameserver',
						value: 'nameserver',
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
			// Nameserver operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['nameserver'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get nameserver information',
						action: 'Get nameserver information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many nameservers for domain',
						action: 'Get many nameservers for domain',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update domain nameservers',
						action: 'Update domain nameservers',
					},
				],
				default: 'getAll',
			},
			// Contact operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['contact'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get domain contact information',
						action: 'Get domain contact information',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update domain contacts',
						action: 'Update domain contacts',
					},
				],
				default: 'get',
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
						name: 'Get All Detailed',
						value: 'getAllDetailed',
						description: 'Get detailed information for all DNS records',
						action: 'Get detailed information for all DNS records',
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
				displayName: 'Domain Name or ID',
				name: 'domain',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getDomains',
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['domain'],
						operation: ['get', 'update'],
					},
				},
				description: 'The domain name to operate on. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			// DNS Record fields
			{
				displayName: 'Zone Name or ID',
				name: 'zoneName',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getZones',
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['record'],
					},
				},
				description: 'The DNS zone name. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Record Name or ID',
				name: 'recordId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getRecordIds',
					loadOptionsDependsOn: ['zoneName'],
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The DNS record ID. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Record Type',
				name: 'recordType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['create', 'getAllDetailed'],
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
				description: 'The type of DNS record to filter by or create',
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
				displayName: 'Domain Name or ID',
				name: 'zoneNameForZone',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getZones',
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['zone'],
					},
				},
				description: 'The domain zone name. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
			// Domain name field for nameserver and contact operations
			{
				displayName: 'Domain Name or ID',
				name: 'domainNameNS',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getDomains',
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['nameserver', 'contact'],
					},
				},
				description: 'The domain name to operate on. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			// Nameserver fields
			{
				displayName: 'Nameserver Name or ID',
				name: 'nameserver',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getNameservers',
					loadOptionsDependsOn: ['domainNameNS'],
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['nameserver'],
						operation: ['get'],
					},
				},
				description: 'The nameserver to get information for. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Nameservers',
				name: 'nameservers',
				type: 'collection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				displayOptions: {
					show: {
						resource: ['nameserver'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Nameserver',
						name: 'nameserver',
						type: 'string',
						default: '',
						placeholder: 'ns1.example.com',
						description: 'Nameserver hostname',
					},
				],
				description: 'List of nameservers to set for the domain',
			},
			// Contact fields
			{
				displayName: 'Contact Type',
				name: 'contactType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['get', 'update'],
					},
				},
				options: [
					{
						name: 'Admin',
						value: 'admin',
					},
					{
						name: 'Billing',
						value: 'billing',
					},
					{
						name: 'Owner',
						value: 'owner',
					},
					{
						name: 'Tech',
						value: 'tech',
					},
				],
				default: 'owner',
				description: 'Type of contact to retrieve or update',
			},
			{
				displayName: 'Contact Name or ID',
				name: 'contactId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getContacts',
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['update'],
					},
				},
				description: 'New contact ID to assign. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	};

	methods = {
		loadOptions: {
			async getDomains(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				
				try {
					const credentials = await this.getCredentials('ovhApi');
					const endpoint = credentials.endpoint as string;
					const applicationKey = credentials.applicationKey as string;
					const applicationSecret = credentials.applicationSecret as string;
					const consumerKey = credentials.consumerKey as string;

					const path = '/domain';
					const method = 'GET';
					const timestamp = Math.round(Date.now() / 1000);
					const fullUrl = `${endpoint}${path}`;

					// Generate signature
					const signatureElements = [
						applicationSecret,
						consumerKey,
						method,
						fullUrl,
						'',
						timestamp,
					];

					const signature = '$1$' + crypto.createHash('sha1').update(signatureElements.join('+')).digest('hex');

					const options: IRequestOptions = {
						method,
						url: fullUrl,
						headers: {
							'X-Ovh-Application': applicationKey,
							'X-Ovh-Consumer': consumerKey,
							'X-Ovh-Signature': signature,
							'X-Ovh-Timestamp': timestamp.toString(),
						},
					};

					let responseData = await this.helpers.request(options);

					// Parse JSON manually for GET requests
					if (typeof responseData === 'string') {
						try {
							responseData = JSON.parse(responseData);
						} catch (error) {
							// If JSON parsing fails, keep the original response
						}
					}

					if (Array.isArray(responseData)) {
						for (const domain of responseData) {
							returnData.push({
								name: domain,
								value: domain,
							});
						}
					}
				} catch (error) {
					// Return empty array on error
					console.error('Error loading domains:', error);
				}

				return returnData;
			},

			async getZones(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				
				try {
					const credentials = await this.getCredentials('ovhApi');
					const endpoint = credentials.endpoint as string;
					const applicationKey = credentials.applicationKey as string;
					const applicationSecret = credentials.applicationSecret as string;
					const consumerKey = credentials.consumerKey as string;

					const path = '/domain/zone';
					const method = 'GET';
					const timestamp = Math.round(Date.now() / 1000);
					const fullUrl = `${endpoint}${path}`;

					// Generate signature
					const signatureElements = [
						applicationSecret,
						consumerKey,
						method,
						fullUrl,
						'',
						timestamp,
					];

					const signature = '$1$' + crypto.createHash('sha1').update(signatureElements.join('+')).digest('hex');

					const options: IRequestOptions = {
						method,
						url: fullUrl,
						headers: {
							'X-Ovh-Application': applicationKey,
							'X-Ovh-Consumer': consumerKey,
							'X-Ovh-Signature': signature,
							'X-Ovh-Timestamp': timestamp.toString(),
						},
					};

					let responseData = await this.helpers.request(options);

					// Parse JSON manually for GET requests
					if (typeof responseData === 'string') {
						try {
							responseData = JSON.parse(responseData);
						} catch (error) {
							// If JSON parsing fails, keep the original response
						}
					}

					if (Array.isArray(responseData)) {
						for (const zone of responseData) {
							returnData.push({
								name: zone,
								value: zone,
							});
						}
					}
				} catch (error) {
					// Return empty array on error
					console.error('Error loading zones:', error);
				}

				return returnData;
			},

			async getRecordIds(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				
				try {
					const zoneName = this.getNodeParameter('zoneName') as string;
					if (!zoneName || zoneName.trim() === '') {
						return returnData;
					}

					const credentials = await this.getCredentials('ovhApi');
					const endpoint = credentials.endpoint as string;
					const applicationKey = credentials.applicationKey as string;
					const applicationSecret = credentials.applicationSecret as string;
					const consumerKey = credentials.consumerKey as string;

					const zoneNameTrimmed = zoneName.trim();
					const path = `/domain/zone/${zoneNameTrimmed}/record`;
					const method = 'GET';
					const timestamp = Math.round(Date.now() / 1000);
					const fullUrl = `${endpoint}${path}`;

					// Generate signature
					const signatureElements = [
						applicationSecret,
						consumerKey,
						method,
						fullUrl,
						'',
						timestamp,
					];

					const signature = '$1$' + crypto.createHash('sha1').update(signatureElements.join('+')).digest('hex');

					const options: IRequestOptions = {
						method,
						url: fullUrl,
						headers: {
							'X-Ovh-Application': applicationKey,
							'X-Ovh-Consumer': consumerKey,
							'X-Ovh-Signature': signature,
							'X-Ovh-Timestamp': timestamp.toString(),
						},
					};

					let responseData = await this.helpers.request(options);

					// Parse JSON manually for GET requests
					if (typeof responseData === 'string') {
						try {
							responseData = JSON.parse(responseData);
						} catch (error) {
							// If JSON parsing fails, keep the original response
						}
					}

					if (Array.isArray(responseData)) {
						// For each record ID, fetch details to show more meaningful information
						for (const recordId of responseData) {
							try {
								const detailPath = `/domain/zone/${zoneNameTrimmed}/record/${recordId}`;
								const detailUrl = `${endpoint}${detailPath}`;
								const detailTimestamp = Math.round(Date.now() / 1000);

								const detailSignatureElements = [
									applicationSecret,
									consumerKey,
									'GET',
									detailUrl,
									'',
									detailTimestamp,
								];

								const detailSignature = '$1$' + crypto.createHash('sha1').update(detailSignatureElements.join('+')).digest('hex');

								const detailOptions: IRequestOptions = {
									method: 'GET',
									url: detailUrl,
									headers: {
										'X-Ovh-Application': applicationKey,
										'X-Ovh-Consumer': consumerKey,
										'X-Ovh-Signature': detailSignature,
										'X-Ovh-Timestamp': detailTimestamp.toString(),
									},
								};

								let detailResponse = await this.helpers.request(detailOptions);

								if (typeof detailResponse === 'string') {
									try {
										detailResponse = JSON.parse(detailResponse);
									} catch (error) {
										// If parsing fails, keep original
									}
								}

								const record = detailResponse as any;
								const subdomain = record.subDomain || '@';
								const type = record.fieldType || 'Unknown';
								const target = record.target || '';
								
								returnData.push({
									name: `${subdomain} (${type}) -> ${target} [ID: ${recordId}]`,
									value: recordId,
								});
							} catch (error) {
								// If we can't get details, just show the ID
								returnData.push({
									name: `Record ID: ${recordId}`,
									value: recordId,
								});
							}
						}
					}
				} catch (error) {
					// Return empty array on error
					console.error('Error loading record IDs:', error);
				}

				return returnData;
			},

			async getNameservers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				
				try {
					const domainName = this.getNodeParameter('domainNameNS') as string;
					if (!domainName || domainName.trim() === '') {
						return returnData;
					}

					const credentials = await this.getCredentials('ovhApi');
					const endpoint = credentials.endpoint as string;
					const applicationKey = credentials.applicationKey as string;
					const applicationSecret = credentials.applicationSecret as string;
					const consumerKey = credentials.consumerKey as string;

					const domainNameTrimmed = domainName.trim();
					const path = `/domain/${domainNameTrimmed}`;
					const method = 'GET';
					const timestamp = Math.round(Date.now() / 1000);
					const fullUrl = `${endpoint}${path}`;

					// Generate signature
					const signatureElements = [
						applicationSecret,
						consumerKey,
						method,
						fullUrl,
						'',
						timestamp,
					];

					const signature = '$1$' + crypto.createHash('sha1').update(signatureElements.join('+')).digest('hex');

					const options: IRequestOptions = {
						method,
						url: fullUrl,
						headers: {
							'X-Ovh-Application': applicationKey,
							'X-Ovh-Consumer': consumerKey,
							'X-Ovh-Signature': signature,
							'X-Ovh-Timestamp': timestamp.toString(),
						},
					};

					let responseData = await this.helpers.request(options);

					// Parse JSON manually for GET requests
					if (typeof responseData === 'string') {
						try {
							responseData = JSON.parse(responseData);
						} catch (error) {
							// If JSON parsing fails, keep the original response
						}
					}

					if (responseData && typeof responseData === 'object' && (responseData as any).nameServers) {
						const nameServers = (responseData as any).nameServers;
						if (Array.isArray(nameServers)) {
							for (const ns of nameServers) {
								if (ns && ns.nameServer) {
									returnData.push({
										name: ns.nameServer,
										value: ns.nameServer,
									});
								}
							}
						}
					}
				} catch (error) {
					// Return empty array on error
					console.error('Error loading nameservers:', error);
				}

				return returnData;
			},

			async getContacts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				
				try {
					const credentials = await this.getCredentials('ovhApi');
					const endpoint = credentials.endpoint as string;
					const applicationKey = credentials.applicationKey as string;
					const applicationSecret = credentials.applicationSecret as string;
					const consumerKey = credentials.consumerKey as string;

					const path = '/me/contact';
					const method = 'GET';
					const timestamp = Math.round(Date.now() / 1000);
					const fullUrl = `${endpoint}${path}`;

					// Generate signature
					const signatureElements = [
						applicationSecret,
						consumerKey,
						method,
						fullUrl,
						'',
						timestamp,
					];

					const signature = '$1$' + crypto.createHash('sha1').update(signatureElements.join('+')).digest('hex');

					const options: IRequestOptions = {
						method,
						url: fullUrl,
						headers: {
							'X-Ovh-Application': applicationKey,
							'X-Ovh-Consumer': consumerKey,
							'X-Ovh-Signature': signature,
							'X-Ovh-Timestamp': timestamp.toString(),
						},
					};

					let responseData = await this.helpers.request(options);

					// Parse JSON manually for GET requests
					if (typeof responseData === 'string') {
						try {
							responseData = JSON.parse(responseData);
						} catch (error) {
							// If JSON parsing fails, keep the original response
						}
					}

					if (Array.isArray(responseData)) {
						// For each contact ID, fetch details to show more meaningful information
						for (const contactId of responseData) {
							try {
								const detailPath = `/me/contact/${contactId}`;
								const detailUrl = `${endpoint}${detailPath}`;
								const detailTimestamp = Math.round(Date.now() / 1000);

								const detailSignatureElements = [
									applicationSecret,
									consumerKey,
									'GET',
									detailUrl,
									'',
									detailTimestamp,
								];

								const detailSignature = '$1$' + crypto.createHash('sha1').update(detailSignatureElements.join('+')).digest('hex');

								const detailOptions: IRequestOptions = {
									method: 'GET',
									url: detailUrl,
									headers: {
										'X-Ovh-Application': applicationKey,
										'X-Ovh-Consumer': consumerKey,
										'X-Ovh-Signature': detailSignature,
										'X-Ovh-Timestamp': detailTimestamp.toString(),
									},
								};

								let detailResponse = await this.helpers.request(detailOptions);

								if (typeof detailResponse === 'string') {
									try {
										detailResponse = JSON.parse(detailResponse);
									} catch (error) {
										// If parsing fails, keep original
									}
								}

								const contact = detailResponse as any;
								const name = `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Unknown';
								const email = contact.email || '';
								
								returnData.push({
									name: `${name} (${email}) - ${contactId}`,
									value: contactId,
								});
							} catch (error) {
								// If we can't get details, just show the ID
								returnData.push({
									name: contactId,
									value: contactId,
								});
							}
						}
					}
				} catch (error) {
					// Return empty array on error
					console.error('Error loading contacts:', error);
				}

				return returnData;
			},
		},
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
				let method = 'GET' as IHttpRequestMethods;
				let path = '';
				let body: IDataObject = {};

				if (resource === 'domain') {
					if (operation === 'get') {
						const domain = this.getNodeParameter('domain', i) as string;
						if (!domain || domain.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'Domain name is required', {
								itemIndex: i,
							});
						}
						path = `/domain/${domain.trim()}`;
					} else if (operation === 'getAll') {
						path = '/domain';
					} else if (operation === 'update') {
						method = 'PUT';
						const domain = this.getNodeParameter('domain', i) as string;
						if (!domain || domain.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'Domain name is required', {
								itemIndex: i,
							});
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
					} else if (operation === 'getAllDetailed') {
						// This will be handled specially in the response processing
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
						const recordUpdateFields = this.getNodeParameter(
							'recordUpdateFields',
							i,
						) as IDataObject;
						path = `/domain/zone/${zoneNameTrimmed}/record/${recordId}`;

						if (recordUpdateFields.subdomain !== undefined)
							body.subDomain = recordUpdateFields.subdomain;
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
						throw new NodeOperationError(this.getNode(), 'Domain zone name is required', {
							itemIndex: i,
						});
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
				} else if (resource === 'nameserver') {
					const domainName = this.getNodeParameter('domainNameNS', i) as string;
					if (!domainName || domainName.trim() === '') {
						throw new NodeOperationError(this.getNode(), 'Domain name is required', {
							itemIndex: i,
						});
					}
					const domainNameTrimmed = domainName.trim();

					if (operation === 'get') {
						const nameserver = this.getNodeParameter('nameserver', i) as string;
						if (!nameserver || nameserver.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'Nameserver is required', {
								itemIndex: i,
							});
						}
						path = `/domain/${domainNameTrimmed}/nameServer/${encodeURIComponent(nameserver.trim())}`;
					} else if (operation === 'getAll') {
						// Use the main domain endpoint to get full nameserver info
						path = `/domain/${domainNameTrimmed}`;
					} else if (operation === 'update') {
						method = 'PUT';
						const nameservers = this.getNodeParameter('nameservers', i) as IDataObject[];
						path = `/domain/${domainNameTrimmed}/nameServer`;
						body = {
							nameServers: nameservers.map((ns: IDataObject) => ns.nameserver),
						};
					}
				} else if (resource === 'contact') {
					const domainName = this.getNodeParameter('domainNameNS', i) as string;
					if (!domainName || domainName.trim() === '') {
						throw new NodeOperationError(this.getNode(), 'Domain name is required', {
							itemIndex: i,
						});
					}
					const domainNameTrimmed = domainName.trim();
					const contactType = this.getNodeParameter('contactType', i) as string;

					if (operation === 'get') {
						// Get the specific contact type for the domain
						path = `/domain/${domainNameTrimmed}`;
					} else if (operation === 'update') {
						method = 'POST';
						const contactId = this.getNodeParameter('contactId', i) as string;
						if (!contactId || contactId.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'Contact ID is required', {
								itemIndex: i,
							});
						}
						// Use the correct OVH API endpoint for contact changes
						path = `/domain/${domainNameTrimmed}/changeContact`;
						body = {
							contactType: contactType,
							contactId: contactId.trim(),
						};
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

				const signature =
					'$1$' + crypto.createHash('sha1').update(signatureElements.join('+')).digest('hex');

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

				// Parse JSON manually for GET requests
				if (method === 'GET' && typeof responseData === 'string') {
					try {
						responseData = JSON.parse(responseData);
					} catch (error) {
						// If JSON parsing fails, keep the original response
					}
				}

				// Special handling for contact get operation
				if (
					operation === 'get' &&
					resource === 'contact' &&
					responseData &&
					typeof responseData === 'object'
				) {
					const contactType = this.getNodeParameter('contactType', i) as string;
					const rawResponse = responseData as any;

					const contactInfo: IDataObject = {
						domain: rawResponse.domain || rawResponse.serviceName || '',
						contactType: contactType,
					};

					// Extract contact information from the correct OVH API structure
					const contactFields = {
						owner: rawResponse.contactOwner?.id || null,
						admin: rawResponse.contactAdmin?.id || null,
						tech: rawResponse.contactTech?.id || null,
						billing: rawResponse.contactBilling?.id || null,
					};

					// Extract contact ID based on selected type
					let contactId: string | null = null;
					if (contactType === 'owner' && contactFields.owner) {
						contactId = contactFields.owner;
						contactInfo.contactId = contactFields.owner;
					} else if (contactType === 'admin' && contactFields.admin) {
						contactId = contactFields.admin;
						contactInfo.contactId = contactFields.admin;
					} else if (contactType === 'tech' && contactFields.tech) {
						contactId = contactFields.tech;
						contactInfo.contactId = contactFields.tech;
					} else if (contactType === 'billing' && contactFields.billing) {
						contactId = contactFields.billing;
						contactInfo.contactId = contactFields.billing;
					} else {
						// If contact type not found, include all contacts
						contactInfo.ownerContact = contactFields.owner;
						contactInfo.adminContact = contactFields.admin;
						contactInfo.techContact = contactFields.tech;
						contactInfo.billingContact = contactFields.billing;
					}

					// Add additional domain info
					contactInfo.domainState = rawResponse.state;
					contactInfo.transferLockStatus = rawResponse.transferLockStatus;
					contactInfo.expirationDate = rawResponse.expirationDate;
					contactInfo.whoisOwner = rawResponse.whoisOwner;

					// If we have a contact ID, fetch the detailed contact information
					if (contactId) {
						try {
							const contactPath = `/me/contact/${contactId}`;
							const contactUrl = `${endpoint}${contactPath}`;

							// Generate signature for contact detail request
							const contactTimestamp = Math.round(Date.now() / 1000);
							const contactSignatureElements = [
								applicationSecret,
								consumerKey,
								'GET',
								contactUrl,
								'',
								contactTimestamp.toString(),
							];
							const contactSignature = crypto
								.createHash('sha1')
								.update(`$1$${contactSignatureElements.join('+')}`)
								.digest('hex');

							const contactOptions: IHttpRequestOptions = {
								method: 'GET',
								url: contactUrl,
								headers: {
									'X-Ovh-Application': applicationKey,
									'X-Ovh-Consumer': consumerKey,
									'X-Ovh-Signature': `$1$${contactSignature}`,
									'X-Ovh-Timestamp': contactTimestamp.toString(),
								},
							};

							const contactDetails = await this.helpers.request(contactOptions);
							
							// Parse JSON if needed
							let parsedContactDetails = contactDetails;
							if (typeof contactDetails === 'string') {
								try {
									parsedContactDetails = JSON.parse(contactDetails);
								} catch (error) {
									// If JSON parsing fails, keep the original response
								}
							}

							// Add the detailed contact information to the response
							if (parsedContactDetails && typeof parsedContactDetails === 'object') {
								const details = parsedContactDetails as any;
								contactInfo.contactDetails = {
									id: details.id,
									firstName: details.firstName,
									lastName: details.lastName,
									email: details.email,
									phone: details.phone,
									cellPhone: details.cellPhone,
									fax: details.fax,
									address: details.address,
									city: details.city,
									zip: details.zip,
									country: details.country,
									language: details.language,
									legalForm: details.legalForm,
									organisationName: details.organisationName,
									organisationType: details.organisationType,
									nationalIdentificationNumber: details.nationalIdentificationNumber,
									vat: details.vat,
									birthDay: details.birthDay,
									birthCity: details.birthCity,
									birthCountry: details.birthCountry,
									gender: details.gender,
								};
							}
						} catch (error) {
							// If fetching contact details fails, add error info but continue
							contactInfo.contactDetailsError = error.message || 'Failed to fetch contact details';
						}
					}

					responseData = contactInfo;
				}

				// Special handling for nameserver getAll operation
				if (
					operation === 'getAll' &&
					resource === 'nameserver' &&
					responseData &&
					typeof responseData === 'object' &&
					(responseData as any).nameServers
				) {
					// Extract nameservers array from domain response
					const nameServers = (responseData as any).nameServers;
					responseData = nameServers; // This will be processed as an array below
				}

				// Special handling for getAllDetailed operation
				if (
					operation === 'getAllDetailed' &&
					resource === 'record' &&
					Array.isArray(responseData)
				) {
					const zoneName = this.getNodeParameter('zoneName', i) as string;
					const zoneNameTrimmed = zoneName.trim();
					const detailedRecords = [];

					// For each record ID, fetch the detailed information
					for (const recordId of responseData) {
						try {
							const detailPath = `/domain/zone/${zoneNameTrimmed}/record/${recordId}`;
							const detailUrl = `${endpoint}${detailPath}`;

							// Generate signature for detail request
							const detailTimestamp = Math.round(Date.now() / 1000);
							const detailSignatureElements = [
								applicationSecret,
								consumerKey,
								'GET',
								detailUrl,
								'',
								detailTimestamp,
							];
							const detailSignature =
								'$1$' + crypto.createHash('sha1').update(detailSignatureElements.join('+')).digest('hex');

							const detailOptions: IRequestOptions = {
								method: 'GET',
								url: detailUrl,
								headers: {
									'X-Ovh-Application': applicationKey,
									'X-Ovh-Consumer': consumerKey,
									'X-Ovh-Signature': detailSignature,
									'X-Ovh-Timestamp': detailTimestamp.toString(),
								},
							};

							let detailResponse = await this.helpers.request(detailOptions);

							// Parse JSON for detail response
							if (typeof detailResponse === 'string') {
								try {
									detailResponse = JSON.parse(detailResponse);
								} catch (error) {
									// If parsing fails, keep original
								}
							}

							detailedRecords.push(detailResponse);
						} catch (error) {
							// If individual record fetch fails, add error info
							detailedRecords.push({
								id: recordId,
								error: 'Failed to fetch details',
								message: error.message || 'Unknown error',
							});
						}
					}

					// Replace responseData with detailed records
					responseData = detailedRecords;
				}

				if (Array.isArray(responseData)) {
					// For arrays, create proper objects based on the operation and resource
					if (operation === 'getAll' && resource === 'domain') {
						// For domain list, wrap each domain name in an object
						responseData.forEach((domainName: string) => {
							returnData.push({ json: { domain: domainName } });
						});
					} else if (operation === 'getAll' && resource === 'nameserver') {
						// For nameserver list, use the complete nameserver objects
						responseData.forEach((nameserver: any) => {
							returnData.push({
								json: {
									nameserver: nameserver.nameServer,
									id: nameserver.id,
									nameServerType: nameserver.nameServerType,
								},
							});
						});
					} else {
						// For other array operations, use the item directly
						responseData.forEach((item) => {
							if (typeof item === 'string' || typeof item === 'number') {
								returnData.push({ json: { value: item } });
							} else {
								returnData.push({ json: item });
							}
						});
					}
				} else {
					// Special handling for zone export which returns a string
					if (operation === 'export' && resource === 'zone' && typeof responseData === 'string') {
						returnData.push({ json: { zoneContent: responseData } });
					} else {
						returnData.push(responseData as IDataObject);
					}
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
