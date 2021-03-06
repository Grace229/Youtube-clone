const mongoose = require('mongoose');
const {Schema} = mongoose;

const videoSchema = new Schema({
    title:{ 
        type: String
    },
   videoLink:{ 
        type: String
    },
   imageLink:{ 
        type: String
    },
    description:{ 
        type: String
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
}, {timestamps: true});
const Video = mongoose.model('video', videoSchema)
module.exports = Video