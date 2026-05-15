const app = require('./src/app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║   🚀 DevLog Server Berjalan!         ║
  ║   Port: ${PORT}                          ║
  ║   URL:  http://localhost:${PORT}         ║
  ╚══════════════════════════════════════╝
  `);
});
