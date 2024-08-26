
const {DataTypes}= require('sequelize')
module.exports=(sequelize)=>{
    return sequelize.define('Orders',{
        OrderID: {
                        type: DataTypes.INTEGER,
                        autoIncrement: true,
                        primaryKey: true
                    },
                    TenantID: {
                        type: DataTypes.INTEGER,
                        allowNull: false
                    },
                    CustomerID: {
                        type: DataTypes.INTEGER,
                        allowNull: false
                    },
                    OrderDate: {
                        type: DataTypes.DATE,
                        defaultValue: DataTypes.NOW
                    },
                    TotalQuantity: DataTypes.INTEGER,
                    AddressID: DataTypes.INTEGER,
                    TotalAmount: DataTypes.DECIMAL(10, 2),
                    OrderStatus: DataTypes.STRING,
                    OrderBy: DataTypes.STRING,
                    DeliveryDate: DataTypes.DATE,
                    CreatedBy: DataTypes.STRING,
                    createdAt: {
                        type: DataTypes.DATE,
                        defaultValue: DataTypes.NOW
                    },
                    UpdatedBy: DataTypes.STRING,
                    updatedAt: {
                        type: DataTypes.DATE,
                        defaultValue: DataTypes.NOW
                    }
    },  {
        tableName:'Orders',
        timestamps:false
    });
};

    
