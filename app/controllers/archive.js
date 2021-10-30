const { models } = require('../models');
const { Sequelize,Op } = require('sequelize');
const { resolveInclude } = require('ejs');
const archive = require('../models/archive');
const sequelize = require('sequelize');

var ArchiveCtrl = {}
ArchiveCtrl.count = async  (req,res) => {
	cnt = await models.passport.count({where:{'archiveName': req.params.id}}) || 0;
	res.status(200).json(cnt);
};

ArchiveCtrl.typeCount = async (req,res) => {
	var type  = req.params.type ||  req.query.type;
	if ( ['wni','wna'].includes(type)) { 
		cnt = await models.archive.count({where:{'type': type}}) || 0;
		res.status(200).json(cnt);
	}else{
		cnt = await models.passport.count({where:{'archiveName': type}}) || 0;
		res.status(200).json(cnt);
	}
}

ArchiveCtrl.get = async  (req,res) => {
	var id = req.params.id || false;
	var  archive= null;
	
	if (req.query.type){
		var _order = [['updatedAt','DESC']];
		if (req.query._sort){
			_order = [req.query._sort.split(':')];
			console.log(_order);
		};
		archive = await models.archive.findAll({
						where: { type: req.query.type ,status:'Active'} ,
						order: _order ,
						limit: 10 
					});
	}else if (id){
		archive = await models.archive.findByPk(id);
		archive.passport_count = models.passport.count({where:{archiveName:archive.name}});
	}else{
		archive = await models.archive.findAll({
							 limit: 10,
							 order: _order
						});
	}
	if (archive){
		res.status(200).json(archive);
	}else{
		res.status(404).send('404 - Not found');
	}
}

ArchiveCtrl.put = async (req,res) => {
	var id = req.params.id || false;
	var body = req.body;
	if (id){
		await models.archive.update(req.body, {where: {name: id}});
		res.status(200).send(id);
	}else{
		await models.archive.create(req.body);
		res.status(201).send(body['name']);
	}
}

ArchiveCtrl.post = async (req,res) => {
	var id = req.params.id || false;
	var body = req.body;
	if (req.params.status && id){
		archive = await models.archive.findByPk(id).then( (archive) => {
					models.archive.update({'status': req.params.status},{where:{id}});
					models.archive.update({'status':'Inactive'},{where:{type: archive.type}}).then( (rec) => {
						res.status(200).send(id);
						sequelize.Promise.resolve(id);
					})
				});
		res.status(200).send(id);
	}if (id){
		await models.archive.update(req.body, {where: {name: id}} );
		res.status(200).send(id);
	}else{
		await models.archive.update({'status': 'Inactive'},{where:{type:req.body['type']}})
		await models.archive.create(req.body);
		res.status(201).send(body['name']);
	}
}
ArchiveCtrl.remove = async  (req,res) => {
	var id = req.params.id || false;
	if (id){
		await models.archive.destroy({where: {code: id}});
		res.status(200).end();
	}
}
 
module.exports = ArchiveCtrl;
