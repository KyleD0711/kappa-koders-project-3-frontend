// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("vueField", (fieldLabel) => {
  return cy.contains(fieldLabel).siblings("input");
});

// cypress/support/commands.js
Cypress.Commands.add("loginByGoogleApi", () => {
  cy.log("Logging in to Google");
  cy.request({
    method: "POST",
    url: "https://www.googleapis.com/oauth2/v4/token",
    body: {
      grant_type: "refresh_token",
      client_id: Cypress.env("googleClientId"),
      client_secret: Cypress.env("googleClientSecret"),
      refresh_token: Cypress.env("googleRefreshToken"),
    },
  }).then(({ body }) => {
    const { access_token, id_token } = body;
    let url =
      (Cypress.env("clientUrl").includes("localhost")
        ? "http://localhost"
        : Cypress.env("clientUrl")) + "/tutorial/login";
    cy.request({
      method: "POST",
      url: url,
      body: { credential: id_token, accessToken: access_token },
    }).then(({ body }) => {
      cy.log(body);
      window.localStorage.setItem("user", JSON.stringify(body));
      cy.visit("/tutorials");
    });
  });
});

Cypress.Commands.add("logout", () => {
  let token = JSON.parse(window.localStorage.getItem("user")).token;
  let url =
    (Cypress.env("clientUrl").includes("localhost")
      ? "http://localhost"
      : Cypress.env("clientUrl")) + "/tutorial/logout";
  cy.request({
    method: "POST",
    url: url,
    body: { token: token },
  }).then(({ body }) => {
    cy.log(body);
    window.localStorage.removeItem("user");
    cy.visit("/");
  });
});
