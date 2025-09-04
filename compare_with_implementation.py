import re

# Read the OVH API file
with open('dedicatedcloud.json', 'r', encoding='utf-8') as f:
    api_content = f.read()

# Read the current implementation
with open('nodes/OvhPrivateCloud/OvhPrivateCloud.node.ts', 'r', encoding='utf-8') as f:
    impl_content = f.read()

# Extract all POST/PUT endpoints with body parameters from API
api_endpoints = {}

# Find all path blocks with POST/PUT operations
path_pattern = r'path:\s*"([^"]+)"'
paths = re.findall(path_pattern, api_content)

for i, path in enumerate(paths):
    # Find the next path to limit our search
    next_path_idx = api_content.find(f'path: "{paths[i+1]}"') if i+1 < len(paths) else len(api_content)
    path_start_idx = api_content.find(f'path: "{path}"')
    path_block = api_content[path_start_idx:next_path_idx]
    
    # Check if this path has POST or PUT operations
    if 'httpMethod: "POST"' in path_block or 'httpMethod: "PUT"' in path_block:
        # Find all operations in this path
        op_blocks = re.split(r'httpMethod:', path_block)[1:]
        
        for op_block in op_blocks:
            if op_block.startswith(' "POST"') or op_block.startswith(' "PUT"'):
                method = 'POST' if op_block.startswith(' "POST"') else 'PUT'
                
                # Check if it's PRODUCTION
                if 'value: "PRODUCTION"' not in op_block:
                    continue
                
                # Extract body parameters
                body_params = []
                param_blocks = re.findall(r'name:\s*"([^"]+)"[^}]*?paramType:\s*"body"[^}]*?dataType:\s*"([^"]+)"[^}]*?required:\s*(true|false)[^}]*?description:\s*"([^"]*)"', op_block)
                
                for param in param_blocks:
                    body_params.append({
                        'name': param[0],
                        'type': param[1],
                        'required': param[2] == 'true',
                        'description': param[3]
                    })
                
                if body_params:
                    key = f"{method} {path}"
                    api_endpoints[key] = body_params

# Now check which endpoints are missing parameters in implementation
missing_params = {}

for endpoint, params in sorted(api_endpoints.items()):
    method, path = endpoint.split(' ', 1)
    
    # Convert path to implementation format
    # Remove {serviceName} and other path params
    impl_path = path.replace('{serviceName}/', '').replace('{', '').replace('}', '')
    
    # Check if endpoint exists in implementation
    if path in impl_content or impl_path in impl_content:
        # Check each parameter
        missing = []
        for param in params:
            # Check if parameter is in implementation
            if f"'{param['name']}'" not in impl_content and f'"{param["name"]}"' not in impl_content:
                missing.append(param)
        
        if missing:
            missing_params[endpoint] = missing

# Generate report
report = "# Missing Body Parameters Report\n\n"
report += "This report shows POST/PUT endpoints that exist in the implementation but are missing body parameters.\n\n"

priority_endpoints = [
    'POST /dedicatedCloud/{serviceName}/datacenter/{datacenterId}/backup/batchRestore',
    'POST /dedicatedCloud/{serviceName}/datacenter/{datacenterId}/backup/disable', 
    'POST /dedicatedCloud/{serviceName}/datacenter/{datacenterId}/backup/generateReport',
    'POST /dedicatedCloud/{serviceName}/datacenter/{datacenterId}/backup/optimizeProxies',
    'POST /dedicatedCloud/{serviceName}/datacenter/{datacenterId}/disasterRecovery/zerto/disable',
    'POST /dedicatedCloud/{serviceName}/datacenter/{datacenterId}/disasterRecovery/zerto/endMigration',
    'POST /dedicatedCloud/{serviceName}/datacenter/{datacenterId}/disasterRecovery/zerto/remoteSites',
    'POST /dedicatedCloud/{serviceName}/datacenter/{datacenterId}/disasterRecovery/zertoSingle/remoteSites',
]

# First show priority endpoints
report += "## PRIORITY ENDPOINTS (Commonly Used)\n\n"
for endpoint in priority_endpoints:
    if endpoint in api_endpoints:
        report += f"### {endpoint}\n"
        report += "**Missing Parameters:**\n"
        for param in api_endpoints[endpoint]:
            req = "Required" if param['required'] else "Optional"
            report += f"- `{param['name']}` ({param['type']}) - {req}\n"
            report += f"  Description: {param['description']}\n"
        report += "\n"

# Then show all endpoints with body params
report += "\n## ALL ENDPOINTS WITH BODY PARAMETERS\n\n"
for endpoint, params in sorted(api_endpoints.items()):
    report += f"### {endpoint}\n"
    report += "**Body Parameters:**\n"
    for param in sorted(params, key=lambda x: x['name']):
        req = "Required" if param['required'] else "Optional"
        report += f"- `{param['name']}` ({param['type']}) - {req}\n"
        if param['description']:
            report += f"  Description: {param['description']}\n"
    report += "\n"

# Statistics
report += f"\n## STATISTICS\n"
report += f"- Total POST/PUT endpoints with body parameters: {len(api_endpoints)}\n"
report += f"- Total body parameters across all endpoints: {sum(len(params) for params in api_endpoints.values())}\n"

# Write report
with open('missing_body_parameters_report.txt', 'w', encoding='utf-8') as f:
    f.write(report)

print(f"Report generated: missing_body_parameters_report.txt")
print(f"Found {len(api_endpoints)} endpoints with body parameters")
print(f"Total body parameters: {sum(len(params) for params in api_endpoints.values())}")