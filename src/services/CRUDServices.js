import bcrypt from "bcryptjs";
import db from '../models/index'

const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                passWord: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
            })
            resolve('successfully create a new user');

        } catch (error) {
            reject(error);
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error)
        }
    })
}

let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = db.User.findAll({raw: true});
            resolve(users);
        } catch (error) {
            reject(error);
        }
    })
}

let getAllUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: userId},
                raw: true
            })
            if (user){
                resolve(user);
            } else {
                resolve([]);
            }
        } catch (error) {
            reject(error);
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            })
            if (user){
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                //save data
                await user.save();
                let allUser = await db.User.findAll();
                resolve(allUser);
            } else {
                resolve();
            }
        } catch (error) {
            console.log(error);
        }
    })
}

let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: userId}
            });
            ///console.log(user);
            if (user){
                await user.destroy();
            }
            resolve(); // return
            
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createNewUser,
    getAllUser,
    getAllUserById,
    updateUserData,
    deleteUserById,
}