import {
	ICredentialType,
	INodeProperties,
	ICredentialTestRequest,
} from 'n8n-workflow';

export class OvhApi implements ICredentialType {
	name = 'ovhApi';
	displayName = 'OVH API';
	documentationUrl = 'https://api.ovh.com/console/';
	properties: INodeProperties[] = [
		{
			displayName: 'Endpoint',
			name: 'endpoint',
			type: 'options',
			options: [
				{
					name: 'OVH Europe',
					value: 'https://eu.api.ovh.com/1.0',
				},
				{
					name: 'OVH Canada',
					value: 'https://ca.api.ovh.com/1.0',
				},
				{
					name: 'OVH US',
					value: 'https://api.us.ovhcloud.com/1.0',
				},
				{
					name: 'So you Start Europe',
					value: 'https://eu.api.soyoustart.com/1.0',
				},
				{
					name: 'So you Start Canada',
					value: 'https://ca.api.soyoustart.com/1.0',
				},
				{
					name: 'Kimsufi Europe',
					value: 'https://eu.api.kimsufi.com/1.0',
				},
				{
					name: 'Kimsufi Canada',
					value: 'https://ca.api.kimsufi.com/1.0',
				},
			],
			default: 'https://eu.api.ovh.com/1.0',
			description: 'The OVH API endpoint to use.',
		},
		{
			displayName: 'Application Key',
			name: 'applicationKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Your OVH application key.',
			required: true,
		},
		{
			displayName: 'Application Secret',
			name: 'applicationSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Your OVH application secret.',
			required: true,
		},
		{
			displayName: 'Consumer Key',
			name: 'consumerKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Your OVH consumer key.',
			required: true,
		},
	];

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.endpoint}}',
			url: '/me',
			method: 'GET',
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					key: 'nichandle',
					value: '',
					message: 'Invalid credentials',
				},
			},
		],
	};
}