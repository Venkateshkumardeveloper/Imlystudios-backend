const{DataTypes}= require('sequelize')
module.exports=(sequelize)=>{
    return sequelize.define('UserManagement',{
        UserID:{
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
        Email:{
            type:DataTypes.STRING(50),
            allowNull:false,
            unique:true
        },
        Password:{
            type:DataTypes.STRING(50),
            allowNull:false
         },
         PhoneNumber: {
            type: DataTypes.STRING(20),
            allowNull: true,
            unique: true
        },
        CreatedBy: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        CreatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        UpdatedBy: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        UpdatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'UserManagement',
        timestamps: false  
    });

};
