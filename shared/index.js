const AWS = require('aws-sdk');
const util = require('../common/util');

const PK = 'SHARED';

exports.handler = async (event) => {
    const dynamo = new AWS.DynamoDB.DocumentClient();
    const userId = util.checkAuth(event);

    if (userId.error) {
        return userId.error;
    }

    const operation = event.requestContext.http.method;

    switch (operation) {
        case 'GET': {
            const dbResponse = await dynamo
                .get(util.idQuery(PK, userId))
                .promise();

            if (dbResponse.Item) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        lists: dbResponse.Item.lists,
                    }),
                };
            } else {
                return {
                    statusCode: 204,
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
            };
        }
    }

    return {
        statusCode: 400,
    };
};
