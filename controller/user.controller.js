const User = require('../model/user.js');
const Destination = require('../model/destination.js');

const errorMessage = require('../constant/errorMessage.js');

/* --------- MUTUAL ZONE ------------- */

// GET: Liet ke danh sach nguoi dung
module.exports.list = async (req, res) => {
	try {
		const userArray = await User.find({}, '_id username role');
		res.status(200).send(userArray);
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
};

// GET: Lay thong tin 01 nguoi dung*
module.exports.me = async (req, res) => {
	try {
		res.status(200).send(req.user);
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
};

// GET: Lay danh sach cac dia diem da them
module.exports.destList = async (req, res) => {
	try {
		const destArray = await Destination.find({ author: req.user._id });
		res.status(200).send(destArray);
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
};

// POST: Dang nhap
module.exports.login = async (req, res) => {
	try {
		const user = await User.findByCredentialsForLogin(req.body.email, req.body.password);
		const token = await user.generateAuthToken();
		res.status(200).send({ token, user });
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
};

// POST: Dang xuat*
module.exports.logout = async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token;
		});
		await req.user.save();
		res.status(204).send();
	} catch (err) {
		res.send({ error: err.message });
	}
};

// PATCH: Cap nhat info*
module.exports.update = async (req, res) => {
	const update = Object.keys(req.body);
	const allowUpdate = ['username', 'password', 'age', 'address', 'role'];
	const isValidOperate = update.every((key) => allowUpdate.includes(key));

	try {
		if (!isValidOperate) throw new Error(errorMessage.INVALID_UPDATE);
		update.forEach((up) => (req.user[up] = req.body[up]));
		await req.user.save(); // req.user ref is in auth.js
		res.status(200).send(req.user);
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
};

// DELETE: Tu xoa nguoi dung*
module.exports.delete = async (req, res) => {
	try {
		await req.user.remove();
		res.status(204).send(req.user);
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
};

/* --------- ADMIN ZONE ------------- */

// POST: Dang ky
module.exports.register = async (req, res) => {
	const user = new User(req.body);

	try {
		// Duplicate email catch
		const credencial = await User.findByCredentials(req.body.username, req.body.email);
		if (credencial != '') throw new Error(credencial);

		// Encroach catch
		if (req.user.role != 'administrator') throw new Error(errorMessage.ENCROACH);

		await user.save();
		res.status(201).send({ user });
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
};

// DELETE: Xoa nguoi dung*
module.exports.remove = async (req, res) => {
	try {
		// Encroach catch
		if (req.user.role != 'administrator') throw new Error(errorMessage.ENCROACH);
		// Username not exist
		const user = await User.findOne({ username: req.body.username });
		if (!user) throw new Error(errorMessage.USERNAME_NOT_EXIST);

		await user.remove();
		res.status(200).send({ user });
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
};
