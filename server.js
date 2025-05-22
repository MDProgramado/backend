const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const cors = require('cors');

server.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      /https?:\/\/localhost(:\d+)?/, 
      /https:\/\/(.+\.)?vercel\.app$/, 
      /https:\/\/testflow-app-seven\.vercel\.app$/
    ];
    
    if (!origin || allowedOrigins.some(regex => regex.test(origin))) {
      callback(null, true);
    } else {
      console.error('Bloqueado por CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));


server.use(jsonServer.bodyParser);


server.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Max-Age', '86400');
  res.sendStatus(204);
});


server.use((req, res, next) => {
  console.log('Dados do db.json:', router.db.getState());
  next();
});


server.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const user = router.db.get('users').find({ email, senha }).value();

  if (user) {
    const { senha: _, ...userWithoutPassword } = user;
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