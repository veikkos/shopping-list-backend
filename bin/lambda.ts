#!/usr/bin/env node
import "source-map-support/register"
import cdk = require("aws-cdk-lib")
import { LambdaApiStack } from "../lib/lambda-api-stack"

export const lambdaApiStackName = "ShoppingListLambdaApiStack"

const app = new cdk.App()
new LambdaApiStack(app, lambdaApiStackName, {})
