const User = require('../model/userModel')
const bcrypt = require('bcrypt')

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const userData = await User.findOne({ username })
        if (!userData) {
            return res.json({ msg: "Incorrect username or password.", status: false }).status(422)
        }
        const passwordCheck = bcrypt.compare(password, userData.password)
        if (!passwordCheck) {
            return res.json({ msg: "Incorrect username or password.", status: false }).status(422)
        }

        userData.password = undefined;

        return res.status(200).json({ status: true, userData })
    } catch (error) {
        next(error)
    }
}

const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username })
        if (usernameCheck) {
            return res.json({ msg: "Username already used", status: false }).status(422)
        }
        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            return res.json({ msg: "Email already used", status: false }).status(422)
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            email, username, password: hashedPassword
        })

        user.password = undefined;

        return res.status(200).json({ status: true, user })
    } catch (error) {
        next(error)
    }
}

const setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { image: avatarImage } = req.body
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage,
        }, { new: true })

        return res.status(200).json({ isSet: userData.isAvatarImageSet, image: userData.avatarImage })
    } catch (error) {
        next(error)
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const users = await User.find({ _id: { $ne: userId } }).select([
            'email',
            'username',
            'avatarImage',
            '_id',
        ])

        return res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

module.exports = { login, register, setAvatar, getAllUsers }