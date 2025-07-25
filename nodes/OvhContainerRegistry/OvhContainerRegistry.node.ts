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

export class OvhContainerRegistry implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OVH Container Registry',
		name: 'ovhContainerRegistry',
		icon: 'file:ovh.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage OVH Managed Container Registry',
		defaults: {
			name: 'OVH Container Registry',
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
						name: 'Plan',
						value: 'plan',
					},
					{
						name: 'Registry',
						value: 'registry',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'registry',
			},
			// Registry operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['registry'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new container registry',
						action: 'Create a new container registry',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a container registry',
						action: 'Delete a container registry',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get container registry information',
						action: 'Get container registry information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many container registries',
						action: 'Get many container registries',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update container registry',
						action: 'Update container registry',
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
						description: 'Create a new registry user',
						action: 'Create a new registry user',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a registry user',
						action: 'Delete a registry user',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get registry user information',
						action: 'Get registry user information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many registry users',
						action: 'Get many registry users',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update registry user',
						action: 'Update registry user',
					},
				],
				default: 'get',
			},
			// Plan operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['plan'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many available plans',
						action: 'Get many available plans',
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
			// Registry ID field
			{
				displayName: 'Registry ID',
				name: 'registryId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['registry'],
						operation: ['get', 'delete', 'update'],
					},
				},
			},
			// Registry ID field for users
			{
				displayName: 'Registry ID',
				name: 'registryId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
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
						operation: ['get', 'delete', 'update'],
					},
				},
			},
			// Registry creation fields
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['registry'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: 'my-container-registry',
			},
			{
				displayName: 'Plan ID',
				name: 'planId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['registry'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: 'SMALL',
			},
			{
				displayName: 'Region',
				name: 'region',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['registry'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'GRA',
						value: 'GRA',
					},
					{
						name: 'BHS',
						value: 'BHS',
					},
					{
						name: 'SBG',
						value: 'SBG',
					},
					{
						name: 'WAW',
						value: 'WAW',
					},
				],
				default: 'GRA',
				required: true,
			},
			// User creation fields
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: 'user@example.com',
			},
			{
				displayName: 'Login',
				name: 'login',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: 'myuser',
			},
			// Registry update fields
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['registry'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
					},
				],
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
				let method = 'GET' as IHttpRequestMethods;
				let path = '';
				let body: IDataObject = {};

				const projectId = this.getNodeParameter('projectId', i) as string;

				if (resource === 'registry') {
					if (operation === 'get') {
						const registryId = this.getNodeParameter('registryId', i) as string;
						path = `/cloud/project/${projectId}/containerRegistry/${registryId}`;
					} else if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/containerRegistry`;
					} else if (operation === 'create') {
						method = 'POST';
						const name = this.getNodeParameter('name', i) as string;
						const planId = this.getNodeParameter('planId', i) as string;
						const region = this.getNodeParameter('region', i) as string;

						path = `/cloud/project/${projectId}/containerRegistry`;
						body = {
							name,
							planID: planId,
							region,
						};
					} else if (operation === 'delete') {
						method = 'DELETE';
						const registryId = this.getNodeParameter('registryId', i) as string;
						path = `/cloud/project/${projectId}/containerRegistry/${registryId}`;
					} else if (operation === 'update') {
						method = 'PUT';
						const registryId = this.getNodeParameter('registryId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						path = `/cloud/project/${projectId}/containerRegistry/${registryId}`;

						if (updateFields.name) body.name = updateFields.name;
					}
				} else if (resource === 'user') {
					const registryId = this.getNodeParameter('registryId', i) as string;

					if (operation === 'get') {
						const userId = this.getNodeParameter('userId', i) as string;
						path = `/cloud/project/${projectId}/containerRegistry/${registryId}/users/${userId}`;
					} else if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/containerRegistry/${registryId}/users`;
					} else if (operation === 'create') {
						method = 'POST';
						const email = this.getNodeParameter('email', i) as string;
						const login = this.getNodeParameter('login', i) as string;
						path = `/cloud/project/${projectId}/containerRegistry/${registryId}/users`;
						body = {
							email,
							login,
						};
					} else if (operation === 'delete') {
						method = 'DELETE';
						const userId = this.getNodeParameter('userId', i) as string;
						path = `/cloud/project/${projectId}/containerRegistry/${registryId}/users/${userId}`;
					} else if (operation === 'update') {
						method = 'PUT';
						const userId = this.getNodeParameter('userId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						path = `/cloud/project/${projectId}/containerRegistry/${registryId}/users/${userId}`;

						if (updateFields.email) body.email = updateFields.email;
					}
				} else if (resource === 'plan') {
					if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/containerRegistry/plan`;
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
					'$1$' + createHash('sha1').update(signatureElements.join('+')).digest('hex');

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
