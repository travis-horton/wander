import http from 'http';
import express from 'express';
import path from 'path';

const app = express();
const server = http.Server(app);
const port = 80;

server.listen(port, () => {
  console.log(`Wander server listening on ${port}`);
});

app.use(express.static('static'));

app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});
