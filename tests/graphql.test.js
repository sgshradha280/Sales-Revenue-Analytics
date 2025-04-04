const request = require("supertest");
const app = require("../server"); // Import your Express app

describe("GraphQL API Tests", () => {
  it("should fetch customer spending", async () => {
    const query = `
      query {
        getCustomerSpending(customerId: "63f8b3d5a7b1d7f3b0a2c5e1") {
          totalSpent
          averageOrderValue
        }
      }
    `;
    
    const response = await request(app)
      .post("/graphql")
      .send({ query });

    expect(response.status).toBe(200);
    expect(response.body.data.getCustomerSpending).toHaveProperty("totalSpent");
  });
});
