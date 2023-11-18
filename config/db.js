const mongoose = require('mongoose');

const connectDB = async () => {
    console.log("Connecting to MongoDB");
    try {
        await mongoose.connect(process.env.MongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
