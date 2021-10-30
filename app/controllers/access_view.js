const mysql = require('mysql2');
const AccessView = {}

function convertToResponse(rec, wna=0){
	//wna == 0 ==> SPRTI , 1=> INTAL
	var obj ={
		"code":  "",
		"name":  "",
		"dateBirth":"",
		"datePrint": "",
		"gender": "L",
		"type": "paspor",
		"status": "SELESAI",
		"archive": "",
		"noKTP": "",
		"noPassport": "",
	}
	if (wna) {
		obj['code'] = rec['no_permohonan'];
		obj['name'] = rec['nama_pemohon'];
		obj['noKTP'] = rec['niora'];
		obj['noPassport'] = rec['no_paspor'];
		obj['dateBirth'] = rec['tgl_lahir'];
		obj['datePrint'] = rec['dokim_akhir'];
		obj['gender'] = rec['jenis_kelamin'];
		obj['type'] = 'ijin_tinggal';
		obj['status'] = rec['sub_tahapan'];
	}else{
		obj['code'] = rec['nomor_permohonan'];
		obj['name'] = rec['nama_lengkap'];
		obj['noKTP'] = rec['niora'];
		obj['noPassport'] = rec['no_paspor'];
		obj['dateBirth'] = rec['tanggal_lahir'];
		obj['datePrint'] = rec['tanggal_dikeluarkan'];
		obj['gender'] = rec['jenis_kelamin'];
		obj['type'] = 'paspor';
		obj['status'] = rec['tahapan'];	
	}
	
	// console.log(obj);
	obj['dateBirth'] = obj['dateBirth'] ? obj['dateBirth'].toISOString().split('T')[0] : "";
	obj['datePrint'] = obj['datePrint'] ? obj['datePrint'].toISOString().split('T')[0] : "";
	return obj;
}

AccessView.get_spri = (req, res) => {
	const no_permohonan = req.params.no_permohonan;
	const connection = mysql.createConnection({
            host: '0.tcp.ngrok.io',
            port: '16283',
            user: 'belawanspriView',
            password: 'spriV!3wknbel4wan!',
            database: 'spri_local'
        });
	connection.query( "SELECT 'paspor' as type,nomor_permohonan as code, \
						nama_lengkap as name, \
						nomor_register as noKTP  ,\
						no_paspor as noPassport,  \
						date(tanggal_lahir) as dateBirth,  \
						date(tanggal_dikeluarkan) as datePrint ,\
						jenis_kelamin as gender, \
						tahapan as status \
						FROM `datapaspor` WHERE nomor_permohonan = ? ", [no_permohonan],(err,rec) => {
		var ret = Object.assign({}, rec.pop());
		res.send(ret);			
	});
};

AccessView.get_intal = async (req, res) => {
	const no_permohonan = req.params.no_permohonan;
	const connection = await mysql.createConnection({
//            host: '10.2.8.17',
//            port: '3307',
host: '8.tcp.ngrok.io',
port: '11642',
            user: 'belawanwnaView',
            password: 'wnaV!3wknb3law4n!',
            database: 'db_it_kanim'
        });
	connection.query("SELECT 'ijin_tinggal' as `type`, no_permohonan as code, \
						nama_pemohon as name, \
						niora as noKTP ,no_paspor as noPassport,  \
						date(tgl_lahir) as dateBirth,  \
						date(dokim_akhir) as datePrint ,\
						jenis_kelamin as gender, \
						sub_tahapan as status \
					FROM `data_wna` WHERE no_permohonan = ? ", [no_permohonan],(err,rec) => {
		console.log(err,rec)
		var ret = Object.assign({}, rec[0]);
		// obj = convertToResponse(ret,1);
		res.send(rec);			
	});
};


module.exports = AccessView;
