import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { runChat } from './chat.js';
import cors from 'cors';
import { iniChat } from './iniChat.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());  
/*app.use(cors({
  origin: 'https://chatbot-blue-six.vercel.app/',
}));
*/

app.use(express.json());
app.use('/static', express.static(join(__dirname, 'static'), { extensions: ['css', 'svg', 'js'] }));
  
app.get('/', (req, res) => {
  iniChat()
  res.sendFile(join(__dirname, 'templates', 'chat.html'));
});

app.post('/chat', async (req, res) => {
  try {
    const mensagem = req.body?.mensagem;
    console.log('Mensagem do usuário', mensagem)

    if (!mensagem) {
      return res.status(400).json({ error: 'Erro no corpo da requisição' });
    }
    const response = await runChat(mensagem);
    res.json({ response });

  } catch (error) {
    console.error('Error no endpoint do chat:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
