const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { check, validationResult } = require('express-validator')

const Machine = require('../../models/Machine')
const MachineType = require('../../models/MachineType')
const auth = require('../../middleware/auth')
const admin = require('../../middleware/admin')

// @route GET /api/machine/all
// @desc Get all machines
// @access Public
router.get('/all', async (req, res) => {
    try {
        const machines = await Machine.find()

        if (!machines) {
            return res.status(404).json({ msg: 'No machines found!' })
        }

        res.json(machines)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Server Error' })
    }
})

// @route GET /api/machine/all/:type_id
// @desc Get all machines by type id
// @access Public
router.get('/all/:type_id', async (req, res) => {
    try {
        const type = await MachineType.findById(req.params.type_id)

        if (!type) {
            return res.status(404).json({ msg: 'Type was not found!' })
        }

        const machines = await Machine.find({ types: mongoose.Types.ObjectId(req.params.category_id)})
        
        if (!machines) {
            return res.status(404).json({ msg: 'No machines found in the type!' })
        }

        res.json(machines)
    } catch ( error ) {
        console.error(error)
        res.status(500).json({ msg: 'Server Error' })
    }
})

// @route GET /api/machine/:id
// @desc Get machine by id
// @access Public
router.get('/:id', async (req, res) => {
    try {
        const machine = await Machine.findById(req.params.id)

        if (!machine) {
            return res.status(404).json({ msg: 'Machine was not found!' })
        }

        res.json(machine)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Server Error' })
    }
})

// @route PUT /api/machine 
// @desc Create a new machine
// @access Private
router.put('/', [auth, admin, [
    check('name', 'Name is required').not().isEmpty(),
    check('types', 'Types is required').not().isEmpty(),
    check('price', 'Price is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }

    const {
        name,
        brand,
        model,
        types,
        price, 
        voltage,
        images,
        video,
        condition,
        year,
        description,
        isSold,
        stock,
        region
    } = req.body

    const machineFields = {}

    if(name) machineFields.name = name
    if(brand) machineFields.brand = brand
    if(model) machineFields.model = model
    if(types) {
        machineFields.types = types.split(',').map(type => type.trim())
    }
    if(price) machineFields.price = price
    if(voltage) machineFields.voltage = voltage
    if(description) machineFields.description = description
    if(images) machineFields.images = images
    if(video) machineFields.video = video
    if(condition) machineFields.condition = condition
    if(year) machineFields.year = year
    if(isSold != null) machineFields.isSold = isSold 
    if(stock) machineFields.stock = stock
    if(region) machineFields.region = region

    try {
        let machine = await Machine.findOne({ name: name })

        // if machine exists, add 1 to the stock number
        if(machine) {
            machine.stock = machine.stock + 1
            return res.json(machine)
        }

        machine = new Machine(machineFields)
        
        await machine.save()
        return res.json(machine)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Server Error' })
    }
})

// @route PUT /api/machine/:id 
// @desc Update a machine by id
// @access Private
router.put('/:id', auth, admin, async (req, res) => {

    const {
        name,
        brand,
        model,
        types,
        price, 
        voltage,
        images,
        video,
        condition,
        year,
        description,
        isSold,
        stock,
        region
    } = req.body

    const machineFields = {}

    if(name) machineFields.name = name
    if(brand) machineFields.brand = brand
    if(model) machineFields.model = model
    if(types) {
        machineFields.types = types.split(',').map(type => type.trim())
    }
    if(price) machineFields.price = price
    if(voltage) machindFields.voltage = voltage
    if(description) machineFields.description = description
    if(images) machineFields.images = images
    if(video) machineFields.video = video
    if(condition) machineFields.condition = condition
    if(year) machineFields.year = year
    if(isSold != null) machineFields.isSold = isSold 
    if(stock) machineFields.stock = stock 
    if(region) machineFields.region = region


    try {
        let machine = await Machine.findById(req.params.id)

        if(!machine) {
            return res.status(404).json({ msg: 'Machine was not found!' })
        }

        machine = await Machine.findByIdAndUpdate(req.params.id, machineFields, { new: true })
        res.json(machine)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Server Error' })
    }
})

// @route DELETE /api/machine/:id
// @desc Delete a machine by id
// @access Private
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        const machine = await Machine.findById(req.params.id)

        if (!machine) {
            return res.status(404).json({ msg: 'Machine was not found!' })
        }

        await Machine.findByIdAndDelete(req.params.id)
        res.json({ msg: 'Machine was deleted!' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Server Error' })
    }
})


module.exports = router