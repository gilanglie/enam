const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>  {
	sequelize.define( 'archive',{
		  // Model attributes are defined here
			name: {
			  type: DataTypes.STRING,
			  allowNull: false,
			  primaryKey:true,
			  unique: 'compositeIndex'
			},
			limit: {
			  type: DataTypes.INTEGER,
			  defaultValue: 50
			},
			type: {
			  type: DataTypes.STRING,
			  defaultValue: "wni",
			  unique: 'compositeIndex'
			},
			status: {
			  type: DataTypes.BOOLEAN,
			  defaultValue: true
			},
		}, {
	  // Other model options go here
		  modelName: 'archive' ,// We need to choose the model name,
		  timestamps: true,
		  createdAt: true,  
		}
	);
}