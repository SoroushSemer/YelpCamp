const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } }
const imageSchema = new Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})

const campgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [imageSchema],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, opts)
campgroundSchema.virtual('properties.popupText').get(function (campground) {
    return `<strong><a href='/campgrounds/${this.id}'>${this.title}</a></strong>
            <p>${this.description.substring(0, 100)}...</p>`
})
campgroundSchema.post('findOneAndDelete', async function (campground) {
    if (campground) {
        await Review.deleteMany({
            _id: {
                $in: campground.reviews
            }
        })
    }
})
module.exports = mongoose.model('Campground', campgroundSchema)