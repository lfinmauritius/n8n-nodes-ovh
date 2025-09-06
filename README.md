# n8n-nodes-ovh

[![n8n](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png)](https://n8n.io) [![OVH](https://raw.githubusercontent.com/lfinmauritius/n8n-nodes-ovh/main/nodes/OvhDomain/ovh.svg)](https://www.ovhcloud.com)

[![npm version](https://img.shields.io/npm/v/n8n-nodes-ovh.svg)](https://www.npmjs.com/package/n8n-nodes-ovh) [![Active Status](https://img.shields.io/badge/status-active-green.svg)] [![License](https://img.shields.io/badge/license-MIT-blue.svg)] [![n8n Community](https://img.shields.io/badge/n8n-community-FF6D5A.svg)] [![OVH API](https://img.shields.io/badge/OVH-API-123F6D.svg)]

**Comprehensive OVH integration for n8n workflow automation**  
🚀 **Production Ready** - 8 active nodes with 450+ operations  
Developed by [Ascenzia](https://ascenzia.fr)

## 🌟 Features

This n8n community node provides comprehensive integration with OVH's suite of cloud services, enabling powerful automation workflows for European cloud infrastructure.

### 🔧 Active Nodes (8)

| Service | Description | Key Operations |
|---------|-------------|----------------|
| **AI** | Machine Learning & AI services | Applications, Training Jobs, Notebooks |
| **Account** | Account & billing management | Profile, Billing, Contacts, API Keys |
| **Dedicated Server** | Bare metal infrastructure | Server management, OS installation, Networking |
| **Domain** | Domain & DNS management | Domains, DNS Records (CRUD), Nameservers |
| **Hosted Private Cloud** | VMware Private Cloud | Datacenters, Hosts, Storage, Networks |
| **Kubernetes** | Managed Kubernetes service | Clusters, Node Pools, IP Restrictions |
| **Order** (Beta) | Order & cart management | Carts, Items, Coupons, Checkout |
| **Private Network** | vRack private networking | IP Blocks, Service Integration, Tasks |

### 🌍 Multi-Region Support

| Region | Endpoint | Description |
|--------|----------|-------------|
| **Europe** | `eu.api.ovh.com` | European operations |
| **Canada** | `ca.api.ovh.com` | North American operations |
| **US** | `api.us.ovhcloud.com` | US operations |
| **So you Start** | `eu.api.soyoustart.com` | Budget dedicated servers |
| **Kimsufi** | `eu.api.kimsufi.com` | Entry-level servers |

## 📦 Installation

### Community Nodes Installation

1. Go to **Settings > Community Nodes** in your n8n instance
2. Click **Install** and enter: `n8n-nodes-ovh`
3. Click **Install** and restart n8n

### Manual Installation

```bash
# Install in your n8n root directory
npm install n8n-nodes-ovh
```

### Docker Installation

```dockerfile
# Add to your n8n Dockerfile
RUN cd /data && npm install n8n-nodes-ovh
```

## 🔑 Authentication

### API Credentials Setup

1. **Create OVH API Credentials**
   - Visit: [OVH API Console](https://api.ovh.com/createToken/)
   - Choose your region endpoint
   - Set required permissions (see below)
   - Generate your credentials

2. **Configure in n8n**
   - Create new **OVH API** credential
   - Enter your **Application Key**, **Application Secret**, and **Consumer Key**
   - Select your **Endpoint** region

### Required API Permissions

#### Core Services
```bash
# Account Management
GET /me*
PUT /me*
POST /me*
DELETE /me*

# Domain Services
GET /domain*
PUT /domain*
POST /domain*
DELETE /domain*

# Dedicated Server
GET /dedicated/server*
PUT /dedicated/server*
POST /dedicated/server*
DELETE /dedicated/server*
```

#### Cloud Services
```bash
# AI Services
GET /cloud/project/*/ai*
PUT /cloud/project/*/ai*
POST /cloud/project/*/ai*
DELETE /cloud/project/*/ai*

# Kubernetes
GET /cloud/project/*/kube*
PUT /cloud/project/*/kube*
POST /cloud/project/*/kube*
DELETE /cloud/project/*/kube*
```

#### Infrastructure Services
```bash
# Hosted Private Cloud
GET /dedicatedCloud*
PUT /dedicatedCloud*
POST /dedicatedCloud*
DELETE /dedicatedCloud*

# Private Network (vRack)
GET /vrack*
PUT /vrack*
POST /vrack*
DELETE /vrack*
```

## 🚀 Quick Start

### Example: Create DNS Record

```json
{
  "nodes": [
    {
      "name": "OVH Domain",
      "type": "n8n-nodes-ovh.ovhDomain",
      "parameters": {
        "resource": "dnsRecord",
        "operation": "create",
        "domain": "example.com",
        "recordType": "A",
        "subDomain": "www",
        "target": "192.168.1.100",
        "ttl": 3600
      }
    }
  ]
}
```

### Example: Deploy AI Application

```json
{
  "nodes": [
    {
      "name": "OVH AI",
      "type": "n8n-nodes-ovh.ovhAi",
      "parameters": {
        "resource": "app",
        "operation": "create",
        "projectId": "your-project-id",
        "name": "my-ai-app",
        "image": "tensorflow/tensorflow:latest",
        "region": "GRA"
      }
    }
  ]
}
```

## 📚 Documentation

### Node References

| Node | Resource Types | Use Cases |
|------|----------------|-----------|
| **[OVH AI](https://docs.ovh.com/gb/en/publiccloud/ai/)** | Apps, Jobs, Notebooks | ML model training, AI app deployment |
| **[OVH Account](https://docs.ovh.com/gb/en/customer/first-steps-ovh-control-panel/)** | Profile, Bills, Contacts | Account automation, billing workflows |
| **[OVH Dedicated Server](https://docs.ovh.com/gb/en/dedicated/)** | Servers, Network, Security | Infrastructure provisioning, monitoring |
| **[OVH Domain](https://docs.ovh.com/gb/en/domains/)** | Domains, DNS, Nameservers | Domain management, DNS automation |
| **[OVH Hosted Private Cloud](https://docs.ovh.com/gb/en/private-cloud/)** | VMware infrastructure | Private cloud orchestration |
| **[OVH Kubernetes](https://docs.ovh.com/gb/en/kubernetes/)** | Clusters, Nodes, Security | Container orchestration |
| **[OVH Order](https://api.ovh.com/console/)** (Beta) | Carts, Coupons, Checkout | Order automation, cart management |
| **[OVH Private Network](https://docs.ovh.com/gb/en/vrack/)** | vRack, Services, IP blocks | Network isolation, service integration |

### Advanced Features

- **🔄 Error Handling**: Comprehensive error messages with troubleshooting steps
- **✅ Input Validation**: Parameter validation prevents API errors
- **🌐 Dynamic Endpoints**: Automatic region detection and endpoint selection
- **📊 Consistent Responses**: Standardized data formats across all nodes
- **🔒 Secure Authentication**: OVH API v1 signature implementation

## 🛠️ Development

### Coming Soon

Additional nodes are implemented but not yet activated:

- **OVH Compute**: Public Cloud compute instances
- **OVH Container Registry**: Managed container registry
- **OVH Database**: Managed database services  
- **OVH Data Processing**: Analytics and processing
- **OVH Storage**: Object storage services

## 🤝 Support

### Community

- **Issues**: [GitHub Issues](https://github.com/lfinmauritius/n8n-nodes-ovh/issues)
- **Discussions**: [GitHub Discussions](https://github.com/lfinmauritius/n8n-nodes-ovh/discussions)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io)

### Professional Support

For enterprise support and custom development:
- **Website**: [ascenzia.fr](https://ascenzia.fr)
- **Services**: AI agent creation, workflow automation, custom integrations

## 📄 License

MIT License - see [LICENSE](LICENSE.md) file for details.

## 🏷️ Version History

### v0.15.22 - Current
- 🆕 **Beta**: OVH Order node for cart and order management
- ✨ Support for cart operations, coupons, and checkout
- 🔧 Enhanced endpoint management across all nodes

### v0.15.19 - Previous
- ✨ Multi-region endpoint support
- 🐛 Enhanced error handling with troubleshooting
- 🔧 Improved DELETE operations responses
- ✅ Parameter validation and input sanitization
- 🆕 New OVH Hosted Private Cloud node

### Previous Versions
- v0.15.x: Enhanced stability and error handling
- v0.14.x: Multi-node activation and testing
- v0.13.x: Core functionality implementation

---

**Developed with ❤️ by [Ascenzia](https://ascenzia.fr)** - Your trusted partner for AI automation and workflow solutions.