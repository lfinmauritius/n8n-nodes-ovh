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

export class OvhAi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OVH AI',
		name: 'ovhAi',
		icon: 'file:ovh.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage OVH AI and Machine Learning services',
		defaults: {
			name: 'OVH AI',
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
						name: 'App',
						value: 'app',
					},
					{
						name: 'Job',
						value: 'job',
					},
					{
						name: 'Model',
						value: 'model',
					},
					{
						name: 'Notebook',
						value: 'notebook',
					},
					{
						name: 'Project',
						value: 'project',
					},
				],
				default: 'app',
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
						name: 'Get',
						value: 'get',
						description: 'Get project information',
						action: 'Get project information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many projects',
						action: 'Get many projects',
					},
				],
				default: 'get',
			},
			// App operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['app'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new AI app',
						action: 'Create a new AI app',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an AI app',
						action: 'Delete an AI app',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get AI app information',
						action: 'Get AI app information',
					},
					{
						name: 'Get Logs',
						value: 'getLogs',
						description: 'Get AI app logs',
						action: 'Get AI app logs',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many AI apps',
						action: 'Get many AI apps',
					},
					{
						name: 'Start',
						value: 'start',
						description: 'Start an AI app',
						action: 'Start an AI app',
					},
					{
						name: 'Stop',
						value: 'stop',
						description: 'Stop an AI app',
						action: 'Stop an AI app',
					},
				],
				default: 'get',
			},
			// Job operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['job'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new training job',
						action: 'Create a new training job',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a training job',
						action: 'Delete a training job',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get training job information',
						action: 'Get training job information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many training jobs',
						action: 'Get many training jobs',
					},
				],
				default: 'get',
			},
			// Model operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['model'],
					},
				},
				options: [
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a model',
						action: 'Delete a model',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get model information',
						action: 'Get model information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many models',
						action: 'Get many models',
					},
				],
				default: 'get',
			},
			// Notebook operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['notebook'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new notebook',
						action: 'Create a new notebook',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a notebook',
						action: 'Delete a notebook',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get notebook information',
						action: 'Get notebook information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many notebooks',
						action: 'Get many notebooks',
					},
					{
						name: 'Start',
						value: 'start',
						description: 'Start a notebook',
						action: 'Start a notebook',
					},
					{
						name: 'Stop',
						value: 'stop',
						description: 'Stop a notebook',
						action: 'Stop a notebook',
					},
				],
				default: 'get',
			},
			// Project ID for cloud resources
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['app', 'job', 'model', 'notebook'],
					},
				},
				placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
				description: 'The cloud project ID',
			},
			// Project ID for project resource (only for get operation)
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['get'],
					},
				},
				placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
				description: 'The cloud project ID',
			},
			// App ID field
			{
				displayName: 'App ID',
				name: 'appId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['app'],
						operation: ['get', 'delete', 'getLogs', 'start', 'stop'],
					},
				},
				description: 'The AI app ID',
			},
			// Job ID field
			{
				displayName: 'Job ID',
				name: 'jobId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['get', 'delete'],
					},
				},
				description: 'The training job ID',
			},
			// Model ID field
			{
				displayName: 'Model ID',
				name: 'modelId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['model'],
						operation: ['get', 'delete'],
					},
				},
				description: 'The model ID to operate on',
			},
			// Notebook ID field
			{
				displayName: 'Notebook ID',
				name: 'notebookId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['notebook'],
						operation: ['get', 'delete', 'start', 'stop'],
					},
				},
				description: 'The notebook ID to operate on',
			},
			// App creation fields
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['app'],
						operation: ['create'],
					},
				},
				placeholder: 'my-ai-app',
				description: 'Name of the AI app',
			},
			{
				displayName: 'Image',
				name: 'image',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['app'],
						operation: ['create'],
					},
				},
				placeholder: 'tensorflow/tensorflow:latest',
				description: 'Docker image to use for the app',
			},
			{
				displayName: 'Region',
				name: 'region',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['app'],
						operation: ['create'],
					},
				},
				placeholder: 'GRA',
				description: 'Region where to deploy the app (e.g., GRA, BHS, etc.)',
			},
			{
				displayName: 'Resources',
				name: 'resources',
				type: 'collection',
				placeholder: 'Add Resource',
				default: {},
				displayOptions: {
					show: {
						resource: ['app'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'CPU',
						name: 'cpu',
						type: 'number',
						default: 1,
						description: 'Number of CPU cores',
					},
					{
						displayName: 'Memory (MB)',
						name: 'memory',
						type: 'number',
						default: 1024,
						placeholder: '1024',
						description: 'Memory allocation in MB (e.g., 1024 for 1GB)',
					},
					{
						displayName: 'GPU',
						name: 'gpu',
						type: 'number',
						default: 0,
						description: 'Number of GPU units',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['app'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Default HTTP Port',
						name: 'defaultHttpPort',
						type: 'number',
						default: 8080,
						description: 'Default HTTP port for the app',
					},
					{
						displayName: 'Environment Variables',
						name: 'env',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						placeholder: 'Add Environment Variable',
						options: [
							{
								name: 'variable',
								displayName: 'Variable',
								values: [
									{
										displayName: 'Name',
										name: 'name',
										type: 'string',
										default: '',
										description: 'Environment variable name',
									},
									{
										displayName: 'Value',
										name: 'value',
										type: 'string',
										default: '',
										description: 'Environment variable value',
									},
								],
							},
						],
					},
					{
						displayName: 'Partner ID',
						name: 'partnerId',
						type: 'string',
						default: '',
						description: 'Partner ID (optional)',
					},
					{
						displayName: 'Port',
						name: 'port',
						type: 'number',
						default: 8080,
						description: 'Port to expose',
					},
					{
						displayName: 'Probe',
						name: 'probe',
						type: 'collection',
						default: {},
						placeholder: 'Add Probe',
						options: [
							{
								displayName: 'Path',
								name: 'path',
								type: 'string',
								default: '/health',
								description: 'Health check path',
							},
							{
								displayName: 'Port',
								name: 'port',
								type: 'number',
								default: 8080,
								description: 'Health check port',
							},
							{
								displayName: 'Initial Delay Seconds',
								name: 'initialDelaySeconds',
								type: 'number',
								default: 30,
								description: 'Number of seconds after the container has started before probes are initiated',
							},
						],
					},
					{
						displayName: 'Scaling Strategy',
						name: 'scalingStrategy',
						type: 'options',
						options: [
							{
								name: 'Fixed',
								value: 'fixed',
							},
							{
								name: 'Automatic',
								value: 'automatic',
							},
						],
						default: 'fixed',
						description: 'Scaling strategy for the app',
					},
					{
						displayName: 'Volumes',
						name: 'volumes',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						placeholder: 'Add Volume',
						options: [
							{
								name: 'volume',
								displayName: 'Volume',
								values: [
									{
										displayName: 'Mount Path',
										name: 'mountPath',
										type: 'string',
										default: '',
										placeholder: '/data',
										description: 'Path where to mount the volume',
									},
									{
										displayName: 'Size (GB)',
										name: 'size',
										type: 'number',
										default: 10,
										placeholder: '10',
										description: 'Size of the volume in GB',
									},
								],
							},
						],
					},
				],
			},
			// Job creation fields
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['create'],
					},
				},
				placeholder: 'my-training-job',
				description: 'Name of the training job',
			},
			{
				displayName: 'Image',
				name: 'image',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['create'],
					},
				},
				placeholder: 'tensorflow/tensorflow:latest',
				description: 'Docker image to use for the training job',
			},
			{
				displayName: 'Region',
				name: 'region',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['create'],
					},
				},
				placeholder: 'GRA',
				description: 'Region where to run the job (e.g., GRA, BHS, etc.)',
			},
			{
				displayName: 'Resources',
				name: 'resources',
				type: 'collection',
				placeholder: 'Add Resource',
				default: {},
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'CPU',
						name: 'cpu',
						type: 'number',
						default: 1,
						description: 'Number of CPU cores',
					},
					{
						displayName: 'Memory (MB)',
						name: 'memory',
						type: 'number',
						default: 1024,
						placeholder: '1024',
						description: 'Memory allocation in MB (e.g., 1024 for 1GB)',
					},
					{
						displayName: 'GPU',
						name: 'gpu',
						type: 'number',
						default: 0,
						description: 'Number of GPU units',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Command',
						name: 'command',
						type: 'string',
						default: '',
						placeholder: 'python train.py',
						description: 'Command to run in the job',
					},
					{
						displayName: 'Environment Variables',
						name: 'env',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						placeholder: 'Add Environment Variable',
						options: [
							{
								name: 'variable',
								displayName: 'Variable',
								values: [
									{
										displayName: 'Name',
										name: 'name',
										type: 'string',
										default: '',
										description: 'Environment variable name',
									},
									{
										displayName: 'Value',
										name: 'value',
										type: 'string',
										default: '',
										description: 'Environment variable value',
									},
								],
							},
						],
					},
					{
						displayName: 'Partner ID',
						name: 'partnerId',
						type: 'string',
						default: '',
						description: 'Partner ID (optional)',
					},
					{
						displayName: 'Timeout',
						name: 'timeout',
						type: 'number',
						default: 3600,
						description: 'Job timeout in seconds',
					},
					{
						displayName: 'Volumes',
						name: 'volumes',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						placeholder: 'Add Volume',
						options: [
							{
								name: 'volume',
								displayName: 'Volume',
								values: [
									{
										displayName: 'Mount Path',
										name: 'mountPath',
										type: 'string',
										default: '',
										placeholder: '/data',
										description: 'Path where to mount the volume',
									},
									{
										displayName: 'Size (GB)',
										name: 'size',
										type: 'number',
										default: 10,
										placeholder: '10',
										description: 'Size of the volume in GB',
									},
								],
							},
						],
					},
				],
			},
			// Notebook creation fields
			{
				displayName: 'Notebook Framework',
				name: 'framework',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['notebook'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'Jupyter',
						value: 'jupyter',
					},
					{
						name: 'JupyterLab',
						value: 'jupyterlab',
					},
					{
						name: 'VSCode',
						value: 'vscode',
					},
				],
				default: 'jupyter',
				description: 'The notebook framework to use',
			},
			{
				displayName: 'Environment',
				name: 'environment',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['notebook'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'TensorFlow',
						value: 'tensorflow',
					},
					{
						name: 'PyTorch',
						value: 'pytorch',
					},
					{
						name: 'Scikit-Learn',
						value: 'sklearn',
					},
					{
						name: 'R',
						value: 'r',
					},
				],
				default: 'tensorflow',
				description: 'The ML environment to use',
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
						const projectId = (this.getNodeParameter('projectId', i) as string).trim();
						path = `/cloud/project/${projectId}`;
					} else if (operation === 'getAll') {
						path = '/cloud/project';
					}
				} else if (resource === 'app') {
					const projectId = (this.getNodeParameter('projectId', i) as string).trim();

					if (operation === 'get') {
						const appId = (this.getNodeParameter('appId', i) as string).trim();
						path = `/cloud/project/${projectId}/ai/app/${appId}`;
					} else if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/ai/app`;
					} else if (operation === 'getLogs') {
						const appId = (this.getNodeParameter('appId', i) as string).trim();
						path = `/cloud/project/${projectId}/ai/app/${appId}/log`;
					} else if (operation === 'start') {
						method = 'PUT';
						const appId = (this.getNodeParameter('appId', i) as string).trim();
						path = `/cloud/project/${projectId}/ai/app/${appId}/start`;
					} else if (operation === 'stop') {
						method = 'PUT';
						const appId = (this.getNodeParameter('appId', i) as string).trim();
						path = `/cloud/project/${projectId}/ai/app/${appId}/stop`;
					} else if (operation === 'create') {
						method = 'POST';
						const name = this.getNodeParameter('name', i) as string;
						const image = this.getNodeParameter('image', i) as string;
						const region = this.getNodeParameter('region', i) as string;
						const resources = this.getNodeParameter('resources', i) as IDataObject;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						path = `/cloud/project/${projectId}/ai/app`;

						body = { name, image, region };
						
						// Add resources as a nested object
						const resourcesObj: IDataObject = {};
						if (resources.cpu !== undefined) resourcesObj.cpu = resources.cpu;
						if (resources.memory) resourcesObj.memory = resources.memory;
						if (resources.gpu !== undefined) resourcesObj.gpu = resources.gpu;
						
						// Always include resources object (required by API)
						body.resources = resourcesObj;
						
						// Add additional fields
						if (additionalFields.port) body.port = additionalFields.port;
						if (additionalFields.defaultHttpPort) body.defaultHttpPort = additionalFields.defaultHttpPort;
						if (additionalFields.scalingStrategy) body.scalingStrategy = additionalFields.scalingStrategy;
						if (additionalFields.partnerId) body.partnerId = additionalFields.partnerId;
						
						// Handle environment variables
						if (additionalFields.env) {
							const envVars = (additionalFields.env as any).variable || [];
							if (envVars.length > 0) {
								const envObject: IDataObject = {};
								envVars.forEach((envVar: any) => {
									if (envVar.name && envVar.value) {
										envObject[envVar.name] = envVar.value;
									}
								});
								body.env = envObject;
							}
						}
						
						// Handle volumes
						if (additionalFields.volumes) {
							const volumes = (additionalFields.volumes as any).volume || [];
							if (volumes.length > 0) {
								body.volumes = volumes.map((vol: any) => ({
									mountPath: vol.mountPath,
									size: vol.size,
								}));
							}
						}
						
						// Handle probe
						if (additionalFields.probe && Object.keys(additionalFields.probe).length > 0) {
							body.probe = additionalFields.probe;
						}
					} else if (operation === 'delete') {
						method = 'DELETE';
						const appId = (this.getNodeParameter('appId', i) as string).trim();
						path = `/cloud/project/${projectId}/ai/app/${appId}`;
					}
				} else if (resource === 'job') {
					const projectId = (this.getNodeParameter('projectId', i) as string).trim();

					if (operation === 'get') {
						const jobId = this.getNodeParameter('jobId', i) as string;
						path = `/cloud/project/${projectId}/ai/job/${jobId}`;
					} else if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/ai/job`;
					} else if (operation === 'create') {
						method = 'POST';
						const name = this.getNodeParameter('name', i) as string;
						const image = this.getNodeParameter('image', i) as string;
						const region = this.getNodeParameter('region', i) as string;
						const resources = this.getNodeParameter('resources', i) as IDataObject;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						path = `/cloud/project/${projectId}/ai/job`;

						body = { name, image, region };
						
						// Add resources as a nested object
						const resourcesObj: IDataObject = {};
						if (resources.cpu !== undefined) resourcesObj.cpu = resources.cpu;
						if (resources.memory) resourcesObj.memory = resources.memory;
						if (resources.gpu !== undefined) resourcesObj.gpu = resources.gpu;
						
						// Always include resources object (required by API)
						body.resources = resourcesObj;
						
						// Add additional fields
						if (additionalFields.command) body.command = additionalFields.command;
						if (additionalFields.timeout) body.timeout = additionalFields.timeout;
						if (additionalFields.partnerId) body.partnerId = additionalFields.partnerId;
						
						// Handle environment variables
						if (additionalFields.env) {
							const envVars = (additionalFields.env as any).variable || [];
							if (envVars.length > 0) {
								const envObject: IDataObject = {};
								envVars.forEach((envVar: any) => {
									if (envVar.name && envVar.value) {
										envObject[envVar.name] = envVar.value;
									}
								});
								body.env = envObject;
							}
						}
						
						// Handle volumes
						if (additionalFields.volumes) {
							const volumes = (additionalFields.volumes as any).volume || [];
							if (volumes.length > 0) {
								body.volumes = volumes.map((vol: any) => ({
									mountPath: vol.mountPath,
									size: vol.size,
								}));
							}
						}
					} else if (operation === 'delete') {
						method = 'DELETE';
						const jobId = (this.getNodeParameter('jobId', i) as string).trim();
						path = `/cloud/project/${projectId}/ai/job/${jobId}`;
					}
				} else if (resource === 'model') {
					const projectId = (this.getNodeParameter('projectId', i) as string).trim();

					// Debug: Return debug info for Model operations
					returnData.push({
						debug: true,
						resource: 'model',
						operation: operation,
						projectId: projectId,
						modelId: operation === 'get' || operation === 'delete' ? 
							(this.getNodeParameter('modelId', i) as string).trim() : 'N/A',
						message: 'Debug mode - Model operations may not exist in OVH AI API',
						expectedPath: operation === 'get' || operation === 'delete' ? 
							`/cloud/project/${projectId}/ai/model/${(this.getNodeParameter('modelId', i) as string).trim()}` :
							`/cloud/project/${projectId}/ai/model`
					});
					continue;
				} else if (resource === 'notebook') {
					const projectId = (this.getNodeParameter('projectId', i) as string).trim();

					if (operation === 'get') {
						const notebookId = (this.getNodeParameter('notebookId', i) as string).trim();
						path = `/cloud/project/${projectId}/ai/notebook/${notebookId}`;
					} else if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/ai/notebook`;
					} else if (operation === 'create') {
						method = 'POST';
						const framework = this.getNodeParameter('framework', i) as string;
						const environment = this.getNodeParameter('environment', i) as string;
						path = `/cloud/project/${projectId}/ai/notebook`;

						body = { framework, environment };
					} else if (operation === 'delete') {
						method = 'DELETE';
						const notebookId = (this.getNodeParameter('notebookId', i) as string).trim();
						path = `/cloud/project/${projectId}/ai/notebook/${notebookId}`;
					} else if (operation === 'start') {
						method = 'POST';
						const notebookId = (this.getNodeParameter('notebookId', i) as string).trim();
						path = `/cloud/project/${projectId}/ai/notebook/${notebookId}/start`;
					} else if (operation === 'stop') {
						method = 'POST';
						const notebookId = (this.getNodeParameter('notebookId', i) as string).trim();
						path = `/cloud/project/${projectId}/ai/notebook/${notebookId}/stop`;
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

				// Remove debug logging since console.log doesn't work in n8n

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

				// Handle different response types based on operation
				if (operation === 'delete') {
					// Delete operations typically return empty response on success
					if (!responseData || (Array.isArray(responseData) && responseData.length === 0) || 
						(typeof responseData === 'string' && responseData.trim() === '')) {
						// Empty response means successful deletion
						const resourceType = resource === 'job' ? 'training job' : resource;
						const resourceId = resource === 'job' ? (this.getNodeParameter('jobId', i) as string).trim() : 
											resource === 'app' ? (this.getNodeParameter('appId', i) as string).trim() :
											resource === 'model' ? (this.getNodeParameter('modelId', i) as string).trim() :
											resource === 'notebook' ? (this.getNodeParameter('notebookId', i) as string).trim() : 'resource';
						returnData.push({ 
							success: true, 
							message: `${resourceType} deleted successfully`,
							operation: operation,
							resource: resource,
							id: resourceId
						});
					} else {
						// If we get actual data back, return it
						returnData.push(responseData);
					}
				} else if (operation === 'start' || operation === 'stop') {
					// Start/Stop operations typically return success message or empty response
					if (typeof responseData === 'string' && responseData.trim() === '') {
						// Empty response means success
						returnData.push({ 
							success: true, 
							message: `${operation === 'start' ? 'Started' : 'Stopped'} successfully`,
							operation: operation 
						});
					} else if (typeof responseData === 'string') {
						try {
							const parsed = JSON.parse(responseData);
							returnData.push(parsed);
						} catch (error) {
							// If not JSON, treat as success message
							returnData.push({ 
								success: true, 
								message: responseData,
								operation: operation 
							});
						}
					} else {
						returnData.push(responseData || { 
							success: true, 
							message: `${operation === 'start' ? 'Started' : 'Stopped'} successfully`,
							operation: operation 
						});
					}
				} else {
					// Parse JSON manually for GET requests and other operations
					if (method === 'GET' && typeof responseData === 'string') {
						try {
							responseData = JSON.parse(responseData);
						} catch (error) {
							// If JSON parsing fails, keep the original response
						}
					}

					if (Array.isArray(responseData)) {
						// For arrays, add each item
						responseData.forEach((item) => {
							if (typeof item === 'string' || typeof item === 'number') {
								// For simple values, wrap in an object
								returnData.push({ value: item });
							} else {
								// For objects, add directly
								returnData.push(item);
							}
						});
					} else {
						// For single objects/values, add directly
						returnData.push(responseData);
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
