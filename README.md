# Shopping List application backend

[![Node.js CI](https://github.com/veikkos/shopping-list-backend/actions/workflows/node.js.yml/badge.svg)](https://github.com/veikkos/shopping-list-backend/actions/workflows/node.js.yml)

Designed to be hosted in Amazon AWS. Uses Lambdas and Dynamo DB. Relies on API Gateway's JWT authorization.

Needs Payload format version `2.0 (interpreted response format)`.

Compatible React front-end implementation at https://github.com/veikkos/shopping-list-web.

## Endpoints

Backend supports three application endpoints plus default catch for CORS preflight requests.

![Endpoints visualized](https://raw.githubusercontent.com/veikkos/shopping-list-backend/master/media/routes.png)

## CORS

CORS needs both AWS configuration but also preflight Lambda with route `/{proxy+}` for all `OPTIONS` requests.

`http://localhost:3000` is allowed for development purposes but can be disabled for production use.

![CORS](https://raw.githubusercontent.com/veikkos/shopping-list-backend/master/media/cors.png)