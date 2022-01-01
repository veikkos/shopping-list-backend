const AWS = require('aws-sdk');
const util = require('../common/util');

const PK = 'SHARED';

exports.handler = async (event) => {
    const dynamo = new AWS.DynamoDB.DocumentClient();
    const userId = util.checkAuth(event);

    if (userId.error) {
        return userId.error;
    }

    const operation = event.requestContext.httpMethod;

    switch (operation) {
        case 'GET': {
            const dbResponse = await dynamo
                .get(util.idQuery(PK, userId))
                .promise();

            if (dbResponse.Item) {
                return {
                    statusCode: 200,
                    headers: util.responseHeaders(),
                    body: JSON.stringify({
                        lists: dbResponse.Item.lists,
                    }),
                };
            } else {
                return {
                    statusCode: 204,
                    headers: util.responseHeaders(),
                }
            }
        }
        case 'POST':
        case 'PUT': {
            const requestJSON = JSON.parse(event.body);
            await dynamo
                .put({
                    TableName: util.tableName,
                    Item: {
                        PK: PK,
                        SK: userId,
                        lists: requestJSON.lists,
                    },
                })
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
