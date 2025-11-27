const supertest = require("supertest");
const app = require("../app");
const Contato = require("../models/contatoModel");

const request = supertest(app);
const url = "/api/contatos";

let id = null;
let token = null;

beforeAll(async () => {
  // Limpa o banco antes dos testes
  await Contato.deleteMany({});

  // Cria um usuário para login
  await request.post(url).send({
    nome: "Senna",
    email: "senna@test.com",
    telefone: "9999-9999",
    senha: "123456"
  });

  // Faz login e pega token
  const response = await request.post("/api/login").send({
    email: "senna@test.com",
    senha: "123456"
  });

  token = response.body.token;
});

describe("CRUD Contatos com JWT", () => {

  test("POST / deve retornar 201", async () => {
    const response = await request.post(url)
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "Novo Contato",
        email: "novo@test.com",
        telefone: "8888-8888",
        senha: "123456"
      });

    expect(response.status).toBe(201);
    expect(response.body.contato).toBeDefined();
    expect(response.body.contato._id).toBeDefined();

    id = response.body.contato._id;
  });

  test("POST / deve retornar 422 (faltando dados)", async () => {
    const response = await request.post(url)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(422);
    expect(response.body.msg).toBe("Campos obrigatórios");
  });

  test("GET / deve retornar 200", async () => {
    const response = await request.get(url)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /id deve retornar 200", async () => {
    const response = await request.get(`${url}/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(id);
  });

  test("GET /id deve retornar 400 (ID inválido)", async () => {
    const response = await request.get(`${url}/0`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("ID inválido");
  });

  test("GET /id deve retornar 404 (não encontrado)", async () => {
    const response = await request.get(`${url}/000000000000000000000000`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("Contato não encontrado");
  });

  test("PUT /id deve retornar 200", async () => {
    const response = await request.put(`${url}/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Contato Atualizado" });

    expect(response.status).toBe(200);
    expect(response.body.contato.nome).toBe("Contato Atualizado");
  });

  test("PUT /id deve retornar 400", async () => {
    const response = await request.put(`${url}/0`)
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Teste" });

    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("ID inválido");
  });

  test("PUT /id deve retornar 404", async () => {
    const response = await request.put(`${url}/000000000000000000000000`)
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Teste" });

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("Contato não encontrado");
  });

  test("DELETE /id deve retornar 204", async () => {
    const response = await request.delete(`${url}/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  test("DELETE /id deve retornar 400", async () => {
    const response = await request.delete(`${url}/0`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("ID inválido");
  });

  test("DELETE /id deve retornar 404", async () => {
    const response = await request.delete(`${url}/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

});
