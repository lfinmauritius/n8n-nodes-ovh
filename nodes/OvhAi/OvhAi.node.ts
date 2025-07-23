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
						name: 'Datastore',
						value: 'datastore',
					},
					{
						name: 'Job',
						value: 'job',
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
			// Datastore operations
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
						name: 'Create Alias',
						value: 'createAlias',
						description: 'Create a new datastore alias',
						action: 'Create a new datastore alias',
					},
					{
						name: 'Delete Alias',
						value: 'deleteAlias',
						description: 'Delete a datastore alias',
						action: 'Delete a datastore alias',
					},
					{
						name: 'Get Alias',
						value: 'getAlias',
						description: 'Get datastore alias information',
						action: 'Get datastore alias information',
					},
					{
						name: 'Get Alias Auth',
						value: 'getAliasAuth',
						description: 'Get datastore alias authentication info',
						action: 'Get datastore alias authentication info',
					},
					{
						name: 'Get Aliases',
						value: 'getAliases',
						description: 'Get datastore aliases in a region',
						action: 'Get datastore aliases in a region',
					},
					{
						name: 'Update Alias',
						value: 'updateAlias',
						description: 'Update datastore alias credentials',
						action: 'Update datastore alias credentials',
					},
				],
				default: 'getAliases',
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
						name: 'Data Sync',
						value: 'dataSync',
						description: 'Synchronize notebook data',
						action: 'Synchronize notebook data',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a notebook',
						action: 'Delete a notebook',
					},
					{
						name: 'Fork Backup',
						value: 'forkBackup',
						description: 'Fork a backup to create new notebook',
						action: 'Fork a backup to create new notebook',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get notebook information',
						action: 'Get notebook information',
					},
					{
						name: 'Get Backup',
						value: 'getBackup',
						description: 'Get specific backup information',
						action: 'Get specific backup information',
					},
					{
						name: 'Get Backup Policy',
						value: 'getBackupPolicy',
						description: 'Get workspace backup retention policy',
						action: 'Get workspace backup retention policy',
					},
					{
						name: 'Get Backups',
						value: 'getBackups',
						description: 'Get notebook backups',
						action: 'Get notebook backups',
					},
					{
						name: 'Get Logs',
						value: 'getLogs',
						description: 'Get notebook logs',
						action: 'Get notebook logs',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many notebooks',
						action: 'Get many notebooks',
					},
					{
						name: 'Restart',
						value: 'restart',
						description: 'Restart a notebook',
						action: 'Restart a notebook',
					},
					{
						name: 'Run Command',
						value: 'runCommand',
						description: 'Run a command on notebooks',
						action: 'Run a command on notebooks',
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
					{
						name: 'Update Backup Policy',
						value: 'updateBackupPolicy',
						description: 'Update workspace backup retention policy',
						action: 'Update workspace backup retention policy',
					},
					{
						name: 'Update Labels',
						value: 'updateLabels',
						description: 'Update notebook labels',
						action: 'Update notebook labels',
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
						resource: ['app', 'job', 'notebook', 'datastore'],
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
						operation: ['get', 'delete', 'start', 'stop', 'getBackups', 'getBackup', 'forkBackup', 'dataSync', 'updateLabels', 'getLogs', 'restart', 'getBackupPolicy', 'updateBackupPolicy'],
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
			// Datastore region field
			{
				displayName: 'Region',
				name: 'region',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['datastore'],
						operation: ['createAlias', 'deleteAlias', 'getAlias', 'getAliasAuth', 'getAliases', 'updateAlias'],
					},
				},
				placeholder: 'GRA',
				description: 'The region where data is stored (e.g., GRA, BHS)',
			},
			// Datastore alias field
			{
				displayName: 'Alias',
				name: 'alias',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['datastore'],
						operation: ['deleteAlias', 'getAlias', 'getAliasAuth'],
					},
				},
				placeholder: 'my-data-alias',
				description: 'The datastore alias name',
			},
			// Datastore alias creation fields
			{
				displayName: 'Alias Name',
				name: 'aliasName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['datastore'],
						operation: ['createAlias'],
					},
				},
				placeholder: 'my-data-alias',
				description: 'Name of the datastore alias to create',
			},
			{
				displayName: 'Access Key',
				name: 'accessKey',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['datastore'],
						operation: ['createAlias'],
					},
				},
				placeholder: 'your-access-key',
				description: 'Access key for the storage credentials',
			},
			{
				displayName: 'Secret Key',
				name: 'secretKey',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['datastore'],
						operation: ['createAlias'],
					},
				},
				placeholder: 'your-secret-key',
				description: 'Secret key for the storage credentials',
			},
			{
				displayName: 'Endpoint (Optional)',
				name: 'storageEndpoint',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['datastore'],
						operation: ['createAlias'],
					},
				},
				placeholder: 's3.region.cloud.ovh.net',
				description: 'Custom storage endpoint (optional)',
			},
			// Datastore alias update fields
			{
				displayName: 'Access Key',
				name: 'updateAccessKey',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['datastore'],
						operation: ['updateAlias'],
					},
				},
				placeholder: 'your-new-access-key',
				description: 'New access key for the storage credentials',
			},
			{
				displayName: 'Secret Key',
				name: 'updateSecretKey',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['datastore'],
						operation: ['updateAlias'],
					},
				},
				placeholder: 'your-new-secret-key',
				description: 'New secret key for the storage credentials',
			},
			{
				displayName: 'Endpoint (Optional)',
				name: 'updateStorageEndpoint',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['datastore'],
						operation: ['updateAlias'],
					},
				},
				placeholder: 's3.region.cloud.ovh.net',
				description: 'New custom storage endpoint (optional)',
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
			// Notebook additional parameters
			{
				displayName: 'Notebook Name',
				name: 'notebookName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['notebook'],
						operation: ['create'],
					},
				},
				placeholder: 'my-notebook',
				description: 'Name of the notebook to create',
			},
			{
				displayName: 'Region',
				name: 'notebookRegion',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['notebook'],
						operation: ['create'],
					},
				},
				placeholder: 'GRA',
				description: 'The region where to deploy the notebook (e.g., GRA, BHS)',
			},
			{
				displayName: 'Flavor',
				name: 'flavor',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['notebook'],
						operation: ['create'],
					},
				},
				placeholder: 'l4-1-gpu',
				description: 'The flavor ID for the notebook (e.g., l4-1-gpu, ai1-1-gpu, ai1-4-cpu)',
			},
			{
				displayName: 'CPU',
				name: 'notebookCpu',
				type: 'number',
				default: 1,
				displayOptions: {
					show: {
						resource: ['notebook'],
						operation: ['create'],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 28,
				},
				description: 'Number of CPU cores (1-28)',
			},
			{
				displayName: 'GPU',
				name: 'notebookGpu',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						resource: ['notebook'],
						operation: ['create'],
					},
				},
				typeOptions: {
					minValue: 0,
					maxValue: 4,
				},
				description: 'Number of GPU units (0-4)',
			},
			{
				displayName: 'Memory (GB)',
				name: 'notebookMemory',
				type: 'number',
				default: 8,
				required: true,
				displayOptions: {
					show: {
						resource: ['notebook'],
						operation: ['create'],
					},
				},
				placeholder: '8',
				description: 'Memory allocation in GB (e.g., 8, 16, 32, 80 for GPU instances)',
			},
			{
				displayName: 'Additional Fields',
				name: 'notebookAdditionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['notebook'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Authorized IPs',
						name: 'authorizedIps',
						type: 'string',
						typeOptions: {
							rows: 3,
						},
						default: '',
						placeholder: '192.168.1.0/24\n10.0.0.0/8',
						description: 'Authorized IP addresses or CIDR blocks (one per line)',
					},
					{
						displayName: 'Custom Framework Version',
						name: 'customFrameworkVersion',
						type: 'string',
						default: '',
						placeholder: '2.7.1-py312-cudadevel128-gpu',
						description: 'Override the default framework version with a specific version (e.g., 2.7.1-py312-cudadevel128-gpu). Leave empty to use default.',
					},
					{
						displayName: 'Environment Variables',
						name: 'envVars',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						description: 'Environment variables to set in the notebook',
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
										description: 'Variable name',
									},
									{
										displayName: 'Value',
										name: 'value',
										type: 'string',
										default: '',
										description: 'Variable value',
									},
								],
							},
						],
					},
					{
						displayName: 'Labels',
						name: 'labels',
						type: 'json',
						default: '{}',
						placeholder: '{"key": "value"}',
						description: 'Labels to add to the notebook as JSON object',
					},
					{
						displayName: 'SSH Public Keys',
						name: 'sshPublicKeys',
						type: 'string',
						typeOptions: {
							rows: 3,
						},
						default: '',
						placeholder: 'ssh-rsa AAAAB3NzaC1...',
						description: 'SSH public keys (one per line) for SSH access',
					},
					{
						displayName: 'Timeout',
						name: 'timeout',
						type: 'number',
						default: 0,
						placeholder: '3600',
						description: 'Timeout in seconds (0 for no timeout)',
					},
					{
						displayName: 'Timeout Auto Restart',
						name: 'timeoutAutoRestart',
						type: 'boolean',
						default: false,
						description: 'Whether to auto-restart on timeout',
					},
					{
						displayName: 'Unsecure HTTP',
						name: 'unsecureHttp',
						type: 'boolean',
						default: false,
						description: 'Whether to allow unsecure HTTP connections',
					},
					{
						displayName: 'Volumes',
						name: 'volumes',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						description: 'Volumes to mount in the notebook',
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
										placeholder: '/workspace/data',
										description: 'Mount path inside the notebook',
									},
									{
										displayName: 'Container',
										name: 'container',
										type: 'string',
										default: '',
										placeholder: 'my-container',
										description: 'Object storage container name',
									},
								],
							},
						],
					},
				],
			},
			// Notebook backup fields
			{
				displayName: 'Backup ID',
				name: 'backupId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['notebook'],
						operation: ['getBackup', 'forkBackup'],
					},
				},
			},
			// Notebook labels field
			{
				displayName: 'Labels',
				name: 'labels',
				type: 'json',
				default: '{}',
				displayOptions: {
					show: {
						resource: ['notebook'],
						operation: ['updateLabels'],
					},
				},
				placeholder: '{"key": "value"}',
				description: 'Labels to update as JSON object',
			},
			// Backup retention policy fields
			{
				displayName: 'Policy Days',
				name: 'policyDays',
				type: 'number',
				default: 7,
				displayOptions: {
					show: {
						resource: ['notebook'],
						operation: ['updateBackupPolicy'],
					},
				},
				description: 'Number of days to retain backups',
			},
			// Command fields
			{
				displayName: 'Command',
				name: 'command',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['notebook'],
						operation: ['runCommand'],
					},
				},
				options: [
					{
						name: 'Start All',
						value: 'startAll',
					},
					{
						name: 'Stop All',
						value: 'stopAll',
					},
					{
						name: 'Restart All',
						value: 'restartAll',
					},
				],
				default: 'startAll',
				description: 'Command to run on notebooks',
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
				} else if (resource === 'datastore') {
					const projectId = (this.getNodeParameter('projectId', i) as string).trim();

					if (operation === 'getAliases') {
						const region = (this.getNodeParameter('region', i) as string).trim();
						path = `/cloud/project/${projectId}/ai/data/region/${region}/alias`;
					} else if (operation === 'getAlias') {
						const region = (this.getNodeParameter('region', i) as string).trim();
						const alias = (this.getNodeParameter('alias', i) as string).trim();
						path = `/cloud/project/${projectId}/ai/data/region/${region}/alias/${alias}`;
					} else if (operation === 'getAliasAuth') {
						const region = (this.getNodeParameter('region', i) as string).trim();
						const alias = (this.getNodeParameter('alias', i) as string).trim();
						path = `/cloud/project/${projectId}/ai/data/region/${region}/alias/${alias}/auth`;
					} else if (operation === 'createAlias') {
						method = 'POST';
						const region = (this.getNodeParameter('region', i) as string).trim();
						const aliasName = (this.getNodeParameter('aliasName', i) as string).trim();
						const accessKey = (this.getNodeParameter('accessKey', i) as string).trim();
						const secretKey = (this.getNodeParameter('secretKey', i) as string).trim();
						const storageEndpoint = this.getNodeParameter('storageEndpoint', i, '') as string;
						
						path = `/cloud/project/${projectId}/ai/data/region/${region}/alias`;
						
						const credentials: any = {
							accessKey: accessKey,
							secretKey: secretKey,
						};
						
						if (storageEndpoint && storageEndpoint.trim() !== '') {
							credentials.endpoint = storageEndpoint.trim();
						}
						
						body = { 
							alias: aliasName,
							credentials: credentials
						};
					} else if (operation === 'deleteAlias') {
						method = 'DELETE';
						const region = (this.getNodeParameter('region', i) as string).trim();
						const alias = (this.getNodeParameter('alias', i) as string).trim();
						path = `/cloud/project/${projectId}/ai/data/region/${region}/alias/${alias}`;
					} else if (operation === 'updateAlias') {
						method = 'PUT';
						const region = (this.getNodeParameter('region', i) as string).trim();
						const alias = (this.getNodeParameter('alias', i) as string).trim();
						const updateAccessKey = (this.getNodeParameter('updateAccessKey', i) as string).trim();
						const updateSecretKey = (this.getNodeParameter('updateSecretKey', i) as string).trim();
						const updateStorageEndpoint = this.getNodeParameter('updateStorageEndpoint', i, '') as string;
						
						path = `/cloud/project/${projectId}/ai/data/region/${region}/alias/${alias}`;
						
						const credentials: any = {
							accessKey: updateAccessKey,
							secretKey: updateSecretKey,
						};
						
						if (updateStorageEndpoint && updateStorageEndpoint.trim() !== '') {
							credentials.endpoint = updateStorageEndpoint.trim();
						}
						
						body = { 
							credentials: credentials
						};
					}
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
						const flavor = (this.getNodeParameter('flavor', i) as string).trim();
						const notebookName = (this.getNodeParameter('notebookName', i) as string).trim();
						const notebookRegion = (this.getNodeParameter('notebookRegion', i) as string).trim();
						const notebookCpu = this.getNodeParameter('notebookCpu', i) as number;
						const notebookGpu = this.getNodeParameter('notebookGpu', i) as number;
						const notebookMemory = this.getNodeParameter('notebookMemory', i) as number;
						const additionalFields = this.getNodeParameter('notebookAdditionalFields', i) as IDataObject;
						
						path = `/cloud/project/${projectId}/ai/notebook`;
						
						// Build resources object with memory as number in bytes
						const resources: any = {
							cpu: notebookCpu,
							memory: notebookMemory * 1024 * 1024 * 1024, // Convert GB to bytes
							flavor: flavor // Flavor is now required
						};
						
						if (notebookGpu > 0) {
							resources.gpu = notebookGpu;
						}
						
						// Build the request body directly at root level (no spec wrapper)
						const envObject: any = {
							editorId: framework
						};
						
						// Use custom framework version if provided
						if (additionalFields.customFrameworkVersion && (additionalFields.customFrameworkVersion as string).trim()) {
							envObject.frameworkVersion = (additionalFields.customFrameworkVersion as string).trim();
						}
						
						body = {
							name: notebookName,
							region: notebookRegion,
							env: envObject,
							resources: resources
						};
						
						// Add volumes if specified
						if (additionalFields.volumes) {
							const volumesArray = (additionalFields.volumes as any).volume || [];
							if (volumesArray.length > 0) {
								body.volumes = volumesArray.map((vol: any) => ({
									container: vol.container,
									mountPath: vol.mountPath,
									permission: 'RW'
								}));
							}
						}
						
						// Add SSH public keys if specified  
						if (additionalFields.sshPublicKeys) {
							const sshKeys = (additionalFields.sshPublicKeys as string).split('\n').filter(key => key.trim());
							if (sshKeys.length > 0) {
								body.sshPublicKeys = sshKeys;
							}
						}
						
						// Add labels if specified
						if (additionalFields.labels) {
							try {
								body.labels = JSON.parse(additionalFields.labels as string);
							} catch (error) {
								// If parsing fails, ignore labels
							}
						}
						
						// Add environment variables if specified
						if (additionalFields.envVars) {
							const envVarsArray = (additionalFields.envVars as any).variable || [];
							if (envVarsArray.length > 0) {
								body.envVars = envVarsArray;
							}
						}
						
						// Add timeout if specified
						if (additionalFields.timeout) {
							body.timeout = additionalFields.timeout as number;
						}
						
						// Add timeout auto restart if specified
						if (additionalFields.timeoutAutoRestart !== undefined) {
							body.timeoutAutoRestart = additionalFields.timeoutAutoRestart as boolean;
						}
						
						// Add unsecure HTTP if specified
						if (additionalFields.unsecureHttp !== undefined) {
							body.unsecureHttp = additionalFields.unsecureHttp as boolean;
						}
						
						// Add authorized IPs if specified
						if (additionalFields.authorizedIps) {
							const ips = (additionalFields.authorizedIps as string).split('\n').filter(ip => ip.trim());
							if (ips.length > 0) {
								body.authorizedIps = ips;
							}
						}
					} else if (operation === 'delete') {
						method = 'DELETE';
						const notebookId = (this.getNodeParameter('notebookId', i) as string).trim();
						path = `/cloud/project/${projectId}/ai/notebook/${notebookId}`;
					} else if (operation === 'start') {
						method = 'PUT';
						const notebookId = (this.getNodeParameter('notebookId', i) as string).trim();
						path = `/cloud/project/${projectId}/ai/notebook/${notebookId}/start`;
					} else if (operation === 'stop') {
						method = 'PUT';
						const notebookId = (this.getNodeParameter('notebookId', i) as string).trim();
						path = `/cloud/project/${projectId}/ai/notebook/${notebookId}/stop`;
					} else if (operation === 'getBackups') {
						const notebookId = (this.getNodeParameter('notebookId', i) as string).trim();
						path = `/cloud/project/${projectId}/ai/notebook/${notebookId}/backup`;
					} else if (operation === 'getBackup') {
						const notebookId = (this.getNodeParameter('notebookId', i) as string).trim();
						const backupId = (this.getNodeParameter('backupId', i) as string).trim();
						path = `/cloud/project/${projectId}/ai/notebook/${notebookId}/backup/${backupId}`;
					} else if (operation === 'forkBackup') {
						method = 'POST';
						const notebookId = (this.getNodeParameter('notebookId', i) as string).trim();
						const backupId = (this.getNodeParameter('backupId', i) as string).trim();
						path = `/cloud/project/${projectId}/ai/notebook/${notebookId}/backup/${backupId}/fork`;
					} else if (operation === 'dataSync') {
						method = 'POST';
						const notebookId = (this.getNodeParameter('notebookId', i) as string).trim();
						path = `/cloud/project/${projectId}/ai/notebook/${notebookId}/backup/datasync`;
					} else if (operation === 'updateLabels') {
						method = 'PUT';
						const notebookId = (this.getNodeParameter('notebookId', i) as string).trim();
						const labels = (this.getNodeParameter('labels', i) as string).trim();
						path = `/cloud/project/${projectId}/ai/notebook/${notebookId}/label`;
						
						// Parse labels JSON string to object
						try {
							body = { labels: JSON.parse(labels) };
						} catch (error) {
							throw new NodeOperationError(this.getNode(), 'Labels must be valid JSON format', {
								itemIndex: i,
							});
						}
					} else if (operation === 'getLogs') {
						const notebookId = (this.getNodeParameter('notebookId', i) as string).trim();
						path = `/cloud/project/${projectId}/ai/notebook/${notebookId}/log`;
					} else if (operation === 'restart') {
						method = 'PUT';
						const notebookId = (this.getNodeParameter('notebookId', i) as string).trim();
						path = `/cloud/project/${projectId}/ai/notebook/${notebookId}/restart`;
					} else if (operation === 'getBackupPolicy') {
						const notebookId = (this.getNodeParameter('notebookId', i) as string).trim();
						path = `/cloud/project/${projectId}/ai/notebook/${notebookId}/workspace_backup_retention`;
					} else if (operation === 'updateBackupPolicy') {
						method = 'PUT';
						const notebookId = (this.getNodeParameter('notebookId', i) as string).trim();
						const policyDays = this.getNodeParameter('policyDays', i) as number;
						path = `/cloud/project/${projectId}/ai/notebook/${notebookId}/workspace_backup_retention`;
						body = { days: policyDays };
					} else if (operation === 'runCommand') {
						method = 'POST';
						const notebookId = (this.getNodeParameter('notebookId', i) as string).trim();
						const command = (this.getNodeParameter('command', i) as string).trim();
						path = `/cloud/project/${projectId}/ai/notebook/${notebookId}/command`;
						body = { command: command };
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
						const resourceType = resource === 'job' ? 'training job' : 
											  resource === 'datastore' ? 'datastore alias' : resource;
						const resourceId = resource === 'job' ? (this.getNodeParameter('jobId', i) as string).trim() : 
											resource === 'app' ? (this.getNodeParameter('appId', i) as string).trim() :
											resource === 'notebook' ? (this.getNodeParameter('notebookId', i) as string).trim() :
											resource === 'datastore' ? (this.getNodeParameter('alias', i) as string).trim() : 'resource';
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
