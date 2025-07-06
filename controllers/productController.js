const Product = require('../models/productModel');

// Récupérer tous les produits avec option de filtrage par catégorie et tri
exports.getAllProducts = async (req, res) => {
  try {
    const { category, sort = 'asc' } = req.query;
    const sortOrder = sort === 'desc' ? -1 : 1;

    const filter = category ? { category } : {};
    const products = await Product.find(filter).sort({ category: sortOrder });

    if (category && products.length === 0) {
      return res.status(404).json({ code: 404, message: `Aucun produit trouvé pour la catégorie "${category}"` });
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ code: 500, message: 'Erreur serveur', error: err.message });
  }
};

// Récupérer un produit par ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      
      return res.status(404).json({ code: 404, message: 'Produit non trouvé' });
    }
    
    res.status(200).json(product);
  } catch (err) {
   
    res.status(400).json({ code: 400, message: 'ID invalide', error: err.message });
  }
};

// Créer un nouveau produit
exports.createProduct = async (req, res) => {
  const { name, description, price, inStock, category } = req.body;

  try {
    const product = await Product.create({ name, description, price, inStock, category });
    res.status(201).json({ code: 201, message: 'Produit créé avec succès', product });
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
};

// Mettre à jour un produit existant
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ code: 404, message: 'Produit non trouvé' });
    }
    res.status(200).json({ code: 200, message: 'Produit mis à jour avec succès', product: updated });
  } catch (err) {
    res.status(400).json({ code: 400, message: 'ID invalide ou données incorrectes', error: err.message });
  }
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ code: 404, message: 'Produit non trouvé' });
    }
    res.status(200).json({ code: 200, message: 'Produit supprimé avec succès' });
  } catch (err) {
    res.status(400).json({ code: 400, message: 'ID invalide', error: err.message });
  }
};
