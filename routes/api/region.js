const express = require('express')
const router = express.Router()

const Region = require('../../models/Region')
const auth = require('../../middleware/auth')
const admin = require('../../middleware/admin')

// @route GET /api/region/all
// @desc Get all regions
// @access Public
router.get('/all', async (req, res) => {
    try {
        const regions = await Region.find()

        if (!regions) {
            return res.status(404).json({ msg: 'No regions found!' })
        }

        res.json(regions)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Server Error' })
    }
})

// @route GET /api/region/:id
// @desc Get region by id
// @access Private
router.get('/:id', auth, admin, async (req, res) => {
    try {
        const region = await Region.findById(req.params.id)

        if (!region) {
            return res.status(404).json({ msg: 'Region was not found!' })
        }

        res.json(region)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Server Error' })
    }
})

// @route PUT /api/region
// @desc Create a region
// @access Private
router.put('/', auth, admin, async (req, res) => {
    const { name } = req.body
    
    try {
        let region = await Region.findOne({ name: name })

        if(region) {
            return res.status(400).json({ msg: 'Region already exists!' })
        }

        region = new Region({ name: name })

        res.json(region)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Server Error' })
    }
})

// @route PUT /api/region/:id
// @desc Update a region
// @access Private
router.put('/:id', auth, admin, async (req, res) => {
    const { name } = req.body

    try {
        let region = await Region.findById(req.params.id)

        if (!region) {
            return res.status(404).json({ msg: 'Region was not found!' })
        }

        region = await Region.findByIdAndUpdate(req.params.id, { name: name}, { new: true })

        res.json(region)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Server Error' })
    }
})

// @route DELETE /api/region/:id
// @desc Delete a region
// @access Private
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        const region = await Region.findById(req.params.id)

        if(!region) {
            return res.status(404).json({ msg: 'Could not find region!' })
        }

        await Region.findByIdAndDelete(req.params.id)

        res.json({ msg: 'Deleted user!' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Server Error' })
    }
})

module.exports = router