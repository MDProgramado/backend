const jsonServer = require('json-server');
const path = require('path'); // 
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json')); // ✅
const middlewares = jsonServer.defaults();
const cors = require('cors');

server.use(jsonServer.bodyParser); 


const allowedOrigins = [
  'http://localhost:4200', 
  'https://testflow-app-mu.vercel.app/login' 
];

server.use(cors({
  origin: function (origin, callback) {

    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'A política CORS para este site não permite acesso a partir da origem especificada.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204 
}));



server.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const db = router.db; 
   
  const user = db.get('users').find({ email: email, senha: senha }).value();

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
  console.log(`JSON Server está rodando na porta ${PORT}`);
});