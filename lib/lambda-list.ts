export interface Lambda {
    functionName: string,
    codePath: string,
    methods: string[],
}

export const lambdas: Lambda[] = [{
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
