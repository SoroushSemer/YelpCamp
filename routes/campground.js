const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')
const wrapAsync = require('../utils/wrapAsync')
const campgrounds = require('../controllers/campgrounds')
const { validateCampground, isLoggedIn, isAuthor } = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudinary/index')
const upload = multer({ storage })

router.route('/')
    .get(wrapAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, wrapAsync(campgrounds.createCampground))


router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(wrapAsync(campgrounds.showCampground))
    .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, wrapAsync(campgrounds.updateCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(campgrounds.renderEditCampground))

module.exports = router;