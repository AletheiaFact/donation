/* eslint-disable no-undef */
/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/




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

const environment = 'sandbox';
const pagseguro_endpoint_url = environment === 'sandbox' ? 'https://sandbox.api.pagseguro.com' : 'https://api.pagseguro.com';
const pagseguro_access_token = process.env.PAGSEGURO_ACCESS_TOKEN

const cardPayment = async (payload) => {
    try {
        const response = await axios.post(
            `${pagseguro_endpoint_url}/orders`,
            JSON.stringify(payload),
            {
                headers: {
                    "Content-Type": "application/json; charset=utf8",
                    Authorization: `Bearer ${pagseguro_access_token}`,
                },
            }
        )

        return response.data;
    } catch (error) {
        return error
    }
};


app.post("/card/:value", async (req, res) => {
    try {
        const { value } = req.params;
        const {
            firstName,
            lastName,
            taxId,
            holder,
            cardNumber,
            email,
            monthExpiration,
            yearExpiration,
            encrypted,
        } = req.body;
    
        const payload = {
            "customer": {
                "name": firstName + " " + lastName,
                "email": email,
                "tax_id": taxId.replace(/[.-]/g, ""),
            },
            "items": [
                {
                    "name": "Aletheia Donation",
                    "quantity": 1,
                    "unit_amount": value
                }
            ],
            "charges": [
                {
                    "description": "Doação",
                    "amount": {
                        "value": value,
                        "currency": "BRL"
                    },
                    "payment_method": {
                        "type": "CREDIT_CARD",
                        "installments": 1,
                        "capture": true,
                        "card": {
                            "encrypted": encrypted,
                            "number": cardNumber.replace(/\./g, ""),
                            "exp_month": monthExpiration,
                            "exp_year": yearExpiration,
                            "holder": {
                                "name": holder
                            }
                        }
                    },
                }
            ]
        }
        
        const response = await cardPayment(payload)
        
        res.send(response);
    } catch (error) {
        res.status(500).json({ error: "Falha ao proceder ao pagamento.", message: error });
    }
    
})

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
