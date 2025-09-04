#!/bin/bash

echo "# Missing Parameters by Endpoint"
echo ""

# Missing parameters
missing_params=(
"backupJobName"
"backupRepositoryName"
"baseDnForGroups"
"baseDnForUsers"
"bypassGuestOsFamilyCheck"
"canManageIpFailOvers"
"canManageNetwork"
"datastore"
"domainAlias"
"domainName"
"duration"
"filerType"
"fullAdminRo"
"futureUse"
"groupName"
"kind"
"kmsLicense"
"label"
"ldapHostname"
"ldapTcpPort"
"localVraNetwork"
"macAddress"
"netmask"
"newDatacenterId"
"newEndpointPublicIp"
"noSsl"
"objectType"
"option"
"ovhEndpointIp"
"portgroup"
"primaryEndpointIp"
"propagate"
"release"
"remoteEndpointInternalIp"
"remoteEndpointPublicIp"
"remoteVraNetwork"
"remoteZvmInternalIp"
"resourcesSize"
"secondaryDatacenterId"
"secondaryEndpointIp"
"secondaryServiceName"
"servicePort"
"size"
"streamId"
"username"
"vendorId"
"version"
"vmwareClusterId"
"vmwareObjectId"
)

for param in "${missing_params[@]}"; do
    echo ""
    echo "## Parameter: $param"
    echo "Found in endpoints:"
    
    # Find all occurrences of this parameter with context
    grep -B30 "name: \"$param\"" dedicatedcloud.json | grep -B30 'paramType: "body"' | grep -B20 'httpMethod: "POST"\|httpMethod: "PUT"' | grep 'path: "' | tail -1
    
    # Also show the description
    grep -A2 "name: \"$param\"" dedicatedcloud.json | grep 'description:' | head -1
done