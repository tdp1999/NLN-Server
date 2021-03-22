// Common error
const INVALID_UPDATE = 'Invalid Update!';

// User controller Error
const DUPLICATE_USER = 'Username has already taken!';
const DUPLICATE_EMAIL = 'Email has already registered!';
const WRONG_EMAIL = 'Unable to login - Cannot find email!';
const WRONG_PASSWORD = 'Unable to login - Wrong password!';
const ENCROACH = 'Unable to execute action: No authorization!';
const USERNAME_NOT_EXIST = 'Username not exist!';

// Province error
const WRONG_PROVINCE_CALL = 'Cannot find province!';
const DUPLICATE_PROVINCE = 'Cannot add province! Province is already have';

// Destination error
const WRONG_DESTINATION_CALL = 'Cannot find destination!';
const WRONG_DELETE_OPERATION = 'Cannot delete destination!';

module.exports = {
	INVALID_UPDATE,
	DUPLICATE_USER,
	DUPLICATE_EMAIL,
	WRONG_EMAIL,
	WRONG_PASSWORD,
	WRONG_PROVINCE_CALL,
	DUPLICATE_PROVINCE,
	WRONG_DESTINATION_CALL,
	WRONG_DELETE_OPERATION,
	ENCROACH,
	USERNAME_NOT_EXIST,
};
