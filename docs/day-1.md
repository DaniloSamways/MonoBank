# PADRÕES GLOBAIS

## Headers obrigatórios (HTTP)

- Authorization: Bearer <JWT> (Onde for obrigatório)
- X-Correlation-Id: <uuid>
  - Se não vier, o API Gateway/serviço gera.
  - Deve ser propagado em TODAS as chamadas internas e eventos.
- Idempotency-Key: <string>
  - Obrigatório apenas no endpoint de criação de transferência.

## Padronização de eventos (Kafka)

Todo evento publicado deve seguir o seguinte formato:

```
{
    "event_id": "uuid",
    "event_type": "tx.created",
    "occurred_at": "2026-01-19T20:00:00.000Z",
    "producer": "transaction-service",
    "correlation_id": "uuid",
    "causation_id": "uuid-or-null",
    "data": {}
}
```

- correlation_id: vem do request inicial (ou gerado)
- causation_id: o event_id que causou esse evento (quando for cadeia)

## Regras de negócio globais

G1 — Ledger append-only: lançamento nunca é editado/deletado.

G2 — Saldo não negativo: debitar só se houver saldo.

G3 — Idempotência: Idempotency-Key + payload igual = mesma resposta; payload diferente = 409.

G4 — Consistência por transação: cada serviço garante atomicidade dentro do seu banco.

G5 — Consumidores idempotentes: se evento repetir, não duplica efeito.

# Serviços do MVP (responsabilidades)

## 1. Auth Service

Responsável por:

- cadastro/login
- JWT + refresh
- publicar user.created

## 2. Account Service

Responsável por:

- conta bancária do usuário
- leitura de saldo (via ledger)
- registrar lançamentos (ledger)

## 3. Transaction Service

Responsável por:

- criar transferências
- idempotência + status
- publicar eventos tx.created, tx.confirmed, tx.failed

## 4. Notification Service

Responsável por:

- consumir eventos tx.\*
- gerar notificação (mock/log)
- idempotência por event_id

# Contrato de API — Endpoints do MVP

## Auth Service

### 1) POST /v1/auth/register

Request

```
{ "name": "Danilo", "email": "danilo@email.com", "password": "Senha123" }
```

Response 201

```
{ "user_id": "uuid" }
```

Publica Kafka: user.created

### 2) POST /v1/auth/login

Request

```
{ "email": "danilo@email.com", "password": "Senha123" }
```

Response 200

```
{ "access_token": "...", "refresh_token": "..." }
```

### 3) POST /v1/auth/refresh

Request

```
{ "refresh_token": "..." }
```

Response 200

```
{ "access_token": "...", "refresh_token": "..." }
```

### 4) GET /v1/auth/me

Auth: Bearer JWT

Response 200

```
{ "user_id": "uuid", "name": "Danilo", "email": "danilo@email.com" }
```

## Account Service

### 1) GET /v1/accounts/me

Retorna a conta principal do usuário

Auth: Bearer JWT

Response 200

```
{
  "account_id": "uuid",
  "status": "ACTIVE",
  "currency": "BRL"
}
```

### 2) GET /v1/accounts/me/balance

Auth: Bearer JWT

Response 200

```
{
  "account_id": "uuid",
  "balance": 10000,
  "currency": "BRL",
  "as_of": "2026-01-19T20:00:00.000Z"
}
```

### 3) GET /v1/accounts/me/statement?limit=20

Auth: Bearer JWT

Response 200

```
{
  "account_id": "uuid",
  "items": [
    {
      "entry_id": "uuid",
      "transaction_id": "uuid",
      "type": "DEBIT",
      "amount": 500,
      "balance_after": 9500,
      "description": "Transfer to ...",
      "created_at": "..."
    }
  ]
}
```

## Transaction Service

### 1) POST /v1/transactions/transfers

Headers

- Idempotency-Key: <string>
- X-Correlation-Id: <uuid> (ou o serviço gera)
- Authorization: Bearer JWT

Request

```
{
  "from_account_id": "uuid",
  "to_account_id": "uuid",
  "amount": 500,
  "currency": "BRL",
  "description": "Pix fake"
}
```

Response 201 (exemplo)

```
{
  "transaction_id": "uuid",
  "status": "PENDING"
}
```

**Regras**

- amount > 0
- from != to
- se saldo insuficiente → 422 INSUFFICIENT_FUNDS
- idempotência conforme regra global

**Publica Kafka**

- tx.created (ao criar)
- depois tx.confirmed ou tx.failed

### 2) GET /v1/transactions/{transaction_id}

Bearer JWT

Response 200

```
{
  "transaction_id": "uuid",
  "status": "CONFIRMED",
  "amount": 500,
  "from_account_id": "uuid",
  "to_account_id": "uuid",
  "created_at": "...",
  "updated_at": "..."
}
```

## Notification Service

### 1) GET /v1/notifications/me?limit=20

Bearer JWT

Response 200

```
{
  "items": [
    { "id": "uuid", "type": "TX_CONFIRMED", "message": "Transferência confirmada", "created_at": "..." }
  ]
}
```

# Contrato Kafka — Eventos do MVP

## user.created

**event_type**: user.created

**producer**: auth-service

**data**

```
{
  "user_id": "uuid",
  "email": "danilo@email.com",
  "name": "Danilo"
}
```

## tx.created

**event_type**: tx.created

**producer**: transaction-service

**data**

```
{
  "transaction_id": "uuid",
  "from_account_id": "uuid",
  "to_account_id": "uuid",
  "amount": 500,
  "currency": "BRL",
  "description": "Pix fake"
}
```

## tx.confirmed

**event_type**: tx.confirmed

**producer**: transaction-service

**data**

```
{ "transaction_id": "uuid" }
```

## tx.failed

**event_type**: tx.failed

**producer**: transaction-service

**data**

```
{ "transaction_id": "uuid", "reason": "INSUFFICIENT_FUNDS" }
```

# Regras mínimas do Ledger (Account Service)

**LedgerEntry**
Campos obrigatórios:

- entry_id
- account_id
- transaction_id
- type (DEBIT/CREDIT)
- amount
- balance_after
- created_at

**Regras**

- append-only
- unicidade: (account_id, transaction_id, type) único
- saldo = último balance_after
