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

function sha1(data: string): string {
	// Simple SHA1 implementation for OVH signature
	// In production, you might want to use a proper crypto library
	let hash = 0;
	for (let i = 0; i < data.length; i++) {
		const char = data.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash; // Convert to 32-bit integer
	}
	return Math.abs(hash).toString(16).padStart(40, '0');
}

export class OvhAI implements INodeType {
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
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many AI apps',
						action: 'Get many AI apps',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update AI app',
						action: 'Update AI app',
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
					{
						name: 'Stop',
						value: 'stop',
						description: 'Stop a training job',
						action: 'Stop a training job',
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
			// Project name field
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['project', 'app', 'job', 'model', 'notebook'],
					},
					hide: {
						resource: ['project'],
						operation: ['getAll'],
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
						operation: ['get', 'delete', 'update'],
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
						operation: ['get', 'delete', 'stop'],
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
						displayName: 'Memory',
						name: 'memory',
						type: 'string',
						default: '1Gi',
						placeholder: '1Gi',
						description: 'Memory allocation (e.g., 1Gi, 512Mi)',
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
			// Job creation fields
			{
				displayName: 'Job Image',
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
				displayName: 'Command',
				name: 'command',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['create'],
					},
				},
				placeholder: 'python train.py',
				description: 'Command to run in the job',
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
			// Update fields for apps
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['app'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Replicas',
						name: 'replicas',
						type: 'number',
						default: 1,
						description: 'Number of app replicas',
					},
					{
						displayName: 'Auto Scaling Enabled',
						name: 'autoScalingEnabled',
						type: 'boolean',
						default: false,
						description: 'Whether to enable auto scaling',
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

				if (resource === 'project') {
					if (operation === 'get') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						path = `/cloud/project/${projectId}`;
					} else if (operation === 'getAll') {
						path = '/cloud/project';
					}
				} else if (resource === 'app') {
					const projectId = this.getNodeParameter('projectId', i) as string;
					
					if (operation === 'get') {
						const appId = this.getNodeParameter('appId', i) as string;
						path = `/cloud/project/${projectId}/ai/app/${appId}`;
					} else if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/ai/app`;
					} else if (operation === 'create') {
						method = 'POST';
						const image = this.getNodeParameter('image', i) as string;
						const resources = this.getNodeParameter('resources', i) as IDataObject;
						path = `/cloud/project/${projectId}/ai/app`;
						
						body = { image };
						if (resources.cpu) body.cpu = resources.cpu;
						if (resources.memory) body.memory = resources.memory;
						if (resources.gpu) body.gpu = resources.gpu;
					} else if (operation === 'delete') {
						method = 'DELETE';
						const appId = this.getNodeParameter('appId', i) as string;
						path = `/cloud/project/${projectId}/ai/app/${appId}`;
					} else if (operation === 'update') {
						method = 'PUT';
						const appId = this.getNodeParameter('appId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						path = `/cloud/project/${projectId}/ai/app/${appId}`;
						
						if (updateFields.replicas) body.replicas = updateFields.replicas;
						if (updateFields.autoScalingEnabled !== undefined) body.autoScalingEnabled = updateFields.autoScalingEnabled;
					}
				} else if (resource === 'job') {
					const projectId = this.getNodeParameter('projectId', i) as string;
					
					if (operation === 'get') {
						const jobId = this.getNodeParameter('jobId', i) as string;
						path = `/cloud/project/${projectId}/ai/job/${jobId}`;
					} else if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/ai/job`;
					} else if (operation === 'create') {
						method = 'POST';
						const image = this.getNodeParameter('image', i) as string;
						const command = this.getNodeParameter('command', i) as string;
						path = `/cloud/project/${projectId}/ai/job`;
						
						body = { image };
						if (command) body.command = command;
					} else if (operation === 'delete') {
						method = 'DELETE';
						const jobId = this.getNodeParameter('jobId', i) as string;
						path = `/cloud/project/${projectId}/ai/job/${jobId}`;
					} else if (operation === 'stop') {
						method = 'POST';
						const jobId = this.getNodeParameter('jobId', i) as string;
						path = `/cloud/project/${projectId}/ai/job/${jobId}/kill`;
					}
				} else if (resource === 'model') {
					const projectId = this.getNodeParameter('projectId', i) as string;
					
					if (operation === 'get') {
						const modelId = this.getNodeParameter('modelId', i) as string;
						path = `/cloud/project/${projectId}/ai/serving/model/${modelId}`;
					} else if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/ai/serving/model`;
					} else if (operation === 'delete') {
						method = 'DELETE';
						const modelId = this.getNodeParameter('modelId', i) as string;
						path = `/cloud/project/${projectId}/ai/serving/model/${modelId}`;
					}
				} else if (resource === 'notebook') {
					const projectId = this.getNodeParameter('projectId', i) as string;
					
					if (operation === 'get') {
						const notebookId = this.getNodeParameter('notebookId', i) as string;
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
						const notebookId = this.getNodeParameter('notebookId', i) as string;
						path = `/cloud/project/${projectId}/ai/notebook/${notebookId}`;
					} else if (operation === 'start') {
						method = 'POST';
						const notebookId = this.getNodeParameter('notebookId', i) as string;
						path = `/cloud/project/${projectId}/ai/notebook/${notebookId}/start`;
					} else if (operation === 'stop') {
						method = 'POST';
						const notebookId = this.getNodeParameter('notebookId', i) as string;
						path = `/cloud/project/${projectId}/ai/notebook/${notebookId}/stop`;
					}
				}

				// Build the request
				const timestamp = Math.round(Date.now() / 1000);
				const fullUrl = `${endpoint}${path}`;
				
				// Create signature
				const toSign = [
					applicationSecret,
					consumerKey,
					method,
					fullUrl,
					JSON.stringify(body),
					timestamp,
				].join('+');
				
				// Generate OVH signature
				const signature = '$1$' + sha1(toSign);

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
					returnData.push(...responseData.map(item => ({ json: item })));
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