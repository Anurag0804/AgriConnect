const Order = require('../models/Order');

// @desc    Get all available orders for vendors
// @route   GET /api/vendors/orders/available
// @access  Private/Vendor
exports.getAvailableOrders = async (req, res) => {
    try {
        // Find orders that are confirmed by the farmer but not yet assigned to a vendor
        const orders = await Order.find({ status: 'confirmed', vendor: null })
            .populate('crop')
            .populate('farmer', 'username address')
            .populate('customer', 'username address');
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Accept an order
// @route   PUT /api/vendors/orders/:id/accept
// @access  Private/Vendor
exports.acceptOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the order is still available
        if (order.vendor) {
            return res.status(400).json({ message: 'Order already taken' });
        }

        order.vendor = req.user.id;
        order.status = 'assigned';

        await order.save();

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update order status
// @route   PUT /api/vendors/orders/:id/status
// @access  Private/Vendor
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Ensure the vendor updating the status is the one assigned to the order
        if (order.vendor.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to update this order' });
        }

        // Validate the status transition
        const allowedTransitions = {
            assigned: ['picked-up', 'delivered'],
            'picked-up': ['delivered']
        };

        if (!allowedTransitions[order.status] || !allowedTransitions[order.status].includes(status)) {
            return res.status(400).json({ message: `Cannot transition from ${order.status} to ${status}` });
        }

        order.status = status;
        await order.save();

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get vendor's order history
// @route   GET /api/vendors/history
// @access  Private/Vendor
exports.getVendorOrderHistory = async (req, res) => {
    try {
        const orders = await Order.find({ vendor: req.user.id, status: 'delivered' })
            .populate('crop')
            .populate('farmer', 'username')
            .populate('customer', 'username');
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
