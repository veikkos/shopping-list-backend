const lambda = require('../index');
const { testCase, cleanup, testHeaders, testTableName } = require('../../common/tests/util');
const { expect } = require('chai');

describe('Unit test for /shared app handler', function () {
    afterEach(() => {
        cleanup();
    });

    it('verifies successful GET response', async () => {
        const result = await testCase({
            lambda,
            event: {
                requestContext: {
                    httpMethod: 'GET',
                },
                headers: testHeaders,
            },
            dbMethod: 'get',
            dbInput: {
                Key: {
                    PK: 'SHARED',
                    SK: '1234',
                },
                TableName: testTableName,
            },
            dbOutput: {
                Item: {
                    lists: [
                        'abcd',
                        'efgh',
                    ],
                },
                Count: 1,
                ScannedCount: 1,
            },
        });

        expect(result.statusCode).to.be.equal(200);
        expect(JSON.parse(result.body)).to.deep.equal({
            lists: [
                'abcd',
                'efgh',
            ],
        });
    });

    it('verifies successful POST response', async () => {
        const result = await testCase({
            lambda,
            event: {
                requestContext: {
                    httpMethod: 'POST',
                },
                headers: testHeaders,
                body: JSON.stringify({
                    lists: [
                        'abcd',
                        'efgh',
                    ],
                }),
            },
            dbMethod: 'put',
            dbInput: {
                TableName: testTableName,
                Item: {
                    PK: 'SHARED',
                    SK: '1234',
                    lists: [
                        'abcd',
                        'efgh',
                    ],
                },
            },
            dbOutput: {
            },
        });

        expect(result.statusCode).to.be.equal(200);
    });
});
