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

export class OvhDataProcessing implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OVH Data Processing',
		name: 'ovhDataProcessing',
		icon: 'file:ovh.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage OVH Data Processing services',
		defaults: {
			name: 'OVH Data Processing',
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
						name: 'Job',
						value: 'job',
					},
					{
						name: 'Metric',
						value: 'metrics',
					},
				],
				default: 'job',
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
						description: 'Create a new data processing job',
						action: 'Create a new data processing job',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a data processing job',
						action: 'Delete a data processing job',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get data processing job information',
						action: 'Get data processing job information',
					},
					{
						name: 'Get Logs',
						value: 'getLogs',
						description: 'Get job logs',
						action: 'Get job logs',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many data processing jobs',
						action: 'Get many data processing jobs',
					},
					{
						name: 'Stop',
						value: 'stop',
						description: 'Stop a running job',
						action: 'Stop a running job',
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
			// Metrics operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['metrics'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get job metrics',
						action: 'Get job metrics',
					},
				],
				default: 'get',
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
			// Job ID field
			{
				displayName: 'Job ID',
				name: 'jobId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['job', 'metrics'],
						operation: ['get', 'delete', 'stop', 'getLogs'],
					},
				},
				description: 'The data processing job ID',
			},
			// Job creation fields
			{
				displayName: 'Engine',
				name: 'engine',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'Spark',
						value: 'spark',
					},
				],
				default: 'spark',
				required: true,
				description: 'The processing engine to use',
			},
			{
				displayName: 'Engine Version',
				name: 'engineVersion',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['create'],
					},
				},
				default: '3.2',
				placeholder: '3.2',
				description: 'The engine version to use',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: 'my-data-job',
				description: 'The job name',
			},
			{
				displayName: 'Region',
				name: 'region',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['job'],
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
				description: 'The region where to run the job',
			},
			// Engine parameters
			{
				displayName: 'Engine Parameters',
				name: 'engineParameters',
				type: 'collection',
				placeholder: 'Add Parameter',
				default: {},
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Arguments',
						name: 'arguments',
						type: 'string',
						default: '',
						placeholder: '--input data.csv --output results.parquet',
						description: 'Arguments to pass to the application',
					},
					{
						displayName: 'Driver Cores',
						name: 'driverCores',
						type: 'number',
						default: 1,
						description: 'Number of cores for the driver',
					},
					{
						displayName: 'Driver Memory',
						name: 'driverMemory',
						type: 'string',
						default: '1g',
						placeholder: '1g',
						description: 'Memory allocation for the driver',
					},
					{
						displayName: 'Executor Cores',
						name: 'executorCores',
						type: 'number',
						default: 1,
						description: 'Number of cores per executor',
					},
					{
						displayName: 'Executor Instances',
						name: 'executorInstances',
						type: 'number',
						default: 1,
						description: 'Number of executor instances',
					},
					{
						displayName: 'Executor Memory',
						name: 'executorMemory',
						type: 'string',
						default: '1g',
						placeholder: '1g',
						description: 'Memory allocation per executor',
					},
					{
						displayName: 'Main Application File',
						name: 'mainApplicationFile',
						type: 'string',
						default: '',
						placeholder: 'swift://container/my-app.py',
						description: 'Path to the main application file',
					},
				],
			},
			// Job status filter
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						name: 'All',
						value: 'all',
					},
					{
						name: 'Cancelled',
						value: 'CANCELLED',
					},
					{
						name: 'Completed',
						value: 'COMPLETED',
					},
					{
						name: 'Failed',
						value: 'FAILED',
					},
					{
						name: 'Pending',
						value: 'PENDING',
					},
					{
						name: 'Running',
						value: 'RUNNING',
					},
				],
				default: 'all',
				description: 'Filter jobs by status',
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

				if (resource === 'job') {
					if (operation === 'get') {
						const jobId = this.getNodeParameter('jobId', i) as string;
						path = `/cloud/project/${projectId}/dataProcessing/jobs/${jobId}`;
					} else if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/dataProcessing/jobs`;
						const status = this.getNodeParameter('status', i) as string;
						if (status !== 'all') {
							path += `?status=${status}`;
						}
					} else if (operation === 'create') {
						method = 'POST';
						const engine = this.getNodeParameter('engine', i) as string;
						const engineVersion = this.getNodeParameter('engineVersion', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						const region = this.getNodeParameter('region', i) as string;
						const engineParameters = this.getNodeParameter('engineParameters', i) as IDataObject;

						path = `/cloud/project/${projectId}/dataProcessing/jobs`;

						body = {
							engine,
							engineVersion,
							name,
							region,
						};

						if (engineParameters.mainApplicationFile) {
							body.mainApplicationFile = engineParameters.mainApplicationFile;
						}
						if (engineParameters.arguments) {
							body.arguments = engineParameters.arguments;
						}
						if (engineParameters.driverCores) {
							body.driverCores = engineParameters.driverCores;
						}
						if (engineParameters.driverMemory) {
							body.driverMemory = engineParameters.driverMemory;
						}
						if (engineParameters.executorCores) {
							body.executorCores = engineParameters.executorCores;
						}
						if (engineParameters.executorMemory) {
							body.executorMemory = engineParameters.executorMemory;
						}
						if (engineParameters.executorInstances) {
							body.executorInstances = engineParameters.executorInstances;
						}
					} else if (operation === 'delete') {
						method = 'DELETE';
						const jobId = this.getNodeParameter('jobId', i) as string;
						path = `/cloud/project/${projectId}/dataProcessing/jobs/${jobId}`;
					} else if (operation === 'stop') {
						method = 'POST';
						const jobId = this.getNodeParameter('jobId', i) as string;
						path = `/cloud/project/${projectId}/dataProcessing/jobs/${jobId}/kill`;
					} else if (operation === 'getLogs') {
						const jobId = this.getNodeParameter('jobId', i) as string;
						path = `/cloud/project/${projectId}/dataProcessing/jobs/${jobId}/logs`;
					}
				} else if (resource === 'capability') {
					if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/dataProcessing/capabilities`;
					}
				} else if (resource === 'metrics') {
					if (operation === 'get') {
						const jobId = this.getNodeParameter('jobId', i) as string;
						path = `/cloud/project/${projectId}/dataProcessing/jobs/${jobId}/metrics`;
					}
				}

				// Build the request
				const timestamp = Math.round(Date.now() / 1000);
				const fullUrl = `${endpoint}${path}`;

				// Prepare body for signature exactly like official OVH SDK
				let bodyForSignature = '';
				if (method === 'POST') {
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
