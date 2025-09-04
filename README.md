# n8n-nodes-ovh

**⚠️ BETA VERSION - Currently OVH AI, OVH Dedicated Server, OVH Domain, OVH Private Cloud, OVH Kubernetes, and OVH Account nodes are active**

This package provides n8n nodes for interacting with the OVH API, allowing you to automate domain, DNS, dedicated server, hosted private cloud, AI/ML services, account management, data processing, managed database, Kubernetes cluster, container registry, public cloud compute, object storage, and private network tasks.

**Note**: This is a beta release. Currently enabled nodes are OVH AI, OVH Dedicated Server, OVH Domain, OVH Private Cloud, OVH Kubernetes, and OVH Account. Other nodes will be activated in future releases after thorough testing.

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

### OVH Private Cloud Node

Comprehensive VMware Private Cloud management with over 300+ operations across 30+ resources.

#### Core Resources
- **Allowed Network**: Firewall ACL management
- **Backup & Backup Repository**: Backup configuration and management
- **Cluster**: Cluster operations and configuration
- **Datacenter**: Virtual datacenter management
- **Disaster Recovery**: Zerto disaster recovery configuration
- **Filer**: Storage filer management
- **HCX, HDS, HIPAA**: Compliance and migration tools
- **Host**: ESXi host management
- **IAM**: Identity and Access Management
- **IP**: IP block management
- **Location**: Datacenter location information
- **NSX-T Edge**: Network edge management
- **Private Gateway**: Private network gateway
- **Robot**: Robot account management
- **Security Options**: Security configuration
- **Service**: Global service operations
- **Service Pack**: Service pack management
- **Tag**: Resource tagging
- **Task**: Task monitoring
- **Two FA Whitelist**: Two-factor authentication
- **User**: User management with comprehensive rights
- **Virtual Machine**: VM lifecycle management
- **VLAN**: VLAN configuration
- **VM Encryption**: Encryption key management
- **vRack**: Virtual rack networking
- **vROps**: vRealize Operations management

#### Key Features
- Complete CRUD operations for all resources
- Task monitoring and management
- Comprehensive user rights management
- Disaster recovery configuration
- Network security and firewall rules
- VM backup and restore operations
- Service pack ordering and management
- Compliance certifications (HDS, HIPAA, PCI-DSS)
- NSX-T integration
- vROps monitoring and configuration

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

#### For OVH Private Cloud:
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

## Release v0.12.0 - Complete Feature Set

### 🚀 Comprehensive OVH Integration Suite

This release represents the complete implementation of OVH API integration for n8n, providing over 530+ operations across all major OVH services.

#### **OVH Private Cloud (VMware) - 300+ Operations**
- **Complete Resource Coverage**: 30+ resource types with full CRUD operations
- **Advanced Features**:
  - Disaster Recovery with Zerto/ZertoSingle configuration
  - NSX-T Edge deployment and management
  - vROps monitoring and alerting
  - VM encryption with KMS
  - Two-factor authentication management
  - Comprehensive backup and restore operations
- **Enhanced Parameter Support**: 100% API parameter coverage for all POST/PUT operations
- **Compliance**: HDS, HIPAA, PCI-DSS certification management

#### **OVH Domain - Complete DNS Management**
- Full domain lifecycle management
- Advanced DNS zone operations with import/export
- Complete DNS record management (A, AAAA, MX, CNAME, TXT, etc.)
- Nameserver configuration
- Contact management with proper ID extraction

#### **OVH Dedicated Server - Infrastructure Automation**
- Server lifecycle management with OS installation
- Network configuration (Virtual MAC, IP blocks)
- Security features (Firewall, IP mitigation, spoof protection)
- Monitoring and statistics
- License management

#### **OVH AI - ML/AI Workload Automation**
- AI application deployment with custom resources
- Training job management
- Jupyter/VSCode notebook automation
- Datastore operations
- Complete lifecycle management with logs and monitoring

#### **OVH Kubernetes - Managed Kubernetes Automation**
- Complete cluster lifecycle management
- Node pool and node operations
- IP restrictions and security management
- OpenID Connect integration
- Private network configuration
- Metrics and monitoring
- Update policy management
- 30+ operations across 11 resources

### Technical Improvements
- **Full ESLint Compliance**: All code follows n8n coding standards
- **Comprehensive Error Handling**: Proper error messages and recovery
- **Optimized API Calls**: Efficient batching and caching
- **Type Safety**: Full TypeScript implementation
- **Load Options**: Dynamic loading for all resource selections

### API Coverage
- **530+ Operations**: Complete coverage of OVH production APIs
- **100% Parameter Implementation**: All required and optional parameters
- **Authenticated Requests**: OVH signature v1 implementation
- **Rate Limiting**: Respects OVH API limits

This release provides enterprise-grade automation capabilities for OVH infrastructure, enabling complex workflows and complete infrastructure-as-code implementations.

## Support

For issues and feature requests, please visit the [GitHub repository](https://github.com/lfinmauritius/n8n-nodes-ovh).

## License

MIT - see [LICENSE](LICENSE.md) file for details.

---

**Developed with ❤️ by [Ascenzia](https://ascenzia.fr)**