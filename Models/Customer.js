const {DataTypes} =require('sequelize')
module.exports=(sequelize)=>{
    return sequelize.define('Customer',{
        CustomerID:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        TenantID:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        FirstName:{
            type:DataTypes.STRING(50),
            allowNull:true
        },
        LastName:{
            type:DataTypes.STRING(50),
            allowNull:true
        },
        Email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        Password: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        PhoneNumber: {
            type: DataTypes.STRING(20),
            allowNull: true,
            unique: true
        },
        AddressID: {
            type: DataTypes.INTEGER,
            allowNull:true
            // references: {
            //     model: 'Address',
            //     key: 'AddressID'
            // },
            // onDelete: 'SET NULL'
        },
        CreatedBy: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        CreatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        UpdatedBy: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        UpdatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'Customer',
        timestamps: false  
    });

};
