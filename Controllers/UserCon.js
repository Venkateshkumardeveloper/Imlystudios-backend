const { UserModel } = require('../ConnectionDB/Connect');  


//Create a new User
exports.createUser = async (req, res) => {
  const { TenantID, FirstName, LastName, Email, Password, PhoneNumber,CreatedBy,UpdatedBy } = req.body;

  try {
    const user = await UserModel.create({
      TenantID,
      FirstName,
      LastName,
      Email,
      Password,
      PhoneNumber,
      CreatedBy,
      UpdatedBy
    });

    return res.status(201).json({
      StatusCode: 'SUCCESS',
      message: 'User created successfully',
      user
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all Customers with Pagination
exports.getAllUsers = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
  
    try {
      const { count, rows } = await UserModel.findAndCountAll({
        limit: pageSize,
        offset: (pageNumber - 1) * pageSize
      });
  
      return res.status(200).json({
        StatusCode: 'SUCCESS',
        page: pageNumber,
        pageSize,
        totalItems: count,
        totalPages: Math.ceil(count / pageSize),
        users: rows
      });
    } catch (error) {
      console.error('Error fetching users with pagination:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

// Get a Customer by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      StatusCode: 'SUCCESS',
      user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a Customer
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { TenantID, FirstName, LastName, Email, Password, PhoneNumber,UpdatedBy } = req.body;

  try {
    const user = await UserModel.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({
      TenantID,
      FirstName,
      LastName,
      Email,
      Password,
      PhoneNumber,
      UpdatedBy
    });

    return res.status(200).json({
      StatusCode: 'SUCCESS',
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a Customer
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();

    return res.status(200).json({
      StatusCode: 'SUCCESS',
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
