# Shopping List application backend

[![Node.js CI](https://github.com/veikkos/shopping-list-backend/actions/workflows/node.js.yml/badge.svg)](https://github.com/veikkos/shopping-list-backend/actions/workflows/node.js.yml)

Designed to be hosted in Amazon AWS. Uses Lambdas and Dynamo DB.

Modified authorizer code by Auth0 under `authorizer/` is not covered by the license but is licensed according to original licensing. See [auth0-samples/jwt-rsa-aws-custom-authorizer](https://github.com/auth0-samples/jwt-rsa-aws-custom-authorizer/blob/master/LICENSE).

Compatible React front-end implementation at https://github.com/veikkos/shopping-list-web.

## Endpoints

Backend supports three application endpoints.

*Note: Deployment has been since implemented with CDK RestApi and built-in CORS support is used instead of custom preflight Lambda. Following image is for illustration purposes only.*

![Endpoints visualized](https://raw.githubusercontent.com/veikkos/shopping-list-backend/master/media/routes.png)
