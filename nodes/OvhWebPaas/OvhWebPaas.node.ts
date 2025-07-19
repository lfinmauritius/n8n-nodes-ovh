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

export class OvhWebPaas implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OVH Web PaaS',
		name: 'ovhWebPaas',
		icon: 'file:ovh.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage OVH Web Platform-as-a-Service',
		defaults: {
			name: 'OVH Web PaaS',
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
						name: 'Capability',
						value: 'capability',
					},
					{
						name: 'Certificate',
						value: 'certificate',
					},
					{
						name: 'Deployment',
						value: 'deployment',
					},
					{
						name: 'Environment',
						value: 'environment',
					},
					{
						name: 'Project',
						value: 'project',
					},
					{
						name: 'Subscription',
						value: 'subscription',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'project',
			},
			// Project operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['project'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new Web PaaS project',
						action: 'Create a new web paa s project',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a Web PaaS project',
						action: 'Delete a web paa s project',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get Web PaaS project information',
						action: 'Get web paa s project information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many Web PaaS projects',
						action: 'Get many web paa s projects',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update Web PaaS project',
						action: 'Update web paa s project',
					},
				],
				default: 'get',
			},
			// Subscription operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['subscription'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get subscription information',
						action: 'Get subscription information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many subscriptions',
						action: 'Get many subscriptions',
					},
				],
				default: 'get',
			},
			// Environment operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['environment'],
					},
				},
				options: [
					{
						name: 'Activate',
						value: 'activate',
						description: 'Activate an environment',
						action: 'Activate an environment',
					},
					{
						name: 'Deactivate',
						value: 'deactivate',
						description: 'Deactivate an environment',
						action: 'Deactivate an environment',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get environment information',
						action: 'Get environment information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many environments',
						action: 'Get many environments',
					},
				],
				default: 'get',
			},
			// Deployment operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['deployment'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get deployment information',
						action: 'Get deployment information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many deployments',
						action: 'Get many deployments',
					},
					{
						name: 'Trigger',
						value: 'trigger',
						description: 'Trigger a new deployment',
						action: 'Trigger a new deployment',
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
						name: 'Add',
						value: 'add',
						description: 'Add a user to project',
						action: 'Add a user to project',
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
						name: 'Remove',
						value: 'remove',
						description: 'Remove a user from project',
						action: 'Remove a user from project',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update user permissions',
						action: 'Update user permissions',
					},
				],
				default: 'get',
			},
			// Certificate operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['certificate'],
					},
				},
				options: [
					{
						name: 'Add',
						value: 'add',
						description: 'Add a SSL certificate',
						action: 'Add a SSL certificate',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a SSL certificate',
						action: 'Delete a SSL certificate',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get certificate information',
						action: 'Get certificate information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many certificates',
						action: 'Get many certificates',
					},
				],
				default: 'get',
			},
			// Capability operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['capability'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many capabilities',
						action: 'Get many capabilities',
					},
				],
				default: 'getAll',
			},
			// Service name field (subscription ID)
			{
				displayName: 'Service Name',
				name: 'serviceName',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'webpaas-xxxxxxxxxx',
				description: 'The Web PaaS service name (subscription ID)',
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['get', 'update', 'delete'],
					},
				},
			},
			// Service name field for other resources
			{
				displayName: 'Service Name',
				name: 'serviceName',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'webpaas-xxxxxxxxxx',
				description: 'The Web PaaS service name (subscription ID)',
				displayOptions: {
					show: {
						resource: ['environment', 'deployment', 'user', 'certificate'],
					},
				},
			},
			// Project ID field
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['environment', 'deployment', 'user', 'certificate'],
						operation: [
							'get',
							'getAll',
							'activate',
							'deactivate',
							'trigger',
							'add',
							'remove',
							'update',
							'delete',
						],
					},
				},
			},
			// Environment ID field
			{
				displayName: 'Environment ID',
				name: 'environmentId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['environment'],
						operation: ['get', 'activate', 'deactivate', 'trigger'],
					},
				},
			},
			// Environment ID field for deployments
			{
				displayName: 'Environment ID',
				name: 'environmentId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['deployment'],
						operation: ['getAll', 'trigger'],
					},
				},
			},
			// Environment ID field for certificates
			{
				displayName: 'Environment ID',
				name: 'environmentId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['certificate'],
						operation: ['get', 'getAll', 'add', 'delete'],
					},
				},
			},
			// Deployment ID field
			{
				displayName: 'Deployment ID',
				name: 'deploymentId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['deployment'],
						operation: ['get'],
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
						operation: ['get', 'remove', 'update'],
					},
				},
			},
			// Certificate ID field
			{
				displayName: 'Certificate ID',
				name: 'certificateId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['certificate'],
						operation: ['get', 'delete'],
					},
				},
			},
			// Project creation fields
			{
				displayName: 'Project Name',
				name: 'projectName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: 'my-web-project',
			},
			{
				displayName: 'Plan ID',
				name: 'planId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: 'webpaas-start',
			},
			{
				displayName: 'Region',
				name: 'region',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'Europe (France)',
						value: 'eu-fr-1',
					},
					{
						name: 'Europe (Germany)',
						value: 'eu-de-1',
					},
					{
						name: 'Canada',
						value: 'ca-1',
					},
					{
						name: 'United States',
						value: 'us-1',
					},
				],
				default: 'eu-fr-1',
				required: true,
			},
			// User addition fields
			{
				displayName: 'User Email',
				name: 'userEmail',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['add'],
					},
				},
				default: '',
				required: true,
				placeholder: 'user@example.com',
			},
			{
				displayName: 'User Role',
				name: 'userRole',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['add', 'update'],
					},
				},
				options: [
					{
						name: 'Admin',
						value: 'admin',
					},
					{
						name: 'Contributor',
						value: 'contributor',
					},
					{
						name: 'Viewer',
						value: 'viewer',
					},
				],
				default: 'viewer',
				required: true,
			},
			// Certificate addition fields
			{
				displayName: 'Certificate',
				name: 'certificate',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['certificate'],
						operation: ['add'],
					},
				},
				default: '',
				required: true,
				placeholder: '-----BEGIN CERTIFICATE-----\n...',
				description: 'The SSL certificate in PEM format',
			},
			{
				displayName: 'Private Key',
				name: 'privateKey',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['certificate'],
						operation: ['add'],
					},
				},
				default: '',
				required: true,
				placeholder: '-----BEGIN PRIVATE KEY-----\n...',
				description: 'The private key in PEM format',
			},
			{
				displayName: 'Certificate Chain',
				name: 'certificateChain',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['certificate'],
						operation: ['add'],
					},
				},
				default: '',
				placeholder: '-----BEGIN CERTIFICATE-----\n...',
				description: 'The certificate chain (optional)',
			},
			// Project update fields
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Default Branch',
						name: 'defaultBranch',
						type: 'string',
						default: '',
						placeholder: 'main',
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

				if (resource === 'project') {
					if (operation === 'get') {
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/webPaaS/${serviceName}`;
					} else if (operation === 'getAll') {
						path = '/webPaaS';
					} else if (operation === 'create') {
						method = 'POST';
						const projectName = this.getNodeParameter('projectName', i) as string;
						const planId = this.getNodeParameter('planId', i) as string;
						const region = this.getNodeParameter('region', i) as string;

						path = '/order/webPaaS/new';
						body = {
							projectName,
							planCode: planId,
							region,
						};
					} else if (operation === 'delete') {
						method = 'DELETE';
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/webPaaS/${serviceName}/terminate`;
					} else if (operation === 'update') {
						method = 'PUT';
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						path = `/webPaaS/${serviceName}`;

						if (updateFields.title) body.title = updateFields.title;
						if (updateFields.defaultBranch) body.default_branch = updateFields.defaultBranch;
					}
				} else if (resource === 'subscription') {
					if (operation === 'get') {
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/webPaaS/${serviceName}/serviceInfos`;
					} else if (operation === 'getAll') {
						path = '/webPaaS';
					}
				} else if (resource === 'environment') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					const projectId = this.getNodeParameter('projectId', i) as string;

					if (operation === 'get') {
						const environmentId = this.getNodeParameter('environmentId', i) as string;
						path = `/webPaaS/${serviceName}/project/${projectId}/environment/${environmentId}`;
					} else if (operation === 'getAll') {
						path = `/webPaaS/${serviceName}/project/${projectId}/environment`;
					} else if (operation === 'activate') {
						method = 'POST';
						const environmentId = this.getNodeParameter('environmentId', i) as string;
						path = `/webPaaS/${serviceName}/project/${projectId}/environment/${environmentId}/activate`;
					} else if (operation === 'deactivate') {
						method = 'POST';
						const environmentId = this.getNodeParameter('environmentId', i) as string;
						path = `/webPaaS/${serviceName}/project/${projectId}/environment/${environmentId}/deactivate`;
					}
				} else if (resource === 'deployment') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					const projectId = this.getNodeParameter('projectId', i) as string;

					if (operation === 'get') {
						const deploymentId = this.getNodeParameter('deploymentId', i) as string;
						path = `/webPaaS/${serviceName}/project/${projectId}/deployment/${deploymentId}`;
					} else if (operation === 'getAll') {
						const environmentId = this.getNodeParameter('environmentId', i) as string;
						path = `/webPaaS/${serviceName}/project/${projectId}/environment/${environmentId}/deployment`;
					} else if (operation === 'trigger') {
						method = 'POST';
						const environmentId = this.getNodeParameter('environmentId', i) as string;
						path = `/webPaaS/${serviceName}/project/${projectId}/environment/${environmentId}/redeploy`;
					}
				} else if (resource === 'user') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					const projectId = this.getNodeParameter('projectId', i) as string;

					if (operation === 'get') {
						const userId = this.getNodeParameter('userId', i) as string;
						path = `/webPaaS/${serviceName}/project/${projectId}/user/${userId}`;
					} else if (operation === 'getAll') {
						path = `/webPaaS/${serviceName}/project/${projectId}/user`;
					} else if (operation === 'add') {
						method = 'POST';
						const userEmail = this.getNodeParameter('userEmail', i) as string;
						const userRole = this.getNodeParameter('userRole', i) as string;
						path = `/webPaaS/${serviceName}/project/${projectId}/user`;
						body = {
							email: userEmail,
							role: userRole,
						};
					} else if (operation === 'remove') {
						method = 'DELETE';
						const userId = this.getNodeParameter('userId', i) as string;
						path = `/webPaaS/${serviceName}/project/${projectId}/user/${userId}`;
					} else if (operation === 'update') {
						method = 'PUT';
						const userId = this.getNodeParameter('userId', i) as string;
						const userRole = this.getNodeParameter('userRole', i) as string;
						path = `/webPaaS/${serviceName}/project/${projectId}/user/${userId}`;
						body = { role: userRole };
					}
				} else if (resource === 'certificate') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					const projectId = this.getNodeParameter('projectId', i) as string;
					const environmentId = this.getNodeParameter('environmentId', i) as string;

					if (operation === 'get') {
						const certificateId = this.getNodeParameter('certificateId', i) as string;
						path = `/webPaaS/${serviceName}/project/${projectId}/environment/${environmentId}/certificate/${certificateId}`;
					} else if (operation === 'getAll') {
						path = `/webPaaS/${serviceName}/project/${projectId}/environment/${environmentId}/certificate`;
					} else if (operation === 'add') {
						method = 'POST';
						const certificate = this.getNodeParameter('certificate', i) as string;
						const privateKey = this.getNodeParameter('privateKey', i) as string;
						const certificateChain = this.getNodeParameter('certificateChain', i) as string;

						path = `/webPaaS/${serviceName}/project/${projectId}/environment/${environmentId}/certificate`;
						body = {
							certificate,
							key: privateKey,
						};
						if (certificateChain) body.chain = certificateChain;
					} else if (operation === 'delete') {
						method = 'DELETE';
						const certificateId = this.getNodeParameter('certificateId', i) as string;
						path = `/webPaaS/${serviceName}/project/${projectId}/environment/${environmentId}/certificate/${certificateId}`;
					}
				} else if (resource === 'capability') {
					if (operation === 'getAll') {
						path = '/webPaaS/capabilities';
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
