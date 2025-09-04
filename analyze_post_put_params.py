import re
import json

def parse_json_like_file(filename):
    """Parse the JSON-like file and extract POST/PUT endpoints with parameters."""
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all operations blocks
    operations_pattern = r'path:\s*"([^"]+)"[^{]*operations:\s*\[(.*?)\]\s*description:'
    
    endpoints = []
    
    # Split content by path blocks
    path_blocks = re.split(r'path:\s*"', content)[1:]
    
    for block in path_blocks:
        # Extract path
        path_match = re.match(r'([^"]+)"', block)
        if not path_match:
            continue
        path = path_match.group(1)
        
        # Find operations in this block
        operations_match = re.search(r'operations:\s*\[(.*?)\]\s*description:', block, re.DOTALL)
        if not operations_match:
            continue
            
        operations_content = operations_match.group(1)
        
        # Split by individual operations
        op_blocks = re.split(r'-\{', operations_content)
        
        for op_block in op_blocks:
            # Check if it's POST or PUT
            method_match = re.search(r'httpMethod:\s*"(POST|PUT)"', op_block)
            if not method_match:
                continue
            
            method = method_match.group(1)
            
            # Check if it's PRODUCTION
            if 'value: "PRODUCTION"' not in op_block:
                continue
            
            # Extract description
            desc_match = re.search(r'description:\s*"([^"]*)"', op_block)
            description = desc_match.group(1) if desc_match else ""
            
            # Extract parameters
            params_match = re.search(r'parameters:\s*\[(.*?)\]', op_block, re.DOTALL)
            
            parameters = {
                'path': [],
                'query': [],
                'body': []
            }
            
            if params_match:
                params_content = params_match.group(1)
                
                # Split parameters
                param_blocks = re.split(r'-\{', params_content)
                
                for param_block in param_blocks:
                    if not param_block.strip():
                        continue
                    
                    # Extract parameter details
                    name_match = re.search(r'name:\s*"([^"]+)"', param_block)
                    type_match = re.search(r'dataType:\s*"([^"]+)"', param_block)
                    param_type_match = re.search(r'paramType:\s*"([^"]+)"', param_block)
                    required_match = re.search(r'required:\s*(true|false)', param_block)
                    desc_match = re.search(r'description:\s*"([^"]*)"', param_block)
                    
                    if name_match and param_type_match:
                        param_info = {
                            'name': name_match.group(1),
                            'type': type_match.group(1) if type_match else 'string',
                            'required': required_match.group(1) == 'true' if required_match else True,
                            'description': desc_match.group(1) if desc_match else ''
                        }
                        
                        param_type = param_type_match.group(1)
                        if param_type in parameters:
                            parameters[param_type].append(param_info)
            
            endpoints.append({
                'path': path,
                'method': method,
                'description': description,
                'parameters': parameters
            })
    
    return endpoints

# Parse the file
endpoints = parse_json_like_file('dedicatedcloud.json')

# Sort by path
endpoints.sort(key=lambda x: x['path'])

# Generate output
output = "# Complete POST/PUT Parameters Analysis - OVH Private Cloud API\n\n"
output += "This file contains ALL POST and PUT endpoints with their complete parameter details.\n\n"

for endpoint in endpoints:
    output += f"\n## {endpoint['method']} {endpoint['path']}\n"
    output += f"**Description**: {endpoint['description']}\n\n"
    
    params = endpoint['parameters']
    
    if params['path']:
        output += "### Path Parameters:\n"
        for param in sorted(params['path'], key=lambda x: x['name']):
            output += f"- **{param['name']}** ({param['type']})"
            output += " - Required" if param['required'] else " - Optional"
            output += f"\n"
            if param['description']:
                output += f"  Description: {param['description']}\n"
        output += "\n"
    
    if params['query']:
        output += "### Query Parameters:\n"
        for param in sorted(params['query'], key=lambda x: x['name']):
            output += f"- **{param['name']}** ({param['type']})"
            output += " - Required" if param['required'] else " - Optional"
            output += f"\n"
            if param['description']:
                output += f"  Description: {param['description']}\n"
        output += "\n"
    
    if params['body']:
        output += "### Body Parameters:\n"
        for param in sorted(params['body'], key=lambda x: x['name']):
            output += f"- **{param['name']}** ({param['type']})"
            output += " - Required" if param['required'] else " - Optional"
            output += f"\n"
            if param['description']:
                output += f"  Description: {param['description']}\n"
        output += "\n"
    
    output += "---\n"

# Add summary
total_endpoints = len(endpoints)
endpoints_with_body = len([e for e in endpoints if e['parameters']['body']])
total_body_params = sum(len(e['parameters']['body']) for e in endpoints)

output += f"\n## SUMMARY STATISTICS\n"
output += f"- Total POST/PUT endpoints: {total_endpoints}\n"
output += f"- Endpoints with body parameters: {endpoints_with_body}\n"
output += f"- Total body parameters: {total_body_params}\n"

# Write output
with open('all_post_put_parameters_complete.txt', 'w', encoding='utf-8') as f:
    f.write(output)

print(f"Analysis complete. Found {total_endpoints} POST/PUT endpoints.")
print(f"Endpoints with body parameters: {endpoints_with_body}")
print(f"Total body parameters: {total_body_params}")

# Also create a summary of endpoints with body params only
body_endpoints = [e for e in endpoints if e['parameters']['body']]
summary = "\n\n## ENDPOINTS WITH BODY PARAMETERS ONLY\n\n"
for endpoint in body_endpoints:
    summary += f"### {endpoint['method']} {endpoint['path']}\n"
    summary += f"Body params: {', '.join([p['name'] for p in endpoint['parameters']['body']])}\n\n"

with open('endpoints_with_body_params.txt', 'w', encoding='utf-8') as f:
    f.write(summary)