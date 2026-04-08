const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SYSTEM_PROMPT = `Eres UniBot, el asistente virtual oficial de la Corporación Universitaria Comfacauca (Unicomfacauca), ubicada en Popayán, Cauca, Colombia.

Tu rol es orientar a estudiantes, aspirantes y comunidad académica sobre:
- Programas académicos: Ingeniería en Sistemas, Contaduría Pública, Administración de Empresas, Licenciaturas, Tecnologías y demás programas.
- Procesos de admisión, matrícula y renovación de matrícula.
- Reglamento estudiantil: derechos, deberes, sanciones, calificaciones.
- Servicios institucionales: bienestar universitario, biblioteca, sistemas, oficina de graduados.
- Información general: misión, visión, acreditaciones, sedes.
- Calendario académico y fechas importantes.

Comportamiento:
- Siempre responde en español, tono amable y profesional.
- Usa viñetas cuando sea útil.
- Si no tienes información específica, orienta a contactar la institución o visitar www.comfacauca.com.
- Si preguntan algo fuera del contexto universitario, redirige amablemente.
- Termina siempre invitando a seguir preguntando.`;

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Mensajes inválidos.' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error Groq:', data);
      return res.status(response.status).json({ error: data?.error?.message || 'Error de API' });
    }

    const reply = data.choices?.[0]?.message?.content || 'No pude generar una respuesta.';
    res.json({ reply });

  } catch (err) {
    console.error('Error servidor:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`UniBot corriendo en puerto ${PORT}`));
