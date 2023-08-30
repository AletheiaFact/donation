/* eslint-disable no-undef */
/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	CLIENT_ID
	CLIENT_SECRET
	ENVIRONMENT
Amplify Params - DO NOT EDIT */

const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const axios = require('axios')

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});


const environment = process.env.ENVIRONMENT || 'sandbox';
const CLIENT_ID = process.env.CLIENT_ID;
const APP_SECRET = process.env.CLIENT_SECRET;
const endpoint_url = environment === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file

const generateAccessToken = async () => {
  try {
        const auth = Buffer.from(`${CLIENT_ID}:${APP_SECRET}`).toString("base64");

        const response = await axios.post(
            `${endpoint_url}/v1/oauth2/token`,
            "grant_type=client_credentials",
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                },
            }
        );
        return response.data.access_token;
  } catch(error) {
      console.error("Failed to generate Access Token:", error?.response?.data);
  } 
};

const createOrder = async (value) => {
    try {
        const accessToken = await generateAccessToken();
        const payload = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "BRL",
                        value,
                    },
                },
            ],
        };
        const response = await axios.post(
            `${endpoint_url}/v2/checkout/orders`,
            JSON.stringify(payload),
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )

        return response.data;
    } catch (error) {
        console.error(error.respose.data)
    }
};


const capturePayment = async (orderID) => {
    const accessToken = await generateAccessToken();
    const url = `${endpoint_url}/v2/checkout/orders/${orderID}/capture`;

    const response = await axios.post(url,null, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        }
    })
    
    return response.data;
};


app.post("/orders/:value", async (req, res) => {
    try {
        const { value } = req.params; // Get the value from the URL parameter
        const response = await createOrder(value);
        res.json(response);
    } catch(error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to create order." });
    }
});

app.post("/orders/:orderID/capture", async (req, res) => {
    try {
        const { orderID } = req.params;
        const response = await capturePayment(orderID);
        res.json(response);
    } catch (error){
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to capture order." });
    }
});

app.listen(3000, () => {
  console.log(`listening on http://localhost:3000/`);
});

module.exports = app