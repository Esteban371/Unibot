const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🔥 RESPUESTAS LOCALES INTELIGENTES
function responderLocal(mensaje) {
  mensaje = mensaje.toLowerCase();

  if (mensaje.includes("hola") || mensaje.includes("buenas")) {
    return "¡Hola! 👋 Soy UniBot. ¿En qué puedo ayudarte hoy?";
  }

  if (mensaje.includes("matricula") || mensaje.includes("inscripción")) {
    return "📚 Matrícula:\n1. Entra al portal\n2. Selecciona materias\n3. Genera recibo\n4. Paga\n\n¿Quieres ayuda con esto?";
  }
if (mensaje.includes("contacto")) {
  return "📞 Puedes comunicarte con la universidad:\n\n- Teléfono: (602) XXX XXX\n- Email: info@unicomfacauca.edu.co\n- Web: www.unicomfacauca.edu.co";
}
  if (mensaje.includes("horario")) {
    return "🕒 Puedes ver tus horarios en el sistema académico con tu usuario.";
  }

  if (mensaje.includes("pago") || mensaje.includes("costos")) {
    return "💰 Métodos de pago:\n- PSE\n- Banco\n- Caja universidad\n\n¿Quieres fechas?";
  }

  if (mensaje.includes("carreras")) {
    return "🎓 Carreras:\n- Sistemas\n- Administración\n- Contaduría\n- Derecho\n\n¿Quieres detalles?";
  }

  return null; // 👈 importante
}

// 🔥 API CHAT
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  const userMessage = messages[messages.length - 1].content;

  // 1️⃣ intentar respuesta local
  const local = responderLocal(userMessage);
  if (local) {
    return res.json({ reply: local });
  }

  // 2️⃣ fallback IA GRATIS (Groq)
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "Eres UniBot, asistente universitario en Colombia. Responde claro, útil y en español."
          },
          ...messages
        ]
      })
    });

    const data = await response.json();

    const reply = data?.choices?.[0]?.message?.content || "No pude responder eso 😅";

    res.json({ reply });

  } catch (error) {
    console.error(error);

    res.json({
      reply: "⚠️ No tengo esa info exacta ahora, pero puedo ayudarte con matrícula, horarios, pagos o carreras 😉"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 UniBot NIVEL DIOS en puerto " + PORT);
});
