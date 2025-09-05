import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	IHttpRequestMethods,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';
import { createHash } from 'crypto';

export class OvhHostedPrivateCloud implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OVH Hosted Private Cloud',
		name: 'ovhHostedPrivateCloud',
		icon: 'file:ovh.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage OVH Hosted Private Cloud (VMware) - Developed by Ascenzia',
		defaults: {
			name: 'OVH Hosted Private Cloud',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'ovhApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://eu.api.ovh.com/1.0',
			url: '',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Datacenter',
						value: 'datacenter',
					},
					{
						name: 'Datastore',
						value: 'datastore',
					},
					{
						name: 'Host',
						value: 'host',
					},
					{
						name: 'Network',
						value: 'network',
					},
					{
						name: 'Service',
						value: 'service',
					},
				],
				default: 'service',
			},

			// Service Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['service'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						action: 'Get service details',
						description: 'Get service information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'Get many services',
						description: 'Get many services',
					},
				],
				default: 'get',
			},

			// Datacenter Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['datacenter'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						action: 'Create a datacenter',
						description: 'Create a new datacenter',
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get datacenter details',
						description: 'Get datacenter information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'Get many datacenters',
						description: 'Get many datacenters',
					},
				],
				default: 'get',
			},

			// Host Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['host'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						action: 'Create a host',
						description: 'Add a new host',
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get host details',
						description: 'Get host information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'Get many hosts',
						description: 'Get many hosts',
					},
				],
				default: 'get',
			},

			// Datastore Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['datastore'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						action: 'Create a datastore',
						description: 'Create a new datastore',
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get datastore details',
						description: 'Get datastore information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'Get many datastores',
						description: 'Get many datastores',
					},
				],
				default: 'get',
			},

			// Network Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['network'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						action: 'Create allowed network',
						description: 'Create a new allowed network',
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get network details',
						description: 'Get network information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'Get many networks',
						description: 'Get many allowed networks',
					},
				],
				default: 'get',
			},

			// Service Name Parameter
			{
				displayName: 'Service Name',
				name: 'serviceName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['service'],
						operation: ['get'],
					},
				},
				default: '',
				placeholder: 'pcc-123-456-789-123',
				description: 'The service name of the Private Cloud',
			},
			{
				displayName: 'Service Name',
				name: 'serviceName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['datacenter', 'host', 'datastore', 'network'],
					},
				},
				default: '',
				placeholder: 'pcc-123-456-789-123',
				description: 'The service name of the Private Cloud',
			},

			// Datacenter ID Parameter
			{
				displayName: 'Datacenter ID',
				name: 'datacenterId',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['datacenter'],
						operation: ['get'],
					},
				},
				default: 1,

			},
			{
				displayName: 'Datacenter ID',
				name: 'datacenterId',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['host', 'datastore'],
					},
				},
				default: 1,

			},

			// Host ID Parameter
			{
				displayName: 'Host ID',
				name: 'hostId',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['host'],
						operation: ['get'],
					},
				},
				default: 1,

			},

			// Filer ID Parameter
			{
				displayName: 'Datastore ID',
				name: 'filerId',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['datastore'],
						operation: ['get'],
					},
				},
				default: 1,
				description: 'The datastore (filer) ID',
			},

			// Network ID Parameter
			{
				displayName: 'Network ID',
				name: 'networkId',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['network'],
						operation: ['get'],
					},
				},
				default: 1,

			},

			// Create Parameters for Datacenter
			{
				displayName: 'Datacenter Name',
				name: 'datacenterName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['datacenter'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'datacenter-1',
				description: 'Name for the new datacenter',
			},

			// Create Parameters for Network
			{
				displayName: 'Network',
				name: 'network',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['network'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: '192.168.1.0/24',
				description: 'Network CIDR to allow',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['network'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Description for the allowed network',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const credentials = await this.getCredentials('ovhApi');

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let endpoint = '';
				let method: IHttpRequestMethods = 'GET';
				let body: IDataObject = {};

				// Build endpoint based on resource and operation
				if (resource === 'service') {
					if (operation === 'getAll') {
						endpoint = '/dedicatedCloud';
					} else if (operation === 'get') {
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						endpoint = `/dedicatedCloud/${serviceName}`;
					}
				} else if (resource === 'datacenter') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'getAll') {
						endpoint = `/dedicatedCloud/${serviceName}/datacenter`;
					} else if (operation === 'get') {
						const datacenterId = this.getNodeParameter('datacenterId', i) as number;
						endpoint = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}`;
					} else if (operation === 'create') {
						endpoint = `/dedicatedCloud/${serviceName}/datacenter`;
						method = 'POST';
						body = {
							name: this.getNodeParameter('datacenterName', i),
						};
					}
				} else if (resource === 'host') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					const datacenterId = this.getNodeParameter('datacenterId', i) as number;
					
					if (!serviceName) {
						throw new NodeOperationError(this.getNode(), 'Service Name is required for host operations', { itemIndex: i });
					}
					if (!datacenterId) {
						throw new NodeOperationError(this.getNode(), 'Datacenter ID is required for host operations', { itemIndex: i });
					}
					
					if (operation === 'getAll') {
						endpoint = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/host`;
					} else if (operation === 'get') {
						const hostId = this.getNodeParameter('hostId', i) as number;
						if (!hostId) {
							throw new NodeOperationError(this.getNode(), 'Host ID is required for get operation', { itemIndex: i });
						}
						endpoint = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/host/${hostId}`;
					} else if (operation === 'create') {
						endpoint = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/host`;
						method = 'POST';
					}
				} else if (resource === 'datastore') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					const datacenterId = this.getNodeParameter('datacenterId', i) as number;
					if (operation === 'getAll') {
						endpoint = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/filer`;
					} else if (operation === 'get') {
						const filerId = this.getNodeParameter('filerId', i) as number;
						endpoint = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/filer/${filerId}`;
					} else if (operation === 'create') {
						endpoint = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/filer`;
						method = 'POST';
					}
				} else if (resource === 'network') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'getAll') {
						endpoint = `/dedicatedCloud/${serviceName}/allowedNetwork`;
					} else if (operation === 'get') {
						const networkId = this.getNodeParameter('networkId', i) as number;
						endpoint = `/dedicatedCloud/${serviceName}/allowedNetwork/${networkId}`;
					} else if (operation === 'create') {
						endpoint = `/dedicatedCloud/${serviceName}/allowedNetwork`;
						method = 'POST';
						body = {
							network: this.getNodeParameter('network', i),
							description: this.getNodeParameter('description', i) || undefined,
						};
					}
				}

				// Validate endpoint
				if (!endpoint) {
					throw new NodeOperationError(this.getNode(), `Invalid operation: ${resource} - ${operation}`, { itemIndex: i });
				}

				// Prepare request
				const timestamp = Math.floor(Date.now() / 1000).toString();
				const hasBody = method === 'POST';
				const bodyString = hasBody ? JSON.stringify(body) : '';
				const fullUrl = `https://eu.api.ovh.com/1.0${endpoint}`;
				
				const signatureData = [
					credentials.applicationSecret,
					credentials.consumerKey,
					method,
					fullUrl,
					bodyString,
					timestamp,
				].join('+');

				const signature = '$1$' + createHash('sha1').update(signatureData).digest('hex');
				
				const options = {
					method,
					uri: fullUrl,
					headers: {
						'X-Ovh-Application': credentials.applicationKey,
						'X-Ovh-Consumer': credentials.consumerKey,
						'X-Ovh-Signature': signature,
						'X-Ovh-Timestamp': timestamp,
						'Content-Type': 'application/json',
					},
					body: hasBody ? body : undefined,
					json: true,
				};

				const responseData = await this.helpers.request(options);

				// Handle array responses for getAll operations
				if (operation === 'getAll' && Array.isArray(responseData)) {
					for (const item of responseData) {
						if (typeof item === 'string' || typeof item === 'number') {
							returnData.push({ id: item, resource, operation });
						} else {
							returnData.push({ json: item as IDataObject, resource, operation });
						}
					}
				} else {
					returnData.push({ json: responseData as IDataObject, resource, operation });
				}

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: error.message, json: {} });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error, {
					itemIndex: i,
				});
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}