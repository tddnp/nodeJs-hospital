import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

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

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                // user already exist             
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'passWord'],
                    where: { email: email },
                    raw: true,
                });
                if (user) {
                    //compare password
                    let check = await bcrypt.compareSync(password, user.passWord);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "ok";
                        delete user.passWord;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Wrong password";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User not found`;
                }
            } else {
                // return err
                userData.errCode = 1;
                userData.errMessage = `Your's email is not exist in our system!`;
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['passWord']
                    }
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['passWord'],
                    }
                })
            }
            resolve(users);
        } catch (error) {
            reject(error);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email first 
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'we already has this email, please try again',
                })
            } else {
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
                console.log(data);
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                });
            }
        } catch (error) {
            reject(error);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            })
            if (user) {
                //console.log(user);
                // await user.destroy(); this will not work because destroy requried sequelize type, 
                // but we set the raw:true so we need to do the following:
                await db.User.destroy({
                    where: { id: userId }
                });
                resolve({
                    errCode: 0,
                    errMessage: 'Successfully delete user'
                })
            }
            resolve({
                errCode: 2,
                errMessage: 'User is not exist in our system, please try again'
            })
        } catch (error) {
            reject(error);
        }
    })
}

let editUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing required parameter",
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phoneNumber = data.phoneNumber;
                await user.save();
                resolve({
                    errCode: 0,
                    errMessage: `Successfully updated user`
                });
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    editUser: editUser
}