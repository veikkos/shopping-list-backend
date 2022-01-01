import { AuthorizationType, LambdaIntegration, MethodLoggingLevel, RestApi, TokenAuthorizer } from "aws-cdk-lib/aws-apigateway"
import { Function, Runtime, AssetCode } from "aws-cdk-lib/aws-lambda"
import { Duration, Stack, StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb"

interface LambdaApiStackProps extends StackProps {
}

interface Lambda {
    functionName: string,
    codePath: string,
    methods: string[],
}

export class LambdaApiStack extends Stack {
    constructor(scope: Construct, id: string, props: LambdaApiStackProps) {
        super(scope, id, props)

        const tokenAuthorizer = this.createAuthorizer();
        const restApi = this.createRestApi();
        const table = this.createTable();
        this.createLambdas(restApi, table, tokenAuthorizer);
    }

    createRestApi() {
        return new RestApi(this, this.stackName + "RestApi", {
            deployOptions: {
                stageName: "prod",
                metricsEnabled: true,
                loggingLevel: MethodLoggingLevel.INFO,
                dataTraceEnabled: true,
            },
            defaultCorsPreflightOptions: {
                allowHeaders: [
                    "access-control-allow-credentials",
                    "access-control-allow-origin",
                    "access-control-expose-headers",
                    "apigw-requestid",
                    "content-length",
                    "content-type",
                    "date",
                    "vary",
                    "authorization"
                ],
                exposeHeaders: [
                    'authorization',
                    '*'
                ],
                allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'DELETE'],
                allowCredentials: true,
                allowOrigins: ['https://kauppalistat.herokuapp.com', 'http://localhost:3000'],
            }
        })
    }

    createTable() {
        const tableId = 'ShoppingList';

        const table = new Table(this, tableId, {
            tableName: 'shopping-list-2',
            partitionKey: { name: 'PK', type: AttributeType.STRING },
            sortKey: { name: 'SK', type: AttributeType.STRING },
        });

        table.addGlobalSecondaryIndex({
            indexName: "PK-user-index",
            partitionKey: {
                name: "PK",
                type: AttributeType.STRING
            },
            sortKey: {
                name: 'user',
                type: AttributeType.STRING
            },
            readCapacity: 5,
            writeCapacity: 5
        });

        return table;
    }

    createAuthorizer() {
        const authorizerFunction = new Function(this, "Authorizer", {
            functionName: "Authorizer",
            handler: "index.handler",
            runtime: Runtime.NODEJS_14_X,
            code: new AssetCode(`./dist/authorizer`),
            memorySize: 128,
            timeout: Duration.seconds(10),
        })

        return new TokenAuthorizer(this, "TokenAuthorizer", {
            handler: authorizerFunction,
            resultsCacheTtl: Duration.millis(0)
        })
    }

    createLambdas(restApi: RestApi, table: Table, tokenAuthorizer: TokenAuthorizer) {
        const lambdas: Lambda[] = [{
            functionName: "Products",
            codePath: "products",
            methods: ["GET", "PUT", "POST", "DELETE"],
        }, {
            functionName: "Lists",
            codePath: "lists",
            methods: ["GET", "PUT", "POST", "DELETE"],
        }, {
            functionName: "Shared",
            codePath: "shared",
            methods: ["GET", "PUT", "POST"],
        }];

        lambdas.forEach((lambda: Lambda) => {
            const lambdaFunction = new Function(this, lambda.functionName, {
                functionName: lambda.functionName,
                handler: "index.handler",
                runtime: Runtime.NODEJS_14_X,
                code: new AssetCode(`./dist/${lambda.codePath}`),
                memorySize: 128,
                timeout: Duration.seconds(10),
            })

            const resource = restApi.root.addResource(lambda.functionName.toLowerCase());

            lambda.methods.forEach((method: string) =>
                resource.addMethod(method, new LambdaIntegration(lambdaFunction, {}), {
                    authorizationType: AuthorizationType.CUSTOM,
                    authorizer: tokenAuthorizer,
                }));

            table.grantReadWriteData(lambdaFunction);
        });
    }
}
