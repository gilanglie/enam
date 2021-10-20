const { models } = require('../models');
const { Op } = require('sequelize');

var ArchiveCtrl = {}
ArchiveCtrl.count = async  (req,res) => {

};


ArchiveCtrl.get = async  (req,res) => {
	var id = req.params.id || false;
	console.log(req.params);
	var  archive= null;
	
	if (req.query.type){
		var _order = ['name', 'DESC'];
		if (req.query._sort){
			_order = req.query._sort.split(':');
		};
		archive = await models.archive.findAll(
						{where: { type: req.query.type ,status:'Active'} },
						{order: _order },
						{ limit: 10 }
					);
	}else if (id){
		archive = await models.archive.findByPk(id);
	}else{
		archive = await models.archive.findAll({ limit: 10 });
		
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
	if (id){
		await models.archive.update(req.body, {where: {name: id}} );
		res.status(200).send(id);
	}else{
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
 