# Missing Parameters to Add

## 1. Backup Operations

### batchRestore
- backupJobName (string) - Optional
- backupRepositoryName (string) - Required

## 2. Disaster Recovery Operations

### zerto/disable
- secondaryDatacenterId (long) - Required
- secondaryServiceName (string) - Required

### zerto/endpointPublicIp
- newEndpointPublicIp (ip) - Required

### zerto/remoteSites (POST)
- label (string) - Required
- remoteEndpointPublicIp (ipv4) - Required

### zerto/vraResources
- resourcesSize (enum) - Required

### zertoSingle/configureVpn
- remoteEndpointInternalIp (ipv4) - Required

### zertoSingle/endpointPublicIp
- newEndpointPublicIp (ip) - Required

### zertoSingle/remoteSites (POST)
- label (string) - Required
- remoteEndpointPublicIp (ipv4) - Required

### zertoSingle/vraResources
- resourcesSize (enum) - Required

## 3. User Operations

### user/{userId}/changeProperties
- canManageIpFailOvers (boolean) - Optional
- canManageNetwork (boolean) - Optional
- fullAdminRo (boolean) - Optional (from params list)

### user/{userId}/objectRight (POST)
- propagate (boolean) - Optional

## 4. VM Operations

### vm/{vmId}/disableCarp
- macAddress (string) - Required

### vm/{vmId}/enableCarp
- macAddress (string) - Required

### vm/{vmId}/restoreBackup
- filerType (enum) - Required

### vm/{vmId}/setLicense
- bypassGuestOsFamilyCheck (boolean) - Required
- kmsLicense (enum) - Required

## 5. Service Operations

### confirmTermination
- futureUse (enum) - Optional

### host/{hostId}/resilience/enable
- duration (long) - Required

### nsxtEdge/{nsxtEdgeId}/relocateEdge
- datastore (string) - Required

### nsxtEdge/{nsxtEdgeId}/resilience/enable
- duration (long) - Required

### orderNewHostHourly
- vmwareClusterId (string) - Required

### privateGateway/enable
- netmask (ip) - Required
- portgroup (string) - Required

### privateGateway/reconfigure
- netmask (ip) - Optional
- newDatacenterId (long) - Optional

### resizeNsxtEdgeCluster
- size (enum) - Required

### securityOptions/resumePendingEnabling
- option (enum) - Required

### upgradeVcenter
- release (enum) - Optional

### vendor/ovhId
- objectType (enum) - Required
- vendorId (string) - Required

### vrops/outgoingFlow (POST)
- servicePort (long) - Required

### vrops/upgrade
- version (string) - Required