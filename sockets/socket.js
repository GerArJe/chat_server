const { io } = require('../index');
const { checkJWT } = require('../helpers/jwt');

// Mensajes de Sockets
io.on('connection', (client) => {
  console.log('Cliente conectado');

  const [valid, uid] = checkJWT(client.handshake.headers['x-token']);

  if (!valid) {
    return client.disconnect();
  }
  
  console.log('Client authenticated');

  client.on('disconnect', () => {
    console.log('Cliente desconectado');
  });

  // client.on('mensaje', ( payload ) => {
  //     console.log('Mensaje', payload);

  //     io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

  // });
});
