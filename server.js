const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API CHAT (SIN IA DE PAGO - RESPUESTAS INTELIGENTES LOCALES)
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Mensajes inválidos.' });
  }

  const userMessage = messages[messages.length - 1].content.toLowerCase();

  let reply = "No tengo esa información aún. Intenta preguntar sobre matrícula, horarios o pagos.";

  // 🔥 RESPUESTAS INTELIGENTES (puedes ampliar esto)
  if (userMessage.includes("hola")) {
    reply = "¡Hola! 👋 Soy UniBot. ¿En qué puedo ayudarte?";
  } 
  else if (userMessage.includes("matricula")) {
    reply = "📚 La matrícula se realiza en línea desde el portal estudiantil. Debes estar al día con tus pagos.";
  } 
  else if (userMessage.includes("horario")) {
    reply = "🕒 Puedes consultar tus horarios en el sistema académico ingresando con tu usuario.";
  } 
  else if (userMessage.includes("pago")) {
    reply = "💰 Los pagos se pueden realizar por PSE, banco o en la universidad.";
  }

  res.json({ reply });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 UniBot funcionando en puerto " + PORT);
});
