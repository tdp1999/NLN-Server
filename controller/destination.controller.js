const Destination = require('../model/destination.js');
const Province = require('../model/province.js');

const sharp = require('sharp');

const errorMessage = require('../constant/errorMessage.js');

// GET: Danh sach tat ca cac diem den (compact)
module.exports.list = async (req, res) => {
	try {
		res.status(200).send(
			await Destination.find({}).populate('province', 'name').populate('author', 'username')
		);
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
};

// GET: Danh sach tat ca cac diem den (detail)
module.exports.detailList = async (req, res) => {
	try {
		res.status(200).send(await Destination.find({}).populate('province').populate('author'));
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
};

// GET: Xem 01 diem den
module.exports.retrieve = async (req, res) => {
	try {
		const dest = await Destination.findOne({ code: req.params.dest })
			.populate('province', 'name')
			.populate('author', 'username');
		if (!dest) throw new Error(errorMessage.WRONG_DESTINATION_CALL);
		res.status(200).send(dest);
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
};

// POST: Them avatar
module.exports.addAvatar = async (req, res) => {
	try {
		const dest = await Destination.findOne({ code: req.params.dest });
		const buffer = await sharp(req.file.buffer).png().toBuffer();
		dest.avatar = buffer;
		await dest.save();

		res.status(200).send({ dest });
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
};

// POST: Them 1 dia diem
module.exports.add = async (req, res) => {
	try {
		// Loai tru truong hop loi
		const prov = await Province.findOne({ name: req.body.province }); // Khong tim thay tinh

		if (!prov) throw new Error(errorMessage.WRONG_PROVINCE_CALL);

		const dest = {
			code: req.body.code,
			name: req.body.name,
			address: req.body.address,
			province: prov._id,
			priceRange: req.body.priceRange,
			introPara: req.body.introPara,
			content: req.body.content,
			category: req.body.category,
			author: req.user._id,
			embeddedMap: req.body.embeddedMap,
		};
		const destination = new Destination(dest);
		prov.destination.push(destination._id);
		await prov.save();
		await destination.save();

		res.status(201).send({ dest });
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
};

// PATCH: Sua thong tin 01 dia diem
module.exports.update = async (req, res) => {
	const update = Object.keys(req.body);
	// Phai catch error cua priceRange va category o client!!!
	const allowUpdate = [
		'priceRange',
		'category',
		'address',
		'province',
		'introPara',
		'content',
		'name',
		'embeddedMap',
	];
	const isValidOperate = update.every((key) => allowUpdate.includes(key));

	try {
		const dest = await Destination.findOne({ code: req.params.dest });
		const province = await Province.findOne({ name: req.body.province });
		if (!isValidOperate || !dest) throw new Error(errorMessage.INVALID_UPDATE);
		update.forEach((up) => {
			if (up == 'province') dest.province = province._id;
			else dest[up] = req.body[up];
		});
		await dest.save();
		res.status(200).send(dest);
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
};

// DELETE: Xoa dia diem
module.exports.delete = async (req, res) => {
	try {
		const dest = await Destination.findOne({ code: req.body.code });
		if (!dest) throw new Error(errorMessage.WRONG_DELETE_OPERATION);

		// Delete ref in province
		const prov = await Province.findOne({ _id: dest.province });
		prov.destination.splice(prov.destination.indexOf(dest._id), 1);
		await prov.save();
		await dest.remove();

		res.status(204).send();
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
};
