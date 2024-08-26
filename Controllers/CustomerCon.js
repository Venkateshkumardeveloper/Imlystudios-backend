const { CustomerModel,AddressModel } = require('../ConnectionDB/Connect');  


// Create a new Customer
// exports.createCustomer = async (req, res) => {
//   const { TenantID, FirstName, LastName, Email, Password, PhoneNumber, AddressID,CreatedBy,UpdatedBy } = req.body;

//   try {
//     const customer = await CustomerModel.create({
//       TenantID,
//       FirstName,
//       LastName,
//       Email,
//       Password,
//       PhoneNumber,
//       AddressID,
//       CreatedBy,
//       UpdatedBy
//     });

//     return res.status(201).json({
//       StatusCode: 'SUCCESS',
//       message: 'Customer created successfully',
//       customer
//     });
//   } catch (error) {
//     console.error('Error creating customer:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

exports.createCustomer = async (req, res) => {
    const { TenantID, FirstName, LastName, Email,Password, PhoneNumber, AddressLine1, AddressLine2, CityID, StateID, CountryID, ZipCode,CreatedBy,UpdatedBy } = req.body;
  
    let addressId = null;
  
    try { 
      // const CreatedBy = req.user.UserID;
      // const UpdatedBy = req.user.UserID;

      if (!TenantID) {
        return res.status(400).json({ error: 'TenantID is required' });
      }
  
      // Check if Address details are provided
      if (AddressLine1 || AddressLine2 || CityID || StateID || CountryID || ZipCode) {
        // Insert the address and get the address ID
        const address = await AddressModel.create({
          TenantID, 
          AddressLine1,
          AddressLine2,
          CityID,
          StateID,
          CountryID,
          ZipCode,
          CreatedBy,UpdatedBy
    
        });
  
        addressId = address.AddressID; 
      }
  
      
      const customer = await CustomerModel.create({
        TenantID, 
        FirstName,
        LastName,
        Email,
        Password,
        PhoneNumber,
        AddressID: addressId,
        CreatedBy,UpdatedBy
      });
  
      return res.status(201).json({
        StatusCode: 'SUCCESS',
        message: 'Customer created successfully',
        customer
      });
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
// Get all Customers with Pagination
exports.getAllCustomers = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
  
    try {
      const { count, rows } = await CustomerModel.findAndCountAll({
        limit: pageSize,
        offset: (pageNumber - 1) * pageSize
      });
  
      return res.status(200).json({
        StatusCode: 'SUCCESS',
        page: pageNumber,
        pageSize,
        totalItems: count,
        totalPages: Math.ceil(count / pageSize),
        customers: rows
      });
    } catch (error) {
      console.error('Error fetching customers with pagination:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

// Get a Customer by ID
exports.getCustomerById = async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await CustomerModel.findByPk(id);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    return res.status(200).json({
      StatusCode: 'SUCCESS',
      customer
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a Customer
exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { TenantID, FirstName, LastName, Email, Password, PhoneNumber,AddressID, UpdatedBy } = req.body;

  try {
    const customer = await CustomerModel.findByPk(id);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    await customer.update({
      TenantID,
      FirstName,
      LastName,
      Email,
      Password,
      PhoneNumber,
      AddressID,
      UpdatedBy
    });

    return res.status(200).json({
      StatusCode: 'SUCCESS',
      message: 'Customer updated successfully',
      customer
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a Customer
exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await CustomerModel.findByPk(id);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    await customer.destroy();

    return res.status(200).json({
      StatusCode: 'SUCCESS',
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
