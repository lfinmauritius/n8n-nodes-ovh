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


export class OvhStorage implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OVH Public Cloud Storage',
		name: 'ovhStorage',
		icon: 'file:ovh.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage OVH Public Cloud Object Storage',
		defaults: {
			name: 'OVH Public Cloud Storage',
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
						name: 'Container',
						value: 'container',
					},
					{
						name: 'Credential',
						value: 'credential',
					},
					{
						name: 'Presigned URL',
						value: 'presignedUrl',
					},
					{
						name: 'Region',
						value: 'region',
					},
					{
						name: 'Storage',
						value: 'storage',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'container',
			},
			// Container operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['container'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new storage container',
						action: 'Create a new storage container',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a storage container',
						action: 'Delete a storage container',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get storage container information',
						action: 'Get storage container information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many storage containers',
						action: 'Get many storage containers',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update storage container',
						action: 'Update storage container',
					},
				],
				default: 'get',
			},
			// Credential operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['credential'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create storage credentials',
						action: 'Create storage credentials',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete storage credentials',
						action: 'Delete storage credentials',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get storage credentials information',
						action: 'Get storage credentials information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many storage credentials',
						action: 'Get many storage credentials',
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
						description: 'Create a new storage user',
						action: 'Create a new storage user',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a storage user',
						action: 'Delete a storage user',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get storage user information',
						action: 'Get storage user information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many storage users',
						action: 'Get many storage users',
					},
				],
				default: 'get',
			},
			// Presigned URL operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['presignedUrl'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a presigned URL',
						action: 'Create a presigned URL',
					},
				],
				default: 'create',
			},
			// Storage operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['storage'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many storage services',
						action: 'Get many storage services',
					},
				],
				default: 'getAll',
			},
			// Region operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['region'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many storage regions',
						action: 'Get many storage regions',
					},
				],
				default: 'getAll',
			},
			// Project ID field
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
				description: 'The cloud project ID',
			},
			// Container ID field
			{
				displayName: 'Container ID',
				name: 'containerId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['container', 'presignedUrl'],
						operation: ['get', 'delete', 'update', 'create'],
					},
					hide: {
						resource: ['container'],
						operation: ['getAll', 'create'],
					},
				},
			},
			// Credential ID field
			{
				displayName: 'Credential ID',
				name: 'credentialId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['credential'],
						operation: ['get', 'delete'],
					},
				},
			},
			// User ID field
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['get', 'delete'],
					},
				},
			},
			// Region field
			{
				displayName: 'Region',
				name: 'region',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['container'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'BHS',
						value: 'BHS',
					},
					{
						name: 'DE',
						value: 'DE',
					},
					{
						name: 'GRA',
						value: 'GRA',
					},
					{
						name: 'SBG',
						value: 'SBG',
					},
					{
						name: 'UK',
						value: 'UK',
					},
					{
						name: 'WAW',
						value: 'WAW',
					},
				],
				default: 'GRA',
				required: true,
			},
			// Container creation fields
			{
				displayName: 'Container Name',
				name: 'containerName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['container'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: 'my-storage-container',
			},
			// User creation fields
			{
				displayName: 'User Description',
				name: 'userDescription',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: 'Storage user for my application',
			},
			// Presigned URL creation fields
			{
				displayName: 'Object Name',
				name: 'objectName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['presignedUrl'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: 'path/to/my-file.jpg',
			},
			{
				displayName: 'Expiration (Seconds)',
				name: 'expire',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['presignedUrl'],
						operation: ['create'],
					},
				},
				default: 3600,
				required: true,
				description: 'URL expiration time in seconds',
			},
			{
				displayName: 'Method',
				name: 'method',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['presignedUrl'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'GET',
						value: 'GET',
					},
					{
						name: 'PUT',
						value: 'PUT',
					},
				],
				default: 'GET',
				required: true,
			},
			// Container update fields
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['container'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Versioning',
						name: 'versioning',
						type: 'boolean',
						default: false,
						description: 'Whether to enable versioning for the container',
					},
					{
						displayName: 'Container Type',
						name: 'containerType',
						type: 'options',
						options: [
							{
								name: 'Private',
								value: 'private',
							},
							{
								name: 'Public',
								value: 'public',
							},
							{
								name: 'Static',
								value: 'static',
							},
						],
						default: 'private',
					},
				],
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

				const projectId = this.getNodeParameter('projectId', i) as string;

				if (resource === 'container') {
					if (operation === 'get') {
						const containerId = this.getNodeParameter('containerId', i) as string;
						path = `/cloud/project/${projectId}/storage/${containerId}`;
					} else if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/storage`;
					} else if (operation === 'create') {
						method = 'POST';
						const containerName = this.getNodeParameter('containerName', i) as string;
						const region = this.getNodeParameter('region', i) as string;
						
						path = `/cloud/project/${projectId}/storage`;
						body = {
							containerName,
							region,
						};
					} else if (operation === 'delete') {
						method = 'DELETE';
						const containerId = this.getNodeParameter('containerId', i) as string;
						path = `/cloud/project/${projectId}/storage/${containerId}`;
					} else if (operation === 'update') {
						method = 'PUT';
						const containerId = this.getNodeParameter('containerId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						path = `/cloud/project/${projectId}/storage/${containerId}`;
						
						if (updateFields.versioning !== undefined) body.versioning = updateFields.versioning;
						if (updateFields.containerType) body.containerType = updateFields.containerType;
					}
				} else if (resource === 'credential') {
					if (operation === 'get') {
						const credentialId = this.getNodeParameter('credentialId', i) as string;
						path = `/cloud/project/${projectId}/storage/access/${credentialId}`;
					} else if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/storage/access`;
					} else if (operation === 'create') {
						method = 'POST';
						path = `/cloud/project/${projectId}/storage/access`;
					} else if (operation === 'delete') {
						method = 'DELETE';
						const credentialId = this.getNodeParameter('credentialId', i) as string;
						path = `/cloud/project/${projectId}/storage/access/${credentialId}`;
					}
				} else if (resource === 'user') {
					if (operation === 'get') {
						const userId = this.getNodeParameter('userId', i) as string;
						path = `/cloud/project/${projectId}/user/${userId}`;
					} else if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/user`;
					} else if (operation === 'create') {
						method = 'POST';
						const userDescription = this.getNodeParameter('userDescription', i) as string;
						path = `/cloud/project/${projectId}/user`;
						body = { description: userDescription };
					} else if (operation === 'delete') {
						method = 'DELETE';
						const userId = this.getNodeParameter('userId', i) as string;
						path = `/cloud/project/${projectId}/user/${userId}`;
					}
				} else if (resource === 'presignedUrl') {
					if (operation === 'create') {
						method = 'POST';
						const containerId = this.getNodeParameter('containerId', i) as string;
						const objectName = this.getNodeParameter('objectName', i) as string;
						const expire = this.getNodeParameter('expire', i) as number;
						const urlMethod = this.getNodeParameter('method', i) as string;
						
						path = `/cloud/project/${projectId}/storage/${containerId}/presign`;
						body = {
							expire,
							method: urlMethod,
							object: objectName,
						};
					}
				} else if (resource === 'storage') {
					if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/storage`;
					}
				} else if (resource === 'region') {
					if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/region`;
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

				const options: IRequestOptions = {
					method,
					url: fullUrl,
					headers: {
						'X-Ovh-Application': applicationKey,
						'X-Ovh-Consumer': consumerKey,
						'X-Ovh-Signature': signature,
						'X-Ovh-Timestamp': timestamp.toString(),
						'Content-Type': 'application/json',
					},
					body,
					json: true,
				};

				responseData = await this.helpers.request(options);

				if (Array.isArray(responseData)) {
					returnData.push(...responseData);
				} else {
					returnData.push(responseData);
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