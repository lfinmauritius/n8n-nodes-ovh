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

export class OvhDedicatedServer implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OVH Dedicated Server',
		name: 'ovhDedicatedServer',
		icon: 'file:ovh.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage OVH dedicated servers',
		defaults: {
			name: 'OVH Dedicated Server',
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
						name: 'Installation',
						value: 'installation',
					},
					{
						name: 'Intervention',
						value: 'intervention',
					},
					{
						name: 'IP',
						value: 'ip',
					},
					{
						name: 'Network',
						value: 'network',
					},
					{
						name: 'Option',
						value: 'options',
					},
					{
						name: 'Security',
						value: 'security',
					},
					{
						name: 'Server',
						value: 'server',
					},
					{
						name: 'Task',
						value: 'task',
					},
				],
				default: 'server',
			},
			// Server operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['server'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get server information',
						action: 'Get server information',
					},
					{
						name: 'Get Hardware',
						value: 'getHardware',
						description: 'Get server hardware information',
						action: 'Get server hardware information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many servers',
						action: 'Get many servers',
					},
					{
						name: 'Get Network',
						value: 'getNetwork',
						description: 'Get server network information',
						action: 'Get server network information',
					},
					{
						name: 'Get Service Info',
						value: 'getServiceInfo',
						description: 'Get server service information',
						action: 'Get server service information',
					},
					{
						name: 'Reboot',
						value: 'reboot',
						description: 'Reboot the server',
						action: 'Reboot the server',
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
					{
						name: 'Cancel',
						value: 'cancel',
						description: 'Cancel a task',
						action: 'Cancel a task',
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
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many IPs',
						action: 'Get many i ps',
					},
				],
				default: 'get',
			},
			// Installation operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['installation'],
					},
				},
				options: [
					{
						name: 'Get Status',
						value: 'getStatus',
						description: 'Get installation status',
						action: 'Get installation status',
					},
					{
						name: 'Get Templates',
						value: 'getTemplates',
						description: 'Get available OS templates',
						action: 'Get available OS templates',
					},
					{
						name: 'Start',
						value: 'start',
						description: 'Start OS installation',
						action: 'Start OS installation',
					},
				],
				default: 'getStatus',
			},
			// Network operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['network'],
					},
				},
				options: [
					{
						name: 'Add Secondary DNS',
						value: 'addSecondaryDns',
						description: 'Add secondary DNS domain',
						action: 'Add secondary DNS domain',
					},
					{
						name: 'Create Virtual MAC',
						value: 'createVirtualMac',
						description: 'Create a virtual MAC address',
						action: 'Create a virtual MAC address',
					},
					{
						name: 'Delete Secondary DNS',
						value: 'deleteSecondaryDns',
						description: 'Delete secondary DNS domain',
						action: 'Delete secondary DNS domain',
					},
					{
						name: 'Delete Virtual MAC',
						value: 'deleteVirtualMac',
						description: 'Delete a virtual MAC address',
						action: 'Delete a virtual MAC address',
					},
					{
						name: 'Get Secondary DNS',
						value: 'getSecondaryDns',
						description: 'Get secondary DNS domains',
						action: 'Get secondary DNS domains',
					},
					{
						name: 'Get Virtual MACs',
						value: 'getVirtualMacs',
						description: 'Get virtual MAC addresses',
						action: 'Get virtual MAC addresses',
					},
					{
						name: 'IP Block Merge',
						value: 'ipBlockMerge',
						description: 'Merge IP blocks',
						action: 'Merge IP blocks',
					},
				],
				default: 'getVirtualMacs',
			},
			// Security operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['security'],
					},
				},
				options: [
					{
						name: 'Get Firewall',
						value: 'getFirewall',
						description: 'Get firewall information',
						action: 'Get firewall information',
					},
					{
						name: 'Update Firewall',
						value: 'updateFirewall',
						description: 'Update firewall configuration',
						action: 'Update firewall configuration',
					},
					{
						name: 'Get IP Spoof',
						value: 'getIpSpoof',
						description: 'Get IP spoof protection status',
						action: 'Get IP spoof protection status',
					},
				],
				default: 'getFirewall',
			},
			// Options operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['options'],
					},
				},
				options: [
					{
						name: 'Get Available Options',
						value: 'getAvailable',
						description: 'Get available server options',
						action: 'Get available server options',
					},
				],
				default: 'getAvailable',
			},
			// Intervention operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['intervention'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get intervention information',
						action: 'Get intervention information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many interventions',
						action: 'Get many interventions',
					},
				],
				default: 'get',
			},
			// Server name field
			{
				displayName: 'Server Name',
				name: 'serverName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['server'],
						operation: ['get', 'getHardware', 'getNetwork', 'getServiceInfo', 'reboot'],
					},
				},
				placeholder: 'ns1234567.ip-1-2-3.eu',
				description: 'The server name to operate on',
			},
			// Server name field for tasks
			{
				displayName: 'Server Name',
				name: 'serverName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['getAll', 'get', 'cancel'],
					},
				},
				placeholder: 'ns1234567.ip-1-2-3.eu',
				description: 'The server name to operate on',
			},
			// Server name field for IPs
			{
				displayName: 'Server Name',
				name: 'serverName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['ip'],
						operation: ['getAll'],
					},
				},
				placeholder: 'ns1234567.ip-1-2-3.eu',
				description: 'The server name to operate on',
			},
			// Task ID field
			{
				displayName: 'Task ID',
				name: 'taskId',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['get', 'cancel'],
					},
				},
				description: 'The ID of the task',
			},
			// IP address field
			{
				displayName: 'IP Address',
				name: 'ipAddress',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['ip'],
						operation: ['get'],
					},
				},
				placeholder: '1.2.3.4',
				description: 'The IP address to get information for',
			},
			// Task status filter
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['task'],
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
						value: 'cancelled',
					},
					{
						name: 'Customer Error',
						value: 'customerError',
					},
					{
						name: 'Doing',
						value: 'doing',
					},
					{
						name: 'Done',
						value: 'done',
					},
					{
						name: 'Init',
						value: 'init',
					},
					{
						name: 'OVH Error',
						value: 'ovhError',
					},
					{
						name: 'Todo',
						value: 'todo',
					},
				],
				default: 'all',
				description: 'Filter tasks by status',
			},
			// Server name field for new resources that need it
			{
				displayName: 'Server Name',
				name: 'serverName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['installation', 'network', 'security', 'options', 'intervention'],
					},
				},
				placeholder: 'ns1234567.ip-1-2-3.eu',
				description: 'The server name to operate on',
			},
			// Installation fields
			{
				displayName: 'Template Name',
				name: 'templateName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['installation'],
						operation: ['start'],
					},
				},
				placeholder: 'debian11_64',
				description: 'The OS template to install',
			},
			{
				displayName: 'Partition Scheme',
				name: 'partitionScheme',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['installation'],
						operation: ['start'],
					},
				},
				placeholder: 'default',
				description: 'The partition scheme to use',
			},
			// Network fields
			{
				displayName: 'MAC Address',
				name: 'macAddress',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['network'],
						operation: ['deleteVirtualMac'],
					},
				},
				placeholder: '00:11:22:33:44:55',
				description: 'The MAC address to delete',
			},
			{
				displayName: 'IP Address',
				name: 'ipAddress',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['network'],
						operation: ['createVirtualMac'],
					},
				},
				placeholder: '1.2.3.4',
				description: 'The IP address to assign to the virtual MAC',
			},
			{
				displayName: 'Virtual MAC Type',
				name: 'virtualMacType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['network'],
						operation: ['createVirtualMac'],
					},
				},
				options: [
					{
						name: 'OVH',
						value: 'ovh',
					},
					{
						name: 'VMware',
						value: 'vmware',
					},
				],
				default: 'ovh',
				description: 'Type of virtual MAC to create',
			},
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['network'],
						operation: ['addSecondaryDns', 'deleteSecondaryDns'],
					},
				},
				placeholder: 'example.com',
				description: 'The domain name',
			},
			{
				displayName: 'IP Block',
				name: 'ipBlock',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['network'],
						operation: ['ipBlockMerge'],
					},
				},
				placeholder: '1.2.3.0/24',
				description: 'The IP block to merge',
			},
			// Security fields
			{
				displayName: 'Firewall Enabled',
				name: 'firewallEnabled',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['security'],
						operation: ['updateFirewall'],
					},
				},
				description: 'Whether to enable the firewall',
			},
			{
				displayName: 'Firewall Mode',
				name: 'firewallMode',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['security'],
						operation: ['updateFirewall'],
					},
				},
				options: [
					{
						name: 'Routed',
						value: 'routed',
					},
					{
						name: 'Transparent',
						value: 'transparent',
					},
				],
				default: 'routed',
			},
			// Intervention fields
			{
				displayName: 'Intervention ID',
				name: 'interventionId',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						resource: ['intervention'],
						operation: ['get'],
					},
				},
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

				if (resource === 'server') {
					if (operation === 'get') {
						const serverName = this.getNodeParameter('serverName', i) as string;
						if (!serverName || serverName.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'Server name is required', {
								itemIndex: i,
							});
						}
						path = `/dedicated/server/${serverName.trim()}`;
					} else if (operation === 'getAll') {
						path = '/dedicated/server';
					} else if (operation === 'getHardware') {
						const serverName = this.getNodeParameter('serverName', i) as string;
						if (!serverName || serverName.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'Server name is required', {
								itemIndex: i,
							});
						}
						path = `/dedicated/server/${serverName.trim()}/specifications/hardware`;
					} else if (operation === 'getNetwork') {
						const serverName = this.getNodeParameter('serverName', i) as string;
						if (!serverName || serverName.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'Server name is required', {
								itemIndex: i,
							});
						}
						path = `/dedicated/server/${serverName.trim()}/specifications/network`;
					} else if (operation === 'getServiceInfo') {
						const serverName = this.getNodeParameter('serverName', i) as string;
						if (!serverName || serverName.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'Server name is required', {
								itemIndex: i,
							});
						}
						path = `/dedicated/server/${serverName.trim()}/serviceInfos`;
					} else if (operation === 'reboot') {
						method = 'POST';
						const serverName = this.getNodeParameter('serverName', i) as string;
						if (!serverName || serverName.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'Server name is required', {
								itemIndex: i,
							});
						}
						path = `/dedicated/server/${serverName.trim()}/reboot`;
					}
				} else if (resource === 'task') {
					const serverName = this.getNodeParameter('serverName', i) as string;
					if (!serverName || serverName.trim() === '') {
						throw new NodeOperationError(this.getNode(), 'Server name is required', {
							itemIndex: i,
						});
					}

					const serverNameTrimmed = serverName.trim();

					if (operation === 'get') {
						const taskId = this.getNodeParameter('taskId', i) as number;
						if (!taskId && taskId !== 0) {
							throw new NodeOperationError(this.getNode(), 'Task ID is required', { itemIndex: i });
						}
						path = `/dedicated/server/${serverNameTrimmed}/task/${taskId}`;
					} else if (operation === 'getAll') {
						path = `/dedicated/server/${serverNameTrimmed}/task`;
						try {
							const status = this.getNodeParameter('status', i, 'all') as string;
							if (status !== 'all') {
								path += `?status=${status}`;
							}
						} catch (error) {
							// If status parameter is not available, use default behavior (no filter)
						}
					} else if (operation === 'cancel') {
						method = 'POST';
						const taskId = this.getNodeParameter('taskId', i) as number;
						if (!taskId && taskId !== 0) {
							throw new NodeOperationError(this.getNode(), 'Task ID is required', { itemIndex: i });
						}
						path = `/dedicated/server/${serverNameTrimmed}/task/${taskId}/cancel`;
					}
				} else if (resource === 'ip') {
					if (operation === 'getAll') {
						const serverName = this.getNodeParameter('serverName', i) as string;
						if (!serverName || serverName.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'Server name is required', {
								itemIndex: i,
							});
						}
						path = `/dedicated/server/${serverName.trim()}/ips`;
					} else if (operation === 'get') {
						const ipAddress = this.getNodeParameter('ipAddress', i) as string;
						if (!ipAddress || ipAddress.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'IP address is required', {
								itemIndex: i,
							});
						}
						path = `/ip/${encodeURIComponent(ipAddress.trim())}`;
					}
				} else if (resource === 'installation') {
					const serverName = this.getNodeParameter('serverName', i) as string;
					if (!serverName || serverName.trim() === '') {
						throw new NodeOperationError(this.getNode(), 'Server name is required', {
							itemIndex: i,
						});
					}
					const serverNameTrimmed = serverName.trim();

					if (operation === 'getStatus') {
						path = `/dedicated/server/${serverNameTrimmed}/install/status`;
					} else if (operation === 'getTemplates') {
						path = `/dedicated/server/${serverNameTrimmed}/install/compatibleTemplates`;
					} else if (operation === 'start') {
						method = 'POST';
						const templateName = this.getNodeParameter('templateName', i) as string;
						if (!templateName || templateName.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'Template name is required', {
								itemIndex: i,
							});
						}
						const partitionScheme = this.getNodeParameter('partitionScheme', i) as string;
						path = `/dedicated/server/${serverNameTrimmed}/install/start`;
						body = {
							templateName: templateName.trim(),
							partitionSchemeName: partitionScheme || 'default',
						};
					}
				} else if (resource === 'network') {
					const serverName = this.getNodeParameter('serverName', i) as string;
					if (!serverName || serverName.trim() === '') {
						throw new NodeOperationError(this.getNode(), 'Server name is required', {
							itemIndex: i,
						});
					}
					const serverNameTrimmed = serverName.trim();

					if (operation === 'getVirtualMacs') {
						path = `/dedicated/server/${serverNameTrimmed}/virtualMac`;
					} else if (operation === 'createVirtualMac') {
						method = 'POST';
						const ipAddress = this.getNodeParameter('ipAddress', i) as string;
						const virtualMacType = this.getNodeParameter('virtualMacType', i) as string;
						if (!ipAddress || ipAddress.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'IP address is required', {
								itemIndex: i,
							});
						}
						path = `/dedicated/server/${serverNameTrimmed}/virtualMac`;
						body = {
							ipAddress: ipAddress.trim(),
							type: virtualMacType,
						};
					} else if (operation === 'deleteVirtualMac') {
						method = 'DELETE';
						const macAddress = this.getNodeParameter('macAddress', i) as string;
						if (!macAddress || macAddress.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'MAC address is required', {
								itemIndex: i,
							});
						}
						path = `/dedicated/server/${serverNameTrimmed}/virtualMac/${encodeURIComponent(macAddress.trim())}`;
					} else if (operation === 'getSecondaryDns') {
						path = `/dedicated/server/${serverNameTrimmed}/secondaryDnsDomains`;
					} else if (operation === 'addSecondaryDns') {
						method = 'POST';
						const domain = this.getNodeParameter('domain', i) as string;
						if (!domain || domain.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'Domain is required', { itemIndex: i });
						}
						path = `/dedicated/server/${serverNameTrimmed}/secondaryDnsDomains`;
						body = { domain: domain.trim() };
					} else if (operation === 'deleteSecondaryDns') {
						method = 'DELETE';
						const domain = this.getNodeParameter('domain', i) as string;
						if (!domain || domain.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'Domain is required', { itemIndex: i });
						}
						path = `/dedicated/server/${serverNameTrimmed}/secondaryDnsDomains/${encodeURIComponent(domain.trim())}`;
					} else if (operation === 'ipBlockMerge') {
						const ipBlock = this.getNodeParameter('ipBlock', i) as string;
						if (!ipBlock || ipBlock.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'IP block is required', {
								itemIndex: i,
							});
						}
						path = `/dedicated/server/${serverNameTrimmed}/ipBlockMerge?block=${encodeURIComponent(ipBlock.trim())}`;
					}
				} else if (resource === 'security') {
					const serverName = this.getNodeParameter('serverName', i) as string;
					if (!serverName || serverName.trim() === '') {
						throw new NodeOperationError(this.getNode(), 'Server name is required', {
							itemIndex: i,
						});
					}
					const serverNameTrimmed = serverName.trim();

					if (operation === 'getFirewall') {
						// Try the firewall endpoint, but it may not exist for all servers
						path = `/dedicated/server/${serverNameTrimmed}/firewall`;
					} else if (operation === 'updateFirewall') {
						method = 'PUT';
						const firewallEnabled = this.getNodeParameter('firewallEnabled', i) as boolean;
						const firewallMode = this.getNodeParameter('firewallMode', i) as string;
						path = `/dedicated/server/${serverNameTrimmed}/firewall`;
						body = {
							enabled: firewallEnabled,
							mode: firewallMode,
						};
					} else if (operation === 'getIpSpoof') {
						// Correct endpoint for IP configuration/restrictions
						path = `/dedicated/server/${serverNameTrimmed}/ips`;
					}
				} else if (resource === 'options') {
					const serverName = this.getNodeParameter('serverName', i) as string;
					if (!serverName || serverName.trim() === '') {
						throw new NodeOperationError(this.getNode(), 'Server name is required', {
							itemIndex: i,
						});
					}
					const serverNameTrimmed = serverName.trim();

					if (operation === 'getAvailable') {
						path = `/dedicated/server/${serverNameTrimmed}/option`;
					}
				} else if (resource === 'intervention') {
					const serverName = this.getNodeParameter('serverName', i) as string;
					if (!serverName || serverName.trim() === '') {
						throw new NodeOperationError(this.getNode(), 'Server name is required', {
							itemIndex: i,
						});
					}
					const serverNameTrimmed = serverName.trim();

					if (operation === 'get') {
						const interventionId = this.getNodeParameter('interventionId', i) as number;
						if (!interventionId && interventionId !== 0) {
							throw new NodeOperationError(this.getNode(), 'Intervention ID is required', {
								itemIndex: i,
							});
						}
						path = `/dedicated/server/${serverNameTrimmed}/intervention/${interventionId}`;
					} else if (operation === 'getAll') {
						path = `/dedicated/server/${serverNameTrimmed}/intervention`;
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
							// Provide more context based on the resource and operation
							if (resource === 'intervention' && operation === 'getAll') {
								returnData.push({ json: { interventionId: item, id: item } });
							} else if (resource === 'task' && operation === 'getAll') {
								returnData.push({ json: { taskId: item, id: item } });
							} else if (resource === 'network' && operation === 'getVirtualMacs') {
								returnData.push({ json: { macAddress: item, mac: item } });
							} else if (resource === 'network' && operation === 'getSecondaryDns') {
								returnData.push({ json: { domain: item, domainName: item } });
							} else {
								returnData.push({ json: { value: item } });
							}
						} else {
							returnData.push({ json: item });
						}
					});
				} else {
					returnData.push(responseData as IDataObject);
				}
			} catch (error) {
				// Special handling for installation status when no installation is in progress
				if (resource === 'installation' && operation === 'getStatus' && error.statusCode === 404) {
					returnData.push({
						json: {
							status: 'no_installation',
							message: 'No installation or reinstallation in progress',
						},
					});
					// Special handling for security features that may not be available
				} else if (resource === 'security' && error.statusCode === 404) {
					if (operation === 'getFirewall') {
						returnData.push({
							json: {
								available: false,
								message: 'Firewall feature is not available for this server',
							},
						});
					} else if (operation === 'getIpSpoof') {
						returnData.push({
							json: {
								available: false,
								message: 'IP spoof protection information is not available for this server',
							},
						});
					} else {
						returnData.push({
							json: {
								available: false,
								message: 'This security feature is not available for this server',
							},
						});
					}
				} else if (this.continueOnFail()) {
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
