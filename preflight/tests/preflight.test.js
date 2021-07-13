const lambda = require('../index');
const { expect } = require('chai');

describe('Unit test for pre-flight handler', function () {
    it('verifies successful response', async () => {
        const result = await lambda.handler({
            requestContext: {
                http: {
                    method: 'OPTIONS',
                },
            },
        });

        expect(result.statusCode).to.be.equal(200);
    });
});
