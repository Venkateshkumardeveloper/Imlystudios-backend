const { StoreModel } = require('../ConnectionDB/Connect');  


//Create a new Store
exports.createStore = async (req, res) => {
  const { TenantID,StoreName,Email, Phone,Address,CreatedBy,UpdatedBy } = req.body;

  try {
    const store = await StoreModel.create({
      TenantID,StoreName,Email, Phone,Address,CreatedBy,UpdatedBy 
    });

    return res.status(201).json({
      StatusCode: 'SUCCESS',
      message: 'Store created successfully',
      store
    });
  } catch (error) {
    console.error('Error creating store:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all Stores with Pagination
exports.getAllStores= async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
  
    try {
      const { count, rows } = await StoreModel.findAndCountAll({
        limit: pageSize,
        offset: (pageNumber - 1) * pageSize
      });
  
      return res.status(200).json({
        StatusCode: 'SUCCESS',
        page: pageNumber,
        pageSize,
        totalItems: count,
        totalPages: Math.ceil(count / pageSize),
        stores: rows
      });
    } catch (error) {
      console.error('Error fetching users with pagination:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

// Get store details by ID
exports.getStoreById = async (req, res) => {
  const { id } = req.params;

  try {
    const store = await StoreModel.findByPk(id);

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    return res.status(200).json({
      StatusCode: 'SUCCESS',
      store
    });
  } catch (error) {
    console.error('Error fetching store:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a Store
exports.updateStore= async (req, res) => {
  const { id } = req.params;
  const { TenantID,StoreName,Email, Phone,Address,CreatedBy,UpdatedBy  } = req.body;

  try {
    const store = await StoreModel.findByPk(id);

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    await store.update({
      TenantID,StoreName,Email, Phone,Address,CreatedBy,UpdatedBy 
    });

    return res.status(200).json({
      StatusCode: 'SUCCESS',
      message: 'Store updated successfully',
      store
    });
  } catch (error) {
    console.error('Error updating store:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a Store
exports.deleteStore= async (req, res) => {
  const { id } = req.params;

  try {
    const store = await StoreModel.findByPk(id);

    if (!store) {
      return res.status(404).json({ error: 'User not found' });
    }

    await store.destroy();

    return res.status(200).json({
      StatusCode: 'SUCCESS',
      message: 'Store deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting store:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
