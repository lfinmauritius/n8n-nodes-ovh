import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	IHttpRequestMethods,
	IRequestOptions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';
import { createHash } from 'crypto';

export class OvhPrivateCloud implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OVH Private Cloud',
		name: 'ovhPrivateCloud',
		icon: 'file:ovh.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage OVH Hosted Private Cloud',
		defaults: {
			name: 'OVH Private Cloud',
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
						name: 'Backup',
						value: 'backup',
					},
					{
						name: 'Cluster',
						value: 'cluster',
					},
					{
						name: 'Datacenter',
						value: 'datacenter',
					},
					{
						name: 'Disaster Recovery',
						value: 'disasterRecovery',
					},
					{
						name: 'Filer',
						value: 'filer',
					},
					{
						name: 'Host',
						value: 'host',
					},
					{
						name: 'NSX-T Edge',
						value: 'nsxtEdge',
					},
					{
						name: 'Private Gateway',
						value: 'privateGateway',
					},
					{
						name: 'Service',
						value: 'service',
					},
					{
						name: 'Task',
						value: 'task',
					},
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'VM',
						value: 'vm',
					},
				],
				default: 'datacenter',
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
						name: 'Get',
						value: 'get',
						description: 'Get service information',
						action: 'Get service information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many services',
						action: 'Get many services',
					},
					{
						name: 'Get Service Info',
						value: 'getServiceInfo',
						description: 'Get service subscription information',
						action: 'Get service subscription information',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update service properties',
						action: 'Update service properties',
					},
				],
				default: 'get',
			},
			// Datacenter operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['datacenter'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new datacenter',
						action: 'Create a new datacenter',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get datacenter information',
						action: 'Get datacenter information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many datacenters',
						action: 'Get many datacenters',
					},
					{
						name: 'Get Task',
						value: 'getTask',
						description: 'Get datacenter task information',
						action: 'Get datacenter task information',
					},
					{
						name: 'Get Tasks',
						value: 'getTasks',
						description: 'Get datacenter tasks',
						action: 'Get datacenter tasks',
					},
					{
						name: 'Order Filer',
						value: 'orderFiler',
						description: 'Order new filer for datacenter',
						action: 'Order new filer for datacenter',
					},
					{
						name: 'Order Host',
						value: 'orderHost',
						description: 'Order new host for datacenter',
						action: 'Order new host for datacenter',
					},
					{
						name: 'Order Host Hour',
						value: 'orderHostHour',
						description: 'Order host on hourly basis',
						action: 'Order host on hourly basis',
					},
					{
						name: 'Reset Task State',
						value: 'resetTaskState',
						description: 'Reset datacenter task state',
						action: 'Reset datacenter task state',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update datacenter information',
						action: 'Update datacenter information',
					},
					{
						name: 'Update Task Maintenance Date',
						value: 'updateTaskMaintenanceDate',
						description: 'Update datacenter task maintenance date',
						action: 'Update datacenter task maintenance date',
					},
				],
				default: 'get',
			},
			// VM operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['vm'],
					},
				},
				options: [
					{
						name: 'Create Backup',
						value: 'createBackup',
						description: 'Create VM backup',
						action: 'Create VM backup',
					},
					{
						name: 'Disable Backup',
						value: 'disableBackup',
						description: 'Disable VM backup',
						action: 'Disable VM backup',
					},
					{
						name: 'Enable Backup',
						value: 'enableBackup',
						description: 'Enable VM backup',
						action: 'Enable VM backup',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get virtual machine information',
						action: 'Get virtual machine information',
					},
					{
						name: 'Get Backup',
						value: 'getBackup',
						description: 'Get VM backup information',
						action: 'Get VM backup information',
					},
					{
						name: 'Get Backup Offer Types',
						value: 'getBackupOfferTypes',
						action: 'Get backup offer types',
					},
					{
						name: 'Get CARP',
						value: 'getCarp',
						description: 'Get CARP configuration',
						action: 'Get CARP configuration',
					},
					{
						name: 'Get License',
						value: 'getLicense',
						description: 'Get VM license',
						action: 'Get VM license',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many virtual machines',
						action: 'Get many virtual machines',
					},
					{
						name: 'Power Off',
						value: 'powerOff',
						description: 'Power off virtual machine',
						action: 'Power off virtual machine',
					},
					{
						name: 'Power On',
						value: 'powerOn',
						description: 'Power on virtual machine',
						action: 'Power on virtual machine',
					},
					{
						name: 'Reset',
						value: 'reset',
						description: 'Reset virtual machine',
						action: 'Reset virtual machine',
					},
					{
						name: 'Restore Backup',
						value: 'restoreBackup',
						description: 'Restore VM from backup',
						action: 'Restore VM from backup',
					},
					{
						name: 'Revert Snapshot',
						value: 'revertSnapshot',
						description: 'Revert to snapshot',
						action: 'Revert to snapshot',
					},
					{
						name: 'Update CARP',
						value: 'updateCarp',
						description: 'Update CARP configuration',
						action: 'Update CARP configuration',
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
						description: 'Create a new user',
						action: 'Create a new user',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a user',
						action: 'Delete a user',
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
						name: 'Update',
						value: 'update',
						description: 'Update user information',
						action: 'Update user information',
					},
				],
				default: 'get',
			},
			// Task operations
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
						value: 'getAll',
						description: 'Get many tasks',
						action: 'Get many tasks',
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
						name: 'Batch Restore',
						value: 'batchRestore',
						description: 'Batch restore backups',
						action: 'Batch restore backups',
					},
					{
						name: 'Can Optimize Proxies',
						value: 'canOptimizeProxies',
						description: 'Check if proxies can be optimized',
						action: 'Check if proxies can be optimized',
					},
					{
						name: 'Change Properties',
						value: 'changeProperties',
						description: 'Change backup properties',
						action: 'Change backup properties',
					},
					{
						name: 'Check Jobs',
						value: 'checkJobs',
						description: 'Check backup jobs',
						action: 'Check backup jobs',
					},
					{
						name: 'Disable',
						value: 'disable',
						description: 'Disable backup',
						action: 'Disable backup',
					},
					{
						name: 'Generate Report',
						value: 'generateReport',
						description: 'Generate backup report',
						action: 'Generate backup report',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get backup information',
						action: 'Get backup information',
					},
					{
						name: 'Get Offer Capabilities',
						value: 'getOfferCapabilities',
						description: 'Get backup offer capabilities',
						action: 'Get backup offer capabilities',
					},
					{
						name: 'Optimize Proxies',
						value: 'optimizeProxies',
						description: 'Optimize backup proxies',
						action: 'Optimize backup proxies',
					},
				],
				default: 'get',
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
						name: 'Create NSX-T',
						value: 'createNsxt',
						description: 'Create NSX-T on cluster',
						action: 'Create NSX-T on cluster',
					},
					{
						name: 'Delete NSX-T',
						value: 'deleteNsxt',
						description: 'Delete NSX-T from cluster',
						action: 'Delete NSX-T from cluster',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get cluster information',
						action: 'Get cluster information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many clusters',
						action: 'Get many clusters',
					},
					{
						name: 'Update NSX-T',
						value: 'updateNsxt',
						description: 'Update NSX-T on cluster',
						action: 'Update NSX-T on cluster',
					},
				],
				default: 'get',
			},
			// Disaster Recovery operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['disasterRecovery'],
					},
				},
				options: [
					{
						name: 'Configure VPN',
						value: 'configureVpn',
						description: 'Configure VPN for Zerto Single',
						action: 'Configure vpn for zerto single',
					},
					{
						name: 'Create Remote Site',
						value: 'createRemoteSite',
						action: 'Create remote site',
					},
					{
						name: 'Create VRA Resources',
						value: 'createVraResources',
						action: 'Create VRA resources',
					},
					{
						name: 'Delete Remote Site',
						value: 'deleteRemoteSite',
						action: 'Delete remote site',
					},
					{
						name: 'Disable Zerto',
						value: 'disableZerto',
						action: 'Disable zerto',
					},
					{
						name: 'Disable Zerto Single',
						value: 'disableZertoSingle',
						action: 'Disable zerto single',
					},
					{
						name: 'End Migration',
						value: 'endMigration',
						description: 'End Zerto migration',
						action: 'End zerto migration',
					},
					{
						name: 'Get Default Local VRA Network',
						value: 'getDefaultLocalVraNetwork',
						action: 'Get default local VRA network',
					},
					{
						name: 'Get Endpoint Public IP',
						value: 'getEndpointPublicIp',
						action: 'Get endpoint public IP',
					},
					{
						name: 'Get Remote Sites',
						value: 'getRemoteSites',
						action: 'Get remote sites',
					},
					{
						name: 'Get Status',
						value: 'getStatus',
						description: 'Get Zerto status',
						action: 'Get zerto status',
					},
					{
						name: 'Get Usage Report',
						value: 'getUsageReport',
						description: 'Get Zerto usage report',
						action: 'Get zerto usage report',
					},
					{
						name: 'Get VRA Resources',
						value: 'getVraResources',
						action: 'Get VRA resources',
					},
					{
						name: 'Request Pairing Token',
						value: 'requestPairingToken',
						description: 'Request pairing token for Zerto Single',
						action: 'Request pairing token for zerto single',
					},
					{
						name: 'Start Migration',
						value: 'startMigration',
						description: 'Start Zerto migration',
						action: 'Start zerto migration',
					},
				],
				default: 'getStatus',
			},
			// Filer operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['filer'],
					},
				},
				options: [
					{
						name: 'Check Global Compatible',
						value: 'checkGlobalCompatible',
						description: 'Check if filer is global compatible',
						action: 'Check if filer is global compatible',
					},
					{
						name: 'Convert To Global',
						value: 'convertToGlobal',
						description: 'Convert filer to global',
						action: 'Convert filer to global',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get filer information',
						action: 'Get filer information',
					},
					{
						name: 'Get Location',
						value: 'getLocation',
						description: 'Get filer location',
						action: 'Get filer location',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many filers',
						action: 'Get many filers',
					},
					{
						name: 'Get Task',
						value: 'getTask',
						description: 'Get filer task',
						action: 'Get filer task',
					},
					{
						name: 'Get Tasks',
						value: 'getTasks',
						description: 'Get filer tasks',
						action: 'Get filer tasks',
					},
					{
						name: 'Remove',
						value: 'remove',
						description: 'Remove filer',
						action: 'Remove filer',
					},
					{
						name: 'Reset Task State',
						value: 'resetTaskState',
						action: 'Reset task state',
					},
					{
						name: 'Update Task Maintenance Date',
						value: 'updateTaskMaintenanceDate',
						description: 'Update task maintenance execution date',
						action: 'Update task maintenance execution date',
					},
				],
				default: 'get',
			},
			// Host operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['host'],
					},
				},
				options: [
					{
						name: 'Add Host Spare',
						value: 'addHostSpare',
						action: 'Add host spare',
					},
					{
						name: 'Check Resilience Can Be Enabled',
						value: 'checkResilienceCanBeEnabled',
						description: 'Check if resilience can be enabled on host',
						action: 'Check if resilience can be enabled on host',
					},
					{
						name: 'Disable Resilience',
						value: 'disableResilience',
						description: 'Disable resilience on host',
						action: 'Disable resilience on host',
					},
					{
						name: 'Enable Resilience',
						value: 'enableResilience',
						description: 'Enable resilience on host',
						action: 'Enable resilience on host',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get host information',
						action: 'Get host information',
					},
					{
						name: 'Get Location',
						value: 'getLocation',
						description: 'Get host location',
						action: 'Get host location',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many hosts',
						action: 'Get many hosts',
					},
					{
						name: 'Get Resilience',
						value: 'getResilience',
						description: 'Get host resilience status',
						action: 'Get host resilience status',
					},
					{
						name: 'Get Task',
						value: 'getTask',
						description: 'Get host task information',
						action: 'Get host task information',
					},
					{
						name: 'Get Tasks',
						value: 'getTasks',
						description: 'Get host tasks',
						action: 'Get host tasks',
					},
					{
						name: 'Remove',
						value: 'remove',
						description: 'Remove host',
						action: 'Remove host',
					},
					{
						name: 'Reset Task State',
						value: 'resetTaskState',
						description: 'Reset host task state',
						action: 'Reset host task state',
					},
					{
						name: 'Update Task Maintenance Date',
						value: 'updateTaskMaintenanceDate',
						description: 'Update host task maintenance date',
						action: 'Update host task maintenance date',
					},
				],
				default: 'get',
			},
			// NSX-T Edge operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['nsxtEdge'],
					},
				},
				options: [
					{
						name: 'Check Resilience Can Be Enabled',
						value: 'checkResilienceCanBeEnabled',
						description: 'Check if resilience can be enabled on edge',
						action: 'Check if resilience can be enabled on edge',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create NSX-T edge',
						action: 'Create NSX-T edge',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete NSX-T edge',
						action: 'Delete NSX-T edge',
					},
					{
						name: 'Disable Resilience',
						value: 'disableResilience',
						description: 'Disable resilience on edge',
						action: 'Disable resilience on edge',
					},
					{
						name: 'Enable Resilience',
						value: 'enableResilience',
						description: 'Enable resilience on edge',
						action: 'Enable resilience on edge',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get NSX-T edge information',
						action: 'Get NSX-T edge information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many NSX-T edges',
						action: 'Get many NSX-T edges',
					},
					{
						name: 'Get Resilience',
						value: 'getResilience',
						description: 'Get edge resilience status',
						action: 'Get edge resilience status',
					},
					{
						name: 'Relocate',
						value: 'relocate',
						description: 'Relocate edge',
						action: 'Relocate edge',
					},
				],
				default: 'get',
			},
			// Private Gateway operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['privateGateway'],
					},
				},
				options: [
					{
						name: 'Disable',
						value: 'disable',
						description: 'Disable private gateway',
						action: 'Disable private gateway',
					},
					{
						name: 'Enable',
						value: 'enable',
						description: 'Enable private gateway',
						action: 'Enable private gateway',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get private gateway information',
						action: 'Get private gateway information',
					},
				],
				default: 'get',
			},
			// Service name field
			{
				displayName: 'Service Name or ID',
				name: 'serviceName',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getPrivateCloudServices',
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['service'],
						operation: ['get', 'update'],
					},
				},
				placeholder: 'pcc-xxx-xxx-xxx-xxx',
				description: 'The Private Cloud service name. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			// Service name field for other resources
			{
				displayName: 'Service Name or ID',
				name: 'serviceName',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getPrivateCloudServices',
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['backup', 'cluster', 'datacenter', 'disasterRecovery', 'filer', 'host', 'nsxtEdge', 'privateGateway', 'vm', 'user', 'task'],
					},
				},
				placeholder: 'pcc-xxx-xxx-xxx-xxx',
				description: 'The Private Cloud service name. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			// Datacenter ID field
			{
				displayName: 'Datacenter Name or ID',
				name: 'datacenterId',
				type: 'options',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getDatacenters',
					loadOptionsDependsOn: ['serviceName'],
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['datacenter'],
						operation: ['get', 'update'],
					},
				},
			},
			// Datacenter ID field for other resources
			{
				displayName: 'Datacenter Name or ID',
				name: 'datacenterId',
				type: 'options',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getDatacenters',
					loadOptionsDependsOn: ['serviceName'],
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['backup', 'cluster', 'disasterRecovery', 'filer', 'host', 'nsxtEdge', 'privateGateway', 'vm'],
					},
				},
			},
			// VM ID field
			{
				displayName: 'VM Name or ID',
				name: 'vmId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getVirtualMachines',
					loadOptionsDependsOn: ['serviceName', 'datacenterId'],
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['vm'],
						operation: ['get', 'powerOff', 'powerOn', 'reset', 'revertSnapshot'],
					},
				},
				description: 'The virtual machine ID. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			// User ID field
			{
				displayName: 'User Name or ID',
				name: 'userId',
				type: 'options',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getUsers',
					loadOptionsDependsOn: ['serviceName'],
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['get', 'delete', 'update'],
					},
				},
			},
			// Task ID field
			{
				displayName: 'Task Name or ID',
				name: 'taskId',
				type: 'options',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getTasks',
					loadOptionsDependsOn: ['serviceName'],
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['get'],
					},
				},
			},
			// Host ID field
			{
				displayName: 'Host Name or ID',
				name: 'hostId',
				type: 'options',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getHosts',
					loadOptionsDependsOn: ['serviceName', 'datacenterId'],
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['host'],
						operation: ['get', 'getLocation', 'remove', 'addHostSpare', 'getResilience', 'checkResilienceCanBeEnabled', 'enableResilience', 'disableResilience', 'getTask', 'getTasks', 'resetTaskState', 'updateTaskMaintenanceDate'],
					},
				},
			},
			// NSX-T Edge ID field
			{
				displayName: 'NSX-T Edge Name or ID',
				name: 'nsxtEdgeId',
				type: 'options',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getNsxtEdges',
					loadOptionsDependsOn: ['serviceName', 'datacenterId'],
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['nsxtEdge'],
						operation: ['get', 'delete', 'relocate', 'getResilience', 'checkResilienceCanBeEnabled', 'enableResilience', 'disableResilience'],
					},
				},
			},
			// Task ID field for host and datacenter operations
			{
				displayName: 'Task ID',
				name: 'taskId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['host', 'datacenter'],
						operation: ['getTask', 'resetTaskState', 'updateTaskMaintenanceDate'],
					},
				},
				placeholder: '12345',
			},
			// User creation fields
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['create'],
					},
				},
				description: 'The username',
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['create'],
					},
				},
				description: 'The user password',
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
						description: 'The user email address',
					},
					{
						displayName: 'Full Name',
						name: 'fullName',
						type: 'string',
						default: '',
						description: 'The user full name',
					},
					{
						displayName: 'Phone Number',
						name: 'phoneNumber',
						type: 'string',
						default: '',
						description: 'The user phone number',
					},
				],
			},
			// Snapshot name for revert operation
			{
				displayName: 'Snapshot Name or ID',
				name: 'snapshotName',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getSnapshots',
					loadOptionsDependsOn: ['serviceName', 'datacenterId', 'vmId'],
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['vm'],
						operation: ['revertSnapshot'],
					},
				},
				description: 'The name of the snapshot to revert to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			// Service update fields
			{
				displayName: 'Update Fields',
				name: 'updateProperties',
				type: 'collection',
				placeholder: 'Add Property',
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
						displayName: 'SslV3',
						name: 'sslV3',
						type: 'boolean',
						default: false,
						description: 'Whether to enable SSLv3',
					},
					{
						displayName: 'User Access Policy',
						name: 'userAccessPolicy',
						type: 'options',
						options: [
							{
								name: 'FILTERED',
								value: 'FILTERED',
							},
							{
								name: 'NO_ACCESS',
								value: 'NO_ACCESS',
							},
							{
								name: 'OPEN',
								value: 'OPEN',
							},
						],
						default: 'FILTERED',
						description: 'User access policy for the service',
					},
					{
						displayName: 'User Limit Concurrent Session',
						name: 'userLimitConcurrentSession',
						type: 'number',
						default: 0,
						description: 'Maximum number of concurrent sessions per user',
					},
					{
						displayName: 'User Session Timeout',
						name: 'userSessionTimeout',
						type: 'number',
						default: 0,
						description: 'User session timeout in seconds',
					},
					{
						displayName: 'Web Access',
						name: 'webAccess',
						type: 'boolean',
						default: true,
						description: 'Whether to enable web access',
					},
				],
			},
			// Cluster ID field
			{
				displayName: 'Cluster Name or ID',
				name: 'clusterId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getClusters',
					loadOptionsDependsOn: ['serviceName', 'datacenterId'],
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['cluster'],
						operation: ['get', 'createNsxt', 'updateNsxt', 'deleteNsxt'],
					},
				},
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			// Filer ID field
			{
				displayName: 'Filer Name or ID',
				name: 'filerId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getFilers',
					loadOptionsDependsOn: ['serviceName', 'datacenterId'],
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['filer'],
						operation: ['get', 'getLocation', 'checkGlobalCompatible', 'convertToGlobal', 'remove', 'getTasks', 'getTask'],
					},
				},
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			// Host ID field
			{
				displayName: 'Host Name or ID',
				name: 'hostId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getHosts',
					loadOptionsDependsOn: ['serviceName', 'datacenterId'],
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['host'],
						operation: ['get', 'getLocation', 'addHostSpare', 'remove'],
					},
				},
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			// Filer Task ID field
			{
				displayName: 'Task ID',
				name: 'taskId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['filer'],
						operation: ['getTask', 'resetTaskState', 'updateTaskMaintenanceDate'],
					},
				},
			},
			// Datacenter create fields
			{
				displayName: 'Datacenter Name',
				name: 'datacenterName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['datacenter'],
						operation: ['create'],
					},
				},
				description: 'Name for the new datacenter',
			},
			{
				displayName: 'Commerce Range Name',
				name: 'commerceRangeName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['datacenter'],
						operation: ['create'],
					},
				},
			},
			// Datacenter update fields
			{
				displayName: 'Update Fields',
				name: 'datacenterUpdateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['datacenter'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Datacenter description',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Datacenter name',
					},
				],
			},
			// Backup properties
			{
				displayName: 'Backup Properties',
				name: 'backupProperties',
				type: 'collection',
				placeholder: 'Add Property',
				default: {},
				displayOptions: {
					show: {
						resource: ['backup'],
						operation: ['changeProperties'],
					},
				},
				options: [
					{
						displayName: 'Backup Duration',
						name: 'backupDuration',
						type: 'number',
						default: 0,
						description: 'Backup duration in days',
					},
					{
						displayName: 'Backup Schedule',
						name: 'backupSchedule',
						type: 'string',
						default: '',
					},
				],
			},
			// Disaster Recovery Type
			{
				displayName: 'Disaster Recovery Type',
				name: 'disasterRecoveryType',
				type: 'options',
				options: [
					{
						name: 'Zerto',
						value: 'zerto',
					},
					{
						name: 'Zerto Single',
						value: 'zertoSingle',
					},
				],
				default: 'zerto',
				displayOptions: {
					show: {
						resource: ['disasterRecovery'],
					},
				},
				description: 'Type of disaster recovery',
			},
			// Remote site ID for disaster recovery
			{
				displayName: 'Remote Site ID',
				name: 'remoteSiteId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['disasterRecovery'],
						operation: ['deleteRemoteSite'],
					},
				},
			},
			// VPN Configuration
			{
				displayName: 'VPN Configuration',
				name: 'vpnConfig',
				type: 'collection',
				placeholder: 'Add Configuration',
				default: {},
				displayOptions: {
					show: {
						resource: ['disasterRecovery'],
						operation: ['configureVpn'],
					},
				},
				options: [
					{
						displayName: 'Local IP',
						name: 'localIp',
						type: 'string',
						default: '',
						description: 'Local IP address',
					},
					{
						displayName: 'Remote IP',
						name: 'remoteIp',
						type: 'string',
						default: '',
						description: 'Remote IP address',
					},
					{
						displayName: 'Pre-Shared Key',
						name: 'preSharedKey',
						type: 'string',
						typeOptions: {
							password: true,
						},
						default: '',
						description: 'Pre-shared key for VPN',
					},
				],
			},
			// Remote site configuration
			{
				displayName: 'Remote Site Configuration',
				name: 'remoteSiteConfig',
				type: 'collection',
				placeholder: 'Add Configuration',
				default: {},
				displayOptions: {
					show: {
						resource: ['disasterRecovery'],
						operation: ['createRemoteSite'],
					},
				},
				options: [
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{
								name: 'OVH',
								value: 'ovh',
							},
							{
								name: 'On Premise',
								value: 'onPremise',
							},
						],
						default: 'ovh',
						description: 'Remote site type',
					},
					{
						displayName: 'Service Name',
						name: 'serviceName',
						type: 'string',
						default: '',
						description: 'Remote service name',
					},
					{
						displayName: 'Datacenter ID',
						name: 'datacenterId',
						type: 'number',
						default: 0,
						description: 'Remote datacenter ID',
					},
				],
			},
			// Task maintenance date
			{
				displayName: 'Execution Date',
				name: 'executionDate',
				type: 'dateTime',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['filer'],
						operation: ['updateTaskMaintenanceDate'],
					},
				},
				description: 'New maintenance execution date',
			},
			// Host spare reason
			{
				displayName: 'Spare Reason',
				name: 'spareReason',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['host'],
						operation: ['addHostSpare'],
					},
				},
				description: 'Reason for adding host spare',
			},
		],
	};

	methods = {
		loadOptions: {
			async getPrivateCloudServices(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('ovhApi');
				const endpoint = credentials.endpoint as string;
				const applicationKey = credentials.applicationKey as string;
				const applicationSecret = credentials.applicationSecret as string;
				const consumerKey = credentials.consumerKey as string;

				const path = '/dedicatedCloud';
				const timestamp = Math.round(Date.now() / 1000);
				const fullUrl = `${endpoint}${path}`;

				const signatureElements = [
					applicationSecret,
					consumerKey,
					'GET',
					fullUrl,
					'',
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
					method: 'GET',
					url: fullUrl,
					headers,
					json: true,
				};

				try {
					const responseData = await this.helpers.request(options);
					const services = Array.isArray(responseData) ? responseData : [];
					
					return services.map((service: string) => ({
						name: service,
						value: service,
					}));
				} catch (error) {
					return [];
				}
			},

			async getDatacenters(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const serviceName = this.getCurrentNodeParameter('serviceName') as string;
				if (!serviceName) return [];

				const credentials = await this.getCredentials('ovhApi');
				const endpoint = credentials.endpoint as string;
				const applicationKey = credentials.applicationKey as string;
				const applicationSecret = credentials.applicationSecret as string;
				const consumerKey = credentials.consumerKey as string;

				const path = `/dedicatedCloud/${serviceName}/datacenter`;
				const timestamp = Math.round(Date.now() / 1000);
				const fullUrl = `${endpoint}${path}`;

				const signatureElements = [
					applicationSecret,
					consumerKey,
					'GET',
					fullUrl,
					'',
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
					method: 'GET',
					url: fullUrl,
					headers,
					json: true,
				};

				try {
					const responseData = await this.helpers.request(options);
					const datacenters = Array.isArray(responseData) ? responseData : [];
					
					// Get details for each datacenter
					const detailPromises = datacenters.map(async (datacenterId: number) => {
						const detailPath = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}`;
						const detailUrl = `${endpoint}${detailPath}`;
						
						const detailSignature = [
							applicationSecret,
							consumerKey,
							'GET',
							detailUrl,
							'',
							timestamp,
						];
						
						const detailSig = '$1$' + createHash('sha1').update(detailSignature.join('+')).digest('hex');
						
						const detailOptions: IRequestOptions = {
							method: 'GET',
							url: detailUrl,
							headers: {
								...headers,
								'X-Ovh-Signature': detailSig,
							},
							json: true,
						};
						
						try {
							const detail = await this.helpers.request(detailOptions);
							return {
								name: detail.name || `Datacenter ${datacenterId}`,
								value: datacenterId.toString(),
							};
						} catch {
							return {
								name: `Datacenter ${datacenterId}`,
								value: datacenterId.toString(),
							};
						}
					});
					
					return await Promise.all(detailPromises);
				} catch (error) {
					return [];
				}
			},

			async getVirtualMachines(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const serviceName = this.getCurrentNodeParameter('serviceName') as string;
				const datacenterId = this.getCurrentNodeParameter('datacenterId') as string;
				
				if (!serviceName || !datacenterId) return [];

				const credentials = await this.getCredentials('ovhApi');
				const endpoint = credentials.endpoint as string;
				const applicationKey = credentials.applicationKey as string;
				const applicationSecret = credentials.applicationSecret as string;
				const consumerKey = credentials.consumerKey as string;

				const path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm`;
				const timestamp = Math.round(Date.now() / 1000);
				const fullUrl = `${endpoint}${path}`;

				const signatureElements = [
					applicationSecret,
					consumerKey,
					'GET',
					fullUrl,
					'',
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
					method: 'GET',
					url: fullUrl,
					headers,
					json: true,
				};

				try {
					const responseData = await this.helpers.request(options);
					const vms = Array.isArray(responseData) ? responseData : [];
					
					// Get details for each VM
					const detailPromises = vms.map(async (vmId: number) => {
						const detailPath = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm/${vmId}`;
						const detailUrl = `${endpoint}${detailPath}`;
						
						const detailSignature = [
							applicationSecret,
							consumerKey,
							'GET',
							detailUrl,
							'',
							timestamp,
						];
						
						const detailSig = '$1$' + createHash('sha1').update(detailSignature.join('+')).digest('hex');
						
						const detailOptions: IRequestOptions = {
							method: 'GET',
							url: detailUrl,
							headers: {
								...headers,
								'X-Ovh-Signature': detailSig,
							},
							json: true,
						};
						
						try {
							const detail = await this.helpers.request(detailOptions);
							const state = detail.state ? ` (${detail.state})` : '';
							return {
								name: `${detail.name || `VM ${vmId}`}${state}`,
								value: vmId.toString(),
							};
						} catch {
							return {
								name: `VM ${vmId}`,
								value: vmId.toString(),
							};
						}
					});
					
					return await Promise.all(detailPromises);
				} catch (error) {
					return [];
				}
			},

			async getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const serviceName = this.getCurrentNodeParameter('serviceName') as string;
				if (!serviceName) return [];

				const credentials = await this.getCredentials('ovhApi');
				const endpoint = credentials.endpoint as string;
				const applicationKey = credentials.applicationKey as string;
				const applicationSecret = credentials.applicationSecret as string;
				const consumerKey = credentials.consumerKey as string;

				const path = `/dedicatedCloud/${serviceName}/user`;
				const timestamp = Math.round(Date.now() / 1000);
				const fullUrl = `${endpoint}${path}`;

				const signatureElements = [
					applicationSecret,
					consumerKey,
					'GET',
					fullUrl,
					'',
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
					method: 'GET',
					url: fullUrl,
					headers,
					json: true,
				};

				try {
					const responseData = await this.helpers.request(options);
					const users = Array.isArray(responseData) ? responseData : [];
					
					// Get details for each user
					const detailPromises = users.map(async (userId: number) => {
						const detailPath = `/dedicatedCloud/${serviceName}/user/${userId}`;
						const detailUrl = `${endpoint}${detailPath}`;
						
						const detailSignature = [
							applicationSecret,
							consumerKey,
							'GET',
							detailUrl,
							'',
							timestamp,
						];
						
						const detailSig = '$1$' + createHash('sha1').update(detailSignature.join('+')).digest('hex');
						
						const detailOptions: IRequestOptions = {
							method: 'GET',
							url: detailUrl,
							headers: {
								...headers,
								'X-Ovh-Signature': detailSig,
							},
							json: true,
						};
						
						try {
							const detail = await this.helpers.request(detailOptions);
							return {
								name: detail.name || `User ${userId}`,
								value: userId.toString(),
							};
						} catch {
							return {
								name: `User ${userId}`,
								value: userId.toString(),
							};
						}
					});
					
					return await Promise.all(detailPromises);
				} catch (error) {
					return [];
				}
			},

			async getTasks(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const serviceName = this.getCurrentNodeParameter('serviceName') as string;
				if (!serviceName) return [];

				const credentials = await this.getCredentials('ovhApi');
				const endpoint = credentials.endpoint as string;
				const applicationKey = credentials.applicationKey as string;
				const applicationSecret = credentials.applicationSecret as string;
				const consumerKey = credentials.consumerKey as string;

				const path = `/dedicatedCloud/${serviceName}/task`;
				const timestamp = Math.round(Date.now() / 1000);
				const fullUrl = `${endpoint}${path}`;

				const signatureElements = [
					applicationSecret,
					consumerKey,
					'GET',
					fullUrl,
					'',
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
					method: 'GET',
					url: fullUrl,
					headers,
					json: true,
				};

				try {
					const responseData = await this.helpers.request(options);
					const tasks = Array.isArray(responseData) ? responseData : [];
					
					// Get details for each task
					const detailPromises = tasks.map(async (taskId: number) => {
						const detailPath = `/dedicatedCloud/${serviceName}/task/${taskId}`;
						const detailUrl = `${endpoint}${detailPath}`;
						
						const detailSignature = [
							applicationSecret,
							consumerKey,
							'GET',
							detailUrl,
							'',
							timestamp,
						];
						
						const detailSig = '$1$' + createHash('sha1').update(detailSignature.join('+')).digest('hex');
						
						const detailOptions: IRequestOptions = {
							method: 'GET',
							url: detailUrl,
							headers: {
								...headers,
								'X-Ovh-Signature': detailSig,
							},
							json: true,
						};
						
						try {
							const detail = await this.helpers.request(detailOptions);
							const state = detail.state ? ` - ${detail.state}` : '';
							const name = detail.name || detail.type || 'Task';
							return {
								name: `${name} ${taskId}${state}`,
								value: taskId.toString(),
							};
						} catch {
							return {
								name: `Task ${taskId}`,
								value: taskId.toString(),
							};
						}
					});
					
					return await Promise.all(detailPromises);
				} catch (error) {
					return [];
				}
			},

			async getSnapshots(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const serviceName = this.getCurrentNodeParameter('serviceName') as string;
				const datacenterId = this.getCurrentNodeParameter('datacenterId') as string;
				const vmId = this.getCurrentNodeParameter('vmId') as string;
				
				if (!serviceName || !datacenterId || !vmId) return [];

				const credentials = await this.getCredentials('ovhApi');
				const endpoint = credentials.endpoint as string;
				const applicationKey = credentials.applicationKey as string;
				const applicationSecret = credentials.applicationSecret as string;
				const consumerKey = credentials.consumerKey as string;

				// First get VM details to access snapshots
				const path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm/${vmId}`;
				const timestamp = Math.round(Date.now() / 1000);
				const fullUrl = `${endpoint}${path}`;

				const signatureElements = [
					applicationSecret,
					consumerKey,
					'GET',
					fullUrl,
					'',
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
					method: 'GET',
					url: fullUrl,
					headers,
					json: true,
				};

				try {
					const vmData = await this.helpers.request(options);
					// Check if snapshots exist on VM data
					if (vmData.snapshots && Array.isArray(vmData.snapshots)) {
						return vmData.snapshots.map((snapshot: any) => ({
							name: snapshot.name || snapshot.description || `Snapshot ${snapshot.id}`,
							value: snapshot.name || snapshot.id,
						}));
					}
					
					// If snapshots not in VM data, try snapshot endpoint
					const snapshotPath = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm/${vmId}/snapshot`;
					const snapshotUrl = `${endpoint}${snapshotPath}`;
					
					const snapshotSignature = [
						applicationSecret,
						consumerKey,
						'GET',
						snapshotUrl,
						'',
						timestamp,
					];
					
					const snapshotSig = '$1$' + createHash('sha1').update(snapshotSignature.join('+')).digest('hex');
					
					const snapshotOptions: IRequestOptions = {
						method: 'GET',
						url: snapshotUrl,
						headers: {
							...headers,
							'X-Ovh-Signature': snapshotSig,
						},
						json: true,
					};
					
					const snapshots = await this.helpers.request(snapshotOptions);
					if (Array.isArray(snapshots)) {
						return snapshots.map((snapshot: any) => ({
							name: snapshot.name || snapshot.description || `Snapshot ${snapshot.id}`,
							value: snapshot.name || snapshot.id,
						}));
					}
					
					return [];
				} catch (error) {
					// If no snapshots, return empty array
					return [];
				}
			},

			async getClusters(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const serviceName = this.getCurrentNodeParameter('serviceName') as string;
				const datacenterId = this.getCurrentNodeParameter('datacenterId') as string;
				
				if (!serviceName || !datacenterId) return [];

				const credentials = await this.getCredentials('ovhApi');
				const endpoint = credentials.endpoint as string;
				const applicationKey = credentials.applicationKey as string;
				const applicationSecret = credentials.applicationSecret as string;
				const consumerKey = credentials.consumerKey as string;

				const path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/cluster`;
				const timestamp = Math.round(Date.now() / 1000);
				const fullUrl = `${endpoint}${path}`;

				const signatureElements = [
					applicationSecret,
					consumerKey,
					'GET',
					fullUrl,
					'',
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
					method: 'GET',
					url: fullUrl,
					headers,
					json: true,
				};

				try {
					const responseData = await this.helpers.request(options);
					const clusters = Array.isArray(responseData) ? responseData : [];
					
					// Get details for each cluster
					const detailPromises = clusters.map(async (clusterId: number) => {
						const detailPath = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/cluster/${clusterId}`;
						const detailUrl = `${endpoint}${detailPath}`;
						
						const detailSignature = [
							applicationSecret,
							consumerKey,
							'GET',
							detailUrl,
							'',
							timestamp,
						];
						
						const detailSig = '$1$' + createHash('sha1').update(detailSignature.join('+')).digest('hex');
						
						const detailOptions: IRequestOptions = {
							method: 'GET',
							url: detailUrl,
							headers: {
								...headers,
								'X-Ovh-Signature': detailSig,
							},
							json: true,
						};
						
						try {
							const detail = await this.helpers.request(detailOptions);
							return {
								name: detail.name || `Cluster ${clusterId}`,
								value: clusterId.toString(),
							};
						} catch {
							return {
								name: `Cluster ${clusterId}`,
								value: clusterId.toString(),
							};
						}
					});
					
					return await Promise.all(detailPromises);
				} catch (error) {
					return [];
				}
			},

			async getFilers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const serviceName = this.getCurrentNodeParameter('serviceName') as string;
				const datacenterId = this.getCurrentNodeParameter('datacenterId') as string;
				
				if (!serviceName || !datacenterId) return [];

				const credentials = await this.getCredentials('ovhApi');
				const endpoint = credentials.endpoint as string;
				const applicationKey = credentials.applicationKey as string;
				const applicationSecret = credentials.applicationSecret as string;
				const consumerKey = credentials.consumerKey as string;

				const path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/filer`;
				const timestamp = Math.round(Date.now() / 1000);
				const fullUrl = `${endpoint}${path}`;

				const signatureElements = [
					applicationSecret,
					consumerKey,
					'GET',
					fullUrl,
					'',
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
					method: 'GET',
					url: fullUrl,
					headers,
					json: true,
				};

				try {
					const responseData = await this.helpers.request(options);
					const filers = Array.isArray(responseData) ? responseData : [];
					
					// Get details for each filer
					const detailPromises = filers.map(async (filerId: number) => {
						const detailPath = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/filer/${filerId}`;
						const detailUrl = `${endpoint}${detailPath}`;
						
						const detailSignature = [
							applicationSecret,
							consumerKey,
							'GET',
							detailUrl,
							'',
							timestamp,
						];
						
						const detailSig = '$1$' + createHash('sha1').update(detailSignature.join('+')).digest('hex');
						
						const detailOptions: IRequestOptions = {
							method: 'GET',
							url: detailUrl,
							headers: {
								...headers,
								'X-Ovh-Signature': detailSig,
							},
							json: true,
						};
						
						try {
							const detail = await this.helpers.request(detailOptions);
							return {
								name: detail.name || `Filer ${filerId}`,
								value: filerId.toString(),
							};
						} catch {
							return {
								name: `Filer ${filerId}`,
								value: filerId.toString(),
							};
						}
					});
					
					return await Promise.all(detailPromises);
				} catch (error) {
					return [];
				}
			},

			async getHosts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const serviceName = this.getCurrentNodeParameter('serviceName') as string;
				const datacenterId = this.getCurrentNodeParameter('datacenterId') as string;
				
				if (!serviceName || !datacenterId) return [];

				const credentials = await this.getCredentials('ovhApi');
				const endpoint = credentials.endpoint as string;
				const applicationKey = credentials.applicationKey as string;
				const applicationSecret = credentials.applicationSecret as string;
				const consumerKey = credentials.consumerKey as string;

				const path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/host`;
				const timestamp = Math.round(Date.now() / 1000);
				const fullUrl = `${endpoint}${path}`;

				const signatureElements = [
					applicationSecret,
					consumerKey,
					'GET',
					fullUrl,
					'',
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
					method: 'GET',
					url: fullUrl,
					headers,
					json: true,
				};

				try {
					const responseData = await this.helpers.request(options);
					const hosts = Array.isArray(responseData) ? responseData : [];
					
					// Get details for each host
					const detailPromises = hosts.map(async (hostId: number) => {
						const detailPath = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/host/${hostId}`;
						const detailUrl = `${endpoint}${detailPath}`;
						
						const detailSignature = [
							applicationSecret,
							consumerKey,
							'GET',
							detailUrl,
							'',
							timestamp,
						];
						
						const detailSig = '$1$' + createHash('sha1').update(detailSignature.join('+')).digest('hex');
						
						const detailOptions: IRequestOptions = {
							method: 'GET',
							url: detailUrl,
							headers: {
								...headers,
								'X-Ovh-Signature': detailSig,
							},
							json: true,
						};
						
						try {
							const detail = await this.helpers.request(detailOptions);
							const state = detail.state ? ` (${detail.state})` : '';
							return {
								name: `${detail.name || `Host ${hostId}`}${state}`,
								value: hostId.toString(),
							};
						} catch {
							return {
								name: `Host ${hostId}`,
								value: hostId.toString(),
							};
						}
					});
					
					return await Promise.all(detailPromises);
				} catch (error) {
					return [];
				}
			},

			async getNsxtEdges(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const serviceName = this.getCurrentNodeParameter('serviceName') as string;
				const datacenterId = this.getCurrentNodeParameter('datacenterId') as string;
				if (!serviceName || !datacenterId) return [];

				const credentials = await this.getCredentials('ovhApi');
				const endpoint = credentials.endpoint as string;
				const applicationKey = credentials.applicationKey as string;
				const applicationSecret = credentials.applicationSecret as string;
				const consumerKey = credentials.consumerKey as string;

				const path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/nsxtEdge`;
				const timestamp = Math.round(Date.now() / 1000);
				const fullUrl = `${endpoint}${path}`;

				const signatureElements = [
					applicationSecret,
					consumerKey,
					'GET',
					fullUrl,
					'',
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
					method: 'GET',
					url: fullUrl,
					headers,
					json: true,
				};

				try {
					const responseData = await this.helpers.request(options);
					const edges = Array.isArray(responseData) ? responseData : [];
					
					// Get details for each edge
					const detailPromises = edges.map(async (edgeId: number) => {
						const detailPath = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/nsxtEdge/${edgeId}`;
						const detailUrl = `${endpoint}${detailPath}`;
						
						const detailSignature = [
							applicationSecret,
							consumerKey,
							'GET',
							detailUrl,
							'',
							timestamp,
						];
						
						const detailSig = '$1$' + createHash('sha1').update(detailSignature.join('+')).digest('hex');
						
						const detailOptions: IRequestOptions = {
							method: 'GET',
							url: detailUrl,
							headers: {
								...headers,
								'X-Ovh-Signature': detailSig,
							},
							json: true,
						};
						
						try {
							const detail = await this.helpers.request(detailOptions);
							const state = detail.state ? ` (${detail.state})` : '';
							return {
								name: `${detail.name || `NSX-T Edge ${edgeId}`}${state}`,
								value: edgeId.toString(),
							};
						} catch {
							return {
								name: `NSX-T Edge ${edgeId}`,
								value: edgeId.toString(),
							};
						}
					});
					
					return await Promise.all(detailPromises);
				} catch (error) {
					return [];
				}
			},
		},
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

				if (resource === 'service') {
					if (operation === 'get') {
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/dedicatedCloud/${serviceName}`;
					} else if (operation === 'getAll') {
						path = '/dedicatedCloud';
					} else if (operation === 'getServiceInfo') {
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/dedicatedCloud/${serviceName}/serviceInfos`;
					} else if (operation === 'update') {
						method = 'POST';
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						const updateProperties = this.getNodeParameter('updateProperties', i) as IDataObject;
						path = `/dedicatedCloud/${serviceName}/changeProperties`;
						
						// Only add properties that are provided
						if (updateProperties.description !== undefined) body.description = updateProperties.description;
						if (updateProperties.userLimitConcurrentSession !== undefined) body.userLimitConcurrentSession = updateProperties.userLimitConcurrentSession;
						if (updateProperties.userAccessPolicy !== undefined) body.userAccessPolicy = updateProperties.userAccessPolicy;
						if (updateProperties.userSessionTimeout !== undefined) body.userSessionTimeout = updateProperties.userSessionTimeout;
						if (updateProperties.sslV3 !== undefined) body.sslV3 = updateProperties.sslV3;
						if (updateProperties.webAccess !== undefined) body.webAccess = updateProperties.webAccess;
					}
				} else if (resource === 'datacenter') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;

					if (operation === 'get') {
						const datacenterId = parseInt(this.getNodeParameter('datacenterId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}`;
					} else if (operation === 'getAll') {
						path = `/dedicatedCloud/${serviceName}/datacenter`;
					} else if (operation === 'create') {
						method = 'POST';
						const datacenterName = this.getNodeParameter('datacenterName', i) as string;
						const commerceRangeName = this.getNodeParameter('commerceRangeName', i) as string;
						path = `/dedicatedCloud/${serviceName}/datacenter`;
						body = {
							name: datacenterName,
							commerceRangeName,
						};
					} else if (operation === 'update') {
						method = 'PUT';
						const datacenterId = parseInt(this.getNodeParameter('datacenterId', i) as string, 10);
						const updateFields = this.getNodeParameter('datacenterUpdateFields', i) as IDataObject;
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}`;
						
						if (updateFields.description !== undefined) body.description = updateFields.description;
						if (updateFields.name !== undefined) body.name = updateFields.name;
					} else if (operation === 'getTask') {
						const datacenterId = parseInt(this.getNodeParameter('datacenterId', i) as string, 10);
						const taskId = this.getNodeParameter('taskId', i) as string;
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/task/${taskId}`;
					} else if (operation === 'getTasks') {
						const datacenterId = parseInt(this.getNodeParameter('datacenterId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/task`;
					} else if (operation === 'resetTaskState') {
						method = 'POST';
						const datacenterId = parseInt(this.getNodeParameter('datacenterId', i) as string, 10);
						const taskId = this.getNodeParameter('taskId', i) as string;
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/task/${taskId}/resetTaskState`;
					} else if (operation === 'updateTaskMaintenanceDate') {
						method = 'POST';
						const datacenterId = parseInt(this.getNodeParameter('datacenterId', i) as string, 10);
						const taskId = this.getNodeParameter('taskId', i) as string;
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/task/${taskId}/updateMaintenanceExecutionDate`;
						// TODO: Add maintenance date field if needed
					} else if (operation === 'orderFiler') {
						method = 'POST';
						const datacenterId = parseInt(this.getNodeParameter('datacenterId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/orderNewFiler`;
						// TODO: Add order parameters if needed
					} else if (operation === 'orderHost') {
						method = 'POST';
						const datacenterId = parseInt(this.getNodeParameter('datacenterId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/orderNewHost`;
						// TODO: Add order parameters if needed
					} else if (operation === 'orderHostHour') {
						method = 'POST';
						const datacenterId = parseInt(this.getNodeParameter('datacenterId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/orderHourlyHost`;
						// TODO: Add order parameters if needed
					}
				} else if (resource === 'vm') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					const datacenterId = parseInt(this.getNodeParameter('datacenterId', i) as string, 10);

					if (operation === 'get') {
						const vmId = parseInt(this.getNodeParameter('vmId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm/${vmId}`;
					} else if (operation === 'getAll') {
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm`;
					} else if (operation === 'powerOff') {
						method = 'POST';
						const vmId = parseInt(this.getNodeParameter('vmId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm/${vmId}/powerOff`;
					} else if (operation === 'powerOn') {
						method = 'POST';
						const vmId = parseInt(this.getNodeParameter('vmId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm/${vmId}/powerOn`;
					} else if (operation === 'reset') {
						method = 'POST';
						const vmId = parseInt(this.getNodeParameter('vmId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm/${vmId}/reset`;
					} else if (operation === 'revertSnapshot') {
						method = 'POST';
						const vmId = parseInt(this.getNodeParameter('vmId', i) as string, 10);
						const snapshotName = this.getNodeParameter('snapshotName', i) as string;
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm/${vmId}/revertSnapshot`;
						body = { snapshotName };
					} else if (operation === 'getBackup') {
						const vmId = parseInt(this.getNodeParameter('vmId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm/${vmId}/backup`;
					} else if (operation === 'enableBackup') {
						method = 'POST';
						const vmId = parseInt(this.getNodeParameter('vmId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm/${vmId}/backup/enable`;
						// TODO: Add backup enable parameters if needed
					} else if (operation === 'disableBackup') {
						method = 'POST';
						const vmId = parseInt(this.getNodeParameter('vmId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm/${vmId}/backup/disable`;
					} else if (operation === 'createBackup') {
						method = 'POST';
						const vmId = parseInt(this.getNodeParameter('vmId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm/${vmId}/backup`;
						// TODO: Add backup creation parameters if needed
					} else if (operation === 'restoreBackup') {
						method = 'POST';
						const vmId = parseInt(this.getNodeParameter('vmId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm/${vmId}/backup/restore`;
						// TODO: Add restore parameters if needed
					} else if (operation === 'getBackupOfferTypes') {
						const vmId = parseInt(this.getNodeParameter('vmId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm/${vmId}/backupOfferType`;
					} else if (operation === 'getCarp') {
						const vmId = parseInt(this.getNodeParameter('vmId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm/${vmId}/carp`;
					} else if (operation === 'updateCarp') {
						method = 'POST';
						const vmId = parseInt(this.getNodeParameter('vmId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm/${vmId}/carp`;
						// TODO: Add CARP update parameters if needed
					} else if (operation === 'getLicense') {
						const vmId = parseInt(this.getNodeParameter('vmId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm/${vmId}/license`;
					}
				} else if (resource === 'user') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;

					if (operation === 'get') {
						const userId = parseInt(this.getNodeParameter('userId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/user/${userId}`;
					} else if (operation === 'getAll') {
						path = `/dedicatedCloud/${serviceName}/user`;
					} else if (operation === 'create') {
						method = 'POST';
						const name = this.getNodeParameter('name', i) as string;
						const password = this.getNodeParameter('password', i) as string;
						path = `/dedicatedCloud/${serviceName}/user`;
						body = { name, password };
					} else if (operation === 'delete') {
						method = 'DELETE';
						const userId = parseInt(this.getNodeParameter('userId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/user/${userId}`;
					} else if (operation === 'update') {
						method = 'PUT';
						const userId = parseInt(this.getNodeParameter('userId', i) as string, 10);
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						path = `/dedicatedCloud/${serviceName}/user/${userId}`;

						if (updateFields.email) body.email = updateFields.email;
						if (updateFields.fullName) body.fullName = updateFields.fullName;
						if (updateFields.phoneNumber) body.phoneNumber = updateFields.phoneNumber;
					}
				} else if (resource === 'task') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;

					if (operation === 'get') {
						const taskId = parseInt(this.getNodeParameter('taskId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/task/${taskId}`;
					} else if (operation === 'getAll') {
						path = `/dedicatedCloud/${serviceName}/task`;
					}
				} else if (resource === 'backup') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					const datacenterId = parseInt(this.getNodeParameter('datacenterId', i) as string, 10);

					if (operation === 'get') {
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/backup`;
					} else if (operation === 'batchRestore') {
						method = 'POST';
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/backup/batchRestore`;
					} else if (operation === 'canOptimizeProxies') {
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/backup/canOptimizeProxies`;
					} else if (operation === 'changeProperties') {
						method = 'POST';
						const backupProperties = this.getNodeParameter('backupProperties', i) as IDataObject;
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/backup/changeProperties`;
						
						if (backupProperties.backupDuration !== undefined) body.backupDuration = backupProperties.backupDuration;
						if (backupProperties.backupSchedule !== undefined) body.backupSchedule = backupProperties.backupSchedule;
					} else if (operation === 'checkJobs') {
						method = 'POST';
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/checkBackupJobs`;
					} else if (operation === 'disable') {
						method = 'POST';
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/backup/disable`;
					} else if (operation === 'generateReport') {
						method = 'POST';
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/backup/generateReport`;
					} else if (operation === 'getOfferCapabilities') {
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/backup/offerCapabilities`;
					} else if (operation === 'optimizeProxies') {
						method = 'POST';
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/backup/optimizeProxies`;
					}
				} else if (resource === 'cluster') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					const datacenterId = parseInt(this.getNodeParameter('datacenterId', i) as string, 10);

					if (operation === 'get') {
						const clusterId = parseInt(this.getNodeParameter('clusterId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/cluster/${clusterId}`;
					} else if (operation === 'getAll') {
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/cluster`;
					} else if (operation === 'createNsxt') {
						method = 'POST';
						const clusterId = parseInt(this.getNodeParameter('clusterId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/cluster/${clusterId}/nsxt`;
					} else if (operation === 'updateNsxt') {
						method = 'PUT';
						const clusterId = parseInt(this.getNodeParameter('clusterId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/cluster/${clusterId}/nsxt`;
					} else if (operation === 'deleteNsxt') {
						method = 'DELETE';
						const clusterId = parseInt(this.getNodeParameter('clusterId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/cluster/${clusterId}/nsxt`;
					}
				} else if (resource === 'disasterRecovery') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					const datacenterId = parseInt(this.getNodeParameter('datacenterId', i) as string, 10);
					const drType = this.getNodeParameter('disasterRecoveryType', i) as string;

					if (operation === 'disableZerto') {
						method = 'POST';
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/disasterRecovery/zerto/disable`;
					} else if (operation === 'disableZertoSingle') {
						method = 'POST';
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/disasterRecovery/zertoSingle/disable`;
					} else if (operation === 'endMigration') {
						method = 'POST';
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/disasterRecovery/zerto/endMigration`;
					} else if (operation === 'getEndpointPublicIp') {
						method = 'POST';
						if (drType === 'zerto') {
							path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/disasterRecovery/zerto/endpointPublicIp`;
						} else {
							path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/disasterRecovery/zertoSingle/endpointPublicIp`;
						}
					} else if (operation === 'getRemoteSites') {
						if (drType === 'zerto') {
							path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/disasterRecovery/zerto/remoteSites`;
						} else {
							path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/disasterRecovery/zertoSingle/remoteSites`;
						}
					} else if (operation === 'createRemoteSite') {
						method = 'POST';
						const remoteSiteConfig = this.getNodeParameter('remoteSiteConfig', i) as IDataObject;
						if (drType === 'zerto') {
							path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/disasterRecovery/zerto/remoteSites`;
						} else {
							path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/disasterRecovery/zertoSingle/remoteSites`;
						}
						body = remoteSiteConfig;
					} else if (operation === 'deleteRemoteSite') {
						method = 'DELETE';
						const remoteSiteId = this.getNodeParameter('remoteSiteId', i) as string;
						if (drType === 'zerto') {
							path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/disasterRecovery/zerto/remoteSites/${remoteSiteId}`;
						} else {
							path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/disasterRecovery/zertoSingle/remoteSites/${remoteSiteId}`;
						}
					} else if (operation === 'startMigration') {
						method = 'POST';
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/disasterRecovery/zerto/startMigration`;
					} else if (operation === 'getStatus') {
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/disasterRecovery/zerto/status`;
					} else if (operation === 'getUsageReport') {
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/disasterRecovery/zerto/usageReport`;
					} else if (operation === 'getVraResources') {
						if (drType === 'zerto') {
							path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/disasterRecovery/zerto/vraResources`;
						} else {
							path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/disasterRecovery/zertoSingle/vraResources`;
						}
					} else if (operation === 'createVraResources') {
						method = 'POST';
						if (drType === 'zerto') {
							path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/disasterRecovery/zerto/vraResources`;
						} else {
							path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/disasterRecovery/zertoSingle/vraResources`;
						}
					} else if (operation === 'configureVpn') {
						method = 'POST';
						const vpnConfig = this.getNodeParameter('vpnConfig', i) as IDataObject;
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/disasterRecovery/zertoSingle/configureVpn`;
						body = vpnConfig;
					} else if (operation === 'getDefaultLocalVraNetwork') {
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/disasterRecovery/zertoSingle/defaultLocalVraNetwork`;
					} else if (operation === 'requestPairingToken') {
						method = 'POST';
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/disasterRecovery/zertoSingle/requestPairingToken`;
					}
				} else if (resource === 'filer') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					const datacenterId = parseInt(this.getNodeParameter('datacenterId', i) as string, 10);

					if (operation === 'get') {
						const filerId = parseInt(this.getNodeParameter('filerId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/filer/${filerId}`;
					} else if (operation === 'getAll') {
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/filer`;
					} else if (operation === 'checkGlobalCompatible') {
						const filerId = parseInt(this.getNodeParameter('filerId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/filer/${filerId}/checkGlobalCompatible`;
					} else if (operation === 'convertToGlobal') {
						method = 'POST';
						const filerId = parseInt(this.getNodeParameter('filerId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/filer/${filerId}/convertToGlobal`;
					} else if (operation === 'getLocation') {
						const filerId = parseInt(this.getNodeParameter('filerId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/filer/${filerId}/location`;
					} else if (operation === 'remove') {
						method = 'POST';
						const filerId = parseInt(this.getNodeParameter('filerId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/filer/${filerId}/remove`;
					} else if (operation === 'getTasks') {
						const filerId = parseInt(this.getNodeParameter('filerId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/filer/${filerId}/task`;
					} else if (operation === 'getTask') {
						const filerId = parseInt(this.getNodeParameter('filerId', i) as string, 10);
						const taskId = this.getNodeParameter('taskId', i) as string;
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/filer/${filerId}/task/${taskId}`;
					} else if (operation === 'resetTaskState') {
						method = 'POST';
						const filerId = parseInt(this.getNodeParameter('filerId', i) as string, 10);
						const taskId = this.getNodeParameter('taskId', i) as string;
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/filer/${filerId}/task/${taskId}/resetTaskState`;
					} else if (operation === 'updateTaskMaintenanceDate') {
						method = 'POST';
						const filerId = parseInt(this.getNodeParameter('filerId', i) as string, 10);
						const taskId = this.getNodeParameter('taskId', i) as string;
						const executionDate = this.getNodeParameter('executionDate', i) as string;
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/filer/${filerId}/task/${taskId}/changeMaintenanceExecutionDate`;
						body = { executionDate };
					}
				} else if (resource === 'host') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					const datacenterId = parseInt(this.getNodeParameter('datacenterId', i) as string, 10);

					if (operation === 'get') {
						const hostId = parseInt(this.getNodeParameter('hostId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/host/${hostId}`;
					} else if (operation === 'getAll') {
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/host`;
					} else if (operation === 'addHostSpare') {
						method = 'POST';
						const hostId = parseInt(this.getNodeParameter('hostId', i) as string, 10);
						const spareReason = this.getNodeParameter('spareReason', i) as string;
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/host/${hostId}/addHostSpare`;
						body = { reason: spareReason };
					} else if (operation === 'getLocation') {
						const hostId = parseInt(this.getNodeParameter('hostId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/host/${hostId}/location`;
					} else if (operation === 'remove') {
						method = 'POST';
						const hostId = parseInt(this.getNodeParameter('hostId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/host/${hostId}/remove`;
					} else if (operation === 'getResilience') {
						const hostId = parseInt(this.getNodeParameter('hostId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/host/${hostId}/resilience`;
					} else if (operation === 'checkResilienceCanBeEnabled') {
						const hostId = parseInt(this.getNodeParameter('hostId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/host/${hostId}/resilience/canBeEnabled`;
					} else if (operation === 'enableResilience') {
						method = 'POST';
						const hostId = parseInt(this.getNodeParameter('hostId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/host/${hostId}/resilience/enable`;
					} else if (operation === 'disableResilience') {
						method = 'POST';
						const hostId = parseInt(this.getNodeParameter('hostId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/host/${hostId}/resilience/disable`;
					} else if (operation === 'getTask') {
						const hostId = parseInt(this.getNodeParameter('hostId', i) as string, 10);
						const taskId = this.getNodeParameter('taskId', i) as string;
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/host/${hostId}/task/${taskId}`;
					} else if (operation === 'getTasks') {
						const hostId = parseInt(this.getNodeParameter('hostId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/host/${hostId}/task`;
					} else if (operation === 'resetTaskState') {
						method = 'POST';
						const hostId = parseInt(this.getNodeParameter('hostId', i) as string, 10);
						const taskId = this.getNodeParameter('taskId', i) as string;
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/host/${hostId}/task/${taskId}/resetTaskState`;
					} else if (operation === 'updateTaskMaintenanceDate') {
						method = 'POST';
						const hostId = parseInt(this.getNodeParameter('hostId', i) as string, 10);
						const taskId = this.getNodeParameter('taskId', i) as string;
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/host/${hostId}/task/${taskId}/updateMaintenanceExecutionDate`;
						// TODO: Add maintenance date field if needed
					}
				} else if (resource === 'nsxtEdge') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					const datacenterId = parseInt(this.getNodeParameter('datacenterId', i) as string, 10);

					if (operation === 'get') {
						const nsxtEdgeId = parseInt(this.getNodeParameter('nsxtEdgeId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/nsxtEdge/${nsxtEdgeId}`;
					} else if (operation === 'getAll') {
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/nsxtEdge`;
					} else if (operation === 'create') {
						method = 'POST';
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/nsxtEdge`;
						// TODO: Add create parameters if needed
					} else if (operation === 'delete') {
						method = 'DELETE';
						const nsxtEdgeId = parseInt(this.getNodeParameter('nsxtEdgeId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/nsxtEdge/${nsxtEdgeId}`;
					} else if (operation === 'relocate') {
						method = 'POST';
						const nsxtEdgeId = parseInt(this.getNodeParameter('nsxtEdgeId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/nsxtEdge/${nsxtEdgeId}/relocate`;
						// TODO: Add relocate parameters if needed
					} else if (operation === 'getResilience') {
						const nsxtEdgeId = parseInt(this.getNodeParameter('nsxtEdgeId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/nsxtEdge/${nsxtEdgeId}/resilience`;
					} else if (operation === 'checkResilienceCanBeEnabled') {
						const nsxtEdgeId = parseInt(this.getNodeParameter('nsxtEdgeId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/nsxtEdge/${nsxtEdgeId}/resilience/canBeEnabled`;
					} else if (operation === 'enableResilience') {
						method = 'POST';
						const nsxtEdgeId = parseInt(this.getNodeParameter('nsxtEdgeId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/nsxtEdge/${nsxtEdgeId}/resilience/enable`;
					} else if (operation === 'disableResilience') {
						method = 'POST';
						const nsxtEdgeId = parseInt(this.getNodeParameter('nsxtEdgeId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/nsxtEdge/${nsxtEdgeId}/resilience/disable`;
					}
				} else if (resource === 'privateGateway') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					const datacenterId = parseInt(this.getNodeParameter('datacenterId', i) as string, 10);

					if (operation === 'get') {
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/privateGateway`;
					} else if (operation === 'enable') {
						method = 'POST';
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/privateGateway/enable`;
					} else if (operation === 'disable') {
						method = 'POST';
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/privateGateway/disable`;
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
