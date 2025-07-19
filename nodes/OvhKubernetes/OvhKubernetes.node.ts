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


export class OvhKubernetes implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OVH Kubernetes',
		name: 'ovhKubernetes',
		icon: 'file:ovh.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage OVH Managed Kubernetes clusters',
		defaults: {
			name: 'OVH Kubernetes',
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
						name: 'Cluster',
						value: 'cluster',
					},
					{
						name: 'Kubeconfig',
						value: 'kubeconfig',
					},
					{
						name: 'Node Pool',
						value: 'nodePool',
					},
				],
				default: 'cluster',
			},
			// Cluster operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['cluster'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new Kubernetes cluster',
						action: 'Create a new kubernetes cluster',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a Kubernetes cluster',
						action: 'Delete a kubernetes cluster',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get Kubernetes cluster information',
						action: 'Get kubernetes cluster information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many Kubernetes clusters',
						action: 'Get many kubernetes clusters',
					},
					{
						name: 'Reset',
						value: 'reset',
						description: 'Reset cluster to default configuration',
						action: 'Reset cluster to default configuration',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update Kubernetes cluster',
						action: 'Update kubernetes cluster',
					},
				],
				default: 'get',
			},
			// Node Pool operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['nodePool'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new node pool',
						action: 'Create a new node pool',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a node pool',
						action: 'Delete a node pool',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get node pool information',
						action: 'Get node pool information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many node pools',
						action: 'Get many node pools',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update node pool',
						action: 'Update node pool',
					},
				],
				default: 'get',
			},
			// Kubeconfig operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['kubeconfig'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get kubeconfig file',
						action: 'Get kubeconfig file',
					},
					{
						name: 'Reset',
						value: 'reset',
						description: 'Reset kubeconfig credentials',
						action: 'Reset kubeconfig credentials',
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
			// Cluster ID field
			{
				displayName: 'Cluster ID',
				name: 'clusterId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['cluster', 'nodePool', 'kubeconfig'],
						operation: ['get', 'delete', 'update', 'reset', 'getAll', 'create'],
					},
					hide: {
						resource: ['cluster'],
						operation: ['getAll', 'create'],
					},
				},
				description: 'The Kubernetes cluster ID',
			},
			// Node Pool ID field
			{
				displayName: 'Node Pool ID',
				name: 'nodePoolId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['nodePool'],
						operation: ['get', 'delete', 'update'],
					},
				},
			},
			// Cluster creation fields
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['cluster'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: 'my-k8s-cluster',
				description: 'The cluster name',
			},
			{
				displayName: 'Version',
				name: 'version',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['cluster'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: '1.28',
				description: 'Kubernetes version',
			},
			{
				displayName: 'Region',
				name: 'region',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['cluster'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'GRA7',
						value: 'GRA7',
					},
					{
						name: 'BHS5',
						value: 'BHS5',
					},
					{
						name: 'SBG5',
						value: 'SBG5',
					},
					{
						name: 'WAW1',
						value: 'WAW1',
					},
				],
				default: 'GRA7',
				required: true,
				description: 'The region where to create the cluster',
			},
			// Node Pool creation fields
			{
				displayName: 'Node Pool Name',
				name: 'nodePoolName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['nodePool'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: 'worker-nodes',
			},
			{
				displayName: 'Flavor',
				name: 'flavor',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['nodePool'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: 'b2-7',
				description: 'The node flavor (instance type)',
			},
			{
				displayName: 'Desired Nodes',
				name: 'desiredNodes',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['nodePool'],
						operation: ['create'],
					},
				},
				default: 3,
				required: true,
				description: 'Number of nodes in the pool',
			},
			{
				displayName: 'Min Nodes',
				name: 'minNodes',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['nodePool'],
						operation: ['create'],
					},
				},
				default: 1,
				description: 'Minimum number of nodes for autoscaling',
			},
			{
				displayName: 'Max Nodes',
				name: 'maxNodes',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['nodePool'],
						operation: ['create'],
					},
				},
				default: 10,
				description: 'Maximum number of nodes for autoscaling',
			},
			{
				displayName: 'Autoscale',
				name: 'autoscale',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['nodePool'],
						operation: ['create'],
					},
				},
				default: false,
				description: 'Whether to enable autoscaling for this node pool',
			},
			// Cluster update fields
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['cluster'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'New cluster name',
					},
					{
						displayName: 'Version',
						name: 'version',
						type: 'string',
						default: '',
						description: 'Kubernetes version to upgrade to',
					},
				],
			},
			// Node Pool update fields
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['nodePool'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Desired Nodes',
						name: 'desiredNodes',
						type: 'number',
						default: 3,
						description: 'Number of nodes in the pool',
					},
					{
						displayName: 'Min Nodes',
						name: 'minNodes',
						type: 'number',
						default: 1,
						description: 'Minimum number of nodes for autoscaling',
					},
					{
						displayName: 'Max Nodes',
						name: 'maxNodes',
						type: 'number',
						default: 10,
						description: 'Maximum number of nodes for autoscaling',
					},
					{
						displayName: 'Autoscale',
						name: 'autoscale',
						type: 'boolean',
						default: false,
						description: 'Whether to enable autoscaling',
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

				if (resource === 'cluster') {
					if (operation === 'get') {
						const clusterId = this.getNodeParameter('clusterId', i) as string;
						path = `/cloud/project/${projectId}/kube/${clusterId}`;
					} else if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/kube`;
					} else if (operation === 'create') {
						method = 'POST';
						const name = this.getNodeParameter('name', i) as string;
						const version = this.getNodeParameter('version', i) as string;
						const region = this.getNodeParameter('region', i) as string;
						
						path = `/cloud/project/${projectId}/kube`;
						body = {
							name,
							version,
							region,
						};
					} else if (operation === 'delete') {
						method = 'DELETE';
						const clusterId = this.getNodeParameter('clusterId', i) as string;
						path = `/cloud/project/${projectId}/kube/${clusterId}`;
					} else if (operation === 'update') {
						method = 'PUT';
						const clusterId = this.getNodeParameter('clusterId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						path = `/cloud/project/${projectId}/kube/${clusterId}`;
						
						if (updateFields.name) body.name = updateFields.name;
						if (updateFields.version) body.version = updateFields.version;
					} else if (operation === 'reset') {
						method = 'POST';
						const clusterId = this.getNodeParameter('clusterId', i) as string;
						path = `/cloud/project/${projectId}/kube/${clusterId}/reset`;
					}
				} else if (resource === 'nodePool') {
					const clusterId = this.getNodeParameter('clusterId', i) as string;
					
					if (operation === 'get') {
						const nodePoolId = this.getNodeParameter('nodePoolId', i) as string;
						path = `/cloud/project/${projectId}/kube/${clusterId}/nodepool/${nodePoolId}`;
					} else if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/kube/${clusterId}/nodepool`;
					} else if (operation === 'create') {
						method = 'POST';
						const nodePoolName = this.getNodeParameter('nodePoolName', i) as string;
						const flavor = this.getNodeParameter('flavor', i) as string;
						const desiredNodes = this.getNodeParameter('desiredNodes', i) as number;
						const minNodes = this.getNodeParameter('minNodes', i) as number;
						const maxNodes = this.getNodeParameter('maxNodes', i) as number;
						const autoscale = this.getNodeParameter('autoscale', i) as boolean;
						
						path = `/cloud/project/${projectId}/kube/${clusterId}/nodepool`;
						body = {
							name: nodePoolName,
							flavorName: flavor,
							desiredNodes,
							minNodes,
							maxNodes,
							autoscale,
						};
					} else if (operation === 'delete') {
						method = 'DELETE';
						const nodePoolId = this.getNodeParameter('nodePoolId', i) as string;
						path = `/cloud/project/${projectId}/kube/${clusterId}/nodepool/${nodePoolId}`;
					} else if (operation === 'update') {
						method = 'PUT';
						const nodePoolId = this.getNodeParameter('nodePoolId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						path = `/cloud/project/${projectId}/kube/${clusterId}/nodepool/${nodePoolId}`;
						
						if (updateFields.desiredNodes) body.desiredNodes = updateFields.desiredNodes;
						if (updateFields.minNodes) body.minNodes = updateFields.minNodes;
						if (updateFields.maxNodes) body.maxNodes = updateFields.maxNodes;
						if (updateFields.autoscale !== undefined) body.autoscale = updateFields.autoscale;
					}
				} else if (resource === 'kubeconfig') {
					const clusterId = this.getNodeParameter('clusterId', i) as string;
					
					if (operation === 'get') {
						method = 'POST';
						path = `/cloud/project/${projectId}/kube/${clusterId}/kubeconfig`;
					} else if (operation === 'reset') {
						method = 'POST';
						path = `/cloud/project/${projectId}/kube/${clusterId}/kubeconfig/reset`;
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