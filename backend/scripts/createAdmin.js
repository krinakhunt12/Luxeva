const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../features/user/model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Luxeva';

async function run() {
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });


        const email = 'admin@luxeva.local';
        const existing = await User.findOne({ email });
        if (existing) {
            if (existing.role === 'admin') {



                process.exit(0);
            }

            // If a user with the admin email exists but doesn't have the admin role,
            // promote them to admin and keep their existing password.
            existing.role = 'admin';
            await existing.save();



            process.exit(0);
        }

        const password = 'Luxeva@1234';
        const hashed = bcrypt.hashSync(password, 10);

        const admin = new User({ name: 'Admin', email, password: hashed, role: 'admin' });
        await admin.save();





        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err);
        process.exit(1);
    }
}

run();