const express = require('express');
const router = express.Router();

const User = require('../models/User');
const bcrypt = require('bcrypt');
router.post('/signup', (req, res) => {
	let { name, email, password, dateofBirth } = req.body;
	name = name.trim();
	email = email.trim();
	password = password.trim();
	dateofBirth = dateofBirth.trim();
	// -  /^[a-zA-Z ]*$/  for name.
	// - /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ for email.
	if (name == '' || email == '' || password == '' || dateofBirth == ' ') {
		res.json({
			status: 'FAILED',
			message: 'Empty Input Fields'
		});
	} else if (!/^[a-zA-Z ]*$/.test(name)) {
		res.json({
			status: 'FAILED',
			message: 'Invalid Name Entered'
		});
	} else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
		res.json({
			status: 'FAILED',
			message: 'Invalid Email Entered'
		});
	} else if (!new Date(dateofBirth).getTime()) {
		res.json({
			status: 'FAILED',
			message: 'Invalid date of Birth Entered'
		});
	} else if (password.length < 8) {
		res.json({
			status: 'FAILED',
			message: 'Password is Too Short'
		});
	} else {
		User.find({ email }).then(result => {
			if (result.length) {
				res.json({
					status: 'FAILED',
					message: 'User with provided email Alredy Exists'
				});
			} else {
				const saltRounds = 10;
				bcrypt.hash(password, saltRounds).then(hashedPassword => {
					const newUser = new User({
						name,
						email,
						password: hashedPassword,
						dateofBirth,
					});
					newUser.save().then(result => {
						res.json({
							status: 'Success',
							message: 'SignUP Successfull',
							data: result,
						});
					})
						.catch(err => {
							res.json({
								status: 'FAILED',
								message: 'An Error occured while Ceating the account'
							});
						})
				})
					.catch(err => {
						res.json({
							status: 'FAILED',
							message: 'An Error occured while hashing the password!'
						});
					})
			}
		}).catch(err => {
			console.log(err);
			res.json({
				status: 'FAILED',
				message: 'An Error Pccured while checking for Existing User'
			});
		})
	}
})


router.post('/signin', (req, res) => {
	let { email, password } = req.body;
	password = password.trim();
	email = email.trim();
	if (email == '' || password == '') {
		res.json({
			status: 'FAILED',
			message: 'Empty Credential Supplied'
		});
	} else {
		User.find({ email }).then(data => {
			if (data.length) {
				const hashedPassword = data[0].password;
				bcrypt.compare(password,hashedPassword).then(result => {
					if (result) {
						res.json({
							status: 'SUCCESS',
							message: 'Signin Succesful',
							data: data
						});
					} else {
						res.json({
							status: 'FAILED',
							message: 'Invalid Password Entered'
						});
					}
				})
					.catch(err => {
						res.json({
							status: 'FAILED',
							message: 'An Error occured while comparing the password'
						});
					})
			} else {
				res.json({
					status: 'FAILED',
					message: 'Invalid Credential Entered'
				});
			}
		}).catch(err => {
			res.json({
				status: 'FAILED',
				message: 'An Error occured while checking for Existing User'
			});
		})

	}

})

module.exports = router;