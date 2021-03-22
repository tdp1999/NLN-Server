const Province = require('../model/province.js');

const errorMessage = require('../constant/errorMessage.js');

// GET: Xem noi dung tinh
module.exports.retrieve = async (req, res) => {
	try {
		const prov = await Province.findOne({ code: req.params.prov });
		if (!prov) throw new Error(errorMessage.WRONG_PROVINCE_CALL);
		res.status(200).send(prov);
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
};

// GET: Danh sach tat ca cac tinh
module.exports.province = async (req, res) => {
	try {
		const provinceList = await Province.find({});
		res.status(200).send(provinceList);
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
};

// GET: Danh sach cac dia diem cua tinh
module.exports.list = async (req, res) => {
	try {
		const arr = await Province.findOne({ code: req.params.prov }).populate('destination');
		res.status(200).send(arr.destination);
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
};

// POST: Them 01 tinh
module.exports.add = async (req, res) => {
	const prov = new Province(req.body);
	try {
		const provInfo = await Province.findOne({ code: req.body.code });
		if (provInfo) throw new Error(errorMessage.DUPLICATE_PROVINCE);
		await prov.save();
		res.status(201).send({ prov });
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
};

// PATCH: Sua thong tin 01 tinh
module.exports.update = async (req, res) => {
	try {
		const province = await Province.findOne({ code: req.body.code });
		if (!province) throw new Error(errorMessage.WRONG_PROVINCE_CALL);

		const update = Object.keys(req.body).filter((key) => key != 'code');
		const allowUpdate = ['introPara'];
		const isValidOperate = update.every((key) => allowUpdate.includes(key));
		if (!isValidOperate) throw new Error(errorMessage.INVALID_UPDATE);

		update.forEach((up) => (province[up] = req.body[up]));
		await province.save();
		res.status(204).send(province);
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
};
