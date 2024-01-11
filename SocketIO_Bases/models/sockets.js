class Sockets {
  constructor(io) {
    this.io = io;

    this.socketEvents();
  }

  socketEvents() {
    this.io.on('connection', socket => {
      console.log(chalk.yellow('Client connected'));

      socket.on('message_to_server', payload => {
        console.log(payload);

        this.io.emit('message_from_server', payload);
      });
    });
  }
}

module.exports = Sockets;
