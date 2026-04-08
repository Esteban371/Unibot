const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🧠 RESPUESTAS INTELIGENTES
function responderLocal(mensaje, historial) {
  mensaje = mensaje.toLowerCase();

  const ultimo = historial.length > 1
    ? historial[historial.length - 2].content.toLowerCase()
    : "";

  // SALUDO
  if (mensaje.includes("hola") || mensaje.includes("buenas")) {
    return "¡Hola! 👋 Soy UniBot. ¿En qué puedo ayudarte?";
  }

  // PAGOS
  if (mensaje.includes("pago")) {
    return "💰 Métodos de pago:\n- PSE\n- Banco\n- Caja universidad\n\n¿Quieres saber fechas?";
  }

  // RESPUESTA SI (PAGOS)
  if ((mensaje === "si" || mensaje === "sí") && ultimo.includes("pago")) {
    return "📅 Fechas de pago:\n- 10 de cada mes\n- 20 de cada mes\n\nEvita recargos pagando a tiempo.";
  }

  // HORARIOS
  if (mensaje.includes("horario")) {
    return "🕒 Puedes consultar tus horarios en el sistema académico con tu usuario.";
  }

  // CARRERAS
  if (mensaje.includes("carrera") || mensaje.includes("programa")) {
    return "🎓 Carreras disponibles:\n- Ingeniería de Sistemas\n- Administración\n- Contaduría\n- Derecho\n\n¿Quieres detalles?";
  }

  return null;
}

// 🔥 API CHAT
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Mensajes inválidos.' });
  }

  const userMessage = messages[messages.length - 1].content;

  // 🔥 INTENTA RESPUESTA LOCAL
  const local = responderLocal(userMessage, messages);

  if (local) {
    return res.json({ reply: local });
  }

  // 🔥 FALLBACK (SI NO SABE)
  return res.json({
    reply: "🤖 Aún estoy aprendiendo. Puedes preguntarme sobre:\n- Pagos\n- Horarios\n- Carreras\n- Matrícula"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 UniBot funcionando en puerto " + PORT);
});
