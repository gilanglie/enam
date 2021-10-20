const {models} = require('../models');
const {Op } = require('sequelize');

const PassportCtrl = {};
 
function isDate(date){
	return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
} 
 
PassportCtrl.get = async  (req,res) => {
	var id = req.params.id;
	
	var q = req.query._q;
	var paspor = null;
	if (req.query.archive){
		paspor = await models.passport.findAll({where:
						{ archiveName : req.query.archive }
					});
		
	}else if (q){
		var date_query =  true ;
		if (isDate(q)) { 
			date_query = { [Op.or] : [ {dateBirth :  q }, {datePrint :  q }] } ;
		}
		paspor = await models.passport.findAll({where:
						{ [Op.or] : [
							{ code: q }  ,
							{ name: { [Op.like]: `%${q}%`} } ,
							{ noKTP: { [Op.like] : `%${q}%`} } ,
							{ noPassport : q } ,
							date_query
							]
						}
					});
	}else if (id || req.query.code ){
		paspor = await models.passport.findByPk(id);
	}else{
		paspor = await models.passport.findAll({ limit: 10 });
		
	}
	
	if (paspor){
		res.status(200).json(paspor);
	}else{
		res.status(200).json([]);
	}
}

PassportCtrl.put = async  (req,res) => {
	var id = req.params.id;
	var body = req.body;
	if (id){
		await models.passport.update(req.body, {where: {code: id}});
		res.status(200).send(id);
	}else{
		await models.passport.create(req.body);
		res.status(201).send(body['code']);
	}
}

PassportCtrl.post = async (req,res) => {
	var id = req.params.id;	var id = req.params.id;
	var body = req.body;
	if (id){
		await models.passport.update(req.body, {where: {code: id}});
		res.status(200).send(id);
	}else{
		await models.passport.create(req.body);
		res.status(201).send(body['code']);
	}
	
}
PassportCtrl.remove = async (req,res) => {
	var id = req.params.id;
	if (id){
		await models.passport.destroy({where: {code: id}});
		res.status(200).end();
	}
}
 
module.exports = PassportCtrl;
 