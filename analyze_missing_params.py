import re

# Read the API file
with open('dedicatedcloud.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Read implementation
with open('nodes/OvhPrivateCloud/OvhPrivateCloud.node.ts', 'r', encoding='utf-8') as f:
    impl_content = f.read()

# Missing parameters we found
missing_params = [
    "backupJobName", "backupRepositoryName", "baseDnForGroups", "baseDnForUsers",
    "bypassGuestOsFamilyCheck", "canManageIpFailOvers", "canManageNetwork", "datastore",
    "domainAlias", "domainName", "duration", "filerType", "fullAdminRo", "futureUse",
    "groupName", "kind", "kmsLicense", "label", "ldapHostname", "ldapTcpPort",
    "localVraNetwork", "macAddress", "netmask", "newDatacenterId", "newEndpointPublicIp",
    "noSsl", "objectType", "option", "ovhEndpointIp", "portgroup", "primaryEndpointIp",
    "propagate", "release", "remoteEndpointInternalIp", "remoteEndpointPublicIp",
    "remoteVraNetwork", "remoteZvmInternalIp", "resourcesSize", "secondaryDatacenterId",
    "secondaryEndpointIp", "secondaryServiceName", "servicePort", "size", "streamId",
    "username", "vendorId", "version", "vmwareClusterId", "vmwareObjectId"
]

# Find endpoints for each missing parameter
endpoint_params = {}

for param in missing_params:
    # Find all occurrences of this parameter
    param_pattern = f'name: "{param}"[^}}]*?paramType: "body"'
    matches = list(re.finditer(param_pattern, content, re.DOTALL))
    
    for match in matches:
        # Find the path and method for this parameter
        # Look backwards for the path
        before_text = content[:match.start()]
        path_matches = list(re.finditer(r'path: "([^"]+)"', before_text))
        if path_matches:
            path = path_matches[-1].group(1)
            
            # Look for the method
            method_search = content[match.start()-500:match.start()+100]
            method_match = re.search(r'httpMethod: "(POST|PUT)"', method_search)
            if method_match:
                method = method_match.group(1)
                
                # Check if PRODUCTION
                if 'value: "PRODUCTION"' in content[match.start()-1000:match.start()+500]:
                    endpoint = f"{method} {path}"
                    
                    # Get parameter details
                    param_block = content[match.start()-100:match.start()+300]
                    type_match = re.search(r'dataType: "([^"]+)"', param_block)
                    required_match = re.search(r'required: (true|false)', param_block)
                    desc_match = re.search(r'description: "([^"]*)"', param_block)
                    
                    param_info = {
                        'name': param,
                        'type': type_match.group(1) if type_match else 'string',
                        'required': required_match.group(1) == 'true' if required_match else True,
                        'description': desc_match.group(1) if desc_match else ''
                    }
                    
                    if endpoint not in endpoint_params:
                        endpoint_params[endpoint] = []
                    endpoint_params[endpoint].append(param_info)

# Generate report
report = "# Missing Parameters by Endpoint Report\n\n"
report += "This report shows all endpoints that have parameters not yet implemented in OvhPrivateCloud.node.ts\n\n"

# Group by common operations
backup_endpoints = {}
disaster_recovery_endpoints = {}
user_endpoints = {}
vm_endpoints = {}
service_endpoints = {}
other_endpoints = {}

for endpoint, params in sorted(endpoint_params.items()):
    if '/backup' in endpoint:
        backup_endpoints[endpoint] = params
    elif '/disasterRecovery' in endpoint:
        disaster_recovery_endpoints[endpoint] = params
    elif '/user' in endpoint:
        user_endpoints[endpoint] = params
    elif '/vm/' in endpoint:
        vm_endpoints[endpoint] = params
    elif 'serviceName}/' not in endpoint.replace('{serviceName}', 'serviceName'):
        service_endpoints[endpoint] = params
    else:
        other_endpoints[endpoint] = params

# Generate sections
def write_section(title, endpoints):
    if not endpoints:
        return ""
    
    section = f"\n## {title}\n\n"
    for endpoint, params in sorted(endpoints.items()):
        section += f"### {endpoint}\n"
        section += "**Missing Parameters:**\n"
        for param in sorted(params, key=lambda x: x['name']):
            req = "Required" if param['required'] else "Optional"
            section += f"- `{param['name']}` ({param['type']}) - {req}\n"
            if param['description']:
                section += f"  - {param['description']}\n"
        section += "\n"
    return section

report += write_section("🔴 BACKUP OPERATIONS", backup_endpoints)
report += write_section("🔴 DISASTER RECOVERY OPERATIONS", disaster_recovery_endpoints)
report += write_section("🔴 USER OPERATIONS", user_endpoints)
report += write_section("🔴 VM OPERATIONS", vm_endpoints)
report += write_section("🔴 SERVICE-LEVEL OPERATIONS", service_endpoints)
report += write_section("🔴 OTHER OPERATIONS", other_endpoints)

# Summary
report += "\n## SUMMARY\n\n"
report += f"- Total endpoints with missing parameters: {len(endpoint_params)}\n"
report += f"- Total missing parameters: {sum(len(params) for params in endpoint_params.values())}\n"
report += f"- Backup operations: {len(backup_endpoints)}\n"
report += f"- Disaster Recovery operations: {len(disaster_recovery_endpoints)}\n"
report += f"- User operations: {len(user_endpoints)}\n"
report += f"- VM operations: {len(vm_endpoints)}\n"
report += f"- Service operations: {len(service_endpoints)}\n"
report += f"- Other operations: {len(other_endpoints)}\n"

# Write report
with open('missing_params_detailed_report.txt', 'w', encoding='utf-8') as f:
    f.write(report)

print("Report generated: missing_params_detailed_report.txt")
print(f"Found {len(endpoint_params)} endpoints with missing parameters")
print(f"Total missing parameters: {sum(len(params) for params in endpoint_params.values())}")