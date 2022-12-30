const amqp = require('amqplib');

class RabbitMQ {
  constructor(queueName) {
    this.queueName = queueName;
    this.options = {
            messageTtl: 1800000,  // 30 minutes in milliseconds
            durable: true,
            autoDelete: true
          };
  }

  async connect(url) {
    if (!this.connection) {
      try {
        this.connection = await amqp.connect(process.env.AMQP_URL);
        this.channel = await this.connection.createChannel();
      } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
      }
    }
  }

  async close() {
    if (this.connection) {
      try {
        await this.channel.close();
        await this.connection.close();
        this.connection = null;
        this.channel = null;
      } catch (error) {
        console.error('Error closing RabbitMQ connection:', error);
      }
    }
  }

  async publish(message) {
    await this.connect();
    try {
      await this.channel.assertQueue(this.queueName, this.options);
      this.channel.sendToQueue(this.queueName, Buffer.from(message));
    } catch (error) {
      console.error('Error publishing to RabbitMQ:', error);
    }
    await this.close();
  }

  async consume(callback) {
    await this.connect();
    try {
      await this.channel.assertQueue(this.queueName, this.options);
      this.channel.consume(this.queueName, (message) => {
        callback(message.content.toString());
        this.channel.ack(message);
      });
    } catch (error) {
      console.error('Error consuming from RabbitMQ:', error);
    }
  }
}

module.exports = RabbitMQ;
