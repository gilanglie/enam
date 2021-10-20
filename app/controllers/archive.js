const { models } = require('../models');
const { Sequelize,Op } = require('sequelize');
const { resolveInclude } = require('ejs');
const archive = require('../models/archive');

var ArchiveCtrl = {}
ArchiveCtrl.count = async  (req,res) => {
	cnt = await models.passport.count({where:{'archiveName': req.params.id}}) || 0;
	res.status(200).json(cnt);
};


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
		// archive['passport_count'] = await models.passport.count({where:{'archiveName': "Box 1"}});
	}else if (id){
		archive = await models.archive.findByPk(id);
		archive.passport_count = models.passport.count({where:{archiveName:archive.name}});
	}else{
		archive = await models.archive.findAll({
							 limit: 10 
				// }).then(archives => { 
				// 	cnt = await models.passport.count({where:{ archiveName :  archive.name }});
				// 	archive['passport_cnt'] = cnt;
				// 	return archive
				});
		// console.log( archive) ;
		
		console.log(archive)
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
		archive = await models.archive.findByPk(id).then (archive => {
					await models.archive.update({'status': req.params.status},{where:{id}});
					await models.archive.update({'status':'Inactive'},{where:{type: archive.type}}).then(rec => {
						res.status(200).send(id);
					})
				});
		res.status(200).send(id);
	}if (id){
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
 