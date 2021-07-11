const AWS = require('aws-sdk');
const util = require('../common/util');

const PK = 'LIST';

const listQuery = (id, userId, requestJSON) => {
    return {
        TableName: util.tableName,
        Item: {
            PK: PK,
            SK: id,
            user: userId,
            products: requestJSON.products,
            name: requestJSON.name,
        },
    }
}

const listUpdateQuery = (id, name, products) => {
    return {
        TableName: util.tableName,
        Key: {
            PK: PK,
            SK: id,
        },
        UpdateExpression: 'set #name = :name, products = :products',
        ExpressionAttributeValues: {
            ':name': name,
            ':products': products,
        },
        ExpressionAttributeNames: {
            '#name': 'name',
        },
    }
}

exports.handler = async (event) => {
    const dynamo = new AWS.DynamoDB.DocumentClient();
    const userId = util.checkAuth(event);

    if (userId.error) {
        return userId.error;
    }

    const operation = event.requestContext.http.method;

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
                    products: dbResponse.Item.products,
                };
            } else {
                const dbResponse = await (dynamo
                    .query(util.userQuery(PK, userId))
                    .promise());
                body = dbResponse.Items.map(list => {
                    return {
                        name: list.name,
                        id: list.SK,
                        products: list.products,
                    }
                });
            }

            return {
                statusCode: 200,
                body: JSON.stringify(body),
            };
        }
        case 'PUT': {
            const id = event.queryStringParameters.id;
            const requestJSON = JSON.parse(event.body);
            await dynamo
                .update(listUpdateQuery(id, requestJSON.name, requestJSON.products))
                .promise();
            return {
                statusCode: 200,
                body: id,
            };
        }
        case 'POST': {
            const requestJSON = JSON.parse(event.body);
            const listId = util.getId();
            await dynamo
                .put(listQuery(listId, userId, requestJSON))
                .promise();
            return {
                statusCode: 201,
                body: listId,
            };
        }
        case 'DELETE': {
            await dynamo
                .delete(util.idQuery(PK, event.queryStringParameters.id))
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
