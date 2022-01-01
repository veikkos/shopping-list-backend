const crypto = require('crypto');

const tableName = 'shopping-list-2';

const getId = () => crypto.randomBytes(8).toString('hex');

const checkAuth = (event) => {
    const authorization = event.headers['Authorization'];

    if (!authorization) {
        const response = {
            statusCode: 401,
            body: 'Missing authorization token',
        };
        return { error: response };
    }

    const auth = authorization.split(' ');
    if (auth[0] !== 'Bearer') {
        const response = {
            statusCode: 401,
            body: 'Missing Bearer in authorization header',
        };
        return { error: response };
    }

    const base64buffer = Buffer.from(auth[1].split('.')[1], 'base64');
    const token = JSON.parse(base64buffer.toString());

    // Signature is already checked by API Gateway prior to calling the Lambda

    return token.sub;
}

const userQuery = (pk, userId) => {
    return {
        TableName: tableName,
        IndexName: 'PK-user-index',
        KeyConditionExpression: 'PK = :pk and #user = :u',
        ExpressionAttributeValues: {
            ':pk': pk,
            ':u': userId,
        },
        ExpressionAttributeNames: {
            '#user': 'user',
        },
    }
}

const idQuery = (pk, id) => {
    return {
        TableName: tableName,
        Key: {
            PK: pk,
            SK: id,
        },
    }
}

const responseHeaders = () => {
    return {
        'Access-Control-Allow-Headers' : 'Content-Type',
        'Access-Control-Allow-Origin': '*',
    }
}

module.exports = {
    tableName,
    getId,
    checkAuth,
    userQuery,
    idQuery,
    responseHeaders,
}
