# Delivery Kafka Simulator

This project is a microservice to simulate the management of Kafka messaging for a delivery application.

## Description

This microservice is built with [Nest](https://github.com/nestjs/nest) and follows a hexagonal architecture.

The main goal is to provide a well-structured, distributed, and clean code base, with a strong focus on observability.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)

### Installation

1. Clone the repository:

```bash
$ git clone https://github.com/mbnaysinger/delivery-kafka-simulator.git
$ cd delivery-kafka-simulator
```

2. Install the dependencies:

```bash
$ npm install
```

### Running the Application

1. Start the Kafka instance using Docker Compose:

```bash
$ docker-compose up -d
```

2. Start the NestJS application:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Architecture

This project follows a hexagonal architecture, which is divided into three main layers:

- **API Layer**: Contains the REST endpoints, Data Transfer Objects (DTOs), and converters.
- **Domain Layer**: Contains the business logic, models, services, and ports.
- **Infrastructure Layer**: Contains the adapters for external services like Kafka, repositories, entities, and converters.

## Logging

This project uses [Pino](https://getpino.io/) for logging, which is a high-performance logger.

The logs are structured in JSON format for easy parsing and integration with log management tools like Grafana Loki.

During development, the logs are pretty-printed to the console for better readability.

## License

This project is [MIT licensed](LICENSE).