const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post("/download", (req, res) => {
  const tweetUrl = req.body.url;

  if (!tweetUrl || (!tweetUrl.includes("twitter.com") && !tweetUrl.includes("x.com"))) {
    return res.status(400).json({ error: "URL inválida do Twitter" });
  }

  const command = `./yt-dlp -f best -g "${tweetUrl}"`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("Erro ao executar yt-dlp:", stderr);
      return res.status(500).json({ error: "Erro ao processar o vídeo" });
    }

    const videoUrl = stdout.trim();

    console.log("URL retornada pelo yt-dlp:", videoUrl); // <== DEBUG

    if (!videoUrl) {
      return res.status(500).json({ error: "Nenhuma URL de vídeo encontrada." });
    }

    res.json({ videoUrl });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});