const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(morgan('dev'));
app.use(cors());

const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send("Roll over to /test to see it it's working or not");
});

app.get('/test', (req, res) => {
  res.json({ status: 'Working!' });
});

app.listen(port, () => {
  console.log(`Backend is running on PORT: ${port}`);
});
