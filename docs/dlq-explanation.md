# Guia de Boas Práticas: Dead-Letter Queue (DLQ)

Este documento descreve o padrão de Dead-Letter Queue (DLQ) e como aplicá-lo em um sistema de microsserviços orientado a eventos para aumentar a resiliência e a confiabilidade.

## O que é uma Dead-Letter Queue (DLQ)?

Uma Dead-Letter Queue (em português, "Fila de Mensagens Mortas") é um padrão de design e um tópico separado para onde as mensagens que um consumidor não consegue processar com sucesso são enviadas. Em vez de deixar uma mensagem problemática travar o sistema ou ser descartada, ela é movida para essa fila para análise e intervenção posterior.

## Por que uma DLQ é Essencial?

Em um sistema distribuído, falhas são inevitáveis. Um consumidor pode falhar por diversos motivos:

- **Bugs no Código:** Uma exceção inesperada durante o processamento.
- **Dados Inválidos ou Malformados:** A mensagem não segue o contrato esperado (uma "poison pill").
- **Falhas em Serviços Externos:** O banco de dados está offline, ou uma API de terceiros está indisponível.

Sem uma estratégia de DLQ, uma única mensagem com falha pode **bloquear o processamento** de uma partição inteira, pois o consumidor tentará reprocessá-la indefinidamente. A DLQ isola a mensagem problemática, permitindo que o sistema continue funcionando normalmente.

## O Fluxo Padrão de uma DLQ

O fluxo de trabalho para lidar com falhas usando uma DLQ é o seguinte:

1.  **Consumo da Mensagem:** Seu serviço consome uma mensagem do tópico principal (ex: `order.created`).

2.  **Tentativa de Processamento:** O serviço tenta executar a lógica de negócio necessária.

3.  **Retries para Falhas Transitórias:** É uma boa prática implementar um mecanismo de retry interno (com backoff exponencial) para falhas que podem ser temporárias (ex: falha de rede). Tente processar a mensagem 2 ou 3 vezes.

4.  **Falha Persistente:** Se a mensagem continua falhando após as tentativas, o serviço a considera uma "mensagem morta".

5.  **Publicação na DLQ:** O consumidor **produz** a mensagem original para um tópico de DLQ dedicado (ex: `order.created.dlq`).

6.  **Enriquecimento da Mensagem:** Ao publicar na DLQ, enriqueça a mensagem com metadados sobre a falha para facilitar a depuração:
    - A mensagem de erro ou a stack trace.
    - O nome do serviço consumidor que falhou.
    - O tópico e a partição originais.
    - O timestamp da falha.

7.  **Commit do Offset Original:** Este é o passo mais importante. Após publicar na DLQ, o consumidor **faz o commit do offset da mensagem no tópico original**. Isso sinaliza ao Kafka que a mensagem foi "tratada" e permite que o consumidor avance para a próxima, evitando o bloqueio.

## Estratégias para Processar Mensagens da DLQ

Uma vez que as mensagens estão na DLQ, elas não devem ser esquecidas. Existem várias estratégias para lidar com elas:

- **Alerta e Monitoramento:** Configure alertas para quando novas mensagens chegarem à DLQ. Isso notifica a equipe de desenvolvimento que há um problema que precisa de atenção.

- **Análise Manual:** Um desenvolvedor pode inspecionar as mensagens na DLQ para entender a causa raiz da falha. Ferramentas como o Kafdrop são úteis para isso.

- **Re-processamento Automatizado:** Crie um serviço separado que consome da DLQ. Ele pode tentar reprocessar as mensagens após uma correção de bug ter sido implantada. Muitas vezes, esse serviço move as mensagens de volta para o tópico original para serem reprocessadas pelo consumidor principal.

- **Descarte:** Se a análise concluir que a mensagem é irrelevante ou incorrigível, ela pode ser descartada.

## Implementação Conceitual no NestJS

Dentro do nosso projeto, a implementação ocorreria no `DeliveryConsumerController` (ou em um serviço que ele chama):

```typescript
// Dentro do método handleOrderCreated

try {
  // 1. Tente executar a lógica de negócio (ex: salvar no DB)
  await this.businessLogicService.process(data);

} catch (error) {
  this.logger.error(`Falha ao processar a mensagem: ${error.message}`, error.stack);

  // 2. Se falhar, publique na DLQ
  // Você precisaria de um KafkaProducer injetado aqui
  await this.kafkaClient.emit('order.created.dlq', {
    originalMessage: data,
    errorDetails: {
      message: error.message,
      service: DeliveryConsumerController.name,
      timestamp: new Date().toISOString(),
    },
  });
}

// 3. O commit do offset da mensagem original acontecerá automaticamente
// ao final da execução do método sem lançar uma exceção.
```

Lembre-se que a lógica de retry interno (passo 3 do fluxo) adicionaria um pouco mais de complexidade a este exemplo, mas a estrutura básica de `try/catch` para enviar à DLQ permanece a mesma.
