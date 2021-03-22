const jwt = require('jsonwebtoken');
const User = require('../model/user.js');

const auth = async (req, res, next) => {
	try {
		const token = req.header('Authorization').replace('Bearer ', '');
		const decode = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findOne({ _id: decode._id, 'tokens.token': token });
		/* Giải thích tokens.token (condition object) trong query findOne:
            Tại sao lại có thể ghi tokens.token mà không phải là 1 vòng lặp tìm token, hay tokens[i].token?
            Dựa trên cấu trúc dữ liệu (array of object) của tokens, ta suy ra như sau:
            - Sau khi tìm được user dựa trên condition đầu tiên là _id, findOne đi tiếp đến điều kiện thứ 2
            - Khi thấy cấu trúc dữ liệu và keys of condition array, nó truy cập vào array tokens
            - Array tokens có cấu trúc tương tự với array user, nên mongoose tiếp tục findOne token với giá trị đã cho (tức là findOne 2 lần)
        */

		if (!user) throw new Error();

		req.token = token;
		req.user = user; // Assign user, mongooseDB instance to a req.user => if req.user save, it save.
		next();
	} catch (err) {
		res.status(401).send({ err: 'Please authenticate! -- Error from middleware' });
	}
};

module.exports = auth;
