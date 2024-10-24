# Automated Integration Testing

#### Written by Emily Pielemeier

## Set up first tests

1. Install Cypress

```bash
npm install cypress
```

2. Configure `package.json` to support `npm test` and `npm run test:open`:

```json
"scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint",
    "bundle": "mv .env dist",
    "test": "cypress run",
    "test:open": "cypress open"
},
```

3. Create `cypress.config.js` with the following

```js
//from https://docs.cypress.io/guides/end-to-end-testing/testing-your-app#Step-3-Configure-Cypress
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:8081",
  },
});
```

4. Run `npm test`. There should be a warning that there are no tests.
5. Create `cypress/e2e/spec.cy.js` with the following

```js
//from https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test#Write-your-first-test
describe("My First Test", () => {
  it("Does not do much!", () => {
    expect(true).to.equal(true);
  });
});
```

6. Run `npm test`. The test should pass.
7. Run `npm run test:open` to interactively run tests

- Select your browser
- Click `Start E2E Testing in browser`
- Click on `spec.cy.js`
- With the browser open, go to VS Code and update `cypress/e2e/spec.cy.js`:

```js
//from https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test#Write-your-first-test
describe("My First Test", () => {
  it("Does not do much!", () => {
    expect(true).to.equal(false);
  });
});
```

- Go back to the browser window. The test reran itself and failed.
- Close the browser window
- Close the Cypress window

8. Run `npm test`. The test should fail.

- Open `cypress/screenshots/spec.cy.js/My First Test -- Does not do much! (failed).png` from the file explorer. Notice the failure in the image.
- Open `cypress/videos/spec.cy.js.mp4` from the file explorer (not from VS Code). Watch the test run and fail in the video.

9. Update `cypress/spec.cy.js` to pass. Run `npm test` to confirm.
10. Update `.gitignore` to include the following

```bash
# Cypress
cypress/screenshots
cypress/videos
```

## Set up end-to-end tests

1. Start your backend, frontend, and database
2. Create `cypress/e2e/tutorials_spec.cy.js` with the following

```js
describe("tutorials", () => {
  it("can load the list page", () => {
    cy.visit("/");
    cy.contains("Tutorial List");
  });
});
```

3. Run `npm run test:open` and select `tutorials_spec.cy.js`. The test should pass.
4. Keeping the browser window open to see live test results, continue adding tests to `cypress/e2e/tutorials_spec.cy.js`

```js
describe("tutorials", () => {
  // ...

  it("can visit the add tutorial page", () => {
    cy.visit("/");
    cy.contains("Add").click();
    cy.url().should("include", "add");
    cy.contains("Tutorial Add");
  });

  describe("add tutorial", () => {
    it("can load the add page", () => {
      cy.visit("/add");
      cy.contains("Tutorial Add");
    });

    it("does not add when fields are empty", () => {
      cy.visit("/add");
      cy.contains("Save").click();
      cy.contains("Content can not be empty!");
    });
  });
});
```

5. Add the following to `cypress/support/commands.js`

```js
Cypress.Commands.add("vueField", (fieldLabel) => {
  return cy.contains(fieldLabel).siblings().find("input");
});
```

6. Add the following test to `cypress/e2e/tutorials_spec.js`. The test should pass.

```js
describe("tutorials", () => {
  //...

  describe("add tutorial", () => {
    //...

    it("can add a tutorial", () => {
      const uniqueId = new Date().getTime();
      cy.visit("/add");
      cy.vueField("Title").type("Automated Testing Tutorial " + uniqueId);
      cy.vueField("Description").type("A really cool tutorial");
      cy.contains("Save").click();

      cy.contains("Tutorial List");
      cy.contains("Automated Testing Tutorial " + uniqueId);
    });
  });
});
```

7. Add the following test to `cypress/e2e/tutorials_spec.js`

```js
describe("tutorials", () => {
  // ...

  describe("add tutorial", () => {
    // ...

    it("can delete an added tutorial", () => {
      var rowCount;
      cy.intercept("GET", "/api/tutorials").as("getTutorials");
      cy.visit("/");
      cy.wait("@getTutorials");
      cy.get(".v-row").then((rows) => {
        cy.log("beginning row count is " + rows.length);
        rowCount = rows.length;
      });
      cy.get(".mdi-trash-can").first().click();
      cy.get(".v-row").then((rows) => {
        cy.wrap(rows).should("have.length", rowCount - 1);
      });
    });
  });
});
```

8. Verify that all tests have passed by using `npm test:open` or `npm test`.
9. With the documentation below and the examples so far write additional tests for viewing and editing tutorials. All tests should pass when you are complete.

# Documentation

- [Cypress Examples](https://example.cypress.io/)
- [Cypress Debugging](https://docs.cypress.io/guides/guides/debugging)
- [Cypress Network Requests](https://docs.cypress.io/guides/guides/network-requests)
