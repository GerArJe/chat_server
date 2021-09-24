const { io } = require('../index');
const { checkJWT } = require('../helpers/jwt');
const {
  userConnected,
  userDisconnected,
  saveMessage,
} = require('../controllers/socket');

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

  client.join(uid);

  client.on('personal-message', async (payload) => {
    await saveMessage(payload);
    io.to(payload.to).emit('personal-message', payload);
  });

  client.on('disconnect', () => {
    userDisconnected(uid);
  });
});
