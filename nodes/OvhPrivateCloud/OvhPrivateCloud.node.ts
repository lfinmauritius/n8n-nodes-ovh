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


export class OvhPrivateCloud implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OVH Private Cloud',
		name: 'ovhPrivateCloud',
		icon: 'file:ovh.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage OVH Hosted Private Cloud',
		defaults: {
			name: 'OVH Private Cloud',
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
						name: 'Datacenter',
						value: 'datacenter',
					},
					{
						name: 'Service',
						value: 'service',
					},
					{
						name: 'Task',
						value: 'task',
					},
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'VM',
						value: 'vm',
					},
				],
				default: 'datacenter',
			},
			// Service operations
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
						description: 'Get service information',
						action: 'Get service information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many services',
						action: 'Get many services',
					},
					{
						name: 'Get Service Info',
						value: 'getServiceInfo',
						description: 'Get service subscription information',
						action: 'Get service subscription information',
					},
				],
				default: 'get',
			},
			// Datacenter operations
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
						name: 'Get',
						value: 'get',
						description: 'Get datacenter information',
						action: 'Get datacenter information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many datacenters',
						action: 'Get many datacenters',
					},
				],
				default: 'get',
			},
			// VM operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['vm'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get virtual machine information',
						action: 'Get virtual machine information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many virtual machines',
						action: 'Get many virtual machines',
					},
					{
						name: 'Power Off',
						value: 'powerOff',
						description: 'Power off virtual machine',
						action: 'Power off virtual machine',
					},
					{
						name: 'Power On',
						value: 'powerOn',
						description: 'Power on virtual machine',
						action: 'Power on virtual machine',
					},
					{
						name: 'Reset',
						value: 'reset',
						description: 'Reset virtual machine',
						action: 'Reset virtual machine',
					},
					{
						name: 'Revert Snapshot',
						value: 'revertSnapshot',
						description: 'Revert to snapshot',
						action: 'Revert to snapshot',
					},
				],
				default: 'get',
			},
			// User operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new user',
						action: 'Create a new user',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a user',
						action: 'Delete a user',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get user information',
						action: 'Get user information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many users',
						action: 'Get many users',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update user information',
						action: 'Update user information',
					},
				],
				default: 'get',
			},
			// Task operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['task'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get task information',
						action: 'Get task information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many tasks',
						action: 'Get many tasks',
					},
				],
				default: 'get',
			},
			// Service name field
			{
				displayName: 'Service Name',
				name: 'serviceName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['service'],
						operation: ['get', 'update'],
					},
				},
				placeholder: 'pcc-xxx-xxx-xxx-xxx',
				description: 'The Private Cloud service name',
			},
			// Service name field for other resources
			{
				displayName: 'Service Name',
				name: 'serviceName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['datacenter', 'vm', 'user', 'task'],
					},
				},
				placeholder: 'pcc-xxx-xxx-xxx-xxx',
				description: 'The Private Cloud service name',
			},
			// Datacenter ID field
			{
				displayName: 'Datacenter ID',
				name: 'datacenterId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['datacenter'],
						operation: ['get'],
					},
				},
			},
			// Datacenter ID field for VMs
			{
				displayName: 'Datacenter ID',
				name: 'datacenterId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['vm'],
						operation: ['get', 'getAll', 'powerOff', 'powerOn', 'reset', 'revertSnapshot'],
					},
				},
			},
			// VM ID field
			{
				displayName: 'VM ID',
				name: 'vmId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['vm'],
						operation: ['get', 'powerOff', 'powerOn', 'reset', 'revertSnapshot'],
					},
				},
				description: 'The virtual machine ID',
			},
			// User ID field
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['get', 'delete', 'update'],
					},
				},

			},
			// Task ID field
			{
				displayName: 'Task ID',
				name: 'taskId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['get'],
					},
				},

			},
			// User creation fields
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['create'],
					},
				},
				description: 'The username',
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['create'],
					},
				},
				description: 'The user password',
			},
			// User update fields
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						placeholder: 'name@email.com',
						default: '',
						description: 'The user email address',
					},
					{
						displayName: 'Full Name',
						name: 'fullName',
						type: 'string',
						default: '',
						description: 'The user full name',
					},
					{
						displayName: 'Phone Number',
						name: 'phoneNumber',
						type: 'string',
						default: '',
						description: 'The user phone number',
					},
				],
			},
			// Snapshot name for revert operation
			{
				displayName: 'Snapshot Name',
				name: 'snapshotName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['vm'],
						operation: ['revertSnapshot'],
					},
				},
				description: 'The name of the snapshot to revert to',
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
				let method = 'GET' as IHttpRequestMethods;
				let path = '';
				let body: IDataObject = {};

				if (resource === 'service') {
					if (operation === 'get') {
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/dedicatedCloud/${serviceName}`;
					} else if (operation === 'getAll') {
						path = '/dedicatedCloud';
					} else if (operation === 'getServiceInfo') {
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/dedicatedCloud/${serviceName}/serviceInfos`;
					}
				} else if (resource === 'datacenter') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					
					if (operation === 'get') {
						const datacenterId = this.getNodeParameter('datacenterId', i) as number;
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}`;
					} else if (operation === 'getAll') {
						path = `/dedicatedCloud/${serviceName}/datacenter`;
					}
				} else if (resource === 'vm') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					const datacenterId = this.getNodeParameter('datacenterId', i) as number;
					
					if (operation === 'get') {
						const vmId = this.getNodeParameter('vmId', i) as number;
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm/${vmId}`;
					} else if (operation === 'getAll') {
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm`;
					} else if (operation === 'powerOff') {
						method = 'POST';
						const vmId = this.getNodeParameter('vmId', i) as number;
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm/${vmId}/powerOff`;
					} else if (operation === 'powerOn') {
						method = 'POST';
						const vmId = this.getNodeParameter('vmId', i) as number;
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm/${vmId}/powerOn`;
					} else if (operation === 'reset') {
						method = 'POST';
						const vmId = this.getNodeParameter('vmId', i) as number;
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm/${vmId}/reset`;
					} else if (operation === 'revertSnapshot') {
						method = 'POST';
						const vmId = this.getNodeParameter('vmId', i) as number;
						const snapshotName = this.getNodeParameter('snapshotName', i) as string;
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm/${vmId}/revertSnapshot`;
						body = { snapshotName };
					}
				} else if (resource === 'user') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					
					if (operation === 'get') {
						const userId = this.getNodeParameter('userId', i) as number;
						path = `/dedicatedCloud/${serviceName}/user/${userId}`;
					} else if (operation === 'getAll') {
						path = `/dedicatedCloud/${serviceName}/user`;
					} else if (operation === 'create') {
						method = 'POST';
						const name = this.getNodeParameter('name', i) as string;
						const password = this.getNodeParameter('password', i) as string;
						path = `/dedicatedCloud/${serviceName}/user`;
						body = { name, password };
					} else if (operation === 'delete') {
						method = 'DELETE';
						const userId = this.getNodeParameter('userId', i) as number;
						path = `/dedicatedCloud/${serviceName}/user/${userId}`;
					} else if (operation === 'update') {
						method = 'PUT';
						const userId = this.getNodeParameter('userId', i) as number;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						path = `/dedicatedCloud/${serviceName}/user/${userId}`;
						
						if (updateFields.email) body.email = updateFields.email;
						if (updateFields.fullName) body.fullName = updateFields.fullName;
						if (updateFields.phoneNumber) body.phoneNumber = updateFields.phoneNumber;
					}
				} else if (resource === 'task') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					
					if (operation === 'get') {
						const taskId = this.getNodeParameter('taskId', i) as number;
						path = `/dedicatedCloud/${serviceName}/task/${taskId}`;
					} else if (operation === 'getAll') {
						path = `/dedicatedCloud/${serviceName}/task`;
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
					json: true, // Always parse JSON responses
				};

				// Only add body and content-type for POST/PUT requests
				if (method === 'POST' || method === 'PUT') {
					if (Object.keys(body).length > 0) {
						options.body = body;
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

				if (Array.isArray(responseData)) {
					// For arrays, create proper objects based on the operation
					responseData.forEach((item) => {
						if (typeof item === 'string' || typeof item === 'number') {
							returnData.push({ json: { value: item } });
						} else {
							returnData.push({ json: item });
						}
					});
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