async function sendMessage() {
  const input = document.getElementById("input");
  const text = input.value;

  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          { role: "user", content: text }
        ]
      })
    });

    const data = await res.json();

    console.log("RESPUESTA BACKEND:", data); // 👈 DEBUG

    if (data.reply) {
      addMessage(data.reply, "bot");
    } else {
      addMessage(data, "bot"); // 👈 aquí mostramos TODO
    }

  } catch (error) {
    addMessage("❌ Error de conexión", "bot");
    console.error(error);
  }
}
