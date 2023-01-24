import db from '../models/index'
import CRUDService from "../services/CRUDServices"

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render("homePage.ejs", {
            data: JSON.stringify(data)
        });
    } catch (error) {
        console.log(error);
    }    
}

let getCRUD = (req, res) => {
    return res.render("crud.ejs");
}

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send("send post CRUD from server");
}

let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    // console.log(data);
    
    return res.render("displayCRUD.ejs", {
        dataTable: data
    });
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    console.log(userId);
    if (userId){
        let userData = await CRUDService.getAllUserById(userId);
        //check userData
        return res.render("editCRUD.ejs", {
            user: userData, //gan gia tri cua userData vao bien user de truyen xuong file ejs
        });
    }else{
        return res.send("user not found!!!")
    }
}

let putCRUD = async (req, res) => {
    let data = req.body;
    let allUser = await CRUDService.updateUserData(data);
    return res.render('displayCRUD.ejs', {
        dataTable: allUser,
    });
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id){
        await CRUDService.deleteUserById(id);
    } else {
        return res.send("user not found");
    }
    return res.send("successfully delete a user");

}

// Object: {
//     key: '',
//     value: '',
// }

module.exports = {
    getHomePage: getHomePage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}