const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Génération du token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, 
    process.env.JWT_SECRET,
    { expiresIn: '48h' }
  );
};

// Inscription
exports.register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Compte déjà existant' });
    }

    let userRole = 'user';

    if (role && ['user', 'admin'].includes(role)) {
      userRole = role;
    }

    // Crée l'utilisateur avec le rôle défini
    await User.create({ email, password, role: userRole });

    res.status(201).json({ message: 'Compte créé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


// Connexion
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Email ou mot de passe invalide' });
  }

  const token = generateToken(user);
// Exclure le mot de passe de la résponse
  const { password: _, ...userWithoutPassword } = user.toObject();

  res.json({
    token,
    user: userWithoutPassword
  });
};
