const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

/**
 * @swagger
 * tags:
 *   name: Produits
 *   description: Gestion des produits
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Récupère tous les produits
 *     tags: [Produits]
 *     responses:
 *       200:
 *         description: Liste des produits
 */
router.get('/', productController.getAllProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Récupère un produit par ID
 *     tags: [Produits]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du produit
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produit trouvé
 *       404:
 *         description: Produit non trouvé
 */
router.get('/:id', productController.getProductById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Créer un nouveau produit (admin uniquement)
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               inStock:
 *                 type: boolean
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Produit créé
 *       403:
 *         description: Accès refusé
 */
router.post('/', auth, isAdmin, productController.createProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Met à jour un produit (admin uniquement)
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du produit à modifier
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               inStock:
 *                 type: boolean
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Produit mis à jour
 *       404:
 *         description: Produit non trouvé
 */
router.put('/:id', auth, isAdmin, productController.updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Supprime un produit (admin uniquement)
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du produit à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produit supprimé
 *       404:
 *         description: Produit non trouvé
 */
router.delete('/:id', auth, isAdmin, productController.deleteProduct);

module.exports = router;
