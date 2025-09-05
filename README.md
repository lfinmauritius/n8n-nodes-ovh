# n8n-nodes-ovh

**⚠️ ACTIVE NODES - Currently 7 OVH nodes are active and fully operational**

This package provides comprehensive n8n nodes for interacting with the OVH API, allowing you to automate domain, DNS, dedicated server, hosted private cloud, AI/ML services, account management, Kubernetes cluster, and private network tasks.

**Currently Active Nodes**: OVH AI, OVH Account, OVH Dedicated Server, OVH Domain, OVH Hosted Private Cloud, OVH Kubernetes, and OVH Private Network.

**Note**: Additional nodes (OVH Compute, OVH Container Registry, OVH Database, OVH Data Processing, OVH Storage) are implemented but not yet activated. They will be enabled in future releases after thorough testing.

**Developed by [Ascenzia](https://ascenzia.fr)** - Your trusted partner for AI agent creation and automation.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Nodes

### OVH Domain Node

#### Domain Operations
- **Get**: Retrieve information about a specific domain
- **Get Many**: List all your domains
- **Update**: Update domain settings (e.g., transfer lock status)

#### DNS Zone Operations
- **Export**: Export a DNS zone (returns complete zone content in `zoneContent` field)
- **Import**: Import a DNS zone from a zone file
- **Refresh**: Refresh a DNS zone

#### DNS Record Operations
- **Get**: Get information about a specific DNS record
- **Get All Detailed**: Get detailed information for all DNS records of a specific type (replaces Get Many for better data structure)
- **Create**: Create a new DNS record with subdomain, target, TTL, and priority (for MX/SRV)
- **Update**: Update existing DNS record properties
- **Delete**: Delete a DNS record

#### Nameserver Operations
- **Get**: Get information about a specific nameserver
- **Get Many**: List all nameservers for a domain (returns nameserver names, IDs, and types)
- **Update**: Update domain nameservers

#### Contact Operations
- **Get**: Get domain contact information by type (Owner, Admin, Tech, Billing)
  - Returns proper contact IDs extracted from OVH API structure
  - Includes additional domain information (state, expiration, transfer lock status)
- **Update**: Update domain contacts by assigning new contact IDs

### OVH Dedicated Server Node

#### Server Operations
- **Get**: Get server information
- **Get Many**: List all dedicated servers
- **Update**: Update server settings (monitoring, state)
- **Reboot**: Reboot server

#### Secondary DNS Operations
- **Create**: Add secondary DNS
- **Delete**: Remove secondary DNS
- **Get**: Get secondary DNS details
- **Get Many**: List secondary DNS domains

#### Service Info Operations
- **Get**: Get billing and service information
- **Update**: Update service renewal settings

#### Installation Operations
- **Get Status**: Get installation status
- **Get Templates**: List available OS templates
- **Install**: Install OS on server

#### IP Block Operations
- **Get**: Get IP block information
- **Get Many**: List IP blocks

#### Network Operations
- **Get Specifications**: Get network specifications
- **Get Public Bandwidth**: Get bandwidth usage

#### Virtual MAC Operations
- **Create**: Create virtual MAC address
- **Delete**: Delete virtual MAC
- **Get**: Get virtual MAC details
- **Get Many**: List virtual MACs

#### Virtual Address Operations
- **Create**: Create virtual address
- **Delete**: Delete virtual address
- **Get**: Get virtual address details
- **Get Many**: List virtual addresses

#### Firewall Operations
- **Create Rule**: Add firewall rule
- **Delete Rule**: Remove firewall rule
- **Enable**: Enable firewall
- **Disable**: Disable firewall
- **Get**: Get firewall status
- **Get Rules**: List firewall rules
- **Update Rule**: Update firewall rule

#### IP Mitigation Operations
- **Get**: Get IP mitigation status
- **Get Statistics**: Get mitigation statistics

#### License Operations
- **Delete**: Delete license
- **Get**: Get license information

#### Security Operations
- **Get Spoof**: Get IP spoof protection status
- **Update Spoof**: Configure IP spoof protection

### OVH Hosted Private Cloud Node

Comprehensive VMware Private Cloud management based on OVH's dedicatedCloud API.

#### Core Resources
- **Service**: List and manage Private Cloud services
- **Datacenter**: Virtual datacenter lifecycle management (create, get, list)
- **Host**: ESXi host management (list, get, create in datacenters)
- **Datastore**: Storage datastore/filer management (list, get, create)
- **Network**: Allowed network configuration (list, get, create)

#### Key Features
- **Service Discovery**: List all available Private Cloud services
- **Datacenter Management**: Create and manage virtual datacenters
- **Host Operations**: Add and manage ESXi hosts within datacenters
- **Storage Management**: Configure and manage datastores/filers
- **Network Security**: Configure allowed network access rules
- **Multi-region Support**: Works with all OVH regions (EU, CA, US, SoYouStart, Kimsufi)
- **Comprehensive Error Handling**: Detailed error messages with troubleshooting steps
- **Parameter Validation**: Input validation prevents API errors

#### Operations Available
- **Service**: Get Many, Get (list and retrieve Private Cloud services)
- **Datacenter**: Create, Get Many, Get (full datacenter lifecycle)
- **Host**: Create, Get Many, Get (host management within datacenters)
- **Datastore**: Create, Get Many, Get (storage management)
- **Network**: Create, Get Many, Get (network access control)

### OVH Kubernetes Node

#### Cluster Operations
- **Create**: Create a new managed Kubernetes cluster
- **Delete**: Delete a Kubernetes cluster
- **Get**: Get cluster information
- **Get Many**: List all clusters
- **Reset**: Reset cluster to default configuration
- **Restart**: Restart control plane API server
- **Update**: Update cluster configuration
- **Update Load Balancers Subnet**: Update load balancers subnet ID
- **Update Patches**: Force cluster and node update to latest patch

#### Node Pool Operations
- **Create**: Create a new node pool
- **Delete**: Delete a node pool
- **Get**: Get node pool information
- **Get Many**: List all node pools
- **Get Nodes**: List all nodes in a node pool
- **Update**: Update node pool configuration

#### Node Operations
- **Delete**: Delete a specific node
- **Get**: Get node information
- **Get Many**: List all nodes

#### IP Restriction Operations
- **Append**: Add IP restrictions to cluster
- **Delete**: Remove an IP restriction
- **Get Many**: List IP restrictions
- **Replace**: Replace all IP restrictions

#### Kubeconfig Operations
- **Get**: Download kubeconfig file
- **Reset**: Reset kubeconfig credentials

#### Flavor Operations
- **Get Many**: List available instance types

#### Customization Operations
- **Get**: Get cluster customization
- **Update**: Update cluster customization

#### Metrics Operations
- **Get Etcd Usage**: Get cluster etcd usage and quota

#### OpenID Connect Operations
- **Configure**: Configure OpenID Connect integration
- **Delete**: Remove OpenID Connect integration
- **Get**: Get OpenID Connect parameters
- **Update**: Update OpenID Connect parameters

#### Private Network Operations
- **Get**: Get private network configuration
- **Update**: Update private network configuration

#### Update Policy Operations
- **Update**: Change cluster update policy

### OVH AI Node

#### AI Application Operations
- **Create**: Deploy AI applications with custom configurations
- **Delete**: Remove AI applications
- **Get**: Get application details
- **Get Logs**: Retrieve application logs
- **Get Many**: List all AI applications
- **Get Status**: Check application status
- **Start**: Start an application
- **Stop**: Stop an application

#### Training Job Operations
- **Create**: Launch training jobs
- **Delete**: Cancel training jobs
- **Get**: Get job details
- **Get Logs**: Retrieve job logs
- **Get Many**: List all training jobs

#### Datastore Operations
- **Get Datastore Alias**: Get datastore alias information by region
- **Delete Datastore Alias**: Remove datastore alias

#### Notebook Operations
- **Create**: Create Jupyter/VSCode notebooks
- **Delete**: Delete notebooks
- **Get**: Get notebook details
- **Get Many**: List all notebooks
- **Start**: Start a notebook
- **Stop**: Stop a notebook

### OVH Account Node

Comprehensive account management with 100+ operations across 20+ resources for managing your OVH account, billing, contacts, and API credentials.

#### Account Operations
- **Get**: Get account information
- **Update**: Update account settings

#### API Credential Operations
- **Get**: Get API credential details
- **Get Many**: List all API credentials
- **Delete**: Delete API credential

#### API OAuth2 Operations
- **Get Client**: Get OAuth2 client information
- **Get Many Clients**: List OAuth2 clients

#### Bill Operations
- **Get**: Get specific bill details with complete information
- **Get Many**: List bill IDs with filtering options (date range, order ID)
- **Download**: Download bill PDF
- **Get Payment**: Get bill payment information

#### Contact Operations
- **Get**: Get contact information
- **Get Many**: List all contacts
- **Create**: Create new contact
- **Update**: Update contact details
- **Delete**: Delete contact

#### Document Operations
- **Get**: Get document details
- **Get Many**: List documents with filtering
- **Create**: Create new document
- **Delete**: Delete document

#### Identity User Operations
- **Get**: Get identity user information
- **Get Many**: List identity users
- **Create**: Create identity user
- **Update**: Update identity user
- **Delete**: Delete identity user
- **Disable**: Disable user account
- **Enable**: Enable user account

#### Identity Group Operations
- **Get**: Get group information
- **Get Many**: List identity groups
- **Create**: Create new group
- **Update**: Update group
- **Delete**: Delete group

#### Order Operations
- **Get**: Get order information
- **Get Many**: List orders
- **Get Status**: Get order status
- **Pay**: Pay pending order
- **Get Associated Object**: Get order associated object
- **Get Details**: Get order details
- **Get Payment**: Get order payment information

#### Payment Mean Operations
**Credit Card**:
- **Get**: Get credit card details
- **Get Many**: List credit cards
- **Create**: Add credit card
- **Delete**: Remove credit card
- **Set Default**: Set as default payment method

**Bank Account**:
- **Get**: Get bank account details  
- **Get Many**: List bank accounts
- **Create**: Add bank account
- **Delete**: Remove bank account
- **Set Default**: Set as default payment method

**PayPal**:
- **Get**: Get PayPal details
- **Get Many**: List PayPal accounts
- **Create**: Add PayPal account
- **Delete**: Remove PayPal account
- **Set Default**: Set as default payment method

#### SMS Operations
- **Get**: Get SMS service details
- **Get Many**: List SMS services
- **Create**: Create SMS service
- **Update**: Update SMS settings
- **Delete**: Delete SMS service
- **Get History**: Get SMS history
- **Send**: Send SMS message

#### SSH Key Operations
- **Get**: Get SSH key details
- **Get Many**: List SSH keys
- **Create**: Add SSH key
- **Update**: Update SSH key
- **Delete**: Delete SSH key
- **Set Default**: Set as default SSH key

#### Task Operations
- **Get**: Get task information
- **Get Many**: List tasks with filtering
- **Accept**: Accept pending task
- **Refuse**: Refuse pending task

#### TOTP Operations
- **Create**: Create TOTP (Time-based One-Time Password)
- **Delete**: Delete TOTP
- **Disable**: Disable TOTP
- **Enable**: Enable TOTP
- **Get**: Get TOTP details
- **Get Many**: List TOTP devices

#### User Operations
- **Get**: Get user information
- **Update**: Update user settings

#### Access Restriction Operations
- **Get IP**: Get IP restriction details
- **Get Many IPs**: List IP restrictions
- **Create IP**: Add IP restriction
- **Delete IP**: Remove IP restriction
- **Update Default IP Rule**: Update default IP rule
- **Update Developer Mode**: Enable/disable developer mode

#### Features
- **Complete CRUD Operations**: Full create, read, update, delete support
- **Comprehensive Filtering**: Advanced filtering for lists (date ranges, status, etc.)
- **Payment Management**: Complete payment method management
- **Security**: IP restrictions, TOTP, SSH key management
- **Billing**: Invoice and payment tracking
- **Identity Management**: User and group management
- **Communication**: SMS services integration
- **Task Management**: Task workflow operations


### OVH Private Network Node

Comprehensive vRack (Virtual Rack) private network management with 35+ operations across 11 resources for managing OVH's private networking infrastructure.

#### IP Block Operations
- **Get**: Get IP block information and usage details
- **Get Many**: List all IP blocks in vRack
- **Create**: Allocate IP blocks to vRack
- **Delete**: Remove IP blocks from vRack

#### Allowed Service Operations
- **Get Many**: List services allowed to access the vRack
- **Create**: Add service access to vRack
- **Delete**: Remove service access from vRack

#### Dedicated Cloud Operations
- **Get**: Get dedicated cloud datacenter information
- **Get Many**: List dedicated cloud datacenters in vRack
- **Create**: Connect dedicated cloud datacenter to vRack
- **Delete**: Disconnect dedicated cloud datacenter from vRack

#### Dedicated Server Operations
- **Get**: Get dedicated server information
- **Get Many**: List dedicated servers in vRack
- **Create**: Connect dedicated server to vRack
- **Delete**: Remove dedicated server from vRack

#### Dedicated Server Interface Operations
- **Get**: Get server interface information
- **Get Many**: List server network interfaces in vRack

#### Public Cloud Project Operations
- **Get**: Get public cloud project information
- **Get Many**: List public cloud projects in vRack
- **Create**: Connect public cloud project to vRack
- **Delete**: Remove public cloud project from vRack

#### Legacy vRack Operations
- **Get**: Get legacy vRack information
- **Get Many**: List legacy vRacks
- **Create**: Create legacy vRack connection
- **Delete**: Remove legacy vRack connection

#### Task Operations
- **Get**: Get task information and status
- **Get Many**: List all vRack tasks with filtering

#### vRack Operations
- **Get**: Get vRack information and settings
- **Get Many**: List all vRacks
- **Update**: Update vRack configuration (name, description)

#### vRack Service Operations
- **Get**: Get vRack service information
- **Get Many**: List available vRack services

#### CloudConnect Operations
- **Get**: Get CloudConnect information
- **Get Many**: List CloudConnect services in vRack
- **Create**: Connect CloudConnect to vRack
- **Delete**: Remove CloudConnect from vRack

#### Features
- **Complete Network Management**: Full control over private network infrastructure
- **Service Integration**: Connect various OVH services (dedicated servers, public cloud, dedicated cloud)
- **IP Address Management**: Comprehensive IP block allocation and management
- **Task Monitoring**: Real-time task tracking and status monitoring
- **Secure Connectivity**: Private network isolation and security
- **Legacy Support**: Support for legacy vRack infrastructure

## Authentication

### Required API Permissions

To use these nodes, you need to create OVH API credentials with appropriate permissions:

1. Go to [OVH API](https://api.ovh.com/createToken/) to create your credentials
2. Set the following permissions based on the services you want to use:

#### For OVH Domain:
- GET /domain*
- PUT /domain*
- POST /domain*
- DELETE /domain*

#### For OVH Dedicated Server:
- GET /dedicated/server*
- PUT /dedicated/server*
- POST /dedicated/server*
- DELETE /dedicated/server*

#### For OVH Hosted Private Cloud:
- GET /dedicatedCloud*
- PUT /dedicatedCloud*
- POST /dedicatedCloud*
- DELETE /dedicatedCloud*


#### For OVH AI:
- GET /cloud/project/*/ai*
- PUT /cloud/project/*/ai*
- POST /cloud/project/*/ai*
- DELETE /cloud/project/*/ai*

#### For OVH Kubernetes:
- GET /cloud/project/*/kube*
- PUT /cloud/project/*/kube*
- POST /cloud/project/*/kube*
- DELETE /cloud/project/*/kube*

#### For OVH Account:
- GET /me*
- PUT /me*
- POST /me*
- DELETE /me*

#### For OVH Private Network:
- GET /vrack*
- PUT /vrack*
- POST /vrack*
- DELETE /vrack*

## Release v0.15.19 - Enhanced Active Nodes

### 🚀 Active OVH API Integration Suite

This release provides 7 fully operational nodes with comprehensive OVH API integration, offering robust automation capabilities for core OVH services.

#### **Recent Improvements (v0.15.x)**
- **Multi-Region Support**: Dynamic API endpoints supporting EU, Canada, US, SoYouStart, and Kimsufi
- **Enhanced Error Handling**: Comprehensive error messages with troubleshooting steps
- **Improved DELETE Operations**: Meaningful success responses instead of null values
- **Parameter Validation**: Input validation prevents common API errors
- **Response Format Consistency**: Standardized data formats across all nodes
- **New Hosted Private Cloud Node**: Complete VMware Private Cloud management

#### **Active Node Coverage (7 Nodes)**
- **OVH AI**: ML/AI workload automation with applications, training jobs, and notebooks
- **OVH Account**: Comprehensive account, billing, and identity management
- **OVH Dedicated Server**: Infrastructure automation with security features
- **OVH Domain**: Complete DNS and domain management
- **OVH Hosted Private Cloud**: VMware Private Cloud management via dedicatedCloud API
- **OVH Kubernetes**: Managed Kubernetes with cluster, node pool, and security operations
- **OVH Private Network**: vRack private networking with service integration

#### **Key Features**
- **Universal Compatibility**: Works with all OVH regions and brands
- **Production Ready**: Comprehensive error handling and validation
- **Enterprise Grade**: Full audit trail and detailed logging
- **Developer Friendly**: Clear documentation and intuitive parameter names
- **Ascenzia Branding**: "Developed by Ascenzia" across all nodes

### Technical Excellence
- **Full ESLint Compliance**: All code follows n8n coding standards
- **Comprehensive Error Handling**: Detailed error messages with resolution steps
- **Dynamic Endpoint Support**: Automatic region detection and endpoint selection
- **Type Safety**: Full TypeScript implementation with proper interfaces
- **Response Standardization**: Consistent data formats for optimal workflow integration

### API Coverage
- **400+ Operations**: Comprehensive coverage of active OVH APIs
- **7 Active Nodes**: Core OVH services fully supported
- **Multi-Region**: EU, CA, US, SoYouStart, Kimsufi support
- **Authentication**: OVH API v1 signature implementation
- **Rate Limiting**: Respects OVH API limits and best practices

This release provides reliable automation capabilities for essential OVH infrastructure management, enabling sophisticated workflows for domain management, server operations, AI/ML workloads, Kubernetes orchestration, and private networking.

## Support

For issues and feature requests, please visit the [GitHub repository](https://github.com/lfinmauritius/n8n-nodes-ovh).

## License

MIT - see [LICENSE](LICENSE.md) file for details.

---

**Developed with ❤️ by [Ascenzia](https://ascenzia.fr)**