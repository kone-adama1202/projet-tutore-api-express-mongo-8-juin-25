const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const { swaggerUi, swaggerSpec } = require('./swagger'); 

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error(' Erreur MongoDB:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Serveur démarré sur http://localhost:${PORT}`));
