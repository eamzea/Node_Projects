const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema(
	{
		book     : { type: Schema.Types.ObjectId, ref: 'Book' },
		returned : { type: Boolean, default: false },
		user     : { type: Schema.Types.ObjectId, ref: 'User' }
	},
	{
		timestamps : {
			createdAt : 'created_at',
			updatedAt : 'updated_at'
		}
	}
);

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
