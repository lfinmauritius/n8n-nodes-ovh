import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	IHttpRequestMethods,
	IRequestOptions,
	NodeOperationError,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import { createHash } from 'crypto';

export class OvhPrivateNetwork implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OVH Private Network',
		name: 'ovhPrivateNetwork',
		icon: 'file:ovh.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage OVH Private Network (vRack) - Complete API Integration - Developed by Ascenzia',
		defaults: {
			name: 'OVH Private Network',
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
						name: 'Cloud Project',
						value: 'cloudProject',
						description: 'Public Cloud Projects in vRack',
					},
					{
						name: 'Dedicated Cloud',
						value: 'dedicatedCloud',
						description: 'VMware Private Cloud in vRack',
					},
					{
						name: 'Dedicated Server',
						value: 'dedicatedServer',
						description: 'Dedicated Servers in vRack',
					},
					{
						name: 'IP Block',
						value: 'ipBlock',
						description: 'IP Blocks management',
					},
					{
						name: 'IP Load Balancer',
						value: 'ipLoadbalancing',
						description: 'IP Load Balancer in vRack',
					},
					{
						name: 'IPv6',
						value: 'ipv6',
						description: 'IPv6 management',
					},
					{
						name: 'Legacy vRack',
						value: 'legacyVrack',
						description: 'Legacy vRack services',
					},
					{
						name: 'OVH Cloud Connect',
						value: 'ovhCloudConnect',
						description: 'OVH Cloud Connect services',
					},
					{
						name: 'Task',
						value: 'task',
						description: 'Task management',
					},
					{
						name: 'vRack',
						value: 'vrack',
						description: 'Main vRack management',
					},
					{
						name: 'vRack Service',
						value: 'vrackServices',
						description: 'VRack Services management',
					},
				],
				default: 'vrack',
			},

			// vRack Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['vrack'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get vRack information',
						action: 'Get v rack information',
					},
					{
						name: 'Get Allowed Services',
						value: 'getAllowedServices',
						description: 'List services that can be attached',
						action: 'Get allowed services',
					},
					{
						name: 'Get Eligible Services',
						value: 'getEligibleServices',
						description: 'List eligible services',
						action: 'Get eligible services',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'List all available vRacks',
						action: 'List all v racks',
					},
					{
						name: 'Get Service Info',
						value: 'getServiceInfo',
						description: 'Get service information',
						action: 'Get service information',
					},
					{
						name: 'Terminate',
						value: 'terminate',
						description: 'Terminate vRack service',
						action: 'Terminate v rack service',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update vRack properties',
						action: 'Update v rack properties',
					},
				],
				default: 'get',
			},

			// Cloud Project Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['cloudProject'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'List cloud projects in vRack',
						action: 'List cloud projects',
					},
					{
						name: 'Attach',
						value: 'attach',
						description: 'Attach cloud project to vRack',
						action: 'Attach cloud project',
					},
					{
						name: 'Detach',
						value: 'detach',
						description: 'Detach cloud project from vRack',
						action: 'Detach cloud project',
					},
				],
				default: 'getMany',
			},

			// Dedicated Cloud Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['dedicatedCloud'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'List dedicated clouds in vRack',
						action: 'List dedicated clouds',
					},
					{
						name: 'Attach',
						value: 'attach',
						description: 'Attach dedicated cloud to vRack',
						action: 'Attach dedicated cloud',
					},
					{
						name: 'Detach',
						value: 'detach',
						description: 'Detach dedicated cloud from vRack',
						action: 'Detach dedicated cloud',
					},
				],
				default: 'getMany',
			},

			// Dedicated Server Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['dedicatedServer'],
					},
				},
				options: [
					{
						name: 'Attach',
						value: 'attach',
						description: 'Attach dedicated server to vRack',
						action: 'Attach dedicated server',
					},
					{
						name: 'Detach',
						value: 'detach',
						description: 'Detach dedicated server from vRack',
						action: 'Detach dedicated server',
					},
					{
						name: 'Get Interface Details',
						value: 'getInterfaceDetails',
						description: 'Get detailed interface information',
						action: 'Get interface details',
					},
					{
						name: 'Get Interfaces',
						value: 'getInterfaces',
						description: 'List server interfaces in vRack',
						action: 'List server interfaces',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'List dedicated servers in vRack',
						action: 'List dedicated servers',
					},
				],
				default: 'getMany',
			},

			// IP Block Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['ipBlock'],
					},
				},
				options: [
					{
						name: 'Attach',
						value: 'attach',
						description: 'Attach IP block to vRack',
						action: 'Attach IP block',
					},
					{
						name: 'Detach',
						value: 'detach',
						description: 'Detach IP block from vRack',
						action: 'Detach IP block',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'List IP blocks in vRack',
						action: 'List IP blocks',
					},
				],
				default: 'getMany',
			},

			// IPv6 Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['ipv6'],
					},
				},
				options: [
					{
						name: 'Create Routed Subrange',
						value: 'createRoutedSubrange',
						description: 'Create routed IPv6 subrange',
						action: 'Create routed subrange',
					},
					{
						name: 'Delete Routed Subrange',
						value: 'deleteRoutedSubrange',
						description: 'Delete routed IPv6 subrange',
						action: 'Delete routed subrange',
					},
					{
						name: 'Get Bridged Subranges',
						value: 'getBridgedSubranges',
						description: 'List bridged IPv6 subranges',
						action: 'Get bridged subranges',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'List IPv6 blocks in vRack',
						action: 'List i pv6 blocks',
					},
					{
						name: 'Get Routed Subranges',
						value: 'getRoutedSubranges',
						description: 'List routed IPv6 subranges',
						action: 'Get routed subranges',
					},
					{
						name: 'Update Bridged Subrange',
						value: 'updateBridgedSubrange',
						description: 'Update bridged IPv6 subrange SLAAC status',
						action: 'Update bridged subrange',
					},
				],
				default: 'getMany',
			},

			// OVH Cloud Connect Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['ovhCloudConnect'],
					},
				},
				options: [
					{
						name: 'Attach',
						value: 'attach',
						description: 'Attach OVH Cloud Connect to vRack',
						action: 'Attach ovh cloud connect',
					},
					{
						name: 'Detach',
						value: 'detach',
						description: 'Detach OVH Cloud Connect from vRack',
						action: 'Detach ovh cloud connect',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'List OVH Cloud Connect services in vRack',
						action: 'List ovh cloud connect services',
					},
				],
				default: 'getMany',
			},

			// Legacy vRack Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['legacyVrack'],
					},
				},
				options: [
					{
						name: 'Attach',
						value: 'attach',
						description: 'Attach legacy vRack to vRack',
						action: 'Attach legacy v rack',
					},
					{
						name: 'Detach',
						value: 'detach',
						description: 'Detach legacy vRack from vRack',
						action: 'Detach legacy v rack',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'List legacy vRack services',
						action: 'List legacy v rack services',
					},
				],
				default: 'getMany',
			},

			// vRack Services Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['vrackServices'],
					},
				},
				options: [
					{
						name: 'Attach',
						value: 'attach',
						description: 'Attach vRack service to vRack',
						action: 'Attach v rack service',
					},
					{
						name: 'Detach',
						value: 'detach',
						description: 'Detach vRack service from vRack',
						action: 'Detach v rack service',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'List vRack services',
						action: 'List v rack services',
					},
				],
				default: 'getMany',
			},

			// Task Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['task'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get task information',
						action: 'Get task information',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'List tasks',
						action: 'List tasks',
					},
				],
				default: 'getMany',
			},

			// Service Name parameter (required for most operations)
			{
				displayName: 'Service Name',
				name: 'serviceName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['vrack', 'cloudProject', 'dedicatedCloud', 'dedicatedServer', 'ipBlock', 'ipv6', 'ovhCloudConnect', 'legacyVrack', 'vrackServices', 'task'],
						operation: ['get', 'update', 'getServiceInfo', 'getAllowedServices', 'getEligibleServices', 'terminate', 'getMany', 'attach', 'detach', 'getInterfaces', 'getInterfaceDetails', 'getBridgedSubranges', 'getRoutedSubranges', 'createRoutedSubrange', 'deleteRoutedSubrange', 'updateBridgedSubrange'],
					},
				},
				default: '',
				description: 'The internal name of your vRack service',
			},

			// Project ID for Cloud Project operations
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['cloudProject'],
						operation: ['attach', 'detach'],
					},
				},
				default: '',
				description: 'Public Cloud Project ID',
			},

			// Dedicated Cloud ID
			{
				displayName: 'Dedicated Cloud ID',
				name: 'dedicatedCloudId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['dedicatedCloud'],
						operation: ['attach', 'detach'],
					},
				},
				default: '',
				description: 'Dedicated Cloud service name',
			},

			// Dedicated Server ID
			{
				displayName: 'Server Name',
				name: 'serverName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['dedicatedServer'],
						operation: ['attach', 'detach'],
					},
				},
				default: '',
				description: 'Dedicated Server name',
			},

			// IP Block
			{
				displayName: 'IP Block',
				name: 'ipBlock',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['ipBlock'],
						operation: ['attach', 'detach'],
					},
				},
				default: '',
				description: 'IP block (e.g., 192.168.1.0/24)',
			},

			// IPv6 Block
			{
				displayName: 'IPv6 Block',
				name: 'ipv6Block',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['ipv6'],
						operation: ['getBridgedSubranges', 'getRoutedSubranges', 'createRoutedSubrange', 'deleteRoutedSubrange', 'updateBridgedSubrange'],
					},
				},
				default: '',
			},

			// Routed Subrange
			{
				displayName: 'Routed Subrange',
				name: 'routedSubrange',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['ipv6'],
						operation: ['deleteRoutedSubrange'],
					},
				},
				default: '',
				description: 'IPv6 routed subrange to delete',
			},

			// Bridged Subrange
			{
				displayName: 'Bridged Subrange',
				name: 'bridgedSubrange',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['ipv6'],
						operation: ['updateBridgedSubrange'],
					},
				},
				default: '',
				description: 'IPv6 bridged subrange to update',
			},

			// Task ID
			{
				displayName: 'Task ID',
				name: 'taskId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['get'],
					},
				},
				default: 0,
			},

			// Service Family Filter
			{
				displayName: 'Service Family',
				name: 'serviceFamily',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['vrack'],
						operation: ['getAllowedServices'],
					},
				},
				options: [
					{
						name: 'All',
						value: '',
					},
					{
						name: 'Cloud Project',
						value: 'cloudProject',
					},
					{
						name: 'Dedicated Cloud',
						value: 'dedicatedCloud',
					},
					{
						name: 'Dedicated Server',
						value: 'dedicatedServer',
					},
					{
						name: 'IP Load Balancer',
						value: 'ipLoadbalancing',
					},
				],
				default: '',
				description: 'Filter services by family type',
			},

			// Update parameters for vRack
			{
				displayName: 'Update Fields',
				name: 'updateProperties',
				type: 'collection',
				placeholder: 'Add Property',
				displayOptions: {
					show: {
						resource: ['vrack'],
						operation: ['update'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'New name for the vRack',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'New description for the vRack',
					},
				],
			},

			// IPv6 Subrange parameters
			{
				displayName: 'Subrange Properties',
				name: 'subrangeProperties',
				type: 'collection',
				placeholder: 'Add Property',
				displayOptions: {
					show: {
						resource: ['ipv6'],
						operation: ['createRoutedSubrange'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Subrange',
						name: 'subrange',
						type: 'string',
						default: '',
						description: 'IPv6 subrange to create',
					},
					{
						displayName: 'Target Service Name',
						name: 'targetServiceName',
						type: 'string',
						default: '',
					},
				],
			},

			// Bridged Subrange Update Properties
			{
				displayName: 'Update Properties',
				name: 'bridgedSubrangeUpdateProperties',
				type: 'collection',
				placeholder: 'Add Property',
				displayOptions: {
					show: {
						resource: ['ipv6'],
						operation: ['updateBridgedSubrange'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'SLAAC',
						name: 'slaac',
						type: 'boolean',
						default: false,
						description: 'Whether to enable SLAAC for the bridged subrange',
					},
				],
			},

			// OVH Cloud Connect ID
			{
				displayName: 'OVH Cloud Connect ID',
				name: 'ovhCloudConnectId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['ovhCloudConnect'],
						operation: ['attach', 'detach'],
					},
				},
				default: '',
				description: 'OVH Cloud Connect service ID',
			},

			// Legacy vRack ID
			{
				displayName: 'Legacy vRack ID',
				name: 'legacyVrackId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['legacyVrack'],
						operation: ['attach', 'detach'],
					},
				},
				default: '',
				description: 'Legacy vRack service ID',
			},

			// vRack Service ID
			{
				displayName: 'vRack Service ID',
				name: 'vrackServiceId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['vrackServices'],
						operation: ['attach', 'detach'],
					},
				},
				default: '',

			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const credentials = await this.getCredentials('ovhApi');

		const applicationKey = credentials.applicationKey as string;
		const applicationSecret = credentials.applicationSecret as string;
		const consumerKey = credentials.consumerKey as string;
		const endpoint = credentials.endpoint as string;

		// Use the endpoint directly from credentials (it's already the full URL)
		const baseURL = endpoint;

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let method: IHttpRequestMethods = 'GET';
				let path = '';
				let body: IDataObject = {};
				let qs: IDataObject = {};

				// Build path and method based on resource and operation
				if (resource === 'vrack') {
					if (operation === 'getMany') {
						path = '/vrack';
					} else if (operation === 'get') {
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/vrack/${serviceName}`;
					} else if (operation === 'update') {
						method = 'PUT';
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						const updateProperties = this.getNodeParameter('updateProperties', i) as IDataObject;
						path = `/vrack/${serviceName}`;
						body = updateProperties;
					} else if (operation === 'getServiceInfo') {
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/vrack/${serviceName}/serviceInfos`;
					} else if (operation === 'getAllowedServices') {
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/vrack/${serviceName}/allowedServices`;
						const serviceFamily = this.getNodeParameter('serviceFamily', i) as string;
						if (serviceFamily) {
							qs.serviceFamily = serviceFamily;
						}
					} else if (operation === 'getEligibleServices') {
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/vrack/${serviceName}/eligibleServices`;
					} else if (operation === 'terminate') {
						method = 'POST';
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/vrack/${serviceName}/terminate`;
					}
				} else if (resource === 'cloudProject') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'getMany') {
						path = `/vrack/${serviceName}/cloudProject`;
					} else if (operation === 'attach') {
						method = 'POST';
						const projectId = this.getNodeParameter('projectId', i) as string;
						path = `/vrack/${serviceName}/cloudProject`;
						body = { project: projectId };
					} else if (operation === 'detach') {
						method = 'DELETE';
						const projectId = this.getNodeParameter('projectId', i) as string;
						path = `/vrack/${serviceName}/cloudProject/${projectId}`;
					}
				} else if (resource === 'dedicatedCloud') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'getMany') {
						path = `/vrack/${serviceName}/dedicatedCloud`;
					} else if (operation === 'attach') {
						method = 'POST';
						const dedicatedCloudId = this.getNodeParameter('dedicatedCloudId', i) as string;
						path = `/vrack/${serviceName}/dedicatedCloud`;
						body = { dedicatedCloud: dedicatedCloudId };
					} else if (operation === 'detach') {
						method = 'DELETE';
						const dedicatedCloudId = this.getNodeParameter('dedicatedCloudId', i) as string;
						path = `/vrack/${serviceName}/dedicatedCloud/${dedicatedCloudId}`;
					}
				} else if (resource === 'dedicatedServer') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'getMany') {
						path = `/vrack/${serviceName}/dedicatedServer`;
					} else if (operation === 'attach') {
						method = 'POST';
						const serverName = this.getNodeParameter('serverName', i) as string;
						path = `/vrack/${serviceName}/dedicatedServer`;
						body = { dedicatedServer: serverName };
					} else if (operation === 'detach') {
						method = 'DELETE';
						const serverName = this.getNodeParameter('serverName', i) as string;
						path = `/vrack/${serviceName}/dedicatedServer/${serverName}`;
					} else if (operation === 'getInterfaces') {
						path = `/vrack/${serviceName}/dedicatedServerInterface`;
					} else if (operation === 'getInterfaceDetails') {
						path = `/vrack/${serviceName}/dedicatedServerInterfaceDetails`;
					}
				} else if (resource === 'ipBlock') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'getMany') {
						path = `/vrack/${serviceName}/ip`;
					} else if (operation === 'attach') {
						method = 'POST';
						const ipBlock = this.getNodeParameter('ipBlock', i) as string;
						path = `/vrack/${serviceName}/ip`;
						body = { ip: ipBlock };
					} else if (operation === 'detach') {
						method = 'DELETE';
						const ipBlock = this.getNodeParameter('ipBlock', i) as string;
						path = `/vrack/${serviceName}/ip/${encodeURIComponent(ipBlock)}`;
					}
				} else if (resource === 'ipv6') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'getMany') {
						path = `/vrack/${serviceName}/ipv6`;
					} else if (operation === 'getBridgedSubranges') {
						const ipv6Block = this.getNodeParameter('ipv6Block', i) as string;
						path = `/vrack/${serviceName}/ipv6/${encodeURIComponent(ipv6Block)}/bridgedSubrange`;
					} else if (operation === 'getRoutedSubranges') {
						const ipv6Block = this.getNodeParameter('ipv6Block', i) as string;
						path = `/vrack/${serviceName}/ipv6/${encodeURIComponent(ipv6Block)}/routedSubrange`;
					} else if (operation === 'createRoutedSubrange') {
						method = 'POST';
						const ipv6Block = this.getNodeParameter('ipv6Block', i) as string;
						const subrangeProps = this.getNodeParameter('subrangeProperties', i) as IDataObject;
						path = `/vrack/${serviceName}/ipv6/${encodeURIComponent(ipv6Block)}/routedSubrange`;
						body = subrangeProps;
					} else if (operation === 'deleteRoutedSubrange') {
						method = 'DELETE';
						const ipv6Block = this.getNodeParameter('ipv6Block', i) as string;
						const routedSubrange = this.getNodeParameter('routedSubrange', i) as string;
						path = `/vrack/${serviceName}/ipv6/${encodeURIComponent(ipv6Block)}/routedSubrange/${encodeURIComponent(routedSubrange)}`;
					} else if (operation === 'updateBridgedSubrange') {
						method = 'PUT';
						const ipv6Block = this.getNodeParameter('ipv6Block', i) as string;
						const bridgedSubrange = this.getNodeParameter('bridgedSubrange', i) as string;
						const updateProps = this.getNodeParameter('bridgedSubrangeUpdateProperties', i) as IDataObject;
						path = `/vrack/${serviceName}/ipv6/${encodeURIComponent(ipv6Block)}/bridgedSubrange/${encodeURIComponent(bridgedSubrange)}`;
						body = updateProps;
					}
				} else if (resource === 'ovhCloudConnect') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'getMany') {
						path = `/vrack/${serviceName}/ovhCloudConnect`;
					} else if (operation === 'attach') {
						method = 'POST';
						const ovhCloudConnectId = this.getNodeParameter('ovhCloudConnectId', i) as string;
						path = `/vrack/${serviceName}/ovhCloudConnect`;
						body = { ovhCloudConnect: ovhCloudConnectId };
					} else if (operation === 'detach') {
						method = 'DELETE';
						const ovhCloudConnectId = this.getNodeParameter('ovhCloudConnectId', i) as string;
						path = `/vrack/${serviceName}/ovhCloudConnect/${ovhCloudConnectId}`;
					}
				} else if (resource === 'legacyVrack') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'getMany') {
						path = `/vrack/${serviceName}/legacyVrack`;
					} else if (operation === 'attach') {
						method = 'POST';
						const legacyVrackId = this.getNodeParameter('legacyVrackId', i) as string;
						path = `/vrack/${serviceName}/legacyVrack`;
						body = { legacyVrack: legacyVrackId };
					} else if (operation === 'detach') {
						method = 'DELETE';
						const legacyVrackId = this.getNodeParameter('legacyVrackId', i) as string;
						path = `/vrack/${serviceName}/legacyVrack/${legacyVrackId}`;
					}
				} else if (resource === 'vrackServices') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'getMany') {
						path = `/vrack/${serviceName}/vrackServices`;
					} else if (operation === 'attach') {
						method = 'POST';
						const vrackServiceId = this.getNodeParameter('vrackServiceId', i) as string;
						path = `/vrack/${serviceName}/vrackServices`;
						body = { vrackServices: vrackServiceId };
					} else if (operation === 'detach') {
						method = 'DELETE';
						const vrackServiceId = this.getNodeParameter('vrackServiceId', i) as string;
						path = `/vrack/${serviceName}/vrackServices/${vrackServiceId}`;
					}
				} else if (resource === 'task') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'getMany') {
						path = `/vrack/${serviceName}/task`;
					} else if (operation === 'get') {
						const taskId = this.getNodeParameter('taskId', i) as number;
						path = `/vrack/${serviceName}/task/${taskId}`;
					}
				}

				// Construct full URL
				const timestamp = Math.floor(Date.now() / 1000);
				const queryString =
					Object.keys(qs).length > 0
						? '?' +
						  Object.keys(qs)
								.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(qs[key] as string)}`)
								.join('&')
						: '';
				const url = baseURL + path + queryString;

				// Create signature
				let bodyForSignature = '';
				if (method !== 'GET' && method !== 'DELETE' && Object.keys(body).length > 0) {
					bodyForSignature = JSON.stringify(body).replace(/[\u0080-\uFFFF]/g, (m) => {
						return '\\u' + ('0000' + m.charCodeAt(0).toString(16)).slice(-4);
					});
				}

				const signatureElements = [
					applicationSecret,
					consumerKey,
					method,
					url,
					bodyForSignature,
					timestamp,
				];

				const signature =
					'$1$' + createHash('sha1').update(signatureElements.join('+')).digest('hex');

				// Prepare request options
				const options: IRequestOptions = {
					method,
					url,
					headers: {
						'X-Ovh-Application': applicationKey,
						'X-Ovh-Timestamp': timestamp.toString(),
						'X-Ovh-Signature': signature,
						'X-Ovh-Consumer': consumerKey,
						'Content-Type': 'application/json',
					},
					body: method !== 'GET' && method !== 'DELETE' ? body : undefined,
					json: true,
				};

				const responseData = await this.helpers.request(options);

				// Handle array responses
				if (Array.isArray(responseData)) {
					responseData.forEach((item) => {
						if (typeof item === 'string' || typeof item === 'number') {
							returnData.push({ value: item, resource, operation });
						} else {
							returnData.push({ ...item, resource, operation });
						}
					});
				} else {
					returnData.push(responseData || { resource, operation });
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