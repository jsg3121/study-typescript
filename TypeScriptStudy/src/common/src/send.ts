import amqp from 'amqplib/callback_api';

amqp.connect("amqp://localhost", (err0, connection) => {
  if (err0) {
    throw err0;
  }

  connection.createChannel((err1, channel) => {
    if (err1) {
      throw err1;
    }

    let queue = "hello";
    let msg = "connect";

    channel.assertQueue(queue, {
      durable: false,
    });

    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(`1[x] Sent %s ${msg}`);
  });
});
