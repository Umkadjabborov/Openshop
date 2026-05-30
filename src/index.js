require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Openshop backend is running' });
});

app.use('/products', productsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
