const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname));

const SYSTEM_PROMPT = 'Eres UniBot, asistente de Unicomfacauca. Responde claro, profesional y en español.';

// Ruta test
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: "Error en IA" });
    }

    const reply = data.content?.[0]?.text || "Sin respuesta.";
    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error servidor" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 UniBot activo en puerto " + PORT);
});
