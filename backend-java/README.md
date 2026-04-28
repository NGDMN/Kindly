# Backend Java — Kindly

Spring Boot. Domínio transacional, API REST, integração com Python e Oracle.

## Divisão

- **Domínio + Persistência + Oracle:** _Neil Goodman_
- **API + Integração:** _Miguel Aguiar Fernandes_

## Stack

- Java 17 (target)
- Spring Boot
- JDBC Oracle (`ojdbc8`)
- Maven
- dotenv-java

## Como rodar

**Pré-requisitos:**
- JDK 17+
- Maven instalado e no PATH
- Arquivo `.env` na raiz do `backend-java/` baseado no `.env.example` da raiz do projeto

**Executar:**
```
mvn spring-boot:run
```
## Estrutura prevista

```
backend-java/
├── pom.xml
├── .env.example
├── src/
│   └── main/
│       ├── java/br/com/fiap/kindly/
│       │   ├── KindlyApplication.java
│       │   ├── config/      # configuração de conexão Oracle
│       │   ├── model/       # entidades (Domínio)
│       │   ├── dao/         # DAOs (Persistência)
│       │   ├── service/     # services de domínio
│       │   ├── controller/  # controllers REST (API)
│       │   ├── dto/         # DTOs (API)
│       │   └── integration/ # cliente HTTP do Python
│       └── resources/
│           └── application.properties
└── README.md
```