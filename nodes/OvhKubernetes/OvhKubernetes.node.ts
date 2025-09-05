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
		description: 'Manage OVH Managed Kubernetes clusters - Developed by Ascenzia',
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
						name: 'Customization',
						value: 'customization',
					},
					{
						name: 'Flavor',
						value: 'flavor',
					},
					{
						name: 'IP Restriction',
						value: 'ipRestriction',
					},
					{
						name: 'Kubeconfig',
						value: 'kubeconfig',
					},
					{
						name: 'Metric',
						value: 'metrics',
					},
					{
						name: 'Node',
						value: 'node',
					},
					{
						name: 'Node Pool',
						value: 'nodePool',
					},
					{
						name: 'OpenID Connect',
						value: 'openIdConnect',
					},
					{
						name: 'Private Network',
						value: 'privateNetwork',
					},
					{
						name: 'Update Policy',
						value: 'updatePolicy',
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
						name: 'Restart',
						value: 'restart',
						description: 'Restart control plane API server',
						action: 'Restart control plane API server',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update Kubernetes cluster',
						action: 'Update kubernetes cluster',
					},
					{
						name: 'Update Load Balancers Subnet',
						value: 'updateLoadBalancersSubnet',
						description: 'Update load balancers subnet ID',
						action: 'Update load balancers subnet ID',
					},
					{
						name: 'Update Patches',
						value: 'updatePatches',
						description: 'Force cluster and node update to latest patch',
						action: 'Force cluster and node update to latest patch',
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
						name: 'Get Nodes',
						value: 'getNodes',
						description: 'Get all nodes in a node pool',
						action: 'Get all nodes in a node pool',
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
			// Node operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['node'],
					},
				},
				options: [
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a specific node',
						action: 'Delete a specific node',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get node information',
						action: 'Get node information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'List many nodes',
						action: 'List all nodes',
					},
				],
				default: 'get',
			},
			// IP Restriction operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['ipRestriction'],
					},
				},
				options: [
					{
						name: 'Append',
						value: 'append',
						description: 'Append IP restrictions to cluster',
						action: 'Append IP restrictions to cluster',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an IP restriction',
						action: 'Delete an IP restriction',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'List IP restrictions',
						action: 'List IP restrictions',
					},
					{
						name: 'Replace',
						value: 'replace',
						description: 'Replace all IP restrictions',
						action: 'Replace all IP restrictions',
					},
				],
				default: 'getAll',
			},
			// Flavor operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['flavor'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'List many available flavors',
						action: 'List all available flavors',
					},
				],
				default: 'getAll',
			},
			// Customization operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['customization'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get cluster customization',
						action: 'Get cluster customization',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update cluster customization',
						action: 'Update cluster customization',
					},
				],
				default: 'get',
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
						name: 'Get Etcd Usage',
						value: 'getEtcdUsage',
						description: 'Get cluster etcd usage and quota',
						action: 'Get cluster etcd usage and quota',
					},
				],
				default: 'getEtcdUsage',
			},
			// OpenID Connect operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['openIdConnect'],
					},
				},
				options: [
					{
						name: 'Configure',
						value: 'configure',
						description: 'Configure OpenID Connect',
						action: 'Configure open id connect',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Remove OpenID Connect integration',
						action: 'Remove open id connect integration',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get OpenID Connect parameters',
						action: 'Get open id connect parameters',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update OpenID Connect parameters',
						action: 'Update open id connect parameters',
					},
				],
				default: 'get',
			},
			// Private Network operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['privateNetwork'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get private network configuration',
						action: 'Get private network configuration',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update private network configuration',
						action: 'Update private network configuration',
					},
				],
				default: 'get',
			},
			// Update Policy operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['updatePolicy'],
					},
				},
				options: [
					{
						name: 'Update',
						value: 'update',
						description: 'Change cluster update policy',
						action: 'Change cluster update policy',
					},
				],
				default: 'update',
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
						resource: ['cluster'],
						operation: ['get', 'delete', 'update', 'reset', 'restart', 'updateLoadBalancersSubnet', 'updatePatches'],
					},
				},
				description: 'The Kubernetes cluster ID',
			},
			// Cluster ID field for other resources
			{
				displayName: 'Cluster ID',
				name: 'clusterId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['nodePool', 'kubeconfig', 'node', 'ipRestriction', 'flavor', 'customization', 'metrics', 'openIdConnect', 'privateNetwork', 'updatePolicy'],
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
						operation: ['get', 'delete', 'update', 'getNodes'],
					},
				},
			},
			// Node ID field
			{
				displayName: 'Node ID',
				name: 'nodeId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['node'],
						operation: ['get', 'delete'],
					},
				},
			},
			// IP field for IP restrictions
			{
				displayName: 'IP Address',
				name: 'ip',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['ipRestriction'],
						operation: ['delete'],
					},
				},
				description: 'The IP address to delete',
			},
			// IPs field for IP restrictions
			{
				displayName: 'IP Addresses',
				name: 'ips',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['ipRestriction'],
						operation: ['append', 'replace'],
					},
				},
				description: 'Comma-separated list of IP addresses',
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
						name: 'BHS5',
						value: 'BHS5',
					},
					{
						name: 'DE1',
						value: 'DE1',
					},
					{
						name: 'GRA7',
						value: 'GRA7',
					},
					{
						name: 'GRA9',
						value: 'GRA9',
					},
					{
						name: 'SBG5',
						value: 'SBG5',
					},
					{
						name: 'SGP1',
						value: 'SGP1',
					},
					{
						name: 'SYD1',
						value: 'SYD1',
					},
					{
						name: 'UK1',
						value: 'UK1',
					},
					{
						name: 'US-EAST-VA-1',
						value: 'US-EAST-VA-1',
					},
					{
						name: 'US-WEST-OR-1',
						value: 'US-WEST-OR-1',
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
			// Load Balancer Subnet ID
			{
				displayName: 'Subnet ID',
				name: 'subnetId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['cluster'],
						operation: ['updateLoadBalancersSubnet'],
					},
				},
				description: 'The new subnet ID for load balancers',
			},
			// Update Policy
			{
				displayName: 'Update Policy',
				name: 'policy',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['updatePolicy'],
						operation: ['update'],
					},
				},
				options: [
					{
						name: 'Always Update',
						value: 'ALWAYS_UPDATE',
					},
					{
						name: 'Minimal Downtime',
						value: 'MINIMAL_DOWNTIME',
					},
					{
						name: 'Never Update',
						value: 'NEVER_UPDATE',
					},
				],
				default: 'MINIMAL_DOWNTIME',
				required: true,
				description: 'The cluster update policy',
			},
			// Customization API Server
			{
				displayName: 'API Server',
				name: 'apiServer',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['customization'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Admissionplugins',
						name: 'admissionPlugins',
						type: 'collection',
						placeholder: 'Add Plugin',
						default: {},
						options: [
							{
								displayName: 'Disabled',
								name: 'disabled',
								type: 'string',
								default: '',
								description: 'Comma-separated list of disabled plugins',
							},
							{
								displayName: 'Enabled',
								name: 'enabled',
								type: 'string',
								default: '',
								description: 'Comma-separated list of enabled plugins',
							},
						],
					},
				],
			},
			// OpenID Connect Configuration
			{
				displayName: 'OIDC Configuration',
				name: 'oidcConfig',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['openIdConnect'],
						operation: ['configure', 'update'],
					},
				},
				options: [
					{
						displayName: 'Client ID',
						name: 'clientId',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Groups Claim',
						name: 'groupsClaim',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Groups Prefix',
						name: 'groupsPrefix',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Issuer URL',
						name: 'issuerUrl',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Required Claim',
						name: 'requiredClaim',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Signing Algs',
						name: 'signingAlgs',
						type: 'string',
						default: '',
						description: 'Comma-separated list of signing algorithms',
					},
					{
						displayName: 'Username Claim',
						name: 'usernameClaim',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Username Prefix',
						name: 'usernamePrefix',
						type: 'string',
						default: '',
					},
				],
			},
			// Private Network Configuration
			{
				displayName: 'Private Network Configuration',
				name: 'privateNetwork',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['privateNetwork'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Default vRack Gateway',
						name: 'defaultVrackGateway',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Private Network Routing As Default',
						name: 'privateNetworkRoutingAsDefault',
						type: 'boolean',
						default: false,
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
						body = { workerNodesPolicy: 'reinstall', controlPlanePolicy: 'rebuild' };
					} else if (operation === 'restart') {
						method = 'POST';
						const clusterId = this.getNodeParameter('clusterId', i) as string;
						path = `/cloud/project/${projectId}/kube/${clusterId}/restart`;
					} else if (operation === 'updateLoadBalancersSubnet') {
						method = 'PUT';
						const clusterId = this.getNodeParameter('clusterId', i) as string;
						const subnetId = this.getNodeParameter('subnetId', i) as string;
						path = `/cloud/project/${projectId}/kube/${clusterId}/updateLoadBalancersSubnetId`;
						body = { loadBalancersSubnetId: subnetId };
					} else if (operation === 'updatePatches') {
						method = 'POST';
						const clusterId = this.getNodeParameter('clusterId', i) as string;
						path = `/cloud/project/${projectId}/kube/${clusterId}/update`;
						body = { force: true };
					}
				} else if (resource === 'nodePool') {
					const clusterId = this.getNodeParameter('clusterId', i) as string;

					if (operation === 'get') {
						const nodePoolId = this.getNodeParameter('nodePoolId', i) as string;
						path = `/cloud/project/${projectId}/kube/${clusterId}/nodepool/${nodePoolId}`;
					} else if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/kube/${clusterId}/nodepool`;
					} else if (operation === 'getNodes') {
						const nodePoolId = this.getNodeParameter('nodePoolId', i) as string;
						path = `/cloud/project/${projectId}/kube/${clusterId}/nodepool/${nodePoolId}/nodes`;
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
				} else if (resource === 'node') {
					const clusterId = this.getNodeParameter('clusterId', i) as string;
					
					if (operation === 'get') {
						const nodeId = this.getNodeParameter('nodeId', i) as string;
						path = `/cloud/project/${projectId}/kube/${clusterId}/node/${nodeId}`;
					} else if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/kube/${clusterId}/node`;
					} else if (operation === 'delete') {
						method = 'DELETE';
						const nodeId = this.getNodeParameter('nodeId', i) as string;
						path = `/cloud/project/${projectId}/kube/${clusterId}/node/${nodeId}`;
					}
				} else if (resource === 'ipRestriction') {
					const clusterId = this.getNodeParameter('clusterId', i) as string;
					
					if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/kube/${clusterId}/ipRestrictions`;
					} else if (operation === 'append') {
						method = 'POST';
						const ips = (this.getNodeParameter('ips', i) as string).split(',').map(ip => ip.trim());
						path = `/cloud/project/${projectId}/kube/${clusterId}/ipRestrictions`;
						body = { ips };
					} else if (operation === 'replace') {
						method = 'PUT';
						const ips = (this.getNodeParameter('ips', i) as string).split(',').map(ip => ip.trim());
						path = `/cloud/project/${projectId}/kube/${clusterId}/ipRestrictions`;
						body = { ips };
					} else if (operation === 'delete') {
						method = 'DELETE';
						const ip = this.getNodeParameter('ip', i) as string;
						if (!ip) {
							throw new NodeOperationError(this.getNode(), 'IP address is required for delete operation. Please provide the IP address to remove from restrictions.', { itemIndex: i });
						}
						path = `/cloud/project/${projectId}/kube/${clusterId}/ipRestrictions/${encodeURIComponent(ip)}`;
					}
				} else if (resource === 'flavor') {
					const clusterId = this.getNodeParameter('clusterId', i) as string;
					
					if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/kube/${clusterId}/flavors`;
					}
				} else if (resource === 'customization') {
					const clusterId = this.getNodeParameter('clusterId', i) as string;
					
					if (operation === 'get') {
						path = `/cloud/project/${projectId}/kube/${clusterId}/customization`;
					} else if (operation === 'update') {
						method = 'PUT';
						const apiServer = this.getNodeParameter('apiServer', i) as IDataObject;
						path = `/cloud/project/${projectId}/kube/${clusterId}/customization`;
						body = { apiServer };
					}
				} else if (resource === 'metrics') {
					const clusterId = this.getNodeParameter('clusterId', i) as string;
					
					if (operation === 'getEtcdUsage') {
						path = `/cloud/project/${projectId}/kube/${clusterId}/metrics/etcdUsage`;
					}
				} else if (resource === 'openIdConnect') {
					const clusterId = this.getNodeParameter('clusterId', i) as string;
					
					if (operation === 'get') {
						path = `/cloud/project/${projectId}/kube/${clusterId}/openIdConnect`;
					} else if (operation === 'configure') {
						method = 'POST';
						const oidcConfig = this.getNodeParameter('oidcConfig', i) as IDataObject;
						path = `/cloud/project/${projectId}/kube/${clusterId}/openIdConnect`;
						body = oidcConfig;
					} else if (operation === 'update') {
						method = 'PUT';
						const oidcConfig = this.getNodeParameter('oidcConfig', i) as IDataObject;
						path = `/cloud/project/${projectId}/kube/${clusterId}/openIdConnect`;
						body = oidcConfig;
					} else if (operation === 'delete') {
						method = 'DELETE';
						path = `/cloud/project/${projectId}/kube/${clusterId}/openIdConnect`;
					}
				} else if (resource === 'privateNetwork') {
					const clusterId = this.getNodeParameter('clusterId', i) as string;
					
					if (operation === 'get') {
						path = `/cloud/project/${projectId}/kube/${clusterId}/privateNetworkConfiguration`;
					} else if (operation === 'update') {
						method = 'PUT';
						const privateNetwork = this.getNodeParameter('privateNetwork', i) as IDataObject;
						path = `/cloud/project/${projectId}/kube/${clusterId}/privateNetworkConfiguration`;
						body = privateNetwork;
					}
				} else if (resource === 'updatePolicy') {
					const clusterId = this.getNodeParameter('clusterId', i) as string;
					
					if (operation === 'update') {
						method = 'PUT';
						const policy = this.getNodeParameter('policy', i) as string;
						path = `/cloud/project/${projectId}/kube/${clusterId}/updatePolicy`;
						body = { updatePolicy: policy };
					}
				}

				// Build the request
				const timestamp = Math.round(Date.now() / 1000);
				const fullUrl = `${endpoint}${path}`;

				// Prepare body for signature exactly like official OVH SDK
				let bodyForSignature = '';
				// DELETE requests should never have body in OVH API
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
				// DELETE requests should never have body in OVH API
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

				// Handle DELETE operations with proper success message
				if (method === 'DELETE') {
					returnData.push({ 
						json: { 
							success: true, 
							message: `${resource} deleted successfully`,
							operation: operation,
							resource: resource
						} 
					});
				} else if (Array.isArray(responseData)) {
					// For arrays, create proper objects based on the operation
					responseData.forEach((item) => {
						if (typeof item === 'string' || typeof item === 'number') {
							// For IP restrictions, return the IP directly as 'ip' field for easier use in delete operations
							if (resource === 'ipRestriction' && operation === 'getAll') {
								returnData.push({ json: { ip: item, value: item } });
							} else {
								returnData.push({ json: { id: item, value: item } });
							}
						} else {
							returnData.push({ json: item });
						}
					});
				} else {
					// Handle null/empty responses from successful operations
					if (responseData === null || responseData === undefined) {
						returnData.push({ 
							json: { 
								success: true, 
								message: `${operation} completed successfully`,
								resource: resource
							} 
						});
					} else {
						returnData.push({ json: responseData as IDataObject });
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