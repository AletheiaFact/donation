export type AmplifyDependentResourcesAttributes = {
  "api": {
    "DonateAletheiaApi": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    },
    "PaymentAletheiaApi": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    }
  },
  "function": {
    "cardPaymentFunction": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "donateApi": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  }
}