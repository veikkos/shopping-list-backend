const lambda = require('../index');
const { testCase, cleanup, testHeaders } = require('../../common/tests/util');
const { expect } = require('chai');
const sinon = require('sinon');
const crypto = require('crypto');

describe('Unit test for /products app handler', function () {
    afterEach(() => {
        cleanup();
    });

    it('verifies successful GET response without parameters', async () => {
        const result = await testCase({
            lambda,
            event: {
                requestContext: {
                    http: {
                        method: 'GET',
                    },
                },
                headers: testHeaders,
            },
            dbMethod: 'query',
            dbInput: {
                TableName: 'shopping-list',
                IndexName: 'PK-user-index',
                KeyConditionExpression: 'PK = :pk and #user = :u',
                ExpressionAttributeValues: { ':pk': 'PRODUCT', ':u': '1234' },
                ExpressionAttributeNames: { '#user': 'user' },
            },
            dbOutput: {
                Items: [
                    {
                        SK: '5269c905c0',
                        user: '1234',
                        PK: 'PRODUCT',
                        name: 'Milk',
                    }],
                Count: 1,
                ScannedCount: 1,
            },
        });

        expect(result.statusCode).to.be.equal(200);
        expect(JSON.parse(result.body)).to.deep.equal([{
            name: 'Milk',
            id: '5269c905c0',
        }]);
    });

    it('verifies successful GET response with ID', async () => {
        const result = await testCase({
            lambda,
            event: {
                requestContext: {
                    http: {
                        method: 'GET',
                    },
                },
                headers: testHeaders,
                queryStringParameters: {
                    id: 100,
                },
            },
            dbMethod: 'get',
            dbInput: {
                TableName: 'shopping-list',
                Key: {
                    PK: 'PRODUCT',
                    SK: 100,
                },
            },
            dbOutput: {
                Item:
                {
                    user: '1234',
                    SK: '5269c905c0',
                    PK: 'PRODUCT',
                    name: 'Milk',
                },
            },
        });

        expect(result.statusCode).to.be.equal(200);
        expect(JSON.parse(result.body)).to.deep.equal({
            name: 'Milk',
            id: '5269c905c0',
        });
    });

    it('verifies successful POST response', async () => {
        sinon.stub(crypto, 'randomBytes').returns('f57ff3a78c');

        const result = await testCase({
            lambda,
            event: {
                requestContext: {
                    http: {
                        method: 'POST',
                    },
                },
                headers: testHeaders,
                body: JSON.stringify({
                    name: 'Honey',
                }),
            },
            dbMethod: 'put',
            dbInput: {
                TableName: 'shopping-list',
                Item: {
                    PK: 'PRODUCT',
                    SK: 'f57ff3a78c',
                    name: 'Honey',
                    user: '1234',
                },
            },
            dbOutput: {
            },
        });

        expect(result.statusCode).to.be.equal(201);
        expect(result.body).to.equal('f57ff3a78c');
    });

    it('verifies successful DELETE response', async () => {
        const result = await testCase({
            lambda,
            event: {
                requestContext: {
                    http: {
                        method: 'DELETE',
                    },
                },
                headers: testHeaders,
                queryStringParameters: {
                    id: 'f57ff3a78c',
                },
            },
            dbMethod: 'delete',
            dbInput: {
                TableName: 'shopping-list',
                Key: {
                    PK: 'PRODUCT',
                    SK: 'f57ff3a78c',
                },
            },
            dbOutput: {
            },
        });

        expect(result.statusCode).to.be.equal(200);
    });

    it('verifies unauthorized request', async () => {
        const result = await testCase({
            lambda,
            event: {
                requestContext: {
                    http: {
                        method: 'GET',
                    },
                },
                headers: {
                },
            },
        });

        expect(result.statusCode).to.be.equal(401);
    });
});
