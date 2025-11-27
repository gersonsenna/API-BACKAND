const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const Contato = require("../models/contatoModel");

let mongoServer;
let token;
let usuarioId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("API de Contatos", () => {

  test("Registrar usuário", async () => {
    const res = await request(app)
      .post("/api/contatos/registrar")
      .send({
        nome: "Senna",
        email: "senna@gmail.com",
        telefone: "61999999999",
        senha: "123456",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  test("Login do usuário", async () => {
    const res = await request(app)
      .post("/api/contatos/login")
      .send({
        email: "senna@gmail.com",
        senha: "123456",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");

    token = res.body.token;

    const usuario = await Contato.findOne({ email: "senna@gmail.com" });
    usuarioId = usuario._id.toString();
  });

  test("Listar contatos (rota protegida)", async () => {
    const res = await request(app)
      .get("/api/contatos")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Buscar contato por ID", async () => {
    const res = await request(app)
      .get(`/api/contatos/${usuarioId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", "senna@gmail.com");
  });

  test("Atualizar contato", async () => {
    const res = await request(app)
      .put(`/api/contatos/${usuarioId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        telefone: "61911111111",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("mensagem", "Contato atualizado");
  });

  test("Excluir contato", async () => {
    const res = await request(app)
      .delete(`/api/contatos/${usuarioId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });

  test("Acesso sem token deve falhar", async () => {
    const res = await request(app)
      .get("/api/contatos");

    expect(res.statusCode).toBe(401);
  });

  test("Token inválido deve falhar", async () => {
    const res = await request(app)
      .get("/api/contatos")
      .set("Authorization", "Bearer TOKEN_ERRADO");

    expect(res.statusCode).toBe(401);
  });

});
