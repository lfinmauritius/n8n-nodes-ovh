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
						name: 'Server',
						value: 'server',
					},
					{
						name: 'Task',
						value: 'task',
					},
					{
						name: 'IP',
						value: 'ip',
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
			// Server name field
			{
				displayName: 'Server Name',
				name: 'serverName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['server', 'task', 'ip'],
						operation: ['get', 'getHardware', 'getNetwork', 'getServiceInfo', 'reboot', 'getAll', 'cancel'],
					},
					hide: {
						resource: ['server'],
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
				required: true,
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
				required: true,
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

				if (resource === 'server') {
					if (operation === 'get') {
						const serverName = this.getNodeParameter('serverName', i) as string;
						if (!serverName || serverName.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'Server name is required', { itemIndex: i });
						}
						path = `/dedicated/server/${serverName.trim()}`;
					} else if (operation === 'getAll') {
						path = '/dedicated/server';
					} else if (operation === 'getHardware') {
						const serverName = this.getNodeParameter('serverName', i) as string;
						if (!serverName || serverName.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'Server name is required', { itemIndex: i });
						}
						path = `/dedicated/server/${serverName.trim()}/specifications/hardware`;
					} else if (operation === 'getNetwork') {
						const serverName = this.getNodeParameter('serverName', i) as string;
						if (!serverName || serverName.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'Server name is required', { itemIndex: i });
						}
						path = `/dedicated/server/${serverName.trim()}/specifications/network`;
					} else if (operation === 'getServiceInfo') {
						const serverName = this.getNodeParameter('serverName', i) as string;
						if (!serverName || serverName.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'Server name is required', { itemIndex: i });
						}
						path = `/dedicated/server/${serverName.trim()}/serviceInfos`;
					} else if (operation === 'reboot') {
						method = 'POST';
						const serverName = this.getNodeParameter('serverName', i) as string;
						if (!serverName || serverName.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'Server name is required', { itemIndex: i });
						}
						path = `/dedicated/server/${serverName.trim()}/reboot`;
					}
				} else if (resource === 'task') {
					const serverName = this.getNodeParameter('serverName', i) as string;
					if (!serverName || serverName.trim() === '') {
						throw new NodeOperationError(this.getNode(), 'Server name is required', { itemIndex: i });
					}
					
					const serverNameTrimmed = serverName.trim();
					
					if (operation === 'get') {
						const taskId = this.getNodeParameter('taskId', i) as number;
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
						path = `/dedicated/server/${serverNameTrimmed}/task/${taskId}/cancel`;
					}
				} else if (resource === 'ip') {
					const serverName = this.getNodeParameter('serverName', i) as string;
					if (!serverName || serverName.trim() === '') {
						throw new NodeOperationError(this.getNode(), 'Server name is required', { itemIndex: i });
					}
					
					const serverNameTrimmed = serverName.trim();
					
					if (operation === 'getAll') {
						path = `/dedicated/server/${serverNameTrimmed}/ips`;
					} else if (operation === 'get') {
						const ipAddress = this.getNodeParameter('ipAddress', i) as string;
						if (!ipAddress || ipAddress.trim() === '') {
							throw new NodeOperationError(this.getNode(), 'IP address is required', { itemIndex: i });
						}
						path = `/ip/${encodeURIComponent(ipAddress.trim())}`;
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

				const signature = '$1$' + createHash('sha1').update(signatureElements.join('+')).digest('hex');

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
					returnData.push(...responseData);
				} else {
					returnData.push(responseData);
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