const {AddressModel}=require('../ConnectionDB/Connect')

exports.createAddress = async (req, res) => {
    const { AddressID,TenantID, AddressLine1, AddressLine2, CityID, StateID, CountryID,ZipCode,CreatedBy,UpdatedBy } = req.body;
  
    try {
      const address = await AddressModel.create({
        AddressID,TenantID, AddressLine1, AddressLine2, CityID, StateID, CountryID,ZipCode,CreatedBy,UpdatedBy
      });
  
      return res.status(201).json({
        StatusCode: 'SUCCESS',
        message: 'Address created successfully',
        address
      });
    } catch (error) {
      console.error('Error creating Address:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.getAllAddresses = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
  
    try {
      const { count, rows } = await AddressModel.findAndCountAll({
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
exports.getAddressById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const address = await AddressModel.findByPk(id);
  
      if (!address) {
        return res.status(404).json({ error: 'Address not found' });
      }
  
      return res.status(200).json({
        StatusCode: 'SUCCESS',
        address
      });
    } catch (error) {
      console.error('Error fetching address:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  // Update a Customer
exports.updateAddress = async (req, res) => {
    const { id } = req.params;
    const { AddressID,TenantID, AddressLine1, AddressLine2, CityID, StateID, CountryID,ZipCode,CreatedBy,UpdatedBy } = req.body;
  
    try {
      const address = await AddressModel.findByPk(id);
  
      if (!address) {
        return res.status(404).json({ error: 'Address not found' });
      }
  
      await address.update({
        AddressID,TenantID, AddressLine1, AddressLine2, CityID, StateID, CountryID,ZipCode,CreatedBy,UpdatedBy
      });
  
      return res.status(200).json({
        StatusCode: 'SUCCESS',
        message: 'Address updated successfully',
        address
      });
    } catch (error) {
      console.error('Error updating address:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  // Delete a address
exports.deleteAddress = async (req, res) => {
    const { id } = req.params;
  
    try {
      const address = await AddressModel.findByPk(id);
  
      if (!address) {
        return res.status(404).json({ error: 'Address not found' });
      }
  
      await address.destroy();
  
      return res.status(200).json({
        StatusCode: 'SUCCESS',
        message: 'Address deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting address:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };