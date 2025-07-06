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
      return res.status(400).json({
        code: 400,
        message: 'Compte déjà existant'
      });
    }

    let userRole = 'user';

    if (role && ['user', 'admin'].includes(role)) {
      userRole = role;
    }

    // Crée l'utilisateur avec le rôle défini
    const newUser = await User.create({ email, password, role: userRole });

    return res.status(201).json({
      code: 201,
      message: 'Compte créé avec succès',
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};


// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        code: 401,
        message: 'Email ou mot de passe invalide'
      });
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user.toObject();

    return res.status(200).json({
      code: 200,
      message: 'Connexion réussie',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    return res.status(500).json({
      code: 500,
      message: 'Erreur interne du serveur'
    });
  }
};

