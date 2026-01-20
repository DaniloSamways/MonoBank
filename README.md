# 🏦 MonoBank — Digital Bank (Engineering Project)

> Projeto de Banco Digital fictício focado em engenharia de software real: microsserviços, event-driven, alta confiabilidade, observabilidade e boas práticas usadas em fintechs.

Este projeto foi criado com o objetivo de simular a arquitetura e os desafios técnicos de um banco digital moderno, priorizando **corretude, escalabilidade e rastreabilidade**, mais do que apenas funcionalidades visuais.

---

## 🎯 Objetivo

Construir uma plataforma de banco digital com:

- Arquitetura de microsserviços
- Comunicação orientada a eventos (Kafka)
- Processamento financeiro com idempotência e ledger
- Observabilidade e rastreabilidade
- Deploy cloud-ready (AWS)
- Código limpo, testável e manutenível

Projeto desenvolvido como **portfólio técnico**

---

## 🧩 Arquitetura Geral

A plataforma é composta por microsserviços independentes organizados em **monorepo**, comunicando-se por HTTP e eventos Kafka.

### Serviços do MVP

| Serviço              | Responsabilidade                             |
| -------------------- | -------------------------------------------- |
| Auth Service         | Autenticação, autorização e identidade       |
| Account Service      | Gestão de contas bancárias e saldo (ledger)  |
| Transaction Service  | Processamento de transferências financeiras  |
| Notification Service | Consumo de eventos e notificações            |
| Shared Kernel        | Logger, erros, correlation, contratos comuns |

---

## 🏗️ Stack Tecnológica

### Backend

- **Node.js + TypeScript**
- **Express.js**
- **TypeORM**
- **PostgreSQL**
- **Redis**
- **Kafka**

### Infra / DevOps

- Docker & Docker Compose
- AWS (EC2, RDS, S3, etc – previsto)
- CI/CD (em evolução)

### Observabilidade

- Logs estruturados (Pino)
- Correlation ID
- Tracing distribuído (futuro)
- Métricas (Prometheus – futuro)

---

## ▶️ Como rodar o projeto

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- npm

### Passo a passo

Suba a infraestrutura local (Postgres, Redis e Kafka):

```bash
cd infra
docker compose up -d
```

Instale as dependências na raiz do projeto:

```bash
npm install
```

Compile o shared kernel:

```bash
npm -w libs/shared run build
```

Inicie o Auth Service:

```bash
npm run dev:auth
```

Teste o serviço:

```bash
GET http://localhost:3001/health
```

> Os demais serviços serão adicionados progressivamente.
