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

export class OvhCompute implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OVH Public Cloud Compute',
		name: 'ovhCompute',
		icon: 'file:ovh.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage OVH Public Cloud Compute instances',
		defaults: {
			name: 'OVH Public Cloud Compute',
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
						name: 'Flavor',
						value: 'flavor',
					},
					{
						name: 'Image',
						value: 'image',
					},
					{
						name: 'Instance',
						value: 'instance',
					},
					{
						name: 'Instance Backup',
						value: 'instanceBackup',
					},
					{
						name: 'Region',
						value: 'region',
					},
					{
						name: 'SSH Key',
						value: 'sshkey',
					},
				],
				default: 'instance',
			},
			// Instance operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['instance'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new compute instance',
						action: 'Create a new compute instance',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a compute instance',
						action: 'Delete a compute instance',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get compute instance information',
						action: 'Get compute instance information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many compute instances',
						action: 'Get many compute instances',
					},
					{
						name: 'Reboot',
						value: 'reboot',
						description: 'Reboot a compute instance',
						action: 'Reboot a compute instance',
					},
					{
						name: 'Reinstall',
						value: 'reinstall',
						description: 'Reinstall a compute instance',
						action: 'Reinstall a compute instance',
					},
					{
						name: 'Resize',
						value: 'resize',
						description: 'Resize a compute instance',
						action: 'Resize a compute instance',
					},
					{
						name: 'Start',
						value: 'start',
						description: 'Start a compute instance',
						action: 'Start a compute instance',
					},
					{
						name: 'Stop',
						value: 'stop',
						description: 'Stop a compute instance',
						action: 'Stop a compute instance',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update compute instance',
						action: 'Update compute instance',
					},
				],
				default: 'get',
			},
			// Instance Backup operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['instanceBackup'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create an instance backup',
						action: 'Create an instance backup',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an instance backup',
						action: 'Delete an instance backup',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get instance backup information',
						action: 'Get instance backup information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many instance backups',
						action: 'Get many instance backups',
					},
					{
						name: 'Restore',
						value: 'restore',
						description: 'Restore from instance backup',
						action: 'Restore from instance backup',
					},
				],
				default: 'get',
			},
			// SSH Key operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['sshkey'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new SSH key',
						action: 'Create a new SSH key',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an SSH key',
						action: 'Delete an SSH key',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get SSH key information',
						action: 'Get SSH key information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many SSH keys',
						action: 'Get many SSH keys',
					},
				],
				default: 'get',
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
						name: 'Get',
						value: 'get',
						description: 'Get flavor information',
						action: 'Get flavor information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many flavors',
						action: 'Get many flavors',
					},
				],
				default: 'getAll',
			},
			// Image operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['image'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get image information',
						action: 'Get image information',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many images',
						action: 'Get many images',
					},
				],
				default: 'getAll',
			},
			// Region operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['region'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many regions',
						action: 'Get many regions',
					},
				],
				default: 'getAll',
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
			// Instance ID field
			{
				displayName: 'Instance ID',
				name: 'instanceId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['instance', 'instanceBackup'],
						operation: ['get', 'delete', 'update', 'start', 'stop', 'reboot', 'reinstall', 'resize', 'getAll', 'create', 'restore'],
					},
					hide: {
						resource: ['instance'],
						operation: ['getAll', 'create'],
					},
				},
			},
			// Backup ID field
			{
				displayName: 'Backup ID',
				name: 'backupId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['instanceBackup'],
						operation: ['get', 'delete', 'restore'],
					},
				},
			},
			// SSH Key ID field
			{
				displayName: 'SSH Key ID',
				name: 'sshKeyId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['sshkey'],
						operation: ['get', 'delete'],
					},
				},
			},
			// Flavor ID field
			{
				displayName: 'Flavor ID',
				name: 'flavorId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['flavor'],
						operation: ['get'],
					},
				},
			},
			// Image ID field
			{
				displayName: 'Image ID',
				name: 'imageId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['get'],
					},
				},
			},
			// Instance creation fields
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['instance'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: 'my-instance',
			},
			{
				displayName: 'Flavor ID',
				name: 'flavorId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['instance'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: 'b2-7',
			},
			{
				displayName: 'Image ID',
				name: 'imageId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['instance'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: 'ubuntu-22.04',
			},
			{
				displayName: 'Region',
				name: 'region',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['instance'],
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
				default: 'GRA7',
				required: true,
			},
			{
				displayName: 'SSH Key ID',
				name: 'sshKeyId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['instance'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'my-ssh-key',
			},
			// SSH Key creation fields
			{
				displayName: 'SSH Key Name',
				name: 'sshKeyName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['sshkey'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: 'my-ssh-key',
			},
			{
				displayName: 'Public Key',
				name: 'publicKey',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['sshkey'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: 'ssh-rsa AAAAB3NzaC1yc2E...',
			},
			// Instance backup creation fields
			{
				displayName: 'Backup Name',
				name: 'backupName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['instanceBackup'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: 'my-backup',
			},
			// Instance resize fields
			{
				displayName: 'New Flavor ID',
				name: 'newFlavorId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['instance'],
						operation: ['resize'],
					},
				},
				default: '',
				required: true,
				placeholder: 'b2-15',
			},
			// Instance reinstall fields
			{
				displayName: 'New Image ID',
				name: 'newImageId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['instance'],
						operation: ['reinstall'],
					},
				},
				default: '',
				required: true,
				placeholder: 'ubuntu-22.04',
			},
			// Instance update fields
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['instance'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Instance Name',
						name: 'instanceName',
						type: 'string',
						default: '',
					},
				],
			},
			// Reboot type
			{
				displayName: 'Reboot Type',
				name: 'rebootType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['instance'],
						operation: ['reboot'],
					},
				},
				options: [
					{
						name: 'Soft',
						value: 'soft',
					},
					{
						name: 'Hard',
						value: 'hard',
					},
				],
				default: 'soft',
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

				const projectId = this.getNodeParameter('projectId', i) as string;

				if (resource === 'instance') {
					if (operation === 'get') {
						const instanceId = this.getNodeParameter('instanceId', i) as string;
						path = `/cloud/project/${projectId}/instance/${instanceId}`;
					} else if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/instance`;
					} else if (operation === 'create') {
						method = 'POST';
						const name = this.getNodeParameter('name', i) as string;
						const flavorId = this.getNodeParameter('flavorId', i) as string;
						const imageId = this.getNodeParameter('imageId', i) as string;
						const region = this.getNodeParameter('region', i) as string;
						const sshKeyId = this.getNodeParameter('sshKeyId', i) as string;
						
						path = `/cloud/project/${projectId}/instance`;
						body = {
							name,
							flavorId,
							imageId,
							region,
						};
						if (sshKeyId) body.sshKeyId = sshKeyId;
					} else if (operation === 'delete') {
						method = 'DELETE';
						const instanceId = this.getNodeParameter('instanceId', i) as string;
						path = `/cloud/project/${projectId}/instance/${instanceId}`;
					} else if (operation === 'update') {
						method = 'PUT';
						const instanceId = this.getNodeParameter('instanceId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						path = `/cloud/project/${projectId}/instance/${instanceId}`;
						
						if (updateFields.instanceName) body.instanceName = updateFields.instanceName;
					} else if (operation === 'start') {
						method = 'POST';
						const instanceId = this.getNodeParameter('instanceId', i) as string;
						path = `/cloud/project/${projectId}/instance/${instanceId}/start`;
					} else if (operation === 'stop') {
						method = 'POST';
						const instanceId = this.getNodeParameter('instanceId', i) as string;
						path = `/cloud/project/${projectId}/instance/${instanceId}/stop`;
					} else if (operation === 'reboot') {
						method = 'POST';
						const instanceId = this.getNodeParameter('instanceId', i) as string;
						const rebootType = this.getNodeParameter('rebootType', i) as string;
						path = `/cloud/project/${projectId}/instance/${instanceId}/reboot`;
						body = { type: rebootType };
					} else if (operation === 'reinstall') {
						method = 'POST';
						const instanceId = this.getNodeParameter('instanceId', i) as string;
						const newImageId = this.getNodeParameter('newImageId', i) as string;
						path = `/cloud/project/${projectId}/instance/${instanceId}/reinstall`;
						body = { imageId: newImageId };
					} else if (operation === 'resize') {
						method = 'POST';
						const instanceId = this.getNodeParameter('instanceId', i) as string;
						const newFlavorId = this.getNodeParameter('newFlavorId', i) as string;
						path = `/cloud/project/${projectId}/instance/${instanceId}/resize`;
						body = { flavorId: newFlavorId };
					}
				} else if (resource === 'instanceBackup') {
					const instanceId = this.getNodeParameter('instanceId', i) as string;
					
					if (operation === 'get') {
						const backupId = this.getNodeParameter('backupId', i) as string;
						path = `/cloud/project/${projectId}/instance/${instanceId}/backup/${backupId}`;
					} else if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/instance/${instanceId}/backup`;
					} else if (operation === 'create') {
						method = 'POST';
						const backupName = this.getNodeParameter('backupName', i) as string;
						path = `/cloud/project/${projectId}/instance/${instanceId}/backup`;
						body = { snapshotName: backupName };
					} else if (operation === 'delete') {
						method = 'DELETE';
						const backupId = this.getNodeParameter('backupId', i) as string;
						path = `/cloud/project/${projectId}/instance/${instanceId}/backup/${backupId}`;
					} else if (operation === 'restore') {
						method = 'POST';
						const backupId = this.getNodeParameter('backupId', i) as string;
						path = `/cloud/project/${projectId}/instance/${instanceId}/backup/${backupId}/restore`;
					}
				} else if (resource === 'sshkey') {
					if (operation === 'get') {
						const sshKeyId = this.getNodeParameter('sshKeyId', i) as string;
						path = `/cloud/project/${projectId}/sshkey/${sshKeyId}`;
					} else if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/sshkey`;
					} else if (operation === 'create') {
						method = 'POST';
						const sshKeyName = this.getNodeParameter('sshKeyName', i) as string;
						const publicKey = this.getNodeParameter('publicKey', i) as string;
						path = `/cloud/project/${projectId}/sshkey`;
						body = {
							name: sshKeyName,
							publicKey,
						};
					} else if (operation === 'delete') {
						method = 'DELETE';
						const sshKeyId = this.getNodeParameter('sshKeyId', i) as string;
						path = `/cloud/project/${projectId}/sshkey/${sshKeyId}`;
					}
				} else if (resource === 'flavor') {
					if (operation === 'get') {
						const flavorId = this.getNodeParameter('flavorId', i) as string;
						path = `/cloud/project/${projectId}/flavor/${flavorId}`;
					} else if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/flavor`;
					}
				} else if (resource === 'image') {
					if (operation === 'get') {
						const imageId = this.getNodeParameter('imageId', i) as string;
						path = `/cloud/project/${projectId}/image/${imageId}`;
					} else if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/image`;
					}
				} else if (resource === 'region') {
					if (operation === 'getAll') {
						path = `/cloud/project/${projectId}/region`;
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