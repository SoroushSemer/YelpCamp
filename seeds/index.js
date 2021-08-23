const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers.js')
const Campground = require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: 'pk.eyJ1IjoiZmVtb3NlbSIsImEiOiJja3NoeGY1bG4wYTg3MnZvOXJyeWdyc2EwIn0.BJAlHSbG5ocDa2cUqmJmEA' })


mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => {
    console.log("Database connected")
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 250; i++) {
        const rand = Math.floor(Math.random() * 1000)
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[rand].city}, ${cities[rand].state}`,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[rand].longitude,
                    cities[rand].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dsekpunfo/image/upload/v1629242990/YelpCamp/gwmzvhtie4zugkuyixzy.jpg',
                    filename: 'YelpCamp/gwmzvhtie4zugkuyixzy'
                },
                {
                    url: 'https://res.cloudinary.com/dsekpunfo/image/upload/v1629242990/YelpCamp/epac3jyzdsopntgg6omg.png',
                    filename: 'YelpCamp/epac3jyzdsopntgg6omg'
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellendus temporibus repudiandae harum? Aut dolor beatae voluptate totam et dolorum, ex delectus quam, sapiente aliquam vero saepe voluptatem, repellat rem possimus! Modi recusandae vel fugiat asperiores perferendis, quasi pariatur ducimus nihil quam minus tempore dignissimos esse, nesciunt labore quod vero saepe. Corporis asperiores explicabo quidem, eveniet aut omnis reiciendis sit labore.',
            price: Math.floor(Math.random() * 30) + 10,
            author: '611af61c810eb98db8d54a5a',
            reviews: [
                "6122caa2015306824857f165",
                "6122caa2015306824857f165",
                "6122caa2015306824857f165",
            ]
        })
        await camp.save()
    }
}
seedDB().then(() => mongoose.connection.close())