const axios = require('axios');
const jsonData = require('../env.json');
const fs = require('fs');
const { expect } = require('chai');
const userData= require('../users.json')


describe("User can do transaction", () => {
    before(async () => {
        var response = await axios.post(`${jsonData.baseUrl}/user/login`,
            {
                "email": "salman@roadtocareer.net",
                "password": "1234"
            },
            {
                headers: {
                    "Content-Type": "application/json",
                }
            })
        console.log(response.data)
        let token_value = response.data.token;
        jsonData.token = token_value;
        fs.writeFileSync('env.json', JSON.stringify(jsonData))

    })

    it("Deposite to agent from system", async () => {
        
        var agentPhoneNumber=userData[userData.length-2].agent_phone_number;
        var response = await axios.post(`${jsonData.baseUrl}/transaction/deposit`,
            {
                
                "from_account": "SYSTEM",
                "to_account": agentPhoneNumber,
                "amount": 5000
            },
            {

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jsonData.token,
                    "X-AUTH-SECRET-KEY": jsonData.secretKey
                }

            }).then((res) => res.data)

        console.log(response);
        console.log(response.message);
        expect(response.message).contains("Deposit successful")
    })

    
    it("Deposite to customer from agent", async () => {
        
        var agentPhoneNumber=userData[userData.length-2].agent_phone_number;
        var customerPhoneNumber=userData[userData.length-3].customer_phone_number;

        var response = await axios.post(`${jsonData.baseUrl}/transaction/deposit`,
            {
                
                "from_account": agentPhoneNumber,
                "to_account": customerPhoneNumber,
                "amount": 2000
            },
            {

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jsonData.token,
                    "X-AUTH-SECRET-KEY": jsonData.secretKey
                }

            }).then((res) => res.data)

        console.log(response);
        expect(response.message).contains("Deposit successful")

        var trnxId = response.trnxId;
        var cus_trnxId={
              customer_trnxId:trnxId
              }
          
         userData.push(cus_trnxId);
         fs.writeFileSync('users.json',JSON.stringify(userData))
         console.log("Saved!")
          
    })

    
    it("Check balancd of customer", async () => {
        var customerPhoneNumber=userData[userData.length-4].customer_phone_number;
        var response = await axios.get(`${jsonData.baseUrl}/transaction/balance/${customerPhoneNumber}`,
            {

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jsonData.token,
                    "X-AUTH-SECRET-KEY": jsonData.secretKey
                }

            }).then((res) => res.data)

        console.log(response.message);
        expect(response.message).contains("User balance")
    })

    
    it("Check statement by transaction Id", async () => {
       var customerTrnxId=userData[userData.length-1].customer_trnxId;
       var response = await axios.get(`${jsonData.baseUrl}/transaction/search/${customerTrnxId}`,

            {

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jsonData.token,
                    "X-AUTH-SECRET-KEY": jsonData.secretKey
                }

            }).then((res) => res.data)

        console.log(response.message);
        expect(response.message).contains("Transaction list")
    })

    
    it("Withdraw by customer", async () => {
        var customerPhoneNumber=userData[userData.length-4].customer_phone_number;
        var agentPhoneNumber=userData[userData.length-3].agent_phone_number;
        var response = await axios.post(`${jsonData.baseUrl}/transaction/withdraw`,
            {
                
                "from_account": customerPhoneNumber,
                "to_account": agentPhoneNumber,
                "amount": 1000
            },
            {

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jsonData.token,
                    "X-AUTH-SECRET-KEY": jsonData.secretKey
                }

            }).then((res) => res.data)

        console.log(response);
        expect(response.message).contains("Withdraw successful")

        const expectedBalance = 990;
        console.assert(response.currentBalance === expectedBalance, `Expected balance: ${expectedBalance}, Actual balance: ${response.currentBalance}`);
    })

    


    it("Send money to another customer", async () => {

        var customerPhoneNumber=userData[userData.length-4].customer_phone_number;
        var customer2PhoneNumber=userData[userData.length-2].customer2_phone_number;
        
        var response = await axios.post(`${jsonData.baseUrl}/transaction/sendmoney`,
            {
                
                "from_account": customerPhoneNumber,
                "to_account": customer2PhoneNumber,
                "amount": 500
            },
            {

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jsonData.token,
                    "X-AUTH-SECRET-KEY": jsonData.secretKey
                }

            }).then((res) => res.data)

        console.log(response.message);
        expect(response.message).contains("Send money successful")

         const currentBalance = response.currentBalance;
         console.log(currentBalance);
         const expectedBalance = 485;
         console.assert(response.currentBalance === expectedBalance, `Expected balance: ${expectedBalance}, Actual balance: ${response.currentBalance}`);
        
    })

    it("Check customer statement", async () => {
        var customerPhoneNumber=userData[userData.length-4].customer_phone_number;
        var response = await axios.get(`${jsonData.baseUrl}/transaction/statement/${customerPhoneNumber}`,
            {

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jsonData.token,
                    "X-AUTH-SECRET-KEY": jsonData.secretKey
                }

            }).then((res) => res.data)

        console.log(response.message);
    })

})    