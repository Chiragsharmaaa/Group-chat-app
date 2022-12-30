const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('../models/user');
const Forgotpassword = require('../models/forgotpassword');

exports.forgotpassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json('No user found!');
        }

        const id = uuid.v4();
        user.createForgotpassword({ id, active: true })
            .catch(err => { throw new Error(err) })

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
            to: email,
            from: 'chiragsharma250999@gmail.com',
            subject: 'Reset your password!',
            text: 'Click on the link to reset your password!',
            html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`
        };

        sgMail.send(msg).then(response => {
            return res.json({ message: 'Link to reset your password sent to your mail id', success: true });
        }).catch(err => {
            throw new Error(err);
        });
    } catch (error) {
        return res.json({ message: error, success: false });
    };
};

exports.resetpassword = async (req, res, next) => {
    let id = req.params.id;

    try {
        let forgotpasswordrequest = await Forgotpassword.findOne({ where: { id } });
        if (!forgotpasswordrequest) {
            return res.status(404).json('User doesnt exist!');
        };
        forgotpasswordrequest.update({ active: false });
        res.status(200).send(`<html>
        <script>
            function formsubmitted(e){
                e.preventDefault();
                console.log('called')
            }
        </script>
        <form action="/password/updatepassword/${id}" method="get">
            <label for="newpassword">Enter New password</label>
            <input name="newpassword" type="password" required></input>
            <button>reset password</button>
        </form>
    </html>`);
        res.end();
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    };
};

exports.updatepassword = async (req, res, next) => {
    const { newpassword } = req.query;
    const id = req.params.resetpasswordid;

    try {
        const resetpasswordrequest = await Forgotpassword.findOne({ where: { id } });
        const user = await User.findOne({ where: { id: resetpasswordrequest.userId } });
        if (!user) {
            return res.status(404).json({ error: 'No user exists!', success: false });
        };

        const salt = 10;
        bcrypt.hash(newpassword, salt, async (err, hash) => {
            if (err) {
                throw new Error(err);
            };
            await user.update({ password: hash });
            res.status(200).json({ message: 'Successfully updated new password!' });
        });
    } catch (error) {
        throw new Error(error);
    }
}