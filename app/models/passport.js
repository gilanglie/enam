const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>  {
	sequelize.define( 'passport',{
		code: {
		  type: DataTypes.STRING,
		  allowNull: false,
		  primaryKey:true
		},
		name: {
		  type: DataTypes.STRING,
		  allowNull: false
		},
		dateBirth: {
		  type: DataTypes.DATE,
		  allowNull: false
		},
		datePrint: {
		  type: DataTypes.DATE,
		  allowNull: false
		},
		gender: {
		  type: DataTypes.STRING,
		  allowNull: false,
		  defaultValue:'L'
		},
		type: {
		  type: DataTypes.STRING,
		  allowNull: false,
		  defaultValue:'paspor'
		},
		status: {
		  type: DataTypes.STRING,
		  allowNull: true
		},
		noKTP: {
		  type: DataTypes.STRING,
		  allowNull: true
		},
		noPassport: {
		  type: DataTypes.STRING,
		  allowNull: true
		},
	},{
		// Other model options go here
			modelName: 'passport' ,// We need to choose the model name,
			timestamps: true,
			createdAt: true,  
		  });
}