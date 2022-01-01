const AWS = require('aws-sdk');
const util = require('../common/util');

const PK = 'PRODUCT';

exports.handler = async (event) => {
    const dynamo = new AWS.DynamoDB.DocumentClient();
    const userId = util.checkAuth(event);

    if (userId.error) {
        return userId.error;
    }

    const operation = event.requestContext.httpMethod;

    switch (operation) {
        case 'GET': {
            let body;
            if (event.queryStringParameters) {
                const dbResponse = await dynamo
                    .get(util.idQuery(PK, event.queryStringParameters.id))
                    .promise();
                body = {
                    name: dbResponse.Item.name,
                    id: dbResponse.Item.SK,
                };
            } else {
                const dbResponse = await dynamo
                    .query(util.userQuery(PK, userId))
                    .promise();
                body = dbResponse.Items.map(product => {
                    return {
                        name: product.name,
                        id: product.SK,
                    };
                });
            }

            return {
                statusCode: 200,
                headers: util.responseHeaders(),
                body: JSON.stringify(body),
            };
        }
        case 'PUT':
            return {
                statusCode: 503,
                headers: util.responseHeaders(),
                body: 'Not supported',
            };
        case 'POST': {
            const requestJSON = JSON.parse(event.body);
            const productId = util.getId();
            await dynamo
                .put({
                    TableName: util.tableName,
                    Item: {
                        PK: PK,
                        SK: productId,
                        user: userId,
                        name: requestJSON.name,
                    },
                })
                .promise();
            return {
                statusCode: 201,
                headers: util.responseHeaders(),
                body: productId,
            };
        }
        case 'DELETE': {
            await dynamo
                .delete(util.idQuery(PK, event.queryStringParameters.id))
                .promise();
            return {
                statusCode: 200,
                headers: util.responseHeaders(),
            };
        }
    }

    return {
        statusCode: 400,
        headers: util.responseHeaders(),
    };
};
