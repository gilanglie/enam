const express = require("express");
const bodyParser = require("body-parser");
const { base64encode, base64decode } = require('nodejs-base64');
const QRCode = require('qrcode')

const accessView = require("./app/controllers/access_view.js");
const archive = require("./app/controllers/archive.js");
const paspor = require("./app/controllers/passport.js");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");



const PORT = 8000

function WrapHandler(handler) {
	return async function(req, res, next) {
		try {
			await handler(req, res);
		} catch (error) {
			next(error);
			console.log(error);
		}
	};
}



app.get(["/qr","/qr/:role","/qr/:role/:doc_limit"], (req,res) => {

	var ip = require("ip");
	
	const role = req.params.role || 'petugas';
	const doc_limit = req.params.doc_limit ||  50;
	console.log()
	const config= {"baseURL": `http://${ip.address()}:${PORT}` };
	config['role'] = role ;
	config['doc_limit'] =  doc_limit;
	config['name'] = `eNAM ${role}`;
	encoded = base64encode(JSON.stringify(config));
	
	QRCode.toDataURL(encoded, (err, src) => {
        if (err) res.send("Error occured");
      
        // Let us return the QR code image as our response and set it to be the source used in the webpage
        res.render("../app/views/qr", { src });
    });
});




// GET SPRI DATA
app.get("/spri/:no_permohonan", WrapHandler(accessView.get_spri));

app.get("/intal/:no_permohonan", WrapHandler(accessView.get_intal));
// GET INTAL DATA


app.get(["/archives","/archive/:id"], WrapHandler(archive.get));
app.get(["/archive/:id/count"], WrapHandler(archive.count));
app.put(["/archives","/archive/:id"], WrapHandler(archive.put));
app.post(["/archives","/archive/:id"], WrapHandler(archive.post));
app.delete(["/archives","/archive/:id"], WrapHandler(archive.remove));

app.get(["/paspors","/paspors/:id"], WrapHandler(paspor.get));
app.put(["/paspors","/paspors/:id"], WrapHandler(paspor.put));
app.post(["/paspors","/paspors/:id"], WrapHandler(paspor.post));
app.delete(["/paspors","/paspors/:id"], WrapHandler(paspor.remove));


// app.listen(PORT, () => {
  // console.log(`Server is running on port ${PORT}.`);
// });

module.exports = app;
