const { io } = require('../index');
const { checkJWT } = require('../helpers/jwt');
const { userConnected, userDisconnected } = require('../controllers/socket');

// Mensajes de Sockets
io.on('connection', (client) => {
  console.log('Cliente conectado');

  const [valid, uid] = checkJWT(client.handshake.headers['x-token']);

  // Verify authentication
  if (!valid) {
    return client.disconnect();
  }

  // Cli authenticated
  userConnected(uid);

  client.on('disconnect', () => {
    userDisconnected(uid);
  });

  // client.on('mensaje', ( payload ) => {
  //     console.log('Mensaje', payload);

  //     io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

  // });
});
