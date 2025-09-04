const fs = require('fs');

// Read the dedicatedcloud.json file
const data = JSON.parse(fs.readFileSync('dedicatedcloud.json', 'utf8'));

// Output file
const outputFile = 'all_post_put_parameters_detailed.txt';
let output = '# Complete POST/PUT Parameters Analysis - OVH Private Cloud API\n\n';
output += 'This file contains ALL POST and PUT endpoints with their complete parameter details.\n\n';

// Track endpoints and their parameters
const endpoints = [];

// Function to extract parameters from an operation
function extractParameters(operation, path) {
    const params = {
        path: path,
        method: operation.httpMethod,
        description: operation.description,
        pathParams: [],
        queryParams: [],
        bodyParams: []
    };
    
    if (operation.parameters) {
        operation.parameters.forEach(param => {
            const paramInfo = {
                name: param.name,
                type: param.dataType || param.type,
                required: param.required !== false,
                description: param.description || ''
            };
            
            if (param.paramType === 'path') {
                params.pathParams.push(paramInfo);
            } else if (param.paramType === 'query') {
                params.queryParams.push(paramInfo);
            } else if (param.paramType === 'body') {
                params.bodyParams.push(paramInfo);
            }
        });
    }
    
    return params;
}

// Iterate through all paths
data.apis.forEach(api => {
    if (api.operations) {
        api.operations.forEach(operation => {
            if (operation.httpMethod === 'POST' || operation.httpMethod === 'PUT') {
                if (operation.apiStatus && operation.apiStatus.value === 'PRODUCTION') {
                    endpoints.push(extractParameters(operation, api.path));
                }
            }
        });
    }
});

// Sort endpoints alphabetically by path
endpoints.sort((a, b) => a.path.localeCompare(b.path));

// Generate output
endpoints.forEach(endpoint => {
    output += `\n## ${endpoint.method} ${endpoint.path}\n`;
    output += `**Description**: ${endpoint.description}\n\n`;
    
    if (endpoint.pathParams.length > 0) {
        output += '### Path Parameters:\n';
        endpoint.pathParams.forEach(param => {
            output += `- **${param.name}** (${param.type})${param.required ? ' - Required' : ' - Optional'}\n`;
            if (param.description) {
                output += `  Description: ${param.description}\n`;
            }
        });
        output += '\n';
    }
    
    if (endpoint.queryParams.length > 0) {
        output += '### Query Parameters:\n';
        endpoint.queryParams.forEach(param => {
            output += `- **${param.name}** (${param.type})${param.required ? ' - Required' : ' - Optional'}\n`;
            if (param.description) {
                output += `  Description: ${param.description}\n`;
            }
        });
        output += '\n';
    }
    
    if (endpoint.bodyParams.length > 0) {
        output += '### Body Parameters:\n';
        endpoint.bodyParams.forEach(param => {
            output += `- **${param.name}** (${param.type})${param.required ? ' - Required' : ' - Optional'}\n`;
            if (param.description) {
                output += `  Description: ${param.description}\n`;
            }
        });
        output += '\n';
    }
    
    output += '---\n';
});

// Add summary statistics
const totalEndpoints = endpoints.length;
const endpointsWithBody = endpoints.filter(e => e.bodyParams.length > 0).length;
const totalBodyParams = endpoints.reduce((sum, e) => sum + e.bodyParams.length, 0);

output += `\n## SUMMARY STATISTICS\n`;
output += `- Total POST/PUT endpoints: ${totalEndpoints}\n`;
output += `- Endpoints with body parameters: ${endpointsWithBody}\n`;
output += `- Total body parameters across all endpoints: ${totalBodyParams}\n`;

// Write to file
fs.writeFileSync(outputFile, output);
console.log(`Analysis complete. Results written to ${outputFile}`);
console.log(`Found ${totalEndpoints} POST/PUT endpoints with ${totalBodyParams} total body parameters.`);