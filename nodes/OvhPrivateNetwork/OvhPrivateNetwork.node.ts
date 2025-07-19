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


export class OvhPrivateNetwork implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OVH Private Network',
		name: 'ovhPrivateNetwork',
		icon: 'file:ovh.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage OVH Private Network (vRack)',
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
					},
					{
						name: 'Dedicated Server',
						value: 'dedicatedServer',
					},
					{
						name: 'IP Block',
						value: 'ipBlock',
					},
					{
						name: 'Private Network',
						value: 'privateNetwork',
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
						name: 'vRack',
						value: 'vrack',
					},
				],
				default: 'vrack',
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
						name: 'Get',
						value: 'get',
						description: 'Get vRack information',
						action: 'Get v rack information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many vRacks',
						action: 'Get many v racks',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update vRack settings',
						action: 'Update v rack settings',
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
						name: 'Add',
						value: 'add',
						description: 'Add a service to vRack',
						action: 'Add a service to v rack',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many services in vRack',
						action: 'Get many services in v rack',
					},
					{
						name: 'Remove',
						value: 'remove',
						description: 'Remove a service from vRack',
						action: 'Remove a service from v rack',
					},
				],
				default: 'getAll',
			},
			// Cloud Project operations
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
						name: 'Add',
						value: 'add',
						description: 'Add cloud project to vRack',
						action: 'Add cloud project to v rack',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many cloud projects in vRack',
						action: 'Get many cloud projects in v rack',
					},
					{
						name: 'Remove',
						value: 'remove',
						description: 'Remove cloud project from vRack',
						action: 'Remove cloud project from v rack',
					},
				],
				default: 'getAll',
			},
			// Dedicated Server operations
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
						name: 'Add',
						value: 'add',
						description: 'Add dedicated server to vRack',
						action: 'Add dedicated server to v rack',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many dedicated servers in vRack',
						action: 'Get many dedicated servers in v rack',
					},
					{
						name: 'Remove',
						value: 'remove',
						description: 'Remove dedicated server from vRack',
						action: 'Remove dedicated server from v rack',
					},
				],
				default: 'getAll',
			},
			// IP Block operations
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
						name: 'Add',
						value: 'add',
						description: 'Add IP block to vRack',
						action: 'Add i p block to v rack',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many IP blocks in vRack',
						action: 'Get many i p blocks in v rack',
					},
					{
						name: 'Remove',
						value: 'remove',
						description: 'Remove IP block from vRack',
						action: 'Remove i p block from v rack',
					},
				],
				default: 'getAll',
			},
			// Private Network operations (for cloud projects)
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
						name: 'Create',
						value: 'create',
						description: 'Create a private network',
						action: 'Create a private network',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a private network',
						action: 'Delete a private network',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get private network information',
						action: 'Get private network information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many private networks',
						action: 'Get many private networks',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update private network',
						action: 'Update private network',
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
			// vRack ID field
			{
				displayName: 'vRack ID',
				name: 'vrackId',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'pn-xxxxxx',
				description: 'The vRack service name',
				displayOptions: {
					show: {
						resource: ['vrack', 'service', 'cloudProject', 'dedicatedServer', 'ipBlock', 'privateNetwork', 'task'],
					},
					hide: {
						resource: ['vrack'],
						operation: ['getAll'],
					},
				},
			},
			// Service name field
			{
				displayName: 'Service Name',
				name: 'serviceName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['service', 'cloudProject', 'dedicatedServer', 'ipBlock'],
						operation: ['add', 'remove'],
					},
				},
				placeholder: 'service-identifier',
			},
			// Project ID field
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['privateNetwork'],
					},
				},
				placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
			},
			// Private Network ID field
			{
				displayName: 'Private Network ID',
				name: 'privateNetworkId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['privateNetwork'],
						operation: ['get', 'delete', 'update'],
					},
				},
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
						operation: ['get'],
					},
				},
			},
			// Private Network creation fields
			{
				displayName: 'Network Name',
				name: 'networkName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['privateNetwork'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: 'my-private-network',
			},
			{
				displayName: 'VLAN ID',
				name: 'vlanId',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['privateNetwork'],
						operation: ['create'],
					},
				},
				default: 0,
				placeholder: '100',
				description: 'VLAN ID (0-4094, 0 for no VLAN)',
			},
			{
				displayName: 'Regions',
				name: 'regions',
				type: 'multiOptions',
				displayOptions: {
					show: {
						resource: ['privateNetwork'],
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
						name: 'SBG5',
						value: 'SBG5',
					},
					{
						name: 'UK1',
						value: 'UK1',
					},
					{
						name: 'WAW1',
						value: 'WAW1',
					},
				],
				default: ['GRA7'],
				required: true,
			},
			// vRack update fields
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['vrack'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
					},
				],
			},
			// Private Network update fields
			{
				displayName: 'Update Fields',
				name: 'updateFields',
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
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
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

				if (resource === 'vrack') {
					if (operation === 'get') {
						const vrackId = this.getNodeParameter('vrackId', i) as string;
						path = `/vrack/${vrackId}`;
					} else if (operation === 'getAll') {
						path = '/vrack';
					} else if (operation === 'update') {
						method = 'PUT';
						const vrackId = this.getNodeParameter('vrackId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						path = `/vrack/${vrackId}`;
						
						if (updateFields.name) body.name = updateFields.name;
						if (updateFields.description) body.description = updateFields.description;
					}
				} else if (resource === 'service') {
					const vrackId = this.getNodeParameter('vrackId', i) as string;
					
					if (operation === 'getAll') {
						path = `/vrack/${vrackId}/allowedServices`;
					} else if (operation === 'add') {
						method = 'POST';
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/vrack/${vrackId}/assign`;
						body = { service: serviceName };
					} else if (operation === 'remove') {
						method = 'POST';
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/vrack/${vrackId}/unassign`;
						body = { service: serviceName };
					}
				} else if (resource === 'cloudProject') {
					const vrackId = this.getNodeParameter('vrackId', i) as string;
					
					if (operation === 'getAll') {
						path = `/vrack/${vrackId}/cloudProject`;
					} else if (operation === 'add') {
						method = 'POST';
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/vrack/${vrackId}/cloudProject`;
						body = { project: serviceName };
					} else if (operation === 'remove') {
						method = 'DELETE';
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/vrack/${vrackId}/cloudProject/${serviceName}`;
					}
				} else if (resource === 'dedicatedServer') {
					const vrackId = this.getNodeParameter('vrackId', i) as string;
					
					if (operation === 'getAll') {
						path = `/vrack/${vrackId}/dedicatedServer`;
					} else if (operation === 'add') {
						method = 'POST';
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/vrack/${vrackId}/dedicatedServer`;
						body = { dedicatedServer: serviceName };
					} else if (operation === 'remove') {
						method = 'DELETE';
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/vrack/${vrackId}/dedicatedServer/${serviceName}`;
					}
				} else if (resource === 'ipBlock') {
					const vrackId = this.getNodeParameter('vrackId', i) as string;
					
					if (operation === 'getAll') {
						path = `/vrack/${vrackId}/ip`;
					} else if (operation === 'add') {
						method = 'POST';
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/vrack/${vrackId}/ip`;
						body = { block: serviceName };
					} else if (operation === 'remove') {
						method = 'DELETE';
						const serviceName = this.getNodeParameter('serviceName', i) as string;
						path = `/vrack/${vrackId}/ip/${encodeURIComponent(serviceName)}`;
					}
				} else if (resource === 'privateNetwork') {
					const projectId = this.getNodeParameter('projectId', i) as string;
					
					if (operation === 'get') {
						const privateNetworkId = this.getNodeParameter('privateNetworkId', i) as string;
						path = `/cloud/project/${projectId}/network/private/${privateNetworkId}`;
					} else if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/network/private`;
					} else if (operation === 'create') {
						method = 'POST';
						const networkName = this.getNodeParameter('networkName', i) as string;
						const vlanId = this.getNodeParameter('vlanId', i) as number;
						const regions = this.getNodeParameter('regions', i) as string[];
						const vrackId = this.getNodeParameter('vrackId', i) as string;
						
						path = `/cloud/project/${projectId}/network/private`;
						body = {
							name: networkName,
							regions,
							vlanId: vlanId > 0 ? vlanId : undefined,
							vrackId,
						};
					} else if (operation === 'delete') {
						method = 'DELETE';
						const privateNetworkId = this.getNodeParameter('privateNetworkId', i) as string;
						path = `/cloud/project/${projectId}/network/private/${privateNetworkId}`;
					} else if (operation === 'update') {
						method = 'PUT';
						const privateNetworkId = this.getNodeParameter('privateNetworkId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						path = `/cloud/project/${projectId}/network/private/${privateNetworkId}`;
						
						if (updateFields.name) body.name = updateFields.name;
					}
				} else if (resource === 'task') {
					const vrackId = this.getNodeParameter('vrackId', i) as string;
					
					if (operation === 'get') {
						const taskId = this.getNodeParameter('taskId', i) as number;
						path = `/vrack/${vrackId}/task/${taskId}`;
					} else if (operation === 'getAll') {
						path = `/vrack/${vrackId}/task`;
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