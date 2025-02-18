const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const router = express.Router();

// Get cart for a specific user
router.get('/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Add a product to the cart
router.post('/add', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }

        const existingProduct = cart.products.find(p => p.productId.toString() === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Update product quantity in cart
router.put('/update', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const product = cart.products.find(p => p.productId.toString() === productId);
        if (product) {
            product.quantity = quantity;
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Remove a product from the cart
router.delete('/remove', async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.products = cart.products.filter(p => p.productId.toString() !== productId);
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Clear the cart
router.delete('/clear/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.products = [];
        await cart.save();
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
