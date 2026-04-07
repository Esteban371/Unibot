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
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: messages,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("ERROR IA:", data);
      return res.status(500).json({
        error: data?.error?.message || "Error en IA"
      });
    }

   const reply = data.choices?.[0]?.message?.content || "Sin respuesta";

  } catch (error) {
    console.error("ERROR SERVIDOR:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// FRONTEND
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
console.log("API KEY:", process.env.GROQ_API_KEY);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 UniBot activo en puerto " + PORT);
});
