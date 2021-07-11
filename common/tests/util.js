const AWSMock = require('aws-sdk-mock');
const { expect } = require('chai');
const sinon = require('sinon');

var mocked = false;

const testCase = async ({ lambda, event, dbMethod, dbInput, dbOutput }) => {
    if (dbMethod && dbInput && dbOutput) {
        AWSMock.mock('DynamoDB.DocumentClient', dbMethod, (params, callback) => {
            expect(params).to.be.deep.equal(dbInput);

            return callback(null, dbOutput);
        });
        mocked = true;
    }

    return lambda.handler(event);
}

const cleanup = () => {
    if (mocked) {
        AWSMock.restore('DynamoDB.DocumentClient');
        mocked = false;
    }
    sinon.restore();
}

const testHeaders = {
    authorization: 'Bearer ABC.eyJzdWIiOiIxMjM0In0=.123',
}

module.exports = {
    testCase,
    cleanup,
    testHeaders,
}