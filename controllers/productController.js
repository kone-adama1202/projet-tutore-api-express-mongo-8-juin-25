const Product = require('../models/productModel');

exports.getAllProducts = async (req, res) => {
  try {
    const { category, sort = 'asc' } = req.query;
    const sortOrder = sort === 'desc' ? -1 : 1;

    // Tri par nom de catégorie
    const filter = category ? { category } : {};
    const products = await Product.find(filter).sort({ category: sortOrder });
    
    if (category && products.length === 0) {
      return res.status(404).json({ message: `Aucun produit trouvé pour la catégorie "${category}"` });
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};


//  Récupérer un produit par son ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); 
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json(product); 
  } catch {
    res.status(400).json({ message: 'ID invalide' }); 
  }
};

// 🔹 Créer un nouveau produit
// Créer un nouveau produit
exports.createProduct = async (req, res) => {
  const { name, description, price, inStock, category } = req.body;

  try {
    const product = await Product.create({ name, description, price, inStock, category });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Mettre à jour un produit existant
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }); 
    if (!updated) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json(updated); 
  } catch {
    res.status(400).json({ message: 'ID invalide' }); 
  }
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id); 
    if (!deleted) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json({ message: 'Produit supprimé' }); 
  } catch {
    res.status(400).json({ message: 'ID invalide' }); 
  }
};
