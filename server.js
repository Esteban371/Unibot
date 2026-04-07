const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API CHAT
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Mensajes inválidos' });
  }

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
        messages: messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("ERROR IA:", data);
      return res.status(500).json({
        error: data?.error?.message || "Error en IA"
      });
    }

    const reply = data.content?.[0]?.text || "Sin respuesta";
    res.json({ reply });

  } catch (error) {
    console.error("ERROR SERVIDOR:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// FRONTEND
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 UniBot activo en puerto " + PORT);
});
