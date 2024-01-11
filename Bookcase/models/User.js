const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	username     : String,
	reservations : [ { type: Schema.Types.ObjectId, ref: 'Reservation' } ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
