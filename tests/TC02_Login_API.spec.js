const { test, expect } = require('@playwright/test'); 


const dataset = require('../utils/CloudBerryStoreTestData.json'); 
const users = dataset.Sheet1; 
for (const data of users) {
  test(`TC02_Login_API-${data.username}`, async ({ request }) => {
const loginPageRes = await request.get("https://www.cloudberrystore.services/index.php?route=account/login&language=en-gb");
expect(loginPageRes.ok()).toBeTruthy();

const html = await loginPageRes.text();

const match = html.match(/login_token=([a-zA-Z0-9]+)/);

expect(match).not.toBeNull();

const loginToken = match[1];
 
const loginRes = await request.post(`https://www.cloudberrystore.services/index.php?route=account/login.login&language=en-gb&login_token=${loginToken}`,
  {
    form: {
      email: data.username,
      password: data.password,
    },
    
     headers: {
          'x-requested-with': 'XMLHttpRequest',
          'accept': 'application/json, text/javascript, */*; q=0.01',
        },


  }
);


expect(loginPageRes.ok()).toBeTruthy();

const body = await loginRes.json();

    expect(body.error, `Login failed for ${data.username}: ${JSON.stringify(body)}`).toBeFalsy();

       expect(body.success || body.redirect, `Unexpected login response: ${JSON.stringify(body)}`).toBeTruthy();

    
const accountRes = await request.get('https://www.cloudberrystore.services/index.php?route=account/account&language=en-gb');


expect(accountRes.ok()).toBeTruthy();

const accountHtml = await accountRes.text();
expect(accountHtml).toContain('My Account');
  });
}