# n8n-nodes-ovh

**⚠️ BETA VERSION - Currently OVH AI, OVH Dedicated Server and OVH Domain nodes are active**

This package provides n8n nodes for interacting with the OVH API, allowing you to automate domain, DNS, dedicated server, hosted private cloud, AI/ML services, data processing, managed database, Kubernetes cluster, container registry, public cloud compute, object storage, Web PaaS, and private network tasks.

**Note**: This is a beta release. Currently enabled nodes are OVH AI, OVH Dedicated Server and OVH Domain. Other nodes will be activated in future releases after thorough testing.

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
- **Get Many**: List all your dedicated servers
- **Get Hardware**: Get server hardware specifications
- **Get Network**: Get server network specifications
- **Get Service Info**: Get server service information
- **Reboot**: Reboot the server

#### Task Operations
- **Get**: Get task information
- **Get Many**: List server tasks (with optional status filter)
- **Cancel**: Cancel a running task

#### IP Operations
- **Get**: Get information about a specific IP
- **Get Many**: List all IPs associated with a server

#### Installation Operations
- **Get Status**: Get server installation/reinstallation status (gracefully handles "no installation in progress")
- **Get Templates**: Get available OS templates compatible with the server
- **Start**: Start OS installation with template and partition scheme selection

#### Network Operations
- **Get Virtual MACs**: List virtual MAC addresses associated with the server
- **Create Virtual MAC**: Create a new virtual MAC address (OVH or VMware type)
- **Delete Virtual MAC**: Remove a virtual MAC address
- **Get Secondary DNS**: List secondary DNS domains configured for the server
- **Add Secondary DNS**: Add a domain to secondary DNS configuration
- **Delete Secondary DNS**: Remove a domain from secondary DNS configuration
- **IP Block Merge**: Merge IP blocks for network management

#### Security Operations
- **Get Firewall**: Get firewall configuration (gracefully handles servers without firewall)
- **Update Firewall**: Configure firewall settings (enabled/disabled, routed/transparent mode)
- **Get IP Spoof**: Get IP spoof protection status

#### Options Operations
- **Get Available Options**: List available server options and add-ons

#### Intervention Operations
- **Get**: Get information about a specific intervention
- **Get Many**: List all interventions for the server

### OVH Private Cloud Node

#### Service Operations
- **Get**: Get service information
- **Get Many**: List all your private cloud services
- **Get Service Info**: Get service subscription information

#### Datacenter Operations
- **Get**: Get datacenter information
- **Get Many**: List all datacenters in a service

#### Virtual Machine Operations
- **Get**: Get virtual machine information
- **Get Many**: List all virtual machines in a datacenter
- **Power Off**: Power off a virtual machine
- **Power On**: Power on a virtual machine
- **Reset**: Reset a virtual machine
- **Revert Snapshot**: Revert VM to a specific snapshot

#### User Operations
- **Get**: Get user information
- **Get Many**: List all users in a service
- **Create**: Create a new user
- **Update**: Update user information
- **Delete**: Delete a user

#### Task Operations
- **Get**: Get task information
- **Get Many**: List all tasks for a service

### OVH AI Node

#### Project Operations
- **Get**: Get cloud project information
- **Get Many**: List all your cloud projects

#### AI App Operations
- **Get**: Get AI application information (includes status)
- **Get Many**: List all AI applications in a project
- **Get Logs**: Retrieve AI application logs
- **Create**: Create a new AI application with:
  - Docker image configuration
  - Resource allocation (CPU, Memory, GPU)
  - Region selection
  - Environment variables
  - Volume mounting
  - Port configuration
  - Health check probes
  - Scaling strategy (fixed/automatic)
- **Start**: Start a stopped AI application
- **Stop**: Stop a running AI application
- **Delete**: Delete an AI application

#### Training Job Operations
- **Get**: Get training job information
- **Get Many**: List all training jobs in a project
- **Create**: Create a new training job with:
  - Docker image and region selection
  - Resource allocation (CPU, Memory, GPU)
  - Command execution configuration
  - Environment variables
  - Volume mounting
  - Timeout settings
- **Stop**: Stop a running training job
- **Delete**: Delete a training job

#### Model Operations
- **Get**: Get model information
- **Get Many**: List all deployed models in a project
- **Delete**: Delete a deployed model

#### Notebook Operations
- **Get**: Get notebook information
- **Get Many**: List all notebooks in a project
- **Create**: Create a new notebook with:
  - Framework selection (Jupyter, JupyterLab, VSCode)
  - Environment selection (TensorFlow, PyTorch, Scikit-Learn, R)
- **Start**: Start a notebook instance
- **Stop**: Stop a notebook instance
- **Delete**: Delete a notebook

### OVH Data Processing Node

#### Job Operations
- **Get**: Get data processing job information
- **Get Many**: List all data processing jobs in a project (with optional status filter)
- **Create**: Create a new data processing job (Spark with configurable resources)
- **Stop**: Stop a running data processing job
- **Delete**: Delete a data processing job
- **Get Logs**: Retrieve job execution logs

#### Capability Operations
- **Get Many**: List available data processing capabilities

#### Metrics Operations
- **Get**: Get job execution metrics and performance data

### OVH Database Node

#### Service Operations
- **Get**: Get database service information
- **Get Many**: List all database services in a project
- **Create**: Create a new managed database service (MySQL, PostgreSQL, Redis, MongoDB)
- **Update**: Update database service settings (description, maintenance time, backup time)
- **Delete**: Delete a database service

#### Database Operations
- **Get**: Get database information
- **Get Many**: List all databases in a service
- **Create**: Create a new database in a service
- **Delete**: Delete a database

#### User Operations
- **Get**: Get database user information
- **Get Many**: List all database users in a service
- **Create**: Create a new database user
- **Reset Password**: Reset a user's password
- **Delete**: Delete a database user

#### Backup Operations
- **Get**: Get backup information
- **Get Many**: List all backups for a service
- **Create**: Create a manual backup
- **Restore**: Restore from a backup
- **Delete**: Delete a backup

#### Capability Operations
- **Get Many**: List database service capabilities and available engines

#### Availability Operations
- **Get Many**: List database service availability by region

### OVH Kubernetes Node

#### Cluster Operations
- **Get**: Get Kubernetes cluster information
- **Get Many**: List all Kubernetes clusters in a project
- **Create**: Create a new Kubernetes cluster with specified version and region
- **Update**: Update cluster settings (name, version)
- **Reset**: Reset cluster to default configuration
- **Delete**: Delete a Kubernetes cluster

#### Node Pool Operations
- **Get**: Get node pool information
- **Get Many**: List all node pools in a cluster
- **Create**: Create a new node pool with autoscaling configuration
- **Update**: Update node pool settings (desired nodes, min/max nodes, autoscaling)
- **Delete**: Delete a node pool

#### Kubeconfig Operations
- **Get**: Get kubeconfig file for cluster access
- **Reset**: Reset kubeconfig credentials

### OVH Container Registry Node

#### Registry Operations
- **Get**: Get container registry information
- **Get Many**: List all container registries in a project
- **Create**: Create a new managed container registry with specified plan and region
- **Update**: Update registry settings (name)
- **Delete**: Delete a container registry

#### User Operations
- **Get**: Get registry user information
- **Get Many**: List all users with access to a registry
- **Create**: Create a new registry user with email and login
- **Update**: Update user settings (email)
- **Delete**: Delete a registry user

#### Plan Operations
- **Get Many**: List available container registry plans and pricing

### OVH Public Cloud Compute Node

#### Instance Operations
- **Get**: Get compute instance information
- **Get Many**: List all compute instances in a project
- **Create**: Create a new compute instance with specified flavor, image, and region
- **Update**: Update instance settings (name)
- **Delete**: Delete a compute instance
- **Start**: Start a stopped compute instance
- **Stop**: Stop a running compute instance
- **Reboot**: Reboot a compute instance (soft or hard reboot)
- **Reinstall**: Reinstall a compute instance with a new image
- **Resize**: Resize a compute instance to a different flavor

#### Instance Backup Operations
- **Get**: Get instance backup information
- **Get Many**: List all backups for an instance
- **Create**: Create a manual backup of an instance
- **Restore**: Restore an instance from a backup
- **Delete**: Delete an instance backup

#### SSH Key Operations
- **Get**: Get SSH key information
- **Get Many**: List all SSH keys in a project
- **Create**: Create a new SSH key pair
- **Delete**: Delete an SSH key

#### Flavor Operations
- **Get**: Get flavor (instance type) information
- **Get Many**: List all available flavors

#### Image Operations
- **Get**: Get image information
- **Get Many**: List all available images

#### Region Operations
- **Get Many**: List all available regions

### OVH Public Cloud Storage Node

#### Container Operations
- **Get**: Get storage container information
- **Get Many**: List all storage containers in a project
- **Create**: Create a new storage container with specified region
- **Update**: Update container settings (versioning, type)
- **Delete**: Delete a storage container

#### Credential Operations
- **Get**: Get storage credentials information
- **Get Many**: List all storage credentials for a project
- **Create**: Create new storage access credentials
- **Delete**: Delete storage credentials

#### User Operations
- **Get**: Get storage user information
- **Get Many**: List all storage users in a project
- **Create**: Create a new storage user with description
- **Delete**: Delete a storage user

#### Presigned URL Operations
- **Create**: Create presigned URLs for secure object access (GET/PUT operations)

#### Storage Operations
- **Get Many**: List all storage services in a project

#### Region Operations
- **Get Many**: List all available storage regions

### OVH Web PaaS Node

#### Project Operations
- **Get**: Get Web PaaS project information
- **Get Many**: List all Web PaaS projects
- **Create**: Create a new Web PaaS project with specified plan and region
- **Update**: Update project settings (title, default branch)
- **Delete**: Delete a Web PaaS project

#### Subscription Operations
- **Get**: Get subscription information and service details
- **Get Many**: List all Web PaaS subscriptions

#### Environment Operations
- **Get**: Get environment information
- **Get Many**: List all environments in a project
- **Activate**: Activate an environment
- **Deactivate**: Deactivate an environment

#### Deployment Operations
- **Get**: Get deployment information
- **Get Many**: List all deployments for an environment
- **Trigger**: Trigger a new deployment

#### User Operations
- **Get**: Get user information
- **Get Many**: List all users in a project
- **Add**: Add a new user to the project with specified role
- **Update**: Update user permissions and role
- **Remove**: Remove a user from the project

#### Certificate Operations
- **Get**: Get SSL certificate information
- **Get Many**: List all certificates for an environment
- **Add**: Add a new SSL certificate with private key
- **Delete**: Delete an SSL certificate

#### Capability Operations
- **Get Many**: List all available Web PaaS capabilities and features

### OVH Private Network Node

#### vRack Operations
- **Get**: Get vRack information and configuration
- **Get Many**: List all vRacks available
- **Update**: Update vRack settings (name, description)

#### Service Operations
- **Get Many**: List all services allowed in vRack
- **Add**: Add a service to vRack (assign)
- **Remove**: Remove a service from vRack (unassign)

#### Cloud Project Operations
- **Get Many**: List all cloud projects in vRack
- **Add**: Add a cloud project to vRack
- **Remove**: Remove a cloud project from vRack

#### Dedicated Server Operations
- **Get Many**: List all dedicated servers in vRack
- **Add**: Add a dedicated server to vRack
- **Remove**: Remove a dedicated server from vRack

#### IP Block Operations
- **Get Many**: List all IP blocks in vRack
- **Add**: Add an IP block to vRack
- **Remove**: Remove an IP block from vRack

#### Private Network Operations
- **Get**: Get private network information
- **Get Many**: List all private networks in a project
- **Create**: Create a new private network with VLAN configuration
- **Update**: Update private network settings (name)
- **Delete**: Delete a private network

#### Task Operations
- **Get**: Get task information
- **Get Many**: List all tasks for vRack operations

## Latest Features & Updates

### Version 0.8.10 - July 2025
- **🚀 OVH AI node enhancement** - Complete Job Create operation with resources and additional parameters:
  - Added required parameters: name, image, region, resources (CPU, Memory, GPU)
  - Added additional fields: command, environment variables, volumes, timeout, partner ID
  - Properly structured resource allocation object for OVH API compliance

### Version 0.8.9 - July 2025
- **🔧 OVH AI node fix** - Improved response handling for Start/Stop operations (handle non-JSON responses)

### Version 0.8.8 - July 2025
- **🔧 OVH AI node cleanup** - Removed non-existent Update operation for AI apps

### Version 0.8.7 - July 2025
- **🔧 OVH AI node fix** - Fixed signature error for Start/Stop operations by not sending empty body

### Version 0.8.6 - July 2025
- **🔧 OVH AI node fix** - Corrected Get Logs endpoint to use /log (not /logs) and Start/Stop operations to use PUT method (not POST)

### Version 0.8.5 - January 2025
- **🔧 OVH AI node fix** - Fixed 415 "Unsupported Media Type" error on Update operation by always sending Content-Type header

### Version 0.8.4 - January 2025
- **🔧 OVH AI node update** - Re-added Start, Stop and Get Logs operations with corrected endpoint paths

### Version 0.8.3 - January 2025
- **🔧 OVH AI node fix** - Removed unsupported operations (Get Logs, Get Status, Start, Stop) that don't exist in OVH API

### Version 0.8.2 - January 2025
- **🔧 OVH AI node fix** - Fixed "Could not get parameter" error on App Get Many operation

### Version 0.8.1 - January 2025
- **🔧 OVH AI node fix** - Fixed resources parameter structure for app creation
- **📝 Documentation update** - Added required API permissions for each OVH service

### Version 0.8.0 - January 2025
- **🤖 New OVH AI node** - Complete AI/ML services management:
  - **AI Applications**: Full lifecycle management with enhanced creation options (environment variables, volumes, health checks, scaling strategies)
  - **Training Jobs**: Create and manage ML training jobs with Docker containers
  - **Models**: Deploy and manage AI models
  - **Notebooks**: Create and control Jupyter/VSCode notebooks for development
  - **Comprehensive parameters**: Support for GPU allocation, custom ports, probe configuration

### Version 0.7.6 - July 2025
- **🚀 Complete OVH Domain node implementation** - Full domain and DNS management capabilities
- **🔧 Major API improvements and bug fixes**:
  - **Contact Get**: Fixed to properly extract contact IDs from OVH API structure (`contactOwner.id`, etc.)
  - **Nameserver Get Many**: Now returns nameserver names, IDs, and types instead of just IDs
  - **Zone Export**: Returns complete zone content in `zoneContent` field instead of individual characters
  - **DNS Records**: Removed redundant "Get Many" operation, enhanced "Get All Detailed" for better data structure
- **✨ Enhanced OVH Dedicated Server** with comprehensive server management:
  - **Installation management**: OS template installation with status monitoring
  - **Network management**: Virtual MAC, secondary DNS, IP block operations
  - **Security management**: Firewall and IP spoof protection configuration
  - **Server options**: Available options and add-ons management
  - **Interventions**: Hardware intervention tracking and management

### Key Improvements (v0.7.1 - v0.7.6)
- **Correct API mapping**: Fixed Contact operations to use proper OVH API response structure
- **Enhanced data presentation**: Nameserver operations return meaningful object structures
- **Better zone handling**: Zone Export returns complete content instead of parsing errors
- **Simplified interface**: Removed redundant operations to improve user experience
- **Graceful degradation**: Features unavailable on specific servers return informative messages instead of errors
- **Robust validation**: Empty field validation with clear error messages
- **Optimized API calls**: Proper content-type handling and signature generation

## Credentials

To use this node, you need to create OVH API credentials:

1. Go to the OVH API token creation page for your region:
   - EU: https://eu.api.ovh.com/createToken/
   - CA: https://ca.api.ovh.com/createToken/
   - US: https://api.us.ovhcloud.com/createToken/

2. Set the required rights for your application based on the nodes you want to use:
   - **OVH Domain**: GET/PUT/POST/DELETE on `/domain/*`
   - **OVH Dedicated Server**: GET/PUT/POST/DELETE on `/dedicated/server/*`
   - **OVH AI**: GET/PUT/POST/DELETE on `/cloud/project/*/ai/*`
   - For all cloud services: GET on `/cloud/project` and `/cloud/project/*`

3. You'll receive:
   - Application Key
   - Application Secret
   - Consumer Key

4. Add these credentials in n8n when configuring the OVH node

## About Ascenzia

[Ascenzia](https://ascenzia.fr) is a French technology company specializing in AI agent creation and intelligent automation solutions. We help businesses build and deploy sophisticated AI agents that can interact with various APIs and automate complex workflows.

### Our Services
- **AI Agent Development**: Design and creation of custom AI agents for business automation
- **Intelligent Workflow Automation**: Building smart workflows with AI decision-making capabilities
- **API Integration**: Connecting AI agents with external services and platforms
- **Custom AI Solutions**: Tailored artificial intelligence solutions for specific business needs

Visit [ascenzia.fr](https://ascenzia.fr) for your AI agent development projects.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [OVH API documentation](https://api.ovh.com/)
- [Ascenzia website](https://ascenzia.fr)

## License

[MIT](LICENSE.md)

---

**© 2025 Ascenzia - Powering AI Agent Innovation**