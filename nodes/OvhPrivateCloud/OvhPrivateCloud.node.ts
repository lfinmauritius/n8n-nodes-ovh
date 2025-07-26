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
						name: 'Allowed Network',
						value: 'allowedNetwork',
					},
					{
						name: 'Backup',
						value: 'backup',
					},
					{
						name: 'Backup Repository',
						value: 'backupRepository',
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
						name: 'Global',
						value: 'global',
					},
					{
						name: 'HCX',
						value: 'hcx',
					},
					{
						name: 'HD',
						value: 'hds',
					},
					{
						name: 'HIPAA',
						value: 'hipaa',
					},
					{
						name: 'Host',
						value: 'host',
					},
					{
						name: 'IAM',
						value: 'iam',
					},
					{
						name: 'IP',
						value: 'ip',
					},
					{
						name: 'Location',
						value: 'location',
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
						name: 'Robot',
						value: 'robot',
					},
					{
						name: 'Security Option',
						value: 'securityOptions',
					},
					{
						name: 'Service',
						value: 'service',
					},
					{
						name: 'Service Info',
						value: 'serviceInfos',
					},
					{
						name: 'Service Pack',
						value: 'servicePack',
					},
					{
						name: 'Tag',
						value: 'tag',
					},
					{
						name: 'Task',
						value: 'task',
					},
					{
						name: 'Two FA Whitelist',
						value: 'twoFAWhitelist',
					},
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'VLAN',
						value: 'vlan',
					},
					{
						name: 'VM',
						value: 'vm',
					},
					{
						name: 'VM Encryption',
						value: 'vmEncryption',
					},
					{
						name: 'vRack',
						value: 'vrack',
					},
					{
						name: 'vROp',
						value: 'vrops',
					},
				],
				default: 'datacenter',
			},
			// Global operations (without serviceName)
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['global'],
					},
				},
				options: [
					{
						name: 'Get All Services',
						value: 'getAllServices',
						description: 'Get all dedicated cloud services',
						action: 'Get all dedicated cloud services',
					},
					{
						name: 'Get Commercial Range',
						value: 'getCommercialRange',
						description: 'Get specific commercial range',
						action: 'Get specific commercial range',
					},
					{
						name: 'Get Commercial Ranges',
						value: 'getCommercialRanges',
						description: 'Get all commercial ranges',
						action: 'Get all commercial ranges',
					},
					{
						name: 'Get Location',
						value: 'getLocation',
						description: 'Get specific location',
						action: 'Get specific location',
					},
					{
						name: 'Get Location Host Profile',
						value: 'getLocationHostProfile',
						description: 'Get specific host profile for location',
						action: 'Get specific host profile for location',
					},
					{
						name: 'Get Location Host Profiles',
						value: 'getLocationHostProfiles',
						description: 'Get host profiles for location',
						action: 'Get host profiles for location',
					},
					{
						name: 'Get Location Host Stock',
						value: 'getLocationHostStock',
						description: 'Get host stock for location',
						action: 'Get host stock for location',
					},
					{
						name: 'Get Location Hypervisor',
						value: 'getLocationHypervisor',
						description: 'Get specific hypervisor for location',
						action: 'Get specific hypervisor for location',
					},
					{
						name: 'Get Location Hypervisors',
						value: 'getLocationHypervisors',
						description: 'Get hypervisors for location',
						action: 'Get hypervisors for location',
					},
					{
						name: 'Get Location PCC Stock',
						value: 'getLocationPccStock',
						description: 'Get PCC stock for location',
						action: 'Get PCC stock for location',
					},
					{
						name: 'Get Location Zpool Stock',
						value: 'getLocationZpoolStock',
						description: 'Get zpool stock for location',
						action: 'Get zpool stock for location',
					},
					{
						name: 'Get Locations',
						value: 'getLocations',
						description: 'Get all locations',
						action: 'Get all locations',
					},
				],
				default: 'getAllServices',
			},
			// Allowed Network operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['allowedNetwork'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create allowed network',
						action: 'Create allowed network',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete allowed network',
						action: 'Delete allowed network',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get allowed network',
						action: 'Get allowed network',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many allowed networks',
						action: 'Get many allowed networks',
					},
					{
						name: 'Get Task',
						value: 'getTask',
						description: 'Get allowed network task',
						action: 'Get allowed network task',
					},
					{
						name: 'Get Tasks',
						value: 'getTasks',
						description: 'Get allowed network tasks',
						action: 'Get allowed network tasks',
					},
					{
						name: 'Reset Task State',
						value: 'resetTaskState',
						action: 'Reset task state',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update allowed network',
						action: 'Update allowed network',
					},
				],
				default: 'get',
			},
			// Backup Repository operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['backupRepository'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get backup repository',
						action: 'Get backup repository',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many backup repositories',
						action: 'Get many backup repositories',
					},
				],
				default: 'get',
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
						name: 'Can Deploy NSX-T Edges on Global Datastores',
						value: 'canDeployNsxtEdgesOnGlobalDatastores',
						description: 'Check if NSX-T edges can be deployed on global datastores',
						action: 'Check if nsx t edges can be deployed on global datastores',
					},
					{
						name: 'Capabilities',
						value: 'capabilities',
						description: 'Get service capabilities',
						action: 'Get service capabilities',
					},
					{
						name: 'Change Contact',
						value: 'changeContact',
						description: 'Change service contact',
						action: 'Change service contact',
					},
					{
						name: 'Change Properties',
						value: 'changeProperties',
						description: 'Update service properties',
						action: 'Update service properties',
					},
					{
						name: 'Check Global Task List',
						value: 'checkGlobalTaskList',
						action: 'Check global task list',
					},
					{
						name: 'Confirm Termination',
						value: 'confirmTermination',
						description: 'Confirm service termination',
						action: 'Confirm service termination',
					},
					{
						name: 'Generate NSXv Inventory',
						value: 'generateNsxvInventory',
						action: 'Generate ns xv inventory',
					},
					{
						name: 'Generate VXLAN to vRack Mapping',
						value: 'generateVxlanToVrackMapping',
						action: 'Generate vxlan to v rack mapping',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get service information',
						action: 'Get service information',
					},
					{
						name: 'Get Commercial Range Compliance',
						value: 'getCommercialRangeCompliance',
						action: 'Get commercial range compliance',
					},
					{
						name: 'Get Commercial Range Orderable',
						value: 'getCommercialRangeOrderable',
						description: 'Get orderable commercial ranges',
						action: 'Get orderable commercial ranges',
					},
					{
						name: 'Get Global Tasks',
						value: 'getGlobalTasks',
						action: 'Get global tasks',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many services',
						action: 'Get many services',
					},
					{
						name: 'Get New Prices',
						value: 'getNewPrices',
						description: 'Get new prices for service',
						action: 'Get new prices for service',
					},
					{
						name: 'Get NSX',
						value: 'getNsx',
						description: 'Get NSX information',
						action: 'Get NSX information',
					},
					{
						name: 'Get NSXt',
						value: 'getNsxt',
						description: 'Get NSXt information',
						action: 'Get ns xt information',
					},
					{
						name: 'Get Orderable IP Countries',
						value: 'getOrderableIpCountries',
						description: 'Get countries where IPs can be ordered',
						action: 'Get countries where i ps can be ordered',
					},
					{
						name: 'Get OVH ID',
						value: 'getOvhId',
						description: 'Get OVH ID from object moref',
						action: 'Get OVH ID from object moref',
					},
					{
						name: 'Get Password Policy',
						value: 'getPasswordPolicy',
						action: 'Get password policy',
					},
					{
						name: 'Get PCI DSS',
						value: 'getPcidss',
						description: 'Get PCI DSS information',
						action: 'Get PCI DSS information',
					},
					{
						name: 'Get Service Info',
						value: 'getServiceInfo',
						description: 'Get service subscription information',
						action: 'Get service subscription information',
					},
					{
						name: 'Get vCenter Version',
						value: 'getVcenterVersion',
						description: 'Get available vCenter versions',
						action: 'Get available v center versions',
					},
					{
						name: 'Get Vendor Information',
						value: 'getVendor',
						action: 'Get vendor information',
					},
					{
						name: 'Get Vendor Object Type',
						value: 'getVendorObjectType',
						description: 'Get vendor object type from object moref',
						action: 'Get vendor object type from object moref',
					},
					{
						name: 'Order New Filer Hourly',
						value: 'orderNewFilerHourly',
						description: 'Order new filer with hourly billing',
						action: 'Order new filer with hourly billing',
					},
					{
						name: 'Reset Triggered Alarm',
						value: 'resetTriggeredAlarm',
						action: 'Reset triggered alarm',
					},
					{
						name: 'Terminate',
						value: 'terminate',
						description: 'Terminate service',
						action: 'Terminate service',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update service properties',
						action: 'Update service properties',
					},
					{
						name: 'Upgrade vCenter',
						value: 'upgradeVcenter',
						description: 'Upgrade vCenter version',
						action: 'Upgrade v center version',
					},
					{
						name: 'VMware Cloud Director Eligibility',
						value: 'vmwareCloudDirectorEligibility',
						description: 'Check VMware Cloud Director eligibility',
						action: 'Check v mware cloud director eligibility',
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
			// VLAN operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['vlan'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get VLAN information',
						action: 'Get VLAN information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many VLANs',
						action: 'Get many vla ns',
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
						name: 'Configure VPN for Zerto Single',
						value: 'configureVpnForZertoSingle',
						description: 'Configure VPN for Zerto Single disaster recovery',
						action: 'Configure vpn for zerto single disaster recovery',
					},
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
			// VM Encryption operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['vmEncryption'],
					},
				},
				options: [
					{
						name: 'Create KMS',
						value: 'createKms',
						description: 'Create a new KMS configuration',
						action: 'Create a new KMS configuration',
					},
					{
						name: 'Delete KMS',
						value: 'deleteKms',
						description: 'Delete a KMS configuration',
						action: 'Delete a KMS configuration',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get VM encryption information',
						action: 'Get VM encryption information',
					},
					{
						name: 'Get KMS',
						value: 'getKms',
						description: 'Get all KMS configurations',
						action: 'Get all KMS configurations',
					},
					{
						name: 'Get KMS Configuration',
						value: 'getKmsConfig',
						description: 'Get specific KMS configuration',
						action: 'Get specific KMS configuration',
					},
					{
						name: 'Update KMS',
						value: 'updateKms',
						description: 'Update KMS configuration properties',
						action: 'Update KMS configuration properties',
					},
				],
				default: 'get',
			},
			// vRack operations
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
						name: 'Delete',
						value: 'delete',
						description: 'Delete vRack association',
						action: 'Delete v rack association',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get vRack information',
						action: 'Get v rack information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many vRack associations',
						action: 'Get many v rack associations',
					},
				],
				default: 'get',
			},
			// vROps operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['vrops'],
					},
				},
				options: [
					{
						name: 'Can Be Disabled',
						value: 'canBeDisabled',
						description: 'Check if vROps can be disabled',
						action: 'Check if v r ops can be disabled',
					},
					{
						name: 'Can Be Enabled',
						value: 'canBeEnabled',
						description: 'Check if vROps can be enabled',
						action: 'Check if v r ops can be enabled',
					},
					{
						name: 'Create Outgoing Flow',
						value: 'createOutgoingFlow',
						description: 'Create a new outgoing flow',
						action: 'Create a new outgoing flow',
					},
					{
						name: 'Delete Outgoing Flow',
						value: 'deleteOutgoingFlow',
						description: 'Delete an outgoing flow',
						action: 'Delete an outgoing flow',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get vROps information',
						action: 'Get v r ops information',
					},
					{
						name: 'Get Outgoing Flow',
						value: 'getOutgoingFlow',
						description: 'Get specific outgoing flow',
						action: 'Get specific outgoing flow',
					},
					{
						name: 'Get Outgoing Flows',
						value: 'getOutgoingFlows',
						description: 'Get all outgoing flows',
						action: 'Get all outgoing flows',
					},
					{
						name: 'Update Outgoing Flow',
						value: 'updateOutgoingFlow',
						description: 'Update outgoing flow properties',
						action: 'Update outgoing flow properties',
					},
					{
						name: 'Upgrade',
						value: 'upgrade',
						description: 'Upgrade vROps',
						action: 'Upgrade v r ops',
					},
				],
				default: 'get',
			},
			// Two FA Whitelist operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['twoFAWhitelist'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new two FA whitelist entry',
						action: 'Create a new two FA whitelist entry',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a two FA whitelist entry',
						action: 'Delete a two FA whitelist entry',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get two FA whitelist entry information',
						action: 'Get two FA whitelist entry information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many two FA whitelist entries',
						action: 'Get many two FA whitelist entries',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update two FA whitelist entry properties',
						action: 'Update two FA whitelist entry properties',
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
						name: 'Change Password',
						value: 'changePassword',
						description: 'Change user password',
						action: 'Change user password',
					},
					{
						name: 'Confirm Phone Number',
						value: 'confirmPhoneNumber',
						description: 'Confirm user phone number',
						action: 'Confirm user phone number',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new user',
						action: 'Create a new user',
					},
					{
						name: 'Create Object Right',
						value: 'createObjectRight',
						description: 'Create object right for user',
						action: 'Create object right for user',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a user',
						action: 'Delete a user',
					},
					{
						name: 'Delete Object Right',
						value: 'deleteObjectRight',
						description: 'Delete object right for user',
						action: 'Delete object right for user',
					},
					{
						name: 'Disable',
						value: 'disable',
						description: 'Disable user account',
						action: 'Disable user account',
					},
					{
						name: 'Enable',
						value: 'enable',
						description: 'Enable user account',
						action: 'Enable user account',
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
						name: 'Get Object Right',
						value: 'getObjectRight',
						description: 'Get specific object right',
						action: 'Get specific object right',
					},
					{
						name: 'Get Object Rights',
						value: 'getObjectRights',
						description: 'Get user object rights',
						action: 'Get user object rights',
					},
					{
						name: 'Get Right',
						value: 'getRight',
						description: 'Get specific user right',
						action: 'Get specific user right',
					},
					{
						name: 'Get Rights',
						value: 'getRights',
						description: 'Get user rights',
						action: 'Get user rights',
					},
					{
						name: 'Get Task',
						value: 'getTask',
						description: 'Get specific user task',
						action: 'Get specific user task',
					},
					{
						name: 'Get Tasks',
						value: 'getTasks',
						description: 'Get user tasks',
						action: 'Get user tasks',
					},
					{
						name: 'Reset Task State',
						value: 'resetTaskState',
						description: 'Reset user task state',
						action: 'Reset user task state',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update user information',
						action: 'Update user information',
					},
					{
						name: 'Update Right',
						value: 'updateRight',
						description: 'Update user right',
						action: 'Update user right',
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
			// Robot operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['robot'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get robot information',
						action: 'Get robot information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many robots',
						action: 'Get many robots',
					},
				],
				default: 'get',
			},
			// Security Options operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['securityOptions'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get security options',
						action: 'Get security options',
					},
					{
						name: 'Get Compatibility Matrix',
						value: 'getCompatibilityMatrix',
						action: 'Get compatibility matrix',
					},
					{
						name: 'Get Dependencies Tree',
						value: 'getDependenciesTree',
						action: 'Get dependencies tree',
					},
					{
						name: 'Get Pending Options',
						value: 'getPendingOptions',
						action: 'Get pending options',
					},
					{
						name: 'Resume Pending Enabling',
						value: 'resumePendingEnabling',
						action: 'Resume pending enabling',
					},
				],
				default: 'get',
			},
			// Service Info operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['serviceInfos'],
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
						name: 'Update',
						value: 'update',
						description: 'Update service information',
						action: 'Update service information',
					},
				],
				default: 'get',
			},
			// Service Pack operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['servicePack'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get service pack information',
						action: 'Get service pack information',
					},
				],
				default: 'get',
			},
			// Service Packs operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['servicePacks'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get service pack information',
						action: 'Get service pack information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many service packs',
						action: 'Get many service packs',
					},
				],
				default: 'get',
			},
			// Tag operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['tag'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get tag information',
						action: 'Get tag information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many tags',
						action: 'Get many tags',
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
			// HCX operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['hcx'],
					},
				},
				options: [
					{
						name: 'Disable',
						value: 'disable',
						description: 'Disable HCX',
						action: 'Disable HCX',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get HCX information',
						action: 'Get HCX information',
					},
				],
				default: 'get',
			},
			// HDS operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['hds'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get HDS information',
						action: 'Get HDS information',
					},
				],
				default: 'get',
			},
			// HIPAA operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['hipaa'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get HIPAA information',
						action: 'Get HIPAA information',
					},
				],
				default: 'get',
			},
			// IAM operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['iam'],
					},
				},
				options: [
					{
						name: 'Add Role',
						value: 'addRole',
						description: 'Add IAM role',
						action: 'Add IAM role',
					},
					{
						name: 'Can Be Disabled',
						value: 'canBeDisabled',
						description: 'Check if IAM can be disabled',
						action: 'Check if IAM can be disabled',
					},
					{
						name: 'Can Be Enabled',
						value: 'canBeEnabled',
						description: 'Check if IAM can be enabled',
						action: 'Check if IAM can be enabled',
					},
					{
						name: 'Disable',
						value: 'disable',
						description: 'Disable IAM',
						action: 'Disable IAM',
					},
					{
						name: 'Enable',
						value: 'enable',
						description: 'Enable IAM',
						action: 'Enable IAM',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get IAM information',
						action: 'Get IAM information',
					},
				],
				default: 'get',
			},
			// IP operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['ip'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get IP information',
						action: 'Get IP information',
					},
					{
						name: 'Get Details',
						value: 'getDetails',
						description: 'Get IP details',
						action: 'Get IP details',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many IPs',
						action: 'Get many i ps',
					},
					{
						name: 'Get Task',
						value: 'getTask',
						description: 'Get IP task',
						action: 'Get IP task',
					},
					{
						name: 'Get Tasks',
						value: 'getTasks',
						description: 'Get IP tasks',
						action: 'Get IP tasks',
					},
					{
						name: 'Reset Task State',
						value: 'resetTaskState',
						description: 'Reset IP task state',
						action: 'Reset IP task state',
					},
					{
						name: 'Update Task Maintenance Date',
						value: 'updateTaskMaintenanceDate',
						description: 'Update IP task maintenance date',
						action: 'Update IP task maintenance date',
					},
				],
				default: 'get',
			},
			// Location operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['location'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get location information',
						action: 'Get location information',
					},
					{
						name: 'Get Host Profile',
						value: 'getHostProfile',
						action: 'Get host profile',
					},
					{
						name: 'Get Host Profiles',
						value: 'getHostProfiles',
						action: 'Get host profiles',
					},
					{
						name: 'Get Hypervisor',
						value: 'getHypervisor',
						action: 'Get hypervisor',
					},
					{
						name: 'Get Hypervisors',
						value: 'getHypervisors',
						action: 'Get hypervisors',
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
						operation: ['canDeployNsxtEdgesOnGlobalDatastores', 'capabilities', 'changeContact', 'changeProperties', 'checkGlobalTaskList', 'confirmTermination', 'generateNsxvInventory', 'generateVxlanToVrackMapping', 'get', 'getCommercialRangeCompliance', 'getCommercialRangeOrderable', 'getGlobalTasks', 'getNewPrices', 'getNsx', 'getNsxt', 'getOrderableIpCountries', 'getOvhId', 'getPasswordPolicy', 'getPcidss', 'getServiceInfo', 'getVcenterVersion', 'getVendor', 'getVendorObjectType', 'orderNewFilerHourly', 'resetTriggeredAlarm', 'terminate', 'update', 'upgradeVcenter', 'vmwareCloudDirectorEligibility'],
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
						resource: ['allowedNetwork', 'backup', 'backupRepository', 'cluster', 'datacenter', 'disasterRecovery', 'filer', 'hcx', 'hds', 'hipaa', 'host', 'iam', 'ip', 'location', 'nsxtEdge', 'privateGateway', 'robot', 'securityOptions', 'serviceInfos', 'servicePack', 'servicePacks', 'tag', 'vm', 'user', 'task', 'twoFAWhitelist', 'vlan', 'vmEncryption', 'vrack', 'vrops'],
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
			// IP network field
			{
				displayName: 'IP Network',
				name: 'network',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['ip'],
						operation: ['get', 'getDetails', 'getTasks', 'getTask', 'resetTaskState', 'updateTaskMaintenanceDate'],
					},
				},
				placeholder: '192.168.0.0/24',
				description: 'The IP network in CIDR format',
			},
			// Task ID field for IP operations
			{
				displayName: 'Task ID',
				name: 'taskId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['ip'],
						operation: ['getTask', 'resetTaskState', 'updateTaskMaintenanceDate'],
					},
				},
				placeholder: '12345',
			},
			// Host Profile ID field
			{
				displayName: 'Host Profile ID',
				name: 'hostProfileId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['location'],
						operation: ['getHostProfile'],
					},
				},
				placeholder: 'profile-ID',
			},
			// Hypervisor Short Name field
			{
				displayName: 'Hypervisor Short Name',
				name: 'hypervisorShortName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['location'],
						operation: ['getHypervisor'],
					},
				},
				placeholder: 'vmware',
			},
			// IAM Grant ID field
			{
				displayName: 'Grant ID',
				name: 'grantId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['iam'],
						operation: ['addRole'],
					},
				},
				placeholder: 'grant-ID',
			},
			// IAM Role ID field
			{
				displayName: 'Role ID',
				name: 'roleId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['iam'],
						operation: ['addRole'],
					},
				},
				placeholder: 'role-ID',
			},
			// IAM Resource ID field
			{
				displayName: 'Resource ID',
				name: 'resourceId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['iam'],
						operation: ['addRole'],
					},
				},
				placeholder: 'resource-ID',
			},
			// IP reset task reason field
			{
				displayName: 'Reason',
				name: 'reason',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['ip'],
						operation: ['resetTaskState'],
					},
				},
				placeholder: 'Reason for resetting task state',
			},
			// Maintenance execution date field
			{
				displayName: 'Maintenance Execution Date',
				name: 'maintenanceExecutionDate',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['ip'],
						operation: ['updateTaskMaintenanceDate'],
					},
				},
				placeholder: '2024-01-01T00:00:00Z',
				description: 'The new maintenance execution date in ISO 8601 format',
			},
			// Two FA Whitelist ID field
			{
				displayName: 'Two FA Whitelist ID',
				name: 'twoFAWhitelistId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['twoFAWhitelist'],
						operation: ['get', 'delete', 'update'],
					},
				},
				placeholder: '12345',
			},
			// Two FA Whitelist create/update fields
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['twoFAWhitelist'],
						operation: ['create', 'update'],
					},
				},
				placeholder: 'Admin workstation',
			},
			{
				displayName: 'IP',
				name: 'ip',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['twoFAWhitelist'],
						operation: ['create'],
					},
				},
				placeholder: '192.168.1.100',
				description: 'IP address to whitelist',
			},
			// VLAN ID field
			{
				displayName: 'VLAN ID',
				name: 'vlanId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['vlan'],
						operation: ['get'],
					},
				},
				placeholder: '10',
			},
			// VM Encryption KMS fields
			{
				displayName: 'KMS ID',
				name: 'kmsId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['vmEncryption'],
						operation: ['getKmsConfig', 'deleteKms', 'updateKms'],
					},
				},
				placeholder: '12345',
			},
			{
				displayName: 'IP',
				name: 'ip',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['vmEncryption'],
						operation: ['createKms'],
					},
				},
				placeholder: '192.168.1.100',
				description: 'KMS server IP address',
			},
			{
				displayName: 'Port',
				name: 'port',
				type: 'number',
				default: 5696,
				required: true,
				displayOptions: {
					show: {
						resource: ['vmEncryption'],
						operation: ['createKms'],
					},
				},
				description: 'KMS server port',
			},
			{
				displayName: 'SSL Thumbprint',
				name: 'sslThumbprint',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['vmEncryption'],
						operation: ['createKms'],
					},
				},
				placeholder: 'XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX',
				description: 'KMS server SSL certificate thumbprint',
			},
			// VM Encryption KMS update fields
			{
				displayName: 'IP',
				name: 'ip',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['vmEncryption'],
						operation: ['updateKms'],
					},
				},
				placeholder: '192.168.1.100',
				description: 'KMS server IP address (optional)',
			},
			{
				displayName: 'Port',
				name: 'port',
				type: 'number',
				default: 5696,
				displayOptions: {
					show: {
						resource: ['vmEncryption'],
						operation: ['updateKms'],
					},
				},
				description: 'KMS server port (optional)',
			},
			{
				displayName: 'SSL Thumbprint',
				name: 'sslThumbprint',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['vmEncryption'],
						operation: ['updateKms'],
					},
				},
				placeholder: 'XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX',
				description: 'KMS server SSL certificate thumbprint (optional)',
			},
			// vRack fields
			{
				displayName: 'vRack',
				name: 'vrack',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['vrack'],
						operation: ['get', 'delete'],
					},
				},
				placeholder: 'pn-123456',
				description: 'The vRack identifier',
			},
			// vROps outgoing flow fields
			{
				displayName: 'Outgoing Flow ID',
				name: 'outgoingFlowId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['vrops'],
						operation: ['getOutgoingFlow', 'deleteOutgoingFlow', 'updateOutgoingFlow'],
					},
				},
				placeholder: '12345',
			},
			{
				displayName: 'Collector Type',
				name: 'collectorType',
				type: 'options',
				options: [
					{
						name: 'SYSLOG',
						value: 'SYSLOG',
					},
					{
						name: 'KAFKA',
						value: 'KAFKA',
					},
				],
				default: 'SYSLOG',
				required: true,
				displayOptions: {
					show: {
						resource: ['vrops'],
						operation: ['createOutgoingFlow'],
					},
				},
				description: 'Type of collector to create',
			},
			{
				displayName: 'Host',
				name: 'host',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['vrops'],
						operation: ['createOutgoingFlow'],
					},
				},
				placeholder: 'collector.example.com',
				description: 'Collector host address',
			},
			{
				displayName: 'Port',
				name: 'port',
				type: 'number',
				default: 514,
				required: true,
				displayOptions: {
					show: {
						resource: ['vrops'],
						operation: ['createOutgoingFlow'],
					},
				},
				description: 'Collector port',
			},
			// vROps outgoing flow update fields
			{
				displayName: 'Host',
				name: 'host',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['vrops'],
						operation: ['updateOutgoingFlow'],
					},
				},
				placeholder: 'collector.example.com',
				description: 'Collector host address (optional)',
			},
			{
				displayName: 'Port',
				name: 'port',
				type: 'number',
				default: 514,
				displayOptions: {
					show: {
						resource: ['vrops'],
						operation: ['updateOutgoingFlow'],
					},
				},
				description: 'Collector port (optional)',
			},
			// User operation fields
			{
				displayName: 'Object Right ID',
				name: 'objectRightId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getObjectRight', 'deleteObjectRight'],
					},
				},
				placeholder: '12345',
			},
			{
				displayName: 'Right ID',
				name: 'rightId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getRight', 'updateRight'],
					},
				},
				placeholder: '12345',
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
						operation: ['changePassword'],
					},
				},
				placeholder: 'New password',
			},
			{
				displayName: 'Token',
				name: 'token',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['confirmPhoneNumber'],
					},
				},
				placeholder: 'Confirmation token',
			},
			// User task fields
			{
				displayName: 'Task ID',
				name: 'taskId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getTask', 'updateTaskMaintenanceDate', 'resetTaskState'],
					},
				},
				placeholder: '12345',
			},
			{
				displayName: 'Maintenance Execution Date',
				name: 'maintenanceExecutionDate',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['updateTaskMaintenanceDate'],
					},
				},
				placeholder: '2024-01-01T00:00:00Z',
				description: 'The new maintenance execution date in ISO 8601 format',
			},
			{
				displayName: 'Reason',
				name: 'reason',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['resetTaskState'],
					},
				},
				placeholder: 'Reason for resetting task state',
			},
			// Vendor object type fields
			{
				displayName: 'Managed Object Reference',
				name: 'managedObjectReference',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['service'],
						operation: ['getVendorObjectType', 'getOvhId'],
					},
				},
				placeholder: 'vm-1234',
				description: 'The VMware managed object reference',
			},
			// Service changeContact fields
			{
				displayName: 'Contact Admin',
				name: 'contactAdmin',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['service'],
						operation: ['changeContact'],
					},
				},
				placeholder: 'admin-account-ID',
				description: 'The contact to set as admin contact',
			},
			{
				displayName: 'Contact Billing',
				name: 'contactBilling',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['service'],
						operation: ['changeContact'],
					},
				},
				placeholder: 'billing-account-ID',
				description: 'The contact to set as billing contact',
			},
			{
				displayName: 'Contact Tech',
				name: 'contactTech',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['service'],
						operation: ['changeContact'],
					},
				},
				placeholder: 'tech-account-ID',
				description: 'The contact to set as tech contact',
			},
			// Service changeProperties fields
			{
				displayName: 'Service Properties',
				name: 'serviceProperties',
				type: 'collection',
				placeholder: 'Add Property',
				default: {},
				displayOptions: {
					show: {
						resource: ['service'],
						operation: ['changeProperties'],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Description of your VMware on OVHcloud',
					},
					{
						displayName: 'SSL V3',
						name: 'sslV3',
						type: 'boolean',
						default: false,
						description: 'Whether to enable SSL v3 support',
					},
					{
						displayName: 'User Access Policy',
						name: 'userAccessPolicy',
						type: 'options',
						default: 'FILTERED',
						options: [
							{
								name: 'Filtered',
								value: 'FILTERED',
							},
							{
								name: 'Open to Internet',
								value: 'OPEN_TO_INTERNET',
							},
							{
								name: 'Restricted',
								value: 'RESTRICTED',
							},
						],
						description: 'Access policy for users',
					},
					{
						displayName: 'User Limit Concurrent Session',
						name: 'userLimitConcurrentSession',
						type: 'number',
						default: 0,
						description: 'Maximum amount of connected users',
					},
					{
						displayName: 'User Logout Policy',
						name: 'userLogoutPolicy',
						type: 'options',
						default: 'NEVER',
						options: [
							{
								name: 'Never',
								value: 'NEVER',
							},
							{
								name: 'On Idle',
								value: 'ON_IDLE',
							},
							{
								name: 'On Disconnect',
								value: 'ON_DISCONNECT',
							},
						],
					},
				],
			},
			// Service confirmTermination fields
			{
				displayName: 'Commentary',
				name: 'commentary',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['service'],
						operation: ['confirmTermination'],
					},
				},
				description: 'Commentary for termination',
			},
			{
				displayName: 'Reason',
				name: 'terminationReason',
				type: 'options',
				default: 'OTHER',
				displayOptions: {
					show: {
						resource: ['service'],
						operation: ['confirmTermination'],
					},
				},
				options: [
					{
						name: 'Features Missing',
						value: 'FEATURES_MISSING',
					},
					{
						name: 'Lack of Performance',
						value: 'LACK_OF_PERFORMANCES',
					},
					{
						name: 'Migrated to Another OVH Product',
						value: 'MIGRATED_TO_ANOTHER_OVH_PRODUCT',
					},
					{
						name: 'Migrated to Competition',
						value: 'MIGRATED_TO_COMPETITION',
					},
					{
						name: 'No Time to Use',
						value: 'NO_TIME_TO_USE',
					},
					{
						name: 'Not Needed Anymore',
						value: 'NOT_NEEDED_ANYMORE',
					},
					{
						name: 'Not Reliable',
						value: 'NOT_RELIABLE',
					},
					{
						name: 'Other',
						value: 'OTHER',
					},
					{
						name: 'Too Expensive',
						value: 'TOO_EXPENSIVE',
					},
					{
						name: 'Too Hard to Use',
						value: 'TOO_HARD_TO_USE',
					},
					{
						name: 'Unsatisfied Support',
						value: 'UNSATISFIED_SUPPORT',
					},
				],
				description: 'Reason for termination',
			},
			{
				displayName: 'Token',
				name: 'token',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['service'],
						operation: ['confirmTermination'],
					},
				},
				placeholder: 'termination-token',
				description: 'Termination token',
			},
			// Service orderNewFilerHourly fields
			{
				displayName: 'Filer Name',
				name: 'filerName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['service'],
						operation: ['orderNewFilerHourly'],
					},
				},
				placeholder: 'filer-name',
				description: 'Name for the new filer',
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
			// User creation optional fields
			{
				displayName: 'Additional Options',
				name: 'userAdditionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Can Add Resources',
						name: 'canAddRessource',
						type: 'boolean',
						default: false,
						description: 'Whether user is able to add resources in Datacenter',
					},
					{
						displayName: 'Can Manage Rights',
						name: 'canManageRights',
						type: 'boolean',
						default: false,
						description: 'Whether user is able to manage users rights',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						placeholder: 'name@email.com',
						default: '',
						description: 'User email address',
					},
					{
						displayName: 'Encryption Right',
						name: 'encryptionRight',
						type: 'boolean',
						default: false,
						description: 'Whether user can manage encryption/KMS configuration',
					},
					{
						displayName: 'Expiration Date',
						name: 'expirationDate',
						type: 'dateTime',
						default: '',
						description: 'Date of removal of the user',
					},
					{
						displayName: 'First Name',
						name: 'firstName',
						type: 'string',
						default: '',
						description: 'First name of the user',
					},
					{
						displayName: 'Last Name',
						name: 'lastName',
						type: 'string',
						default: '',
						description: 'Last name of the user',
					},
					{
						displayName: 'Network Role',
						name: 'networkRole',
						type: 'options',
						default: 'none',
						options: [
							{
								name: 'None',
								value: 'none',
							},
							{
								name: 'Read Only',
								value: 'readOnly',
							},
							{
								name: 'Admin',
								value: 'admin',
							},
						],
						description: 'Network access role',
					},
					{
						displayName: 'NSX Right',
						name: 'nsxRight',
						type: 'boolean',
						default: false,
						description: 'Whether user is able to access nsx interface',
					},
					{
						displayName: 'Phone Number',
						name: 'phoneNumber',
						type: 'string',
						default: '',
						description: 'Mobile phone number',
					},
					{
						displayName: 'Receive Alerts',
						name: 'receiveAlerts',
						type: 'boolean',
						default: false,
						description: 'Whether user receives technical alerts',
					},
					{
						displayName: 'Right',
						name: 'right',
						type: 'options',
						default: 'disabled',
						options: [
							{
								name: 'Disabled',
								value: 'disabled',
							},
							{
								name: 'Read Only',
								value: 'readOnly',
							},
							{
								name: 'Admin',
								value: 'admin',
							},
						],
						description: 'Access type in all Datacenters',
					},
					{
						displayName: 'Token Validator',
						name: 'tokenValidator',
						type: 'boolean',
						default: false,
						description: 'Whether user can confirm security tokens',
					},
					{
						displayName: 'VM Network Role',
						name: 'vmNetworkRole',
						type: 'options',
						default: 'none',
						options: [
							{
								name: 'None',
								value: 'none',
							},
							{
								name: 'Read Only',
								value: 'readOnly',
							},
							{
								name: 'Admin',
								value: 'admin',
							},
						],
					},
				],
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
				displayName: 'Commercial Range Name',
				name: 'commercialRangeName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['datacenter'],
						operation: ['create'],
					},
				},
				description: 'The commercial range of this new datacenter',
			},
			{
				displayName: 'vRack Name',
				name: 'vrackName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['datacenter'],
						operation: ['create'],
					},
				},
				description: 'VRack to attach the datacenter to (optional)',
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
						displayName: 'Backup Duration in Report',
						name: 'backupDurationInReport',
						type: 'boolean',
						default: false,
						description: 'Whether to include duration on email report (deprecated)',
					},
					{
						displayName: 'Backup Offer',
						name: 'backupOffer',
						type: 'options',
						default: 'standard',
						options: [
							{
								name: 'Standard',
								value: 'standard',
							},
							{
								name: 'Advanced',
								value: 'advanced',
							},
							{
								name: 'Premium',
								value: 'premium',
							},
						],
						required: true,
						description: 'Backup offer type',
					},
					{
						displayName: 'Backup Size in Report',
						name: 'backupSizeInReport',
						type: 'boolean',
						default: false,
						description: 'Whether to include backup size on day on email report (deprecated)',
					},
					{
						displayName: 'Disk Size in Report',
						name: 'diskSizeInReport',
						type: 'boolean',
						default: false,
						description: 'Whether to include disk size on mail report (deprecated)',
					},
					{
						displayName: 'Full Day in Report',
						name: 'fullDayInReport',
						type: 'boolean',
						default: false,
						description: 'Whether to include full day on mail report (deprecated)',
					},
					{
						displayName: 'Mail Address',
						name: 'mailAddress',
						type: 'string',
						default: '',
						placeholder: 'name@email.com',
						description: 'Additional email address for backup daily report',
					},
					{
						displayName: 'Restore Point in Report',
						name: 'restorePointInReport',
						type: 'boolean',
						default: false,
						description: 'Whether to include RestorePoint number on mail report (deprecated)',
					},
					{
						displayName: 'Schedule Hour',
						name: 'scheduleHour',
						type: 'string',
						default: '',
						placeholder: '14:00',
						description: 'Schedule hour for start backup (UTC)',
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
			// Network Access ID field
			{
				displayName: 'Network Access ID',
				name: 'networkAccessId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['allowedNetwork'],
						operation: ['get', 'delete', 'update'],
					},
				},
			},
			// Network field for allowed network
			{
				displayName: 'Network',
				name: 'network',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['allowedNetwork'],
						operation: ['create'],
					},
				},
				placeholder: '192.168.1.0/24',
				description: 'Network CIDR',
			},
			// Description field for allowed network
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['allowedNetwork'],
						operation: ['create'],
					},
				},
				description: 'Network description (optional)',
			},
			// Update fields for allowed network
			{
				displayName: 'Update Fields',
				name: 'allowedNetworkUpdateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['allowedNetwork'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Network description',
					},
					{
						displayName: 'Network',
						name: 'network',
						type: 'string',
						default: '',
						placeholder: '192.168.1.0/24',
						description: 'Network CIDR',
					},
				],
			},
			// Repository ID field
			{
				displayName: 'Repository ID',
				name: 'repositoryId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['backupRepository'],
						operation: ['get'],
					},
				},
				description: 'Backup repository ID',
			},
			// Robot Name parameter
			{
				displayName: 'Robot Name',
				name: 'robotName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['robot'],
						operation: ['get'],
					},
				},
			},
			// Service Pack Name parameter
			{
				displayName: 'Service Pack Name',
				name: 'servicePackName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['servicePacks'],
						operation: ['get'],
					},
				},
			},
			// Tag Name parameter
			{
				displayName: 'Tag Name',
				name: 'tagName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['tag'],
						operation: ['get'],
					},
				},
			},
			// Commercial Range Name field
			{
				displayName: 'Commercial Range Name',
				name: 'commercialRangeName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['global'],
						operation: ['getCommercialRange'],
					},
				},
				placeholder: 'SDDC',
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
					if (operation === 'canDeployNsxtEdgesOnGlobalDatastores') {
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/dedicatedCloud/${serviceName}/canDeployNsxtEdgesOnGlobalDatastores`;
					} else if (operation === 'capabilities') {
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/dedicatedCloud/${serviceName}/capabilities`;
					} else if (operation === 'changeContact') {
						method = 'POST';
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/dedicatedCloud/${serviceName}/changeContact`;
						
						// Get optional contact parameters
						const contactAdmin = this.getNodeParameter('contactAdmin', i, '') as string;
						const contactBilling = this.getNodeParameter('contactBilling', i, '') as string;
						const contactTech = this.getNodeParameter('contactTech', i, '') as string;
						
						if (contactAdmin) body.contactAdmin = contactAdmin;
						if (contactBilling) body.contactBilling = contactBilling;
						if (contactTech) body.contactTech = contactTech;
					} else if (operation === 'changeProperties') {
						method = 'POST';
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						const serviceProperties = this.getNodeParameter('serviceProperties', i) as IDataObject;
						path = `/dedicatedCloud/${serviceName}/changeProperties`;
						
						// Add optional properties
						if (serviceProperties.description !== undefined && serviceProperties.description !== '') body.description = serviceProperties.description;
						if (serviceProperties.sslV3 !== undefined) body.sslV3 = serviceProperties.sslV3;
						if (serviceProperties.userAccessPolicy !== undefined) body.userAccessPolicy = serviceProperties.userAccessPolicy;
						if (serviceProperties.userLimitConcurrentSession !== undefined) body.userLimitConcurrentSession = serviceProperties.userLimitConcurrentSession;
						if (serviceProperties.userLogoutPolicy !== undefined) body.userLogoutPolicy = serviceProperties.userLogoutPolicy;
					} else if (operation === 'confirmTermination') {
						method = 'POST';
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						const token = this.getNodeParameter('token', i) as string;
						const reason = this.getNodeParameter('terminationReason', i) as string;
						const commentary = this.getNodeParameter('commentary', i, '') as string;
						path = `/dedicatedCloud/${serviceName}/confirmTermination`;
						
						body = {
							token,
							reason,
						};
						if (commentary) body.commentary = commentary;
					} else if (operation === 'get') {
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/dedicatedCloud/${serviceName}`;
					} else if (operation === 'getAll') {
						path = '/dedicatedCloud';
					} else if (operation === 'getCommercialRangeCompliance') {
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/dedicatedCloud/${serviceName}/commercialRange/compliance`;
					} else if (operation === 'getCommercialRangeOrderable') {
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/dedicatedCloud/${serviceName}/commercialRange/orderable`;
					} else if (operation === 'getNewPrices') {
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/dedicatedCloud/${serviceName}/newPrices`;
					} else if (operation === 'getNsx') {
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/dedicatedCloud/${serviceName}/nsx`;
					} else if (operation === 'getNsxt') {
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/dedicatedCloud/${serviceName}/nsxt`;
					} else if (operation === 'getOrderableIpCountries') {
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/dedicatedCloud/${serviceName}/orderableIpCountries`;
					} else if (operation === 'getPasswordPolicy') {
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/dedicatedCloud/${serviceName}/passwordPolicy`;
					} else if (operation === 'getPcidss') {
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/dedicatedCloud/${serviceName}/pcidss`;
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
					} else if (operation === 'checkGlobalTaskList') {
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/dedicatedCloud/${serviceName}/globalTasks`;
					} else if (operation === 'getGlobalTasks') {
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/dedicatedCloud/${serviceName}/globalTasks`;
					} else if (operation === 'upgradeVcenter') {
						method = 'POST';
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/dedicatedCloud/${serviceName}/upgradeVcenter`;
					} else if (operation === 'getVcenterVersion') {
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/dedicatedCloud/${serviceName}/vcenterVersion`;
					} else if (operation === 'getVendor') {
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/dedicatedCloud/${serviceName}/vendor`;
					} else if (operation === 'getVendorObjectType') {
						method = 'POST';
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						const managedObjectReference = this.getNodeParameter('managedObjectReference', i) as string;
						path = `/dedicatedCloud/${serviceName}/vendor/objectType`;
						body = { managedObjectReference };
					} else if (operation === 'orderNewFilerHourly') {
						method = 'POST';
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						const filerName = this.getNodeParameter('filerName', i) as string;
						path = `/dedicatedCloud/${serviceName}/orderNewFilerHourly`;
						body = { name: filerName };
					} else if (operation === 'getOvhId') {
						method = 'POST';
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						const managedObjectReference = this.getNodeParameter('managedObjectReference', i) as string;
						path = `/dedicatedCloud/${serviceName}/vendor/ovhId`;
						body = { managedObjectReference };
					} else if (operation === 'resetTriggeredAlarm') {
						method = 'POST';
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/dedicatedCloud/${serviceName}/resetTriggeredAlarm`;
					} else if (operation === 'terminate') {
						method = 'POST';
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/dedicatedCloud/${serviceName}/terminate`;
					} else if (operation === 'vmwareCloudDirectorEligibility') {
						method = 'POST';
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/dedicatedCloud/${serviceName}/vmwareCloudDirectorEligibility`;
					}
				} else if (resource === 'global') {
					if (operation === 'getAllServices') {
						path = '/dedicatedCloud';
					} else if (operation === 'getCommercialRanges') {
						path = '/dedicatedCloud/commercialRange';
					} else if (operation === 'getCommercialRange') {
						const commercialRangeName = this.getNodeParameter('commercialRangeName', i) as string;
						path = `/dedicatedCloud/commercialRange/${commercialRangeName}`;
					} else if (operation === 'getLocations') {
						path = '/dedicatedCloud/location';
					}
				} else if (resource === 'allowedNetwork') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'getAll') {
						path = `/dedicatedCloud/${serviceName}/allowedNetwork`;
					} else if (operation === 'get') {
						const networkAccessId = parseInt(this.getNodeParameter('networkAccessId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/allowedNetwork/${networkAccessId}`;
					} else if (operation === 'create') {
						method = 'POST';
						const network = this.getNodeParameter('network', i) as string;
						const description = this.getNodeParameter('description', i) as string;
						path = `/dedicatedCloud/${serviceName}/allowedNetwork`;
						body = { network };
						if (description) body.description = description;
					} else if (operation === 'delete') {
						method = 'DELETE';
						const networkAccessId = parseInt(this.getNodeParameter('networkAccessId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/allowedNetwork/${networkAccessId}`;
					} else if (operation === 'update') {
						method = 'PUT';
						const networkAccessId = parseInt(this.getNodeParameter('networkAccessId', i) as string, 10);
						const updateFields = this.getNodeParameter('allowedNetworkUpdateFields', i) as IDataObject;
						path = `/dedicatedCloud/${serviceName}/allowedNetwork/${networkAccessId}`;
						
						// Build the allowedNetwork object for PUT
						if (updateFields.description !== undefined) body.description = updateFields.description;
						if (updateFields.network !== undefined) body.network = updateFields.network;
					}
				} else if (resource === 'backupRepository') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'getAll') {
						path = `/dedicatedCloud/${serviceName}/backupRepository`;
					} else if (operation === 'get') {
						const repositoryId = parseInt(this.getNodeParameter('repositoryId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/backupRepository/${repositoryId}`;
					}
				} else if (resource === 'robot') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'getAll') {
						path = `/dedicatedCloud/${serviceName}/robot`;
					} else if (operation === 'get') {
						const robotName = this.getNodeParameter('robotName', i) as string;
						path = `/dedicatedCloud/${serviceName}/robot/${robotName}`;
					}
				} else if (resource === 'securityOptions') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'get') {
						path = `/dedicatedCloud/${serviceName}/securityOptions`;
					} else if (operation === 'getCompatibilityMatrix') {
						path = `/dedicatedCloud/${serviceName}/securityOptions/compatibilityMatrix`;
					} else if (operation === 'getDependenciesTree') {
						path = `/dedicatedCloud/${serviceName}/securityOptions/dependenciesTree`;
					} else if (operation === 'getPendingOptions') {
						path = `/dedicatedCloud/${serviceName}/securityOptions/pendingOptions`;
					} else if (operation === 'resumePendingEnabling') {
						method = 'POST';
						path = `/dedicatedCloud/${serviceName}/securityOptions/resumePendingEnabling`;
					}
				} else if (resource === 'serviceInfos') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'get') {
						path = `/dedicatedCloud/${serviceName}/serviceInfos`;
					} else if (operation === 'update') {
						method = 'PUT';
						path = `/dedicatedCloud/${serviceName}/serviceInfos`;
					}
				} else if (resource === 'servicePack') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					path = `/dedicatedCloud/${serviceName}/servicePack`;
				} else if (resource === 'servicePacks') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'getAll') {
						path = `/dedicatedCloud/${serviceName}/servicePacks`;
					} else if (operation === 'get') {
						const servicePackName = this.getNodeParameter('servicePackName', i) as string;
						path = `/dedicatedCloud/${serviceName}/servicePacks/${servicePackName}`;
					}
				} else if (resource === 'tag') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'getAll') {
						path = `/dedicatedCloud/${serviceName}/tag`;
					} else if (operation === 'get') {
						const tagName = this.getNodeParameter('tagName', i) as string;
						path = `/dedicatedCloud/${serviceName}/tag/${tagName}`;
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
						const commercialRangeName = this.getNodeParameter('commercialRangeName', i) as string;
						const vrackName = this.getNodeParameter('vrackName', i) as string;
						path = `/dedicatedCloud/${serviceName}/datacenter`;
						body = {
							name: datacenterName,
							commercialRangeName,
						};
						if (vrackName) body.vrackName = vrackName;
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
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/task/${taskId}/changeMaintenanceExecutionDate`;
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
					} else if (operation === 'configureVpnForZertoSingle') {
						method = 'POST';
						const vmId = parseInt(this.getNodeParameter('vmId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/vm/${vmId}/disasterRecovery/configureVpnForZertoSingle`;
						// TODO: Add VPN configuration parameters if needed
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
						const additionalOptions = this.getNodeParameter('userAdditionalOptions', i) as IDataObject;
						path = `/dedicatedCloud/${serviceName}/user`;
						body = { name, password };
						
						// Add optional parameters if provided
						if (additionalOptions.canAddRessource !== undefined) body.canAddRessource = additionalOptions.canAddRessource;
						if (additionalOptions.canManageRights !== undefined) body.canManageRights = additionalOptions.canManageRights;
						if (additionalOptions.email !== undefined && additionalOptions.email !== '') body.email = additionalOptions.email;
						if (additionalOptions.encryptionRight !== undefined) body.encryptionRight = additionalOptions.encryptionRight;
						if (additionalOptions.expirationDate !== undefined && additionalOptions.expirationDate !== '') body.expirationDate = additionalOptions.expirationDate;
						if (additionalOptions.firstName !== undefined && additionalOptions.firstName !== '') body.firstName = additionalOptions.firstName;
						if (additionalOptions.lastName !== undefined && additionalOptions.lastName !== '') body.lastName = additionalOptions.lastName;
						if (additionalOptions.networkRole !== undefined && additionalOptions.networkRole !== 'none') body.networkRole = additionalOptions.networkRole;
						if (additionalOptions.nsxRight !== undefined) body.nsxRight = additionalOptions.nsxRight;
						if (additionalOptions.phoneNumber !== undefined && additionalOptions.phoneNumber !== '') body.phoneNumber = additionalOptions.phoneNumber;
						if (additionalOptions.receiveAlerts !== undefined) body.receiveAlerts = additionalOptions.receiveAlerts;
						if (additionalOptions.right !== undefined && additionalOptions.right !== 'disabled') body.right = additionalOptions.right;
						if (additionalOptions.tokenValidator !== undefined) body.tokenValidator = additionalOptions.tokenValidator;
						if (additionalOptions.vmNetworkRole !== undefined && additionalOptions.vmNetworkRole !== 'none') body.vmNetworkRole = additionalOptions.vmNetworkRole;
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
					} else if (operation === 'changePassword') {
						method = 'POST';
						const userId = parseInt(this.getNodeParameter('userId', i) as string, 10);
						const password = this.getNodeParameter('password', i) as string;
						path = `/dedicatedCloud/${serviceName}/user/${userId}/changePassword`;
						body = { password };
					} else if (operation === 'confirmPhoneNumber') {
						method = 'POST';
						const userId = parseInt(this.getNodeParameter('userId', i) as string, 10);
						const token = this.getNodeParameter('token', i) as string;
						path = `/dedicatedCloud/${serviceName}/user/${userId}/confirmPhoneNumber`;
						body = { token };
					} else if (operation === 'disable') {
						method = 'POST';
						const userId = parseInt(this.getNodeParameter('userId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/user/${userId}/disable`;
					} else if (operation === 'enable') {
						method = 'POST';
						const userId = parseInt(this.getNodeParameter('userId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/user/${userId}/enable`;
					} else if (operation === 'getObjectRights') {
						const userId = parseInt(this.getNodeParameter('userId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/user/${userId}/objectRight`;
					} else if (operation === 'getObjectRight') {
						const userId = parseInt(this.getNodeParameter('userId', i) as string, 10);
						const objectRightId = parseInt(this.getNodeParameter('objectRightId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/user/${userId}/objectRight/${objectRightId}`;
					} else if (operation === 'createObjectRight') {
						method = 'POST';
						const userId = parseInt(this.getNodeParameter('userId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/user/${userId}/objectRight`;
						// TODO: Add object right creation parameters
					} else if (operation === 'deleteObjectRight') {
						method = 'DELETE';
						const userId = parseInt(this.getNodeParameter('userId', i) as string, 10);
						const objectRightId = parseInt(this.getNodeParameter('objectRightId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/user/${userId}/objectRight/${objectRightId}`;
					} else if (operation === 'getRights') {
						const userId = parseInt(this.getNodeParameter('userId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/user/${userId}/right`;
					} else if (operation === 'getRight') {
						const userId = parseInt(this.getNodeParameter('userId', i) as string, 10);
						const rightId = parseInt(this.getNodeParameter('rightId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/user/${userId}/right/${rightId}`;
					} else if (operation === 'updateRight') {
						method = 'PUT';
						const userId = parseInt(this.getNodeParameter('userId', i) as string, 10);
						const rightId = parseInt(this.getNodeParameter('rightId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/user/${userId}/right/${rightId}`;
						// TODO: Add right update parameters
					} else if (operation === 'getTasks') {
						const userId = parseInt(this.getNodeParameter('userId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/user/${userId}/task`;
					} else if (operation === 'getTask') {
						const userId = parseInt(this.getNodeParameter('userId', i) as string, 10);
						const taskId = parseInt(this.getNodeParameter('taskId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/user/${userId}/task/${taskId}`;
					} else if (operation === 'updateTaskMaintenanceDate') {
						method = 'POST';
						const userId = parseInt(this.getNodeParameter('userId', i) as string, 10);
						const taskId = parseInt(this.getNodeParameter('taskId', i) as string, 10);
						const maintenanceExecutionDate = this.getNodeParameter('maintenanceExecutionDate', i) as string;
						path = `/dedicatedCloud/${serviceName}/user/${userId}/task/${taskId}/changeMaintenanceExecutionDate`;
						body = { maintenanceExecutionDate };
					} else if (operation === 'resetTaskState') {
						method = 'POST';
						const userId = parseInt(this.getNodeParameter('userId', i) as string, 10);
						const taskId = parseInt(this.getNodeParameter('taskId', i) as string, 10);
						const reason = this.getNodeParameter('reason', i) as string;
						path = `/dedicatedCloud/${serviceName}/user/${userId}/task/${taskId}/resetTaskState`;
						body = { reason };
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
						
						// Required parameter
						if (backupProperties.backupOffer !== undefined) body.backupOffer = backupProperties.backupOffer;
						
						// Optional parameters
						if (backupProperties.backupDurationInReport !== undefined) body.backupDurationInReport = backupProperties.backupDurationInReport;
						if (backupProperties.backupSizeInReport !== undefined) body.backupSizeInReport = backupProperties.backupSizeInReport;
						if (backupProperties.diskSizeInReport !== undefined) body.diskSizeInReport = backupProperties.diskSizeInReport;
						if (backupProperties.fullDayInReport !== undefined) body.fullDayInReport = backupProperties.fullDayInReport;
						if (backupProperties.mailAddress !== undefined && backupProperties.mailAddress !== '') body.mailAddress = backupProperties.mailAddress;
						if (backupProperties.restorePointInReport !== undefined) body.restorePointInReport = backupProperties.restorePointInReport;
						if (backupProperties.scheduleHour !== undefined && backupProperties.scheduleHour !== '') body.scheduleHour = backupProperties.scheduleHour;
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
						path = `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/host/${hostId}/task/${taskId}/changeMaintenanceExecutionDate`;
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
				} else if (resource === 'hcx') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'get') {
						path = `/dedicatedCloud/${serviceName}/hcx`;
					} else if (operation === 'disable') {
						method = 'POST';
						path = `/dedicatedCloud/${serviceName}/hcx/disable`;
					}
				} else if (resource === 'hds') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'get') {
						path = `/dedicatedCloud/${serviceName}/hds`;
					}
				} else if (resource === 'hipaa') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'get') {
						path = `/dedicatedCloud/${serviceName}/hipaa`;
					}
				} else if (resource === 'iam') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'get') {
						path = `/dedicatedCloud/${serviceName}/iam`;
					} else if (operation === 'addRole') {
						method = 'POST';
						const grantId = this.getNodeParameter('grantId', i) as string;
						const roleId = this.getNodeParameter('roleId', i) as string;
						const resourceId = this.getNodeParameter('resourceId', i) as string;
						path = `/dedicatedCloud/${serviceName}/iam`;
						body = {
							grantId,
							roleId,
							resourceId,
						};
					} else if (operation === 'canBeDisabled') {
						path = `/dedicatedCloud/${serviceName}/iam/canBeDisabled`;
					} else if (operation === 'canBeEnabled') {
						path = `/dedicatedCloud/${serviceName}/iam/canBeEnabled`;
					} else if (operation === 'disable') {
						method = 'POST';
						path = `/dedicatedCloud/${serviceName}/iam/disable`;
					} else if (operation === 'enable') {
						method = 'POST';
						path = `/dedicatedCloud/${serviceName}/iam/enable`;
					}
				} else if (resource === 'ip') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'getAll') {
						path = `/dedicatedCloud/${serviceName}/ip`;
					} else if (operation === 'get') {
						const network = encodeURIComponent(this.getNodeParameter('network', i) as string);
						path = `/dedicatedCloud/${serviceName}/ip/${network}`;
					} else if (operation === 'getDetails') {
						const network = encodeURIComponent(this.getNodeParameter('network', i) as string);
						path = `/dedicatedCloud/${serviceName}/ip/${network}/details`;
					} else if (operation === 'getTasks') {
						const network = encodeURIComponent(this.getNodeParameter('network', i) as string);
						path = `/dedicatedCloud/${serviceName}/ip/${network}/task`;
					} else if (operation === 'getTask') {
						const network = encodeURIComponent(this.getNodeParameter('network', i) as string);
						const taskId = parseInt(this.getNodeParameter('taskId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/ip/${network}/task/${taskId}`;
					} else if (operation === 'resetTaskState') {
						method = 'POST';
						const network = encodeURIComponent(this.getNodeParameter('network', i) as string);
						const taskId = parseInt(this.getNodeParameter('taskId', i) as string, 10);
						const reason = this.getNodeParameter('reason', i) as string;
						path = `/dedicatedCloud/${serviceName}/ip/${network}/task/${taskId}/resetTaskState`;
						body = { reason };
					} else if (operation === 'updateTaskMaintenanceDate') {
						method = 'POST';
						const network = encodeURIComponent(this.getNodeParameter('network', i) as string);
						const taskId = parseInt(this.getNodeParameter('taskId', i) as string, 10);
						const maintenanceExecutionDate = this.getNodeParameter('maintenanceExecutionDate', i) as string;
						path = `/dedicatedCloud/${serviceName}/ip/${network}/task/${taskId}/changeMaintenanceExecutionDate`;
						body = { maintenanceExecutionDate };
					}
				} else if (resource === 'location') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'get') {
						path = `/dedicatedCloud/${serviceName}/location`;
					} else if (operation === 'getHostProfiles') {
						path = `/dedicatedCloud/${serviceName}/location/hostprofile`;
					} else if (operation === 'getHostProfile') {
						const hostProfileId = parseInt(this.getNodeParameter('hostProfileId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/location/hostprofile/${hostProfileId}`;
					} else if (operation === 'getHypervisors') {
						path = `/dedicatedCloud/${serviceName}/location/hypervisor`;
					} else if (operation === 'getHypervisor') {
						const hypervisorShortName = this.getNodeParameter('hypervisorShortName', i) as string;
						path = `/dedicatedCloud/${serviceName}/location/hypervisor/${hypervisorShortName}`;
					}
				} else if (resource === 'twoFAWhitelist') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'getAll') {
						path = `/dedicatedCloud/${serviceName}/twoFAWhitelist`;
					} else if (operation === 'get') {
						const twoFAWhitelistId = parseInt(this.getNodeParameter('twoFAWhitelistId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/twoFAWhitelist/${twoFAWhitelistId}`;
					} else if (operation === 'create') {
						method = 'POST';
						const ip = this.getNodeParameter('ip', i) as string;
						const description = this.getNodeParameter('description', i) as string;
						path = `/dedicatedCloud/${serviceName}/twoFAWhitelist`;
						body = { ip, description };
					} else if (operation === 'delete') {
						method = 'DELETE';
						const twoFAWhitelistId = parseInt(this.getNodeParameter('twoFAWhitelistId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/twoFAWhitelist/${twoFAWhitelistId}`;
					} else if (operation === 'update') {
						method = 'POST';
						const twoFAWhitelistId = parseInt(this.getNodeParameter('twoFAWhitelistId', i) as string, 10);
						const description = this.getNodeParameter('description', i) as string;
						path = `/dedicatedCloud/${serviceName}/twoFAWhitelist/${twoFAWhitelistId}/changeProperties`;
						body = { description };
					}
				} else if (resource === 'vlan') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'getAll') {
						path = `/dedicatedCloud/${serviceName}/vlan`;
					} else if (operation === 'get') {
						const vlanId = parseInt(this.getNodeParameter('vlanId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/vlan/${vlanId}`;
					}
				} else if (resource === 'vmEncryption') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'get') {
						path = `/dedicatedCloud/${serviceName}/vmEncryption`;
					} else if (operation === 'getKms') {
						path = `/dedicatedCloud/${serviceName}/vmEncryption/kms`;
					} else if (operation === 'getKmsConfig') {
						const kmsId = parseInt(this.getNodeParameter('kmsId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/vmEncryption/kms/${kmsId}`;
					} else if (operation === 'createKms') {
						method = 'POST';
						const ip = this.getNodeParameter('ip', i) as string;
						const port = this.getNodeParameter('port', i) as number;
						const sslThumbprint = this.getNodeParameter('sslThumbprint', i) as string;
						path = `/dedicatedCloud/${serviceName}/vmEncryption/kms`;
						body = { ip, port, sslThumbprint };
					} else if (operation === 'deleteKms') {
						method = 'DELETE';
						const kmsId = parseInt(this.getNodeParameter('kmsId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/vmEncryption/kms/${kmsId}`;
					} else if (operation === 'updateKms') {
						method = 'POST';
						const kmsId = parseInt(this.getNodeParameter('kmsId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/vmEncryption/kms/${kmsId}/changeProperties`;
						
						// Only add properties that are provided
						const ip = this.getNodeParameter('ip', i, '') as string;
						const port = this.getNodeParameter('port', i, 0) as number;
						const sslThumbprint = this.getNodeParameter('sslThumbprint', i, '') as string;
						
						if (ip) body.ip = ip;
						if (port) body.port = port;
						if (sslThumbprint) body.sslThumbprint = sslThumbprint;
					}
				} else if (resource === 'vrack') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'getAll') {
						path = `/dedicatedCloud/${serviceName}/vrack`;
					} else if (operation === 'get') {
						const vrack = this.getNodeParameter('vrack', i) as string;
						path = `/dedicatedCloud/${serviceName}/vrack/${vrack}`;
					} else if (operation === 'delete') {
						method = 'DELETE';
						const vrack = this.getNodeParameter('vrack', i) as string;
						path = `/dedicatedCloud/${serviceName}/vrack/${vrack}`;
					}
				} else if (resource === 'vrops') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'get') {
						path = `/dedicatedCloud/${serviceName}/vrops`;
					} else if (operation === 'canBeDisabled') {
						path = `/dedicatedCloud/${serviceName}/vrops/canBeDisabled`;
					} else if (operation === 'canBeEnabled') {
						path = `/dedicatedCloud/${serviceName}/vrops/canBeEnabled`;
					} else if (operation === 'getOutgoingFlows') {
						path = `/dedicatedCloud/${serviceName}/vrops/outgoingFlow`;
					} else if (operation === 'getOutgoingFlow') {
						const outgoingFlowId = parseInt(this.getNodeParameter('outgoingFlowId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/vrops/outgoingFlow/${outgoingFlowId}`;
					} else if (operation === 'createOutgoingFlow') {
						method = 'POST';
						const collectorType = this.getNodeParameter('collectorType', i) as string;
						const host = this.getNodeParameter('host', i) as string;
						const port = this.getNodeParameter('port', i) as number;
						path = `/dedicatedCloud/${serviceName}/vrops/outgoingFlow`;
						body = { collectorType, host, port };
					} else if (operation === 'deleteOutgoingFlow') {
						method = 'DELETE';
						const outgoingFlowId = parseInt(this.getNodeParameter('outgoingFlowId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/vrops/outgoingFlow/${outgoingFlowId}`;
					} else if (operation === 'updateOutgoingFlow') {
						method = 'POST';
						const outgoingFlowId = parseInt(this.getNodeParameter('outgoingFlowId', i) as string, 10);
						path = `/dedicatedCloud/${serviceName}/vrops/outgoingFlow/${outgoingFlowId}/changeProperties`;
						
						// Only add properties that are provided
						const host = this.getNodeParameter('host', i, '') as string;
						const port = this.getNodeParameter('port', i, 0) as number;
						
						if (host) body.host = host;
						if (port) body.port = port;
					} else if (operation === 'upgrade') {
						method = 'POST';
						path = `/dedicatedCloud/${serviceName}/vrops/upgrade`;
					}
				} else if (resource === 'service') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					if (operation === 'generateNsxvInventory') {
						method = 'POST';
						path = `/dedicatedCloud/${serviceName}/generateNsxvInventory`;
					} else if (operation === 'generateVxlanToVrackMapping') {
						method = 'POST';
						path = `/dedicatedCloud/${serviceName}/generateVxlanToVrackMapping`;
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
