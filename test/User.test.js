const { expect } = require('chai');
const axios = require('axios');
const jsonData = require('../env.json');
const fs = require('fs')
const { faker } = require('@faker-js/faker')
var rand = require('../generateRandom')

const userData= require('../users.json')

describe("User can do login", () => {
    it("Calling login API", async () => {
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
        expect(response.data.message).contains("Login successfully")
        let token_value = response.data.token;
        jsonData.token = token_value;
        fs.writeFileSync('env.json', JSON.stringify(jsonData))

    })

    
    var customer_name = faker.name.fullName();
    var customer_email = faker.internet.email().toLowerCase();
    var customer_phone_number = "015010" + rand(10000, 99999);
    it("Create new user", async () => {
        var response = await axios.post(`${jsonData.baseUrl}/user/create`, {
            "name": customer_name,
            "email": customer_email,
            "password": "1234",
            "phone_number": customer_phone_number,
            "nid": "123456789",
            "role": "Customer"
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": jsonData.token,
                "X-AUTH-SECRET-KEY": jsonData.secretKey
            }
        }).then((res) => res.data.user)
        console.log(response)

        var id=response.id;
        var name = response.name;
        var email = response.email;
        var phone_number = response.phone_number;
        var role = response.role;

        var newUser={
            customer_id:id,
            customer_name:name,
            customer_email:email,
            customer_phone_number:phone_number,
            role:role
        }

        userData.push(newUser);

        fs.writeFileSync('users.json',JSON.stringify(userData))
        console.log("Saved!")
    })

    var agent_name = faker.name.fullName();
    var agent_email = faker.internet.email().toLowerCase();
    var agent_phone_number = "016010" + rand(10000, 99999);
    it("Create new agent", async () => {
        var response = await axios.post(`${jsonData.baseUrl}/user/create`, {
            "name": agent_name,
            "email": agent_email,
            "password": "1233",
            "phone_number": agent_phone_number,
            "nid": "123456788",
            "role": "Agent"
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": jsonData.token,
                "X-AUTH-SECRET-KEY": jsonData.secretKey
            }
        }).then((res) => res.data.user)
        console.log(response)

        
        var name = response.name;
        var email = response.email;
        var phone_number = response.phone_number;
        var role = response.role;

        var newUser={
            agent_name:name,
            agent_email:email,
            agent_phone_number:phone_number,
            role:role
        }

        userData.push(newUser);

        fs.writeFileSync('users.json',JSON.stringify(userData))
        console.log("Saved!")
    })

    it("Search by the customer phone number", async () => {
        var customerPhoneNumber=userData[userData.length-2].customer_phone_number;
        var response = await axios.get(`${jsonData.baseUrl}/user/search/Phonenumber/${customerPhoneNumber}`,
            {

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jsonData.token,
                    "X-AUTH-SECRET-KEY": jsonData.secretKey
                }

            }).then((res) => res.data)

        console.log(response.message);
    })
    
    var customer2_name = faker.name.fullName();
    var customer2_email = faker.internet.email().toLowerCase();
    var customer2_phone_number = "017010" + rand(10000, 99999);
    it("Create another customer", async () => {
        var response = await axios.post(`${jsonData.baseUrl}/user/create`, {
            "name": customer2_name,
            "email": customer2_email,
            "password": "1233",
            "phone_number": customer2_phone_number,
            "nid": "123456788",
            "role": "Customer"
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": jsonData.token,
                "X-AUTH-SECRET-KEY": jsonData.secretKey
            }
        }).then((res) => res.data.user)
        console.log(response)

        
        var name = response.name;
        var email = response.email;
        var phone_number = response.phone_number;
        var role = response.role;

        var newUser={
            customer2_name:name,
            customer2_email:email,
            customer2_phone_number:phone_number,
            role:role
        }

        userData.push(newUser);

        fs.writeFileSync('users.json',JSON.stringify(userData))
        console.log("Saved!")
    })

    

 })