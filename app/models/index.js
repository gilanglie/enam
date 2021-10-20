const { Sequelize } = require('sequelize');

function applyExtraSetup(sequelize) {
	const { archive, passport } = sequelize.models;
	archive.hasMany(passport);
	passport.belongsTo( archive,{ targetKey:"name"});
}

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: './db/docScanner.db',
	dialectOptions: {mode: 2},
	logQueryParameters: false,
	benchmark: true
});
sequelize.sync();

const modelDefiners = [
	require('./passport'),
	require('./archive'),
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

// We execute any extra setup after the models are defined, such as adding associations.
applyExtraSetup(sequelize);

// We export the sequelize connection i
module.exports = sequelize;