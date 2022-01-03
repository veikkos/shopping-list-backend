const list = require('../dist/lib/lambda-list');

module.exports.resources = (resource) => {
    const methods = ['GET', 'PUT', 'POST', 'DELETE'];
    const methodMatch = methods.find(method => resource.includes(method))
    const resourceMatch = list.lambdas.find(r => {
        return resource.includes(r.functionName.toLowerCase());
    }).functionName.toLowerCase()

    console.log(resourceMatch);
    const resourceArrays = list.lambdas.map((lambda) => {
        return lambda.methods.map((method) => {
            return resource
                .replace(methodMatch, method)
                .replace(resourceMatch, lambda.functionName.toLowerCase());
        }); 
    })

    return resourceArrays.flat();
};
