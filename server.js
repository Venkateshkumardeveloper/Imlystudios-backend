const express = require('express');
const customerRoutes = require('./Routes/Routes');
const userRoutes = require('./Routes/Routes');
const storeRoutes = require('./Routes/Routes');
const ordersRoute = require('./Routes/Routes');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/orders', ordersRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

