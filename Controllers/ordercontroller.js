const { Orders, CustomerModel, AddressModel, sequelize } = require('../ConnectionDB/Connect');

exports.createOrder = async (req, res) => {
    const {
        TenantID, CustomerID, OrderDate, TotalQuantity, AddressLine1, AddressLine2, CityID, StateID, CountryID, ZipCode, TotalAmount, OrderStatus, OrderBy, DeliveryDate,
        customerFirstName, customerLastName, customerEmail, customerPhone
    } = req.body;

    console.log('CustomerModel:', CustomerModel);
    console.log('AddressModel:', AddressModel);
    console.log('Orders:', Orders);
    const transaction = await sequelize.transaction();

    try {
        let customerIdToUse = CustomerID;
        let addressIdToUse = null;

        // Handle Address
        if (AddressLine1 || AddressLine2 || CityID || StateID || CountryID || ZipCode) {
            // Determine the value for the street field
            const Street = AddressLine1 || AddressLine2;

            // Check if CustomerID is 0, indicating a new customer
            if (customerIdToUse === 0) {
                // Create a new customer and address
                const newAddress = await AddressModel.create({
                    TenantID,
                    Street,
                    AddressLine1,
                    AddressLine2,
                    CityID,
                    StateID,
                    CountryID,
                    ZipCode,
                    CreatedBy: OrderBy,
                    UpdatedBy: OrderBy,
                }, { transaction });

                addressIdToUse = newAddress.AddressID;

                const newCustomer = await CustomerModel.create({
                    TenantID,
                    FirstName: customerFirstName,
                    LastName: customerLastName,
                    Email: customerEmail,
                    PhoneNumber: customerPhone,
                    AddressID: addressIdToUse,
                    CreatedBy: OrderBy,
                    UpdatedBy: OrderBy,
                }, { transaction });

                customerIdToUse = newCustomer.CustomerID;

            } else {
                // Use the existing customer and possibly create a new address
                const customer = await CustomerModel.findByPk(customerIdToUse);

                if (customer) {
                    // If the customer has no address, create a new one
                    if (!customer.AddressID) {
                        const newAddress = await AddressModel.create({
                            TenantID,
                            Street,
                            AddressLine1,
                            AddressLine2,
                            CityID,
                            StateID,
                            CountryID,
                            ZipCode,
                            CreatedBy: OrderBy,
                            UpdatedBy: OrderBy,
                        }, { transaction });

                        addressIdToUse = newAddress.AddressID;

                        // Update the customer with the new address ID
                        await customer.update({ AddressID: addressIdToUse }, { transaction });

                    } else {
                        // If the customer already has an address, use it
                        addressIdToUse = customer.AddressID;
                    }
                } else {
                    return res.status(400).json({ error: 'CustomerID not found.' });
                }
            }
        } else {
            // If no address details are provided, use the existing address ID if available
            if (customerIdToUse) {
                const customer = await CustomerModel.findByPk(customerIdToUse);
                if (customer) {
                    addressIdToUse = customer.AddressID;
                }
            }
        }

        // Create the order using the determined CustomerID and AddressID
        const newOrder = await Orders.create({
            TenantID,
            CustomerID: customerIdToUse,
            OrderDate: OrderDate || new Date(),
            TotalQuantity,
            AddressID: addressIdToUse || null,
            TotalAmount,
            OrderStatus,
            OrderBy,
            DeliveryDate,
            CreatedBy: OrderBy,
            CreatedAt: new Date(),
            UpdatedBy: OrderBy,
            UpdatedAt: new Date(),
        }, { transaction });

        await transaction.commit();
        res.status(201).json({
            StatusCode: 'SUCCESS',
            message: 'Order created successfully',
            OrderID: newOrder.OrderID });

    } catch (error) {
        await transaction.rollback();
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.updateOrder = async (req, res) => {
    const { OrderID } = req.params;
    const {
        TenantID, CustomerID, OrderDate, TotalQuantity, AddressLine1, AddressLine2, CityID,StateID,CountryID, ZipCode,
        TotalAmount, OrderStatus, OrderBy, DeliveryDate, customerFirstName, customerLastName, customerEmail, customerPhone
    } = req.body;

    const transaction = await sequelize.transaction();

    try {
        // Find the existing order
        const order = await Orders.findByPk(OrderID);
        if (!order) {
            return res.status(404).json({ error: 'Order not found.' });
        }

        // Initialize addressIdToUse with the existing AddressID from the order
        let addressIdToUse = order.AddressID;

        // Handle Address update only if address details are provided
        if (AddressLine1 || AddressLine2 || CityID || StateID || CountryID || ZipCode) {
            const Street = AddressLine1 || AddressLine2;

            // Find the customer to check for existing address
            const customer = await CustomerModel.findByPk(CustomerID);
            if (!customer) {
                return res.status(404).json({ error: 'Customer not found.' });
            }

            if (customer.AddressID) {
                // Update the existing address if customer already has one
                await AddressModel.update({
                    TenantID,
                    Street,
                    AddressLine1,
                    AddressLine2,
                    CityID,
                    StateID,
                    CountryID,
                    ZipCode,
                    UpdatedBy: OrderBy,
                }, { where: { AddressID: customer.AddressID }, transaction });

                addressIdToUse = customer.AddressID;
            } else {
                // Create a new address if the customer has no associated address
                const newAddress = await AddressModel.create({
                    TenantID,
                    Street,
                    AddressLine1,
                    AddressLine2,
                    CityID,
                    StateID,
                    CountryID,
                    ZipCode,
                    CreatedBy: OrderBy,
                    UpdatedBy: OrderBy,
                }, { transaction });

                addressIdToUse = newAddress.AddressID;

                // Update the customer with the new address ID
                await customer.update({ AddressID: addressIdToUse }, { transaction });
            }
        }

        // Update the Order only with provided fields, leaving other fields intact
        await Orders.update({
            TenantID: TenantID || order.TenantID,
            CustomerID: CustomerID || order.CustomerID,
            OrderDate: OrderDate || order.OrderDate,
            TotalQuantity: TotalQuantity || order.TotalQuantity,
            AddressID: addressIdToUse || order.AddressID,
            TotalAmount: TotalAmount || order.TotalAmount,
            OrderStatus: OrderStatus || order.OrderStatus,
            OrderBy: OrderBy || order.OrderBy,
            DeliveryDate: DeliveryDate || order.DeliveryDate,
            UpdatedBy: OrderBy || order.UpdatedBy,
            UpdatedAt: new Date(),
        }, { where: { OrderID }, transaction });

        await transaction.commit();
        res.status(200).json({
            StatusCode: 'SUCCESS',
            message: 'Order created successfully' });

    } catch (error) {
        await transaction.rollback();
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.getOrderById = async (req, res) => {
    const { OrderID } = req.params;

    try {
        const order = await Orders.findByPk(OrderID, {
            include: [
                { model: CustomerModel, include: [AddressModel] },
                // { model: Address }
            ]
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found.' });
        }

        res.status(200).json({
            StatusCode: 'SUCCESS',
            message: 'Order Fetched By ID successfully',
            order
        });

    } catch (error) {
        console.error('Error fetching order by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteOrderById = async (req, res) => {
    const { OrderID } = req.params;

    try {
        const deleted = await Orders.destroy({ where: { OrderID } });

        if (deleted) {
            res.status(200).json({StatusCode: 'SUCCESS', 
                                  message: 'Order deleted successfully.' });
        } else {
            res.status(404).json({ error: 'Order not found.' });
        }

    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getAllOrders = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; 

    try {
        const offset = (page - 1) * limit;

        const { count, rows: orders } = await Orders.findAndCountAll({
            include: [
                { model: CustomerModel, include: [AddressModel] },
                // { model: Address }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            StatusCode: 'SUCCESS',
            message: 'Orders Fetched successfully',
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            totalOrders: count,
            orders
        });

    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

