const lambda = require('../index');
const { testCase, cleanup, testHeaders } = require('../../common/tests/util');
const { expect } = require('chai');
const sinon = require('sinon');
const crypto = require('crypto');

describe('Unit test for /lists app handler', function () {
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
                ExpressionAttributeValues: { ':pk': 'LIST', ':u': '1234' },
                ExpressionAttributeNames: { '#user': 'user' },
            },
            dbOutput: {
                Items: [{
                    SK: '74844e4759',
                    user: '1234',
                    PK: 'LIST',
                    products: [{
                        amount: 1,
                        collected: false,
                        id: 'e676cb41b8',
                    }],
                    name: 'My List',
                }],
                Count: 1,
                ScannedCount: 1,
            },
        });

        expect(result.statusCode).to.be.equal(200);
        expect(JSON.parse(result.body)).to.deep.equal([{
            name: 'My List',
            id: '74844e4759',
            products: [{
                amount: 1,
                collected: false,
                id: 'e676cb41b8',
            }],
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
                    PK: 'LIST',
                    SK: 100,
                },
            },
            dbOutput: {
                Item: {
                    user: '1234',
                    SK: '5e9647c597',
                    PK: 'LIST',
                    name: 'My List',
                    products: [{
                        amount: 3,
                        collected: false,
                        id: 'e676cb41b8',
                    }],
                },
            },
        });

        expect(result.statusCode).to.be.equal(200);
        expect(JSON.parse(result.body)).to.deep.equal({
            name: 'My List',
            id: '5e9647c597',
            products: [{
                amount: 3,
                collected: false,
                id: 'e676cb41b8',
            }],
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
                    name: 'My List',
                    products: [{
                        id: 'e676cb41b8',
                        amount: 1,
                        collected: false,
                    }],
                }),
            },
            dbMethod: 'put',
            dbInput: {
                TableName: 'shopping-list',
                Item: {
                    PK: 'LIST',
                    SK: 'f57ff3a78c',
                    name: 'My List',
                    products: [{
                        amount: 1,
                        collected: false,
                        id: 'e676cb41b8',
                    }],
                    user: '1234',
                },
            },
            dbOutput: {
            },
        });

        expect(result.statusCode).to.be.equal(201);
        expect(result.body).to.equal('f57ff3a78c');
    });

    it('verifies successful PUT response', async () => {
        const result = await testCase({
            lambda,
            event: {
                requestContext: {
                    http: {
                        method: 'PUT',
                    },
                },
                headers: testHeaders,
                queryStringParameters: {
                    id: 'f57ff3a78c',
                },
                body: JSON.stringify({
                    name: 'My List',
                    products: [{
                        id: 'e676cb41b8',
                        amount: 1,
                        collected: false,
                    }],
                }),
            },
            dbMethod: 'update',
            dbInput: {
                TableName: 'shopping-list',
                ExpressionAttributeNames: {
                    '#name': 'name',
                },
                ExpressionAttributeValues: {
                    ':name': 'My List',
                    ':products': [{
                        amount: 1,
                        collected: false,
                        id: 'e676cb41b8',
                    }],
                },
                UpdateExpression: 'set #name = :name, products = :products',
                Key: {
                    PK: 'LIST',
                    SK: 'f57ff3a78c',
                },
            },
            dbOutput: {
            },
        });

        expect(result.statusCode).to.be.equal(200);
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
                    PK: 'LIST',
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
