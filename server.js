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
function responderLocal(mensaje, historial) {
  mensaje = mensaje.toLowerCase();

  const ultimo = historial[historial.length - 2]?.content?.toLowerCase() || "";

  // SALUDO
  if (mensaje.includes("hola") || mensaje.includes("buenas")) {
    return "¡Hola! 👋 Soy UniBot de Unicomfacauca. ¿En qué puedo ayudarte?";
  }

  // PAGOS
  if (mensaje.includes("pago") || mensaje.includes("costos")) {
    return "💰 Métodos de pago:\n- PSE\n- Banco\n- Caja universidad\n\n¿Quieres saber fechas de pago?";
  }

  // SI responde después de pagos
  if ((mensaje === "si" || mensaje === "sí") && ultimo.includes("pago")) {
    return "📅 Fechas de pago:\n\n- Primer corte: 10 de cada mes\n- Segundo corte: 20 de cada mes\n\nEvita recargos pagando antes de la fecha límite.";
  }

  // MATRÍCULA
  if (mensaje.includes("matricula")) {
    return "📚 Matrícula:\n1. Ingresa al portal\n2. Selecciona materias\n3. Genera recibo\n4. Realiza el pago\n\n¿Necesitas ayuda con algún paso?";
  }

  // SI después de matrícula
  if ((mensaje === "si" || mensaje === "sí") && ultimo.includes("matrícula")) {
    return "👉 Para matricularte necesitas:\n\n- Usuario activo\n- No tener deudas\n- Haber aprobado prerequisitos\n\n¿En qué paso estás?";
  }

  // CARRERAS
  if (mensaje.includes("carreras") || mensaje.includes("programas")) {
    return "🎓 Programas:\n- Ingeniería de Sistemas\n- Administración de Empresas\n- Contaduría Pública\n- Derecho\n\n¿Quieres info de alguna carrera?";
  }

  return null;
} // 👈 importante
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
