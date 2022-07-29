import mongoose from 'mongoose';

const url = 'mongodb://db:27017/juqte';

mongoose.connect(
    url,
    (err) => {
        if (err) console.log('Error', err);
        else console.log('Mongodb connected');
    }
);

export default mongoose;