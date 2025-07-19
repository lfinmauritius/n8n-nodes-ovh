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


export class OvhDatabase implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OVH Database',
		name: 'ovhDatabase',
		icon: 'file:ovh.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage OVH Managed Databases',
		defaults: {
			name: 'OVH Database',
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
						name: 'Availability',
						value: 'availability',
					},
					{
						name: 'Backup',
						value: 'backup',
					},
					{
						name: 'Capability',
						value: 'capability',
					},
					{
						name: 'Database',
						value: 'database',
					},
					{
						name: 'Service',
						value: 'service',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'service',
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
						name: 'Create',
						value: 'create',
						description: 'Create a new database service',
						action: 'Create a new database service',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a database service',
						action: 'Delete a database service',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get database service information',
						action: 'Get database service information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many database services',
						action: 'Get many database services',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update database service',
						action: 'Update database service',
					},
				],
				default: 'get',
			},
			// Database operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['database'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new database',
						action: 'Create a new database',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a database',
						action: 'Delete a database',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get database information',
						action: 'Get database information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many databases',
						action: 'Get many databases',
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
						description: 'Create a new database user',
						action: 'Create a new database user',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a database user',
						action: 'Delete a database user',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get database user information',
						action: 'Get database user information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many database users',
						action: 'Get many database users',
					},
					{
						name: 'Reset Password',
						value: 'resetPassword',
						description: 'Reset user password',
						action: 'Reset user password',
					},
				],
				default: 'get',
			},
			// Backup operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['backup'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a backup',
						action: 'Create a backup',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a backup',
						action: 'Delete a backup',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get backup information',
						action: 'Get backup information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many backups',
						action: 'Get many backups',
					},
					{
						name: 'Restore',
						value: 'restore',
						description: 'Restore from backup',
						action: 'Restore from backup',
					},
				],
				default: 'get',
			},
			// Availability operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['availability'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many availabilities',
						action: 'Get many availabilities',
					},
				],
				default: 'getAll',
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
			// Service ID field
			{
				displayName: 'Service ID',
				name: 'serviceId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['service', 'database', 'user', 'backup'],
						operation: ['get', 'delete', 'update', 'create', 'getAll', 'resetPassword', 'restore'],
					},
					hide: {
						resource: ['service'],
						operation: ['getAll', 'create'],
					},
				},
				description: 'The database service ID',
			},
			// Database ID field
			{
				displayName: 'Database ID',
				name: 'databaseId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['database'],
						operation: ['get', 'delete'],
					},
				},
				description: 'The unique identifier of the database',
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
						operation: ['get', 'delete', 'resetPassword'],
					},
				},
				description: 'The database user ID',
			},
			// Backup ID field
			{
				displayName: 'Backup ID',
				name: 'backupId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['backup'],
						operation: ['get', 'delete', 'restore'],
					},
				},
				description: 'The unique identifier of the backup',
			},
			// Service creation fields
			{
				displayName: 'Engine',
				name: 'engine',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['service'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'MySQL',
						value: 'mysql',
					},
					{
						name: 'PostgreSQL',
						value: 'postgresql',
					},
					{
						name: 'Redis',
						value: 'redis',
					},
					{
						name: 'MongoDB',
						value: 'mongodb',
					},
				],
				default: 'mysql',
				required: true,
				description: 'The database engine',
			},
			{
				displayName: 'Version',
				name: 'version',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['service'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: '8.0',
				description: 'The database version',
			},
			{
				displayName: 'Plan',
				name: 'plan',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['service'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: 'essential',
				description: 'The service plan',
			},
			{
				displayName: 'Flavor',
				name: 'flavor',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['service'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: 'db1-4',
				description: 'The instance flavor',
			},
			// Database creation fields
			{
				displayName: 'Database Name',
				name: 'databaseName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['database'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: 'mydatabase',
				description: 'The name for the new database',
			},
			// User creation fields
			{
				displayName: 'Username',
				name: 'username',
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
				description: 'The username for the new database user',
			},
			// Service update fields
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['service'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Service description',
					},
					{
						displayName: 'Maintenance Time',
						name: 'maintenanceTime',
						type: 'string',
						default: '',
						placeholder: '02:00:00',
						description: 'Maintenance window time (HH:MM:SS)',
					},
					{
						displayName: 'Backup Time',
						name: 'backupTime',
						type: 'string',
						default: '',
						placeholder: '03:00:00',
						description: 'Backup time (HH:MM:SS)',
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

				if (resource === 'service') {
					if (operation === 'get') {
						const serviceId = this.getNodeParameter('serviceId', i) as string;
						path = `/cloud/project/${projectId}/database/service/${serviceId}`;
					} else if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/database/service`;
					} else if (operation === 'create') {
						method = 'POST';
						const engine = this.getNodeParameter('engine', i) as string;
						const version = this.getNodeParameter('version', i) as string;
						const plan = this.getNodeParameter('plan', i) as string;
						const flavor = this.getNodeParameter('flavor', i) as string;
						
						path = `/cloud/project/${projectId}/database/${engine}`;
						body = {
							version,
							plan,
							flavor,
						};
					} else if (operation === 'delete') {
						method = 'DELETE';
						const serviceId = this.getNodeParameter('serviceId', i) as string;
						path = `/cloud/project/${projectId}/database/service/${serviceId}`;
					} else if (operation === 'update') {
						method = 'PUT';
						const serviceId = this.getNodeParameter('serviceId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						path = `/cloud/project/${projectId}/database/service/${serviceId}`;
						
						if (updateFields.description) body.description = updateFields.description;
						if (updateFields.maintenanceTime) body.maintenanceTime = updateFields.maintenanceTime;
						if (updateFields.backupTime) body.backupTime = updateFields.backupTime;
					}
				} else if (resource === 'database') {
					const serviceId = this.getNodeParameter('serviceId', i) as string;
					
					if (operation === 'get') {
						const databaseId = this.getNodeParameter('databaseId', i) as string;
						path = `/cloud/project/${projectId}/database/service/${serviceId}/database/${databaseId}`;
					} else if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/database/service/${serviceId}/database`;
					} else if (operation === 'create') {
						method = 'POST';
						const databaseName = this.getNodeParameter('databaseName', i) as string;
						path = `/cloud/project/${projectId}/database/service/${serviceId}/database`;
						body = { name: databaseName };
					} else if (operation === 'delete') {
						method = 'DELETE';
						const databaseId = this.getNodeParameter('databaseId', i) as string;
						path = `/cloud/project/${projectId}/database/service/${serviceId}/database/${databaseId}`;
					}
				} else if (resource === 'user') {
					const serviceId = this.getNodeParameter('serviceId', i) as string;
					
					if (operation === 'get') {
						const userId = this.getNodeParameter('userId', i) as string;
						path = `/cloud/project/${projectId}/database/service/${serviceId}/user/${userId}`;
					} else if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/database/service/${serviceId}/user`;
					} else if (operation === 'create') {
						method = 'POST';
						const username = this.getNodeParameter('username', i) as string;
						path = `/cloud/project/${projectId}/database/service/${serviceId}/user`;
						body = { name: username };
					} else if (operation === 'delete') {
						method = 'DELETE';
						const userId = this.getNodeParameter('userId', i) as string;
						path = `/cloud/project/${projectId}/database/service/${serviceId}/user/${userId}`;
					} else if (operation === 'resetPassword') {
						method = 'POST';
						const userId = this.getNodeParameter('userId', i) as string;
						path = `/cloud/project/${projectId}/database/service/${serviceId}/user/${userId}/credentials/reset`;
					}
				} else if (resource === 'backup') {
					const serviceId = this.getNodeParameter('serviceId', i) as string;
					
					if (operation === 'get') {
						const backupId = this.getNodeParameter('backupId', i) as string;
						path = `/cloud/project/${projectId}/database/service/${serviceId}/backup/${backupId}`;
					} else if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/database/service/${serviceId}/backup`;
					} else if (operation === 'create') {
						method = 'POST';
						path = `/cloud/project/${projectId}/database/service/${serviceId}/backup`;
					} else if (operation === 'delete') {
						method = 'DELETE';
						const backupId = this.getNodeParameter('backupId', i) as string;
						path = `/cloud/project/${projectId}/database/service/${serviceId}/backup/${backupId}`;
					} else if (operation === 'restore') {
						method = 'POST';
						const backupId = this.getNodeParameter('backupId', i) as string;
						path = `/cloud/project/${projectId}/database/service/${serviceId}/backup/${backupId}/restore`;
					}
				} else if (resource === 'availability') {
					if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/database/availability`;
					}
				} else if (resource === 'capability') {
					if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/database/capabilities`;
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