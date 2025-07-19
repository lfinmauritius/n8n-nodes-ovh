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
						path = `/dedicated/server/${serverName}`;
					} else if (operation === 'getAll') {
						path = '/dedicated/server';
					} else if (operation === 'getHardware') {
						const serverName = this.getNodeParameter('serverName', i) as string;
						path = `/dedicated/server/${serverName}/specifications/hardware`;
					} else if (operation === 'getNetwork') {
						const serverName = this.getNodeParameter('serverName', i) as string;
						path = `/dedicated/server/${serverName}/specifications/network`;
					} else if (operation === 'getServiceInfo') {
						const serverName = this.getNodeParameter('serverName', i) as string;
						path = `/dedicated/server/${serverName}/serviceInfos`;
					} else if (operation === 'reboot') {
						method = 'POST';
						const serverName = this.getNodeParameter('serverName', i) as string;
						path = `/dedicated/server/${serverName}/reboot`;
					}
				} else if (resource === 'task') {
					const serverName = this.getNodeParameter('serverName', i) as string;
					
					if (operation === 'get') {
						const taskId = this.getNodeParameter('taskId', i) as number;
						path = `/dedicated/server/${serverName}/task/${taskId}`;
					} else if (operation === 'getAll') {
						path = `/dedicated/server/${serverName}/task`;
						const status = this.getNodeParameter('status', i) as string;
						if (status !== 'all') {
							path += `?status=${status}`;
						}
					} else if (operation === 'cancel') {
						method = 'POST';
						const taskId = this.getNodeParameter('taskId', i) as number;
						path = `/dedicated/server/${serverName}/task/${taskId}/cancel`;
					}
				} else if (resource === 'ip') {
					const serverName = this.getNodeParameter('serverName', i) as string;
					
					if (operation === 'getAll') {
						path = `/dedicated/server/${serverName}/ips`;
					} else if (operation === 'get') {
						const ipAddress = this.getNodeParameter('ipAddress', i) as string;
						path = `/ip/${encodeURIComponent(ipAddress)}`;
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