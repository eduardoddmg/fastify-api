# API com Fastify, Prisma e TypeScript

Este é um projeto de API RESTful construído com um stack moderno e robusto, focado em performance, segurança e boas práticas de desenvolvimento. A API fornece funcionalidades para gerenciamento de usuários (registro/login) e tarefas (CRUD), com autenticação baseada em JWT e documentação automática com Swagger.

## ✨ Funcionalidades Principais

- **⚡ Performance:** Construído sobre o Fastify, um dos frameworks web mais rápidos para Node.js.
- **🔒 Autenticação:** Sistema completo de registro e login de usuários com senhas hasheadas (Bcrypt) e autenticação de rotas via JWT (JSON Web Tokens).
- **✅ Validação Robusta:** Validação de dados de entrada com **Zod**, garantindo que apenas dados válidos cheguem à lógica de negócio.
- **🔧 ORM Moderno:** Integração com **Prisma** para uma interação segura e tipada com o banco de dados (configurado para SQLite).
- **📄 Documentação Automática:** Geração de documentação interativa com **Swagger (OpenAPI)** a partir dos próprios esquemas de validação do Zod.
- **📝 CRUD Completo:**
  - `/user`: Rotas para registro (`/register`) e login (`/login`).
  - `/tasks`: CRUD completo (Create, Read, Update, Delete) para tarefas, com rotas protegidas por autenticação.
- **🔍 Funcionalidades Avançadas:** Listagem de tarefas com suporte para **paginação**, **busca por texto** e **filtro por status**.

## 🛠️ Stack de Tecnologias

- **Framework:** [Fastify](https://fastify.io/) 🚀
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) 🔵
- **ORM:** [Prisma](https://www.prisma.io/) 🅿️
- **Banco de Dados:** [SQLite](https://www.sqlite.org/index.html) 💾
- **Validação:** [Zod](https://zod.dev/) ✅
- **Documentação:** [Swagger (OpenAPI)](https://swagger.io/) 📄
- **Autenticação:** [JWT](https://jwt.io/) & [Bcrypt](https://www.npmjs.com/package/bcrypt) 🔑

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

- [Node.js](https://nodejs.org/en/) (v18 ou superior recomendado)
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

## 🚀 Começando

Siga os passos abaixo para configurar e rodar o projeto localmente.

**1. Clone o repositório**

```bash
git clone [https://github.com/seu-usuario/fastify-api.git](https://github.com/seu-usuario/fastify-api.git)
cd fastify-api
```
