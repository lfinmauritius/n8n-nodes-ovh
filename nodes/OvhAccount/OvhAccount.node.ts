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

export class OvhAccount implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OVH Account',
		name: 'ovhAccount',
		icon: 'file:ovh.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage OVH Account, billing, security and API settings',
		defaults: {
			name: 'OVH Account',
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
						name: 'Abuse',
						value: 'abuse',
					},
					{
						name: 'Access Restriction',
						value: 'accessRestriction',
					},
					{
						name: 'Account',
						value: 'account',
					},
					{
						name: 'Agreement',
						value: 'agreement',
					},
					{
						name: 'API Application',
						value: 'apiApplication',
					},
					{
						name: 'API Credential',
						value: 'apiCredential',
					},
					{
						name: 'API OAuth2',
						value: 'apiOauth2',
					},
					{
						name: 'Bill',
						value: 'bill',
					},
					{
						name: 'Contact',
						value: 'contact',
					},
					{
						name: 'Credit',
						value: 'credit',
					},
					{
						name: 'Document',
						value: 'document',
					},
					{
						name: 'Identity',
						value: 'identity',
					},
					{
						name: 'Notification',
						value: 'notification',
					},
					{
						name: 'Order',
						value: 'order',
					},
					{
						name: 'Payment Mean',
						value: 'paymentMean',
					},
					{
						name: 'SSH Key',
						value: 'sshKey',
					},
					{
						name: 'Sub Account',
						value: 'subAccount',
					},
					{
						name: 'Support Level',
						value: 'supportLevel',
					},
					{
						name: 'Task',
						value: 'task',
					},
					{
						name: 'VIP Status',
						value: 'vipStatus',
					},
				],
				default: 'account',
			},
			// Account operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['account'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get account details',
						action: 'Get account details',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update account details',
						action: 'Update account details',
					},
				],
				default: 'get',
			},
			// Abuse operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['abuse'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get specific abuse case',
						action: 'Get abuse case',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get all abuse cases',
						action: 'Get many abuse cases',
					},
				],
				default: 'getMany',
			},
			// Access Restriction operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['accessRestriction'],
					},
				},
				options: [
					{
						name: 'Create IP Restriction',
						value: 'createIp',
						description: 'Add an IP access restriction',
						action: 'Create IP restriction',
					},
					{
						name: 'Create SMS',
						value: 'createSms',
						description: 'Add SMS Two-Factor authentication',
						action: 'Create SMS',
					},
					{
						name: 'Create TOTP',
						value: 'createTotp',
						description: 'Add TOTP Two-Factor authentication',
						action: 'Create TOTP',
					},
					{
						name: 'Delete IP Restriction',
						value: 'deleteIp',
						description: 'Delete an IP restriction',
						action: 'Delete IP restriction',
					},
					{
						name: 'Delete SMS',
						value: 'deleteSms',
						description: 'Delete SMS account',
						action: 'Delete SMS',
					},
					{
						name: 'Delete TOTP',
						value: 'deleteTotp',
						description: 'Delete TOTP account',
						action: 'Delete TOTP',
					},
					{
						name: 'Get Default IP Rule',
						value: 'getDefaultIpRule',
						description: 'Get default IP restriction rule',
						action: 'Get default IP rule',
					},
					{
						name: 'Get Developer Mode',
						value: 'getDeveloperMode',
						description: 'Get developer mode restriction status',
						action: 'Get developer mode',
					},
					{
						name: 'Get IP Restrictions',
						value: 'getIp',
						description: 'Get IP restrictions list',
						action: 'Get IP restrictions',
					},
					{
						name: 'Get SMS',
						value: 'getSms',
						description: 'Get SMS Two-Factor accounts',
						action: 'Get SMS accounts',
					},
					{
						name: 'Get TOTP',
						value: 'getTotp',
						description: 'Get TOTP Two-Factor accounts',
						action: 'Get TOTP accounts',
					},
					{
						name: 'Update Default IP Rule',
						value: 'updateDefaultIpRule',
						description: 'Update default IP restriction rule',
						action: 'Update default IP rule',
					},
					{
						name: 'Update Developer Mode',
						value: 'updateDeveloperMode',
						description: 'Update developer mode restriction',
						action: 'Update developer mode',
					},
				],
				default: 'getIp',
			},
			// Agreement operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['agreement'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get specific agreement',
						action: 'Get agreement',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get all agreements',
						action: 'Get many agreements',
					},
					{
						name: 'Accept',
						value: 'accept',
						description: 'Accept an agreement',
						action: 'Accept agreement',
					},
				],
				default: 'getMany',
			},
			// API Application operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['apiApplication'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get specific API application',
						action: 'Get API application',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get all API applications',
						action: 'Get many API applications',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an API application',
						action: 'Delete API application',
					},
				],
				default: 'getMany',
			},
			// API Credential operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['apiCredential'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get specific API credential',
						action: 'Get API credential',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get all API credentials',
						action: 'Get many API credentials',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an API credential',
						action: 'Delete API credential',
					},
				],
				default: 'getMany',
			},
			// API OAuth2 operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['apiOauth2'],
					},
				},
				options: [
					{
						name: 'Create Client',
						value: 'createClient',
						description: 'Create OAuth2 client',
						action: 'Create o auth2 client',
					},
					{
						name: 'Delete Client',
						value: 'deleteClient',
						description: 'Delete OAuth2 client',
						action: 'Delete o auth2 client',
					},
					{
						name: 'Get Client',
						value: 'getClient',
						description: 'Get OAuth2 client details',
						action: 'Get o auth2 client',
					},
					{
						name: 'Get Many Clients',
						value: 'getManyClients',
						description: 'Get all OAuth2 clients',
						action: 'Get many o auth2 clients',
					},
					{
						name: 'Update Client',
						value: 'updateClient',
						description: 'Update OAuth2 client',
						action: 'Update o auth2 client',
					},
				],
				default: 'getManyClients',
			},
			// Bill operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['bill'],
					},
				},
				options: [
					{
						name: 'Download',
						value: 'download',
						description: 'Download bill PDF',
						action: 'Download bill',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get specific bill',
						action: 'Get bill',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get all bills',
						action: 'Get many bills',
					},
					{
						name: 'Get Payment',
						value: 'getPayment',
						description: 'Get bill payment information',
						action: 'Get bill payment',
					},
				],
				default: 'getMany',
			},
			// Contact operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['contact'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get specific contact',
						action: 'Get contact',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get all contacts',
						action: 'Get many contacts',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new contact',
						action: 'Create contact',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update contact details',
						action: 'Update contact',
					},
				],
				default: 'getMany',
			},
			// Credit operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['credit'],
					},
				},
				options: [
					{
						name: 'Get Balance',
						value: 'getBalance',
						description: 'Get credit balance',
						action: 'Get credit balance',
					},
					{
						name: 'Get Movements',
						value: 'getMovements',
						description: 'Get credit movements',
						action: 'Get credit movements',
					},
				],
				default: 'getBalance',
			},
			// Document operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['document'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get specific document',
						action: 'Get document',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get all documents',
						action: 'Get many documents',
					},
					{
						name: 'Upload',
						value: 'upload',
						description: 'Upload a document',
						action: 'Upload document',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a document',
						action: 'Delete document',
					},
				],
				default: 'getMany',
			},
			// Identity operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['identity'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get identity information',
						action: 'Get identity',
					},
					{
						name: 'Request Validation',
						value: 'requestValidation',
						description: 'Request identity validation',
						action: 'Request identity validation',
					},
				],
				default: 'get',
			},
			// Notification operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['notification'],
					},
				},
				options: [
					{
						name: 'Get Email',
						value: 'getEmail',
						description: 'Get email notification settings',
						action: 'Get email settings',
					},
					{
						name: 'Update Email',
						value: 'updateEmail',
						description: 'Update email notification settings',
						action: 'Update email settings',
					},
					{
						name: 'Get SMS',
						value: 'getSms',
						description: 'Get SMS notification settings',
						action: 'Get SMS settings',
					},
					{
						name: 'Update SMS',
						value: 'updateSms',
						description: 'Update SMS notification settings',
						action: 'Update SMS settings',
					},
				],
				default: 'getEmail',
			},
			// Order operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['order'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get specific order',
						action: 'Get order',
					},
					{
						name: 'Get Associated Object',
						value: 'getAssociatedObject',
						description: 'Get object associated with order',
						action: 'Get associated object',
					},
					{
						name: 'Get Details',
						value: 'getDetails',
						description: 'Get order details',
						action: 'Get order details',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get all orders',
						action: 'Get many orders',
					},
					{
						name: 'Get Payment',
						value: 'getPayment',
						description: 'Get order payment information',
						action: 'Get order payment',
					},
					{
						name: 'Get Status',
						value: 'getStatus',
						description: 'Get order status',
						action: 'Get order status',
					},
					{
						name: 'Pay',
						value: 'pay',
						description: 'Pay an order',
						action: 'Pay order',
					},
				],
				default: 'getMany',
			},
			// Payment Mean operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['paymentMean'],
					},
				},
				options: [
					{
						name: 'Create Bank Account',
						value: 'createBankAccount',
						description: 'Add a bank account',
						action: 'Create bank account',
					},
					{
						name: 'Create Credit Card',
						value: 'createCreditCard',
						description: 'Add a credit card',
						action: 'Create credit card',
					},
					{
						name: 'Create PayPal',
						value: 'createPaypal',
						description: 'Add a PayPal account',
						action: 'Create pay pal',
					},
					{
						name: 'Delete Bank Account',
						value: 'deleteBankAccount',
						description: 'Delete a bank account',
						action: 'Delete bank account',
					},
					{
						name: 'Delete Credit Card',
						value: 'deleteCreditCard',
						description: 'Delete a credit card',
						action: 'Delete credit card',
					},
					{
						name: 'Delete PayPal',
						value: 'deletePaypal',
						description: 'Delete a PayPal account',
						action: 'Delete pay pal',
					},
					{
						name: 'Get Available Payment Methods',
						value: 'getAvailableMethods',
						description: 'Get available automatic payment methods',
						action: 'Get available payment methods',
					},
					{
						name: 'Get Bank Account',
						value: 'getBankAccount',
						description: 'Get bank account details',
						action: 'Get bank account',
					},
					{
						name: 'Get Credit Card',
						value: 'getCreditCard',
						description: 'Get credit card details',
						action: 'Get credit card',
					},
					{
						name: 'Get Many Bank Accounts',
						value: 'getManyBankAccounts',
						description: 'Get all bank accounts',
						action: 'Get many bank accounts',
					},
					{
						name: 'Get Many Credit Cards',
						value: 'getManyCreditCards',
						description: 'Get all credit cards',
						action: 'Get many credit cards',
					},
					{
						name: 'Get Many PayPal',
						value: 'getManyPaypal',
						description: 'Get all PayPal accounts',
						action: 'Get many pay pal',
					},
					{
						name: 'Get PayPal',
						value: 'getPaypal',
						description: 'Get PayPal account details',
						action: 'Get pay pal',
					},
				],
				default: 'getAvailableMethods',
			},
			// SSH Key operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['sshKey'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get specific SSH key',
						action: 'Get SSH key',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get all SSH keys',
						action: 'Get many SSH keys',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Add an SSH key',
						action: 'Create SSH key',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an SSH key',
						action: 'Delete SSH key',
					},
				],
				default: 'getMany',
			},
			// Sub Account operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['subAccount'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get specific sub-account',
						action: 'Get sub account',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get all sub-accounts',
						action: 'Get many sub accounts',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a sub-account',
						action: 'Create sub account',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update sub-account',
						action: 'Update sub account',
					},
				],
				default: 'getMany',
			},
			// Support Level operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['supportLevel'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get support level',
						action: 'Get support level',
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
						description: 'Get specific task',
						action: 'Get task',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get all tasks',
						action: 'Get many tasks',
					},
					{
						name: 'Accept',
						value: 'accept',
						description: 'Accept a task',
						action: 'Accept task',
					},
					{
						name: 'Refuse',
						value: 'refuse',
						description: 'Refuse a task',
						action: 'Refuse task',
					},
				],
				default: 'getMany',
			},
			// VIP Status operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['vipStatus'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get VIP status',
						action: 'Get VIP status',
					},
				],
				default: 'get',
			},
			// Parameters
			{
				displayName: 'Abuse ID',
				name: 'abuseId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['abuse'],
						operation: ['get'],
					},
				},
				description: 'Abuse case ID',
			},
			{
				displayName: 'IP Block',
				name: 'ip',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['accessRestriction'],
						operation: ['createIp'],
					},
				},
				description: 'IP or IP range (CIDR notation)',
			},
			{
				displayName: 'Rule',
				name: 'rule',
				type: 'options',
				options: [
					{
						name: 'Accept',
						value: 'accept',
					},
					{
						name: 'Deny',
						value: 'deny',
					},
				],
				default: 'accept',
				required: true,
				displayOptions: {
					show: {
						resource: ['accessRestriction'],
						operation: ['createIp'],
					},
				},
				description: 'Accept or deny IP access',
			},
			{
				displayName: 'Warning',
				name: 'warning',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['accessRestriction'],
						operation: ['createIp'],
					},
				},
				description: 'Whether to send an email if someone tries to access with this IP',
			},
			{
				displayName: 'Restriction ID',
				name: 'restrictionId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['accessRestriction'],
						operation: ['deleteIp'],
					},
				},
				description: 'ID of the IP restriction to delete',
			},
			{
				displayName: 'Default Rule',
				name: 'defaultRule',
				type: 'options',
				options: [
					{
						name: 'Accept',
						value: 'accept',
					},
					{
						name: 'Deny',
						value: 'deny',
					},
				],
				default: 'accept',
				required: true,
				displayOptions: {
					show: {
						resource: ['accessRestriction'],
						operation: ['updateDefaultIpRule'],
					},
				},
				description: 'Default rule for IP access',
			},
			{
				displayName: 'TOTP ID',
				name: 'totpId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['accessRestriction'],
						operation: ['deleteTotp'],
					},
				},
				description: 'ID of the TOTP account to delete',
			},
			{
				displayName: 'SMS ID',
				name: 'smsId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['accessRestriction'],
						operation: ['deleteSms'],
					},
				},
				description: 'ID of the SMS account to delete',
			},
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['accessRestriction'],
						operation: ['updateDeveloperMode'],
					},
				},
				description: 'Whether to enable developer mode restriction',
			},
			{
				displayName: 'Agreement ID',
				name: 'agreementId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['agreement'],
						operation: ['get', 'accept'],
					},
				},

			},
			{
				displayName: 'Application ID',
				name: 'applicationId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['apiApplication'],
						operation: ['get', 'delete'],
					},
				},
				description: 'API Application ID',
			},
			{
				displayName: 'Credential ID',
				name: 'credentialId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['apiCredential'],
						operation: ['get', 'delete'],
					},
				},
				description: 'API Credential ID',
			},
			{
				displayName: 'Client ID',
				name: 'clientId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['apiOauth2'],
						operation: ['getClient', 'updateClient', 'deleteClient'],
					},
				},
				description: 'OAuth2 Client ID',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['apiOauth2'],
						operation: ['createClient', 'updateClient'],
					},
				},
				description: 'OAuth2 client name',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['apiOauth2'],
						operation: ['createClient', 'updateClient'],
					},
				},
				description: 'OAuth2 client description',
			},
			{
				displayName: 'Callback URLs',
				name: 'callbackUrls',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['apiOauth2'],
						operation: ['createClient', 'updateClient'],
					},
				},
				description: 'Callback URLs (comma-separated)',
			},
			{
				displayName: 'Bill ID',
				name: 'billId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['bill'],
						operation: ['get', 'download', 'getPayment'],
					},
				},

			},
			{
				displayName: 'Contact ID',
				name: 'contactId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['get', 'update'],
					},
				},

			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create', 'update'],
					},
				},
				description: 'Contact first name',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create', 'update'],
					},
				},
				description: 'Contact last name',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create', 'update'],
					},
				},
				description: 'Contact email',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create', 'update'],
					},
				},
				description: 'Contact phone number',
			},
			{
				displayName: 'Document ID',
				name: 'documentId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['get', 'delete'],
					},
				},

			},
			{
				displayName: 'Document Name',
				name: 'documentName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['upload'],
					},
				},

			},
			{
				displayName: 'Document Content',
				name: 'documentContent',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['upload'],
					},
				},
				description: 'Document content (base64 encoded)',
			},
			{
				displayName: 'Order ID',
				name: 'orderId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['get', 'getStatus', 'pay', 'getAssociatedObject', 'getDetails', 'getPayment'],
					},
				},

			},
			{
				displayName: 'Payment Mean ID',
				name: 'paymentMeanId',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['pay'],
					},
				},
				description: 'Payment mean ID to use for payment',
			},
			{
				displayName: 'Bank Account ID',
				name: 'bankAccountId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['paymentMean'],
						operation: ['getBankAccount', 'deleteBankAccount'],
					},
				},

			},
			{
				displayName: 'IBAN',
				name: 'iban',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['paymentMean'],
						operation: ['createBankAccount'],
					},
				},
				description: 'Bank account IBAN',
			},
			{
				displayName: 'BIC',
				name: 'bic',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['paymentMean'],
						operation: ['createBankAccount'],
					},
				},
				description: 'Bank account BIC',
			},
			{
				displayName: 'Owner Name',
				name: 'ownerName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['paymentMean'],
						operation: ['createBankAccount'],
					},
				},
				description: 'Bank account owner name',
			},
			{
				displayName: 'Credit Card ID',
				name: 'creditCardId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['paymentMean'],
						operation: ['getCreditCard', 'deleteCreditCard'],
					},
				},

			},
			{
				displayName: 'PayPal ID',
				name: 'paypalId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['paymentMean'],
						operation: ['getPaypal', 'deletePaypal'],
					},
				},
				description: 'PayPal account ID',
			},
			{
				displayName: 'PayPal Email',
				name: 'paypalEmail',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['paymentMean'],
						operation: ['createPaypal'],
					},
				},
				description: 'PayPal account email',
			},
			{
				displayName: 'SSH Key Name',
				name: 'sshKeyName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['sshKey'],
						operation: ['get', 'delete'],
					},
				},

			},
			{
				displayName: 'Key Name',
				name: 'keyName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['sshKey'],
						operation: ['create'],
					},
				},
				description: 'Name for the SSH key',
			},
			{
				displayName: 'Public Key',
				name: 'publicKey',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['sshKey'],
						operation: ['create'],
					},
				},
				description: 'SSH public key content',
			},
			{
				displayName: 'Sub Account ID',
				name: 'subAccountId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['subAccount'],
						operation: ['get', 'update'],
					},
				},
				description: 'Sub-account ID',
			},
			{
				displayName: 'Sub Account Description',
				name: 'subAccountDescription',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['subAccount'],
						operation: ['create', 'update'],
					},
				},
				description: 'Sub-account description',
			},
			{
				displayName: 'Task ID',
				name: 'taskId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['get', 'accept', 'refuse'],
					},
				},

			},
			{
				displayName: 'Token',
				name: 'token',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['accept', 'refuse'],
					},
				},
				description: 'Task validation token',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['account'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Company Name',
						name: 'companyName',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Fax',
						name: 'fax',
						type: 'string',
						default: '',
					},
					{
						displayName: 'First Name',
						name: 'firstname',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Language',
						name: 'language',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Last Name',
						name: 'name',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Phone',
						name: 'phone',
						type: 'string',
						default: '',
					},
					{
						displayName: 'VAT Number',
						name: 'vat',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Zip',
						name: 'zip',
						type: 'string',
						default: '',
					},
				],
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['bill'],
						operation: ['getMany'],
					},
				},
				options: [
					{
						displayName: 'Date From',
						name: 'dateFrom',
						type: 'dateTime',
						default: '',
						description: 'Filter by date from',
					},
					{
						displayName: 'Date To',
						name: 'dateTo',
						type: 'dateTime',
						default: '',
						description: 'Filter by date to',
					},
					{
						displayName: 'Order ID',
						name: 'orderId',
						type: 'number',
						default: 0,
						description: 'Filter by order ID',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const credentials = await this.getCredentials('ovhApi');

		const endpoint = credentials.endpoint as string;
		const applicationKey = credentials.applicationKey as string;
		const applicationSecret = credentials.applicationSecret as string;
		const consumerKey = credentials.consumerKey as string;

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let method: IHttpRequestMethods = 'GET';
				let path = '';
				let body: IDataObject = {};
				let qs: IDataObject = {};

				// Account resource
				if (resource === 'account') {
					if (operation === 'get') {
						path = '/me';
					} else if (operation === 'update') {
						method = 'PUT';
						path = '/me';
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						body = additionalFields;
					}
				}
				// Abuse resource
				else if (resource === 'abuse') {
					if (operation === 'get') {
						const abuseId = this.getNodeParameter('abuseId', i) as string;
						path = `/me/abuse/${abuseId}`;
					} else if (operation === 'getMany') {
						path = '/me/abuse';
					}
				}
				// Access Restriction resource
				else if (resource === 'accessRestriction') {
					if (operation === 'createIp') {
						method = 'POST';
						path = '/me/accessRestriction/ip';
						body = {
							ip: this.getNodeParameter('ip', i) as string,
							rule: this.getNodeParameter('rule', i) as string,
							warning: this.getNodeParameter('warning', i) as boolean,
						};
					} else if (operation === 'deleteIp') {
						method = 'DELETE';
						const restrictionId = this.getNodeParameter('restrictionId', i) as number;
						path = `/me/accessRestriction/ip/${restrictionId}`;
					} else if (operation === 'getIp') {
						path = '/me/accessRestriction/ip';
					} else if (operation === 'getDefaultIpRule') {
						path = '/me/accessRestriction/ipDefaultRule';
					} else if (operation === 'updateDefaultIpRule') {
						method = 'PUT';
						path = '/me/accessRestriction/ipDefaultRule';
						body = {
							rule: this.getNodeParameter('defaultRule', i) as string,
						};
					} else if (operation === 'getTotp') {
						path = '/me/accessRestriction/totp';
					} else if (operation === 'createTotp') {
						method = 'POST';
						path = '/me/accessRestriction/totp';
					} else if (operation === 'deleteTotp') {
						method = 'DELETE';
						const totpId = this.getNodeParameter('totpId', i) as number;
						path = `/me/accessRestriction/totp/${totpId}`;
					} else if (operation === 'getSms') {
						path = '/me/accessRestriction/sms';
					} else if (operation === 'createSms') {
						method = 'POST';
						path = '/me/accessRestriction/sms';
					} else if (operation === 'deleteSms') {
						method = 'DELETE';
						const smsId = this.getNodeParameter('smsId', i) as number;
						path = `/me/accessRestriction/sms/${smsId}`;
					} else if (operation === 'getDeveloperMode') {
						path = '/me/accessRestriction/developerMode';
					} else if (operation === 'updateDeveloperMode') {
						method = 'PUT';
						path = '/me/accessRestriction/developerMode';
						body = {
							enabled: this.getNodeParameter('enabled', i) as boolean,
						};
					}
				}
				// Agreement resource
				else if (resource === 'agreement') {
					if (operation === 'get') {
						const agreementId = this.getNodeParameter('agreementId', i) as number;
						path = `/me/agreements/${agreementId}`;
					} else if (operation === 'getMany') {
						path = '/me/agreements';
					} else if (operation === 'accept') {
						method = 'POST';
						const agreementId = this.getNodeParameter('agreementId', i) as number;
						path = `/me/agreements/${agreementId}/accept`;
					}
				}
				// API Application resource
				else if (resource === 'apiApplication') {
					if (operation === 'get') {
						const applicationId = this.getNodeParameter('applicationId', i) as number;
						path = `/me/api/application/${applicationId}`;
					} else if (operation === 'getMany') {
						path = '/me/api/application';
					} else if (operation === 'delete') {
						method = 'DELETE';
						const applicationId = this.getNodeParameter('applicationId', i) as number;
						path = `/me/api/application/${applicationId}`;
					}
				}
				// API Credential resource
				else if (resource === 'apiCredential') {
					if (operation === 'get') {
						const credentialId = this.getNodeParameter('credentialId', i) as number;
						path = `/me/api/credential/${credentialId}`;
					} else if (operation === 'getMany') {
						path = '/me/api/credential';
					} else if (operation === 'delete') {
						method = 'DELETE';
						const credentialId = this.getNodeParameter('credentialId', i) as number;
						path = `/me/api/credential/${credentialId}`;
					}
				}
				// API OAuth2 resource
				else if (resource === 'apiOauth2') {
					if (operation === 'getClient') {
						const clientId = this.getNodeParameter('clientId', i) as string;
						path = `/me/api/oauth2/client/${clientId}`;
					} else if (operation === 'getManyClients') {
						path = '/me/api/oauth2/client';
					} else if (operation === 'createClient') {
						method = 'POST';
						path = '/me/api/oauth2/client';
						body = {
							name: this.getNodeParameter('name', i) as string,
							description: this.getNodeParameter('description', i, '') as string,
						};
						const callbackUrls = this.getNodeParameter('callbackUrls', i, '') as string;
						if (callbackUrls) {
							body.callbackUrls = callbackUrls.split(',').map(url => url.trim());
						}
					} else if (operation === 'updateClient') {
						method = 'PUT';
						const clientId = this.getNodeParameter('clientId', i) as string;
						path = `/me/api/oauth2/client/${clientId}`;
						body = {
							name: this.getNodeParameter('name', i) as string,
							description: this.getNodeParameter('description', i, '') as string,
						};
						const callbackUrls = this.getNodeParameter('callbackUrls', i, '') as string;
						if (callbackUrls) {
							body.callbackUrls = callbackUrls.split(',').map(url => url.trim());
						}
					} else if (operation === 'deleteClient') {
						method = 'DELETE';
						const clientId = this.getNodeParameter('clientId', i) as string;
						path = `/me/api/oauth2/client/${clientId}`;
					}
				}
				// Bill resource
				else if (resource === 'bill') {
					if (operation === 'get') {
						const billId = this.getNodeParameter('billId', i) as string;
						path = `/me/bill/${billId}`;
					} else if (operation === 'getMany') {
						path = '/me/bill';
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						if (filters.dateFrom) {
							qs['date.from'] = filters.dateFrom;
						}
						if (filters.dateTo) {
							qs['date.to'] = filters.dateTo;
						}
						if (filters.orderId) {
							qs.orderId = filters.orderId;
						}
					} else if (operation === 'download') {
						const billId = this.getNodeParameter('billId', i) as string;
						path = `/me/bill/${billId}/download`;
					} else if (operation === 'getPayment') {
						const billId = this.getNodeParameter('billId', i) as string;
						path = `/me/bill/${billId}/payment`;
					}
				}
				// Contact resource
				else if (resource === 'contact') {
					if (operation === 'get') {
						const contactId = this.getNodeParameter('contactId', i) as number;
						path = `/me/contact/${contactId}`;
					} else if (operation === 'getMany') {
						path = '/me/contact';
					} else if (operation === 'create') {
						method = 'POST';
						path = '/me/contact';
						body = {
							firstName: this.getNodeParameter('firstName', i, '') as string,
							lastName: this.getNodeParameter('lastName', i, '') as string,
							email: this.getNodeParameter('email', i, '') as string,
							phone: this.getNodeParameter('phone', i, '') as string,
						};
					} else if (operation === 'update') {
						method = 'PUT';
						const contactId = this.getNodeParameter('contactId', i) as number;
						path = `/me/contact/${contactId}`;
						body = {};
						const firstName = this.getNodeParameter('firstName', i, '') as string;
						const lastName = this.getNodeParameter('lastName', i, '') as string;
						const email = this.getNodeParameter('email', i, '') as string;
						const phone = this.getNodeParameter('phone', i, '') as string;
						if (firstName) body.firstName = firstName;
						if (lastName) body.lastName = lastName;
						if (email) body.email = email;
						if (phone) body.phone = phone;
					}
				}
				// Credit resource
				else if (resource === 'credit') {
					if (operation === 'getBalance') {
						path = '/me/credit/balance';
					} else if (operation === 'getMovements') {
						path = '/me/credit/movements';
					}
				}
				// Document resource
				else if (resource === 'document') {
					if (operation === 'get') {
						const documentId = this.getNodeParameter('documentId', i) as string;
						path = `/me/document/${documentId}`;
					} else if (operation === 'getMany') {
						path = '/me/document';
					} else if (operation === 'upload') {
						method = 'POST';
						path = '/me/document';
						body = {
							name: this.getNodeParameter('documentName', i) as string,
							content: this.getNodeParameter('documentContent', i) as string,
						};
					} else if (operation === 'delete') {
						method = 'DELETE';
						const documentId = this.getNodeParameter('documentId', i) as string;
						path = `/me/document/${documentId}`;
					}
				}
				// Identity resource
				else if (resource === 'identity') {
					if (operation === 'get') {
						path = '/me/identity';
					} else if (operation === 'requestValidation') {
						method = 'POST';
						path = '/me/identity/validation';
					}
				}
				// Notification resource
				else if (resource === 'notification') {
					if (operation === 'getEmail') {
						path = '/me/notification/email';
					} else if (operation === 'updateEmail') {
						method = 'PUT';
						path = '/me/notification/email';
						body = {}; // Add email notification settings as needed
					} else if (operation === 'getSms') {
						path = '/me/notification/sms';
					} else if (operation === 'updateSms') {
						method = 'PUT';
						path = '/me/notification/sms';
						body = {}; // Add SMS notification settings as needed
					}
				}
				// Order resource
				else if (resource === 'order') {
					if (operation === 'get') {
						const orderId = this.getNodeParameter('orderId', i) as number;
						path = `/me/order/${orderId}`;
					} else if (operation === 'getMany') {
						path = '/me/order';
					} else if (operation === 'getStatus') {
						const orderId = this.getNodeParameter('orderId', i) as number;
						path = `/me/order/${orderId}/status`;
					} else if (operation === 'pay') {
						method = 'POST';
						const orderId = this.getNodeParameter('orderId', i) as number;
						path = `/me/order/${orderId}/pay`;
						const paymentMeanId = this.getNodeParameter('paymentMeanId', i, 0) as number;
						if (paymentMeanId) {
							body = { paymentMeanId };
						}
					} else if (operation === 'getAssociatedObject') {
						const orderId = this.getNodeParameter('orderId', i) as number;
						path = `/me/order/${orderId}/associatedObject`;
					} else if (operation === 'getDetails') {
						const orderId = this.getNodeParameter('orderId', i) as number;
						path = `/me/order/${orderId}/details`;
					} else if (operation === 'getPayment') {
						const orderId = this.getNodeParameter('orderId', i) as number;
						path = `/me/order/${orderId}/payment`;
					}
				}
				// Payment Mean resource
				else if (resource === 'paymentMean') {
					if (operation === 'getBankAccount') {
						const bankAccountId = this.getNodeParameter('bankAccountId', i) as number;
						path = `/me/paymentMean/bankAccount/${bankAccountId}`;
					} else if (operation === 'getManyBankAccounts') {
						path = '/me/paymentMean/bankAccount';
					} else if (operation === 'createBankAccount') {
						method = 'POST';
						path = '/me/paymentMean/bankAccount';
						body = {
							iban: this.getNodeParameter('iban', i) as string,
							bic: this.getNodeParameter('bic', i, '') as string,
							ownerName: this.getNodeParameter('ownerName', i, '') as string,
						};
					} else if (operation === 'deleteBankAccount') {
						method = 'DELETE';
						const bankAccountId = this.getNodeParameter('bankAccountId', i) as number;
						path = `/me/paymentMean/bankAccount/${bankAccountId}`;
					} else if (operation === 'getCreditCard') {
						const creditCardId = this.getNodeParameter('creditCardId', i) as number;
						path = `/me/paymentMean/creditCard/${creditCardId}`;
					} else if (operation === 'getManyCreditCards') {
						path = '/me/paymentMean/creditCard';
					} else if (operation === 'createCreditCard') {
						method = 'POST';
						path = '/me/paymentMean/creditCard';
						// Credit card creation typically requires a special flow
						body = {};
					} else if (operation === 'deleteCreditCard') {
						method = 'DELETE';
						const creditCardId = this.getNodeParameter('creditCardId', i) as number;
						path = `/me/paymentMean/creditCard/${creditCardId}`;
					} else if (operation === 'getPaypal') {
						const paypalId = this.getNodeParameter('paypalId', i) as number;
						path = `/me/paymentMean/paypal/${paypalId}`;
					} else if (operation === 'getManyPaypal') {
						path = '/me/paymentMean/paypal';
					} else if (operation === 'createPaypal') {
						method = 'POST';
						path = '/me/paymentMean/paypal';
						body = {
							email: this.getNodeParameter('paypalEmail', i) as string,
						};
					} else if (operation === 'deletePaypal') {
						method = 'DELETE';
						const paypalId = this.getNodeParameter('paypalId', i) as number;
						path = `/me/paymentMean/paypal/${paypalId}`;
					} else if (operation === 'getAvailableMethods') {
						path = '/me/availableAutomaticPaymentMeans';
					}
				}
				// SSH Key resource
				else if (resource === 'sshKey') {
					if (operation === 'get') {
						const sshKeyName = this.getNodeParameter('sshKeyName', i) as string;
						path = `/me/sshKey/${sshKeyName}`;
					} else if (operation === 'getMany') {
						path = '/me/sshKey';
					} else if (operation === 'create') {
						method = 'POST';
						path = '/me/sshKey';
						body = {
							keyName: this.getNodeParameter('keyName', i) as string,
							key: this.getNodeParameter('publicKey', i) as string,
						};
					} else if (operation === 'delete') {
						method = 'DELETE';
						const sshKeyName = this.getNodeParameter('sshKeyName', i) as string;
						path = `/me/sshKey/${sshKeyName}`;
					}
				}
				// Sub Account resource
				else if (resource === 'subAccount') {
					if (operation === 'get') {
						const subAccountId = this.getNodeParameter('subAccountId', i) as number;
						path = `/me/subAccount/${subAccountId}`;
					} else if (operation === 'getMany') {
						path = '/me/subAccount';
					} else if (operation === 'create') {
						method = 'POST';
						path = '/me/subAccount';
						body = {
							description: this.getNodeParameter('subAccountDescription', i, '') as string,
						};
					} else if (operation === 'update') {
						method = 'PUT';
						const subAccountId = this.getNodeParameter('subAccountId', i) as number;
						path = `/me/subAccount/${subAccountId}`;
						body = {
							description: this.getNodeParameter('subAccountDescription', i, '') as string,
						};
					}
				}
				// Support Level resource
				else if (resource === 'supportLevel') {
					if (operation === 'get') {
						path = '/me/supportLevel';
					}
				}
				// Task resource
				else if (resource === 'task') {
					if (operation === 'get') {
						const taskId = this.getNodeParameter('taskId', i) as number;
						path = `/me/task/${taskId}`;
					} else if (operation === 'getMany') {
						path = '/me/task';
					} else if (operation === 'accept') {
						method = 'POST';
						const taskId = this.getNodeParameter('taskId', i) as number;
						path = `/me/task/${taskId}/accept`;
						const token = this.getNodeParameter('token', i, '') as string;
						if (token) {
							body = { token };
						}
					} else if (operation === 'refuse') {
						method = 'POST';
						const taskId = this.getNodeParameter('taskId', i) as number;
						path = `/me/task/${taskId}/refuse`;
						const token = this.getNodeParameter('token', i, '') as string;
						if (token) {
							body = { token };
						}
					}
				}
				// VIP Status resource
				else if (resource === 'vipStatus') {
					if (operation === 'get') {
						path = '/me/vipStatus';
					}
				}

				// Prepare the request
				const timestamp = Math.round(Date.now() / 1000);
				const url = `${endpoint}${path}`;

				// Build query string
				let queryString = '';
				if (Object.keys(qs).length > 0) {
					queryString = '?' + Object.keys(qs)
						.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(qs[key] as string)}`)
						.join('&');
				}

				// Create signature
				let bodyForSignature = '';
				if (method !== 'GET' && method !== 'DELETE' && Object.keys(body).length > 0) {
					// Match official OVH SDK: JSON.stringify + unicode escaping
					bodyForSignature = JSON.stringify(body).replace(/[\u0080-\uFFFF]/g, (m) => {
						return '\\u' + ('0000' + m.charCodeAt(0).toString(16)).slice(-4);
					});
				}

				const signatureElements = [
					applicationSecret,
					consumerKey,
					method,
					url + queryString,
					bodyForSignature,
					timestamp,
				];

				const signature =
					'$1$' + createHash('sha1').update(signatureElements.join('+')).digest('hex');

				const options: IRequestOptions = {
					method,
					uri: url + queryString,
					headers: {
						'X-Ovh-Application': applicationKey,
						'X-Ovh-Timestamp': timestamp.toString(),
						'X-Ovh-Signature': signature,
						'X-Ovh-Consumer': consumerKey,
						'Content-Type': 'application/json',
					},
					body: method !== 'GET' ? body : undefined,
					json: true,
				};

				const responseData = await this.helpers.request(options);

				// Handle special operations responses
				if (operation === 'delete' || operation === 'deleteIp' || operation === 'deleteTotp' || 
					operation === 'deleteSms' || operation === 'deleteBankAccount' || 
					operation === 'deleteCreditCard' || operation === 'deletePaypal' || 
					operation === 'deleteClient') {
					// For delete operations, return success confirmation
					returnData.push({ 
						success: true, 
						message: `${resource} deleted successfully`,
						operation: operation,
						resource: resource,
					});
				} else if (operation === 'accept' || operation === 'refuse') {
					// For task operations
					returnData.push({ 
						success: true, 
						message: `Task ${operation}ed successfully`,
						operation: operation,
						resource: resource,
						taskId: this.getNodeParameter('taskId', i) as number,
					});
				} else if (operation === 'update' || operation === 'updateDefaultIpRule' || 
						   operation === 'updateDeveloperMode' || operation === 'updateClient' ||
						   operation === 'updateEmail' || operation === 'updateSms') {
					// For update operations
					returnData.push({ 
						success: true, 
						message: `${resource} updated successfully`,
						operation: operation,
						resource: resource,
						data: body,
					});
				} else if (operation === 'create' || operation === 'createIp' || operation === 'createTotp' ||
						   operation === 'createSms' || operation === 'createBankAccount' ||
						   operation === 'createCreditCard' || operation === 'createPaypal' ||
						   operation === 'createClient') {
					// For create operations
					returnData.push({
						success: true,
						message: `${resource} created successfully`,
						operation: operation,
						resource: resource,
						data: responseData,
					});
				} else if (operation === 'getStatus' && typeof responseData === 'string') {
					// For getStatus operation, return the string status directly
					returnData.push({
						status: responseData,
						resource: resource,
						operation: operation,
					});
				} else if (Array.isArray(responseData)) {
					// For arrays, add each item
					responseData.forEach((item) => {
						if (typeof item === 'string' || typeof item === 'number') {
							// For simple values, wrap in an object
							returnData.push({ value: item, resource, operation });
						} else {
							// For objects, add directly with metadata
							returnData.push({ ...item, resource, operation });
						}
					});
				} else {
					// For single objects/values, add directly
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