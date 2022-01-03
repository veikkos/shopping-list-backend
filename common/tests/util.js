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
    'Authorization': 'Bearer ABC.eyJzdWIiOiIxMjM0In0=.123',
}

const testTableName = 'shopping-list-2'

module.exports = {
    testCase,
    cleanup,
    testHeaders,
    testTableName,
}