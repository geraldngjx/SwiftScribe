import mongoose from 'mongoose';

const connectMongo = async () => mongoose.connect('mongodb+srv://admin:VrJdvxKgCbB7x6tK@cluster0.5mhgl.mongodb.net/SwiftScribe?retryWrites=true&w=majority');

export default connectMongo;