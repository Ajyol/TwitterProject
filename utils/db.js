const mongoose = require('mongoose');
let instance = null;

class Database {

    constructor() {
        if (!instance) {
            instance = this;
            this._connect();
        }
        return instance;
    }

    _connect() {
        mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Database Connected ^^');
        }).catch(err => {
            console.error(err);
        });
    }

}
module.exports = new Database();