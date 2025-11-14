const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

describe("Rotas de Tarefas", () => {
  let token;

  beforeAll(() => {
    token = "Bearer " + process.env.TEST_TOKEN;
  });

  it("GET /tarefas deve retornar 200", async () => {
    const res = await request(app).get("/tarefas");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /tarefas deve retornar 201", async () => {
    const res = await request(app)
      .post("/tarefas")
      .set("Authorization", token)
      .send({ titulo: "Test Tarefa", descricao: "Descrição teste" });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
  });
});
