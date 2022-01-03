const { resources } = require('../resources');
const { expect } = require('chai');

describe('Unit test for authorization resources', function () {
    it('verifies successful resources', async () => {
        const res = resources('arn:aws:execute-api:some-region-1:642323544524:g6r754f95f/prod/GET/products')
        expect(res).to.be.deep.equal([
              'arn:aws:execute-api:some-region-1:642323544524:g6r754f95f/prod/GET/products',
              'arn:aws:execute-api:some-region-1:642323544524:g6r754f95f/prod/PUT/products',
              'arn:aws:execute-api:some-region-1:642323544524:g6r754f95f/prod/POST/products',
              'arn:aws:execute-api:some-region-1:642323544524:g6r754f95f/prod/DELETE/products',
              'arn:aws:execute-api:some-region-1:642323544524:g6r754f95f/prod/GET/lists',
              'arn:aws:execute-api:some-region-1:642323544524:g6r754f95f/prod/PUT/lists',
              'arn:aws:execute-api:some-region-1:642323544524:g6r754f95f/prod/POST/lists',
              'arn:aws:execute-api:some-region-1:642323544524:g6r754f95f/prod/DELETE/lists',
              'arn:aws:execute-api:some-region-1:642323544524:g6r754f95f/prod/GET/shared',
              'arn:aws:execute-api:some-region-1:642323544524:g6r754f95f/prod/PUT/shared',
              'arn:aws:execute-api:some-region-1:642323544524:g6r754f95f/prod/POST/shared',
        ]);
    });
});
