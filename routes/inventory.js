const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const passport = require('passport');
const Sequelize = require('sequelize');
const User = require('../models/User');

//Get all the list of inventory
router.get('/', authenticatedMiddleware(), (req, res) =>
Inventory.findAll()
    .then(inventory => {
        //console.log(inventory);
        //res.sendStatus(200);

        res.render('inventory', {inventory: inventory,
            update_stock: req.flash('update_stock'),
            delete_stock: req.flash('delete_stock'),
            add_stock: req.flash('add_stock')
        });
    })
    .catch(err => console.log(err)));

// Display add form
router.get('/add', authenticatedMiddleware(), (req, res) => res.render('add'));

// Add list of inventory
router.post('/add', (req, res) => {

    let { medicine, batch, expiry, quantity, category, note } = req.body;
    let available = quantity;
    let errors = [];

    if (!medicine){
        errors.push({ text: 'Please enter name of medicine'});
    }
    if (!batch){
        errors.push({ text: 'Please enter the batch number'});
    }
    if (!expiry){
        errors.push({ text: 'Please enter the expiry date'});
    }
    if (!quantity){
        errors.push({ text: 'Please the stock quantity'});
    }
    if (!category){
        errors.push({ text: 'Please the stock quantity'});
    }

    // Check for errors
    if(errors.length > 0) {
        res.render('add', {errors, medicine, batch, expiry, quantity, category});
    }else {
        //insert into db
        Inventory.create({
            medicine: medicine,
            batch: batch,
            expiry: expiry,
            quantity: quantity,
            available: available,
            category: category,
            note: note
        })
            .then(req.flash('add_stock', 'Inventory successfully added'),
                    res.redirect('/inventory'))
            .catch(err => console.log(err));
    }
});

// Display add form
router.get('/edit/:id', authenticatedMiddleware(), (req, res) => {
    let id = req.params.id;
    Inventory.findByPk(id).then(
        edit_info => {
            res.render('edit', {edit_info: edit_info})
        }
    ).catch(err => console.log(err));

});

router.post('/edit/:id', (req, res) => {
    const id = req.params.id;
    const { medicine, batch, expiry, quantity, category, note } = req.body;
    //const medicine = req.body.medicine;
   Inventory.update({medicine: medicine, batch: batch, expiry: expiry, quantity: quantity, category: category, note: note},
       {where: {id:id}}, {raw: true})
       .then(req.flash('edit_stock', 'Successfully edited the stock'),
           res.redirect('/inventory/drug_info/'+id))
       .catch(err => console.log(err));
})

router.get('/update_stock/:id', authenticatedMiddleware(), (req, res) => {
    let id = req.params.id;
    Inventory.findByPk(id).then(
        update_info => {
            res.render('update_stock', {update_info: update_info})
        }
    ).catch(err => console.log(err));
});

router.post('/update_stock/:id', (req, res) => {
    const id = req.params.id;
    const { available } = req.body;
    Inventory.update({available: available}, {where: {id:id}}, {raw: true})
        .then(req.flash('update_stock', 'Successfully updated the stock'),
            res.redirect('/inventory'))
        .catch(err => console.log(err));
})

// router.get('/', function( req, res ) {
//     res.render('index', { expressFlash: req.flash('success'), sessionFlash: res.locals.sessionFlash });
// });


// Display add form
router.get('/drug_info/:id', authenticatedMiddleware(), (req, res) => {
    let id = req.params.id;
    Inventory.findByPk(id).then(
        drug_info => {
            res.render('drug_info', {
                drug_info: drug_info,
                edit_stock: req.flash('edit_stock'),})
        }
    ).catch(err => console.log(err));

});

router.get('/delete/:id', authenticatedMiddleware(), (req, res) => {
    let id = req.params.id;
     Inventory.destroy({
        where: {
            id: id
        }
    }).then(req.flash('delete_stock', 'Successfully deleted the stock'),
         res.redirect('/inventory'))
         .catch(err => console.log(err));

});

// const totalAmount = await DONATIONS.findAll({
//     attributes: [
//         'member_id',
//         [sequelize.fn('sum', sequelize.col('amount')), 'total_amount'],
//     ],
//     group: ['member_id'],
//  });

router.get('/dashboard', authenticatedMiddleware(), (req, res) => {
    Inventory.sum('available')
        .then(total_available => {
            //let drug = parseInt(drugs.available, 10)
                res.render('dashboard', { total_available: total_available, layout: 'dashboard_landing'})
    }
    )
        .catch(err => console.log(err))

});

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    // console.log(`id: ${id}`);
    User.findByPk(id)
        .then((user) => {
            done(null, user);
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        });
});

function authenticatedMiddleware()  {
    return (req, res, next) => {
        console.log('req.session.passport.user: ${JSON.stringify(req.session.passport)}');

        if (req.isAuthenticated()) return next();
        res.redirect('/user/login');
    }
}

module.exports = router;