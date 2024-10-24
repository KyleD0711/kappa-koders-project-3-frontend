describe("tutorials", () => {
  it("can load the login page", () => {
    cy.visit("/");
    cy.contains("Welcome to Tutorials!");
  });

  it("can login", () => {
    cy.visit("/");
    cy.loginByGoogleApi();
    cy.contains("Hello");
  });

  describe("add tutorial", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.loginByGoogleApi();
      cy.contains("Hello");
    });

    it("can visit the add tutorial page", () => {
      cy.contains("Add").click();
      cy.url().should("include", "add");
      cy.contains("Tutorial Add");
    });

    it("can load the add page", () => {
      cy.visit("/add");
      cy.contains("Tutorial Add");
    });

    it("does not add when fields are empty", () => {
      cy.visit("/add");
      cy.contains("Save").click();
      cy.contains("Content can not be empty!");
    });

    it("can add a tutorial", () => {
      const uniqueId = new Date().getTime();
      cy.visit("/add");
      cy.vueField("Title").type("Automated Testing Tutorial " + uniqueId);
      cy.vueField("Description").type("A really cool tutorial");
      cy.contains("Save").click();

      cy.contains("Tutorials");
      cy.contains("Automated Testing Tutorial " + uniqueId);
    });

    it("can delete an added tutorial", () => {
      var rowCount;
      cy.intercept("GET", "/tutorial/tutorials/userTut/1").as("getAllForUser");
      cy.visit("/tutorials");
      cy.wait("@getAllForUser");
      cy.get("tr").then((rows) => {
        cy.log("beginning row count is " + rows.length);
        rowCount = rows.length;
      });
      cy.get(".mdi-trash-can").first().click();
      cy.get("tr").then((rows) => {
        cy.wrap(rows).should("have.length", rowCount - 1);
      });
    });

    afterEach(() => {
      //   var user = window.localStorage.getItem("user");
      //   var initials = user.fName[0] + user.lName[0];
      //   cy.contains(initials).click();
      //   cy.contains("Logout").click();
      cy.logout();
    });
  });
});
