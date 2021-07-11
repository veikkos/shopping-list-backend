exports.handler = async (event) => {
    const requestContext = event.requestContext
    if (requestContext && requestContext.http) {
        const http = requestContext.http
        if (http && http.method === 'OPTIONS') {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
            };
        }
    }

    return {
        statusCode: 400,
    };
};
