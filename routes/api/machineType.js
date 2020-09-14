const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

const MachineType = require('../../models/MachineType')
const Machine = require('../../models/Machine')
const auth = require('../../middleware/auth')
const admin = require('../../middleware/admin')


// @route GET /api/machinetype/all
// @desc Get all machine types
// @access Public
router.get('/all', async (req, res) => {
    try {
        const types = await MachineType.find()

        if (!types) {
            return res.status(404).json({ msg: 'No types found!' })
        }

        res.json(types)
    } catch (error) { 
        console.error(error)
        res.status(500).json({ msg: 'Server Error' })       
    }
})

// @route GET /api/machinetype/:id
// @desc Get type by id
// @access Private
router.get('/:id', auth, admin, async (req, res) => {
    try {
        const type = await MachineType.findById(req.params.id)

        if (!type) {
            return res.status(404).json({ msg: 'Type was not found!' })
        }

        res.json(type)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Server Error' })
    }
})

// @route PUT /api/machinetype
// @desc Create a type
// @access Private
router.put('/', auth, admin, async (req, res) => {
    try {
        const { name } = req.body;
        let type = await MachineType.findOne({ name: name})

        if (type) {
            return res.status(400).json({ msg: 'Category already exists!' })
        }

        type = new MachineType({ name: name })

        await type.save()
        res.json(type)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Server Error' })
    }
})

// @route PUT /api/machinetype/:id
// @desc Update a machine type by id
// @access Private
router.put('/:id', auth, admin, async (req, res) => {
    try {
        let type = await MachineType.findById(req.params.id)

        if (!type) {
            return res.status(404).json({ msg: 'Type was not found!' })
        }

        const { name } = req.body

        const typeFields = {}
        if (name) typeFields.name = name

        type = await MachineType.findByIdAndUpdate(req.params.id, typeFields, { new: true })
        res.json(type)
    } catch (error) {
        console.error()
        res.status(500).json({ msg: 'Server Error' })
    }
})

// @route DELETE /api/machinetype/:id
// @desc Delete machine type by id
// @access Private
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        const type = await MachineType.findById(req.params.id)

        if (!type) {
            return res.status(404).json({ msg: 'Type was not found!' })
        }

        await MachineType.findByIdAndDelete(req.params.id)

        res.json({ msg: 'Type was deleted!' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Server Error' })
    }
})

module.exports = router