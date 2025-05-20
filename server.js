const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();
const cors = require('cors');


console.log('Caminho do db.json:', path.join(__dirname, 'db.json'));

server.use((req, res, next) => {
  console.log('Dados do banco:', router.db.getState());
  next();
});

server.use(jsonServer.bodyParser);
server.use(cors()); 

server.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const user = router.db.get('users').find({ email, senha }).value();

  if (user) {
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.senha;
    res.status(200).json({ message: 'Login bem-sucedido', user: userWithoutPassword });
  } else {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

server.use(router); 

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});