import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);
    // display all user
    router.get("/crud", homeController.getCRUD);
    //create a new user
    router.get("/get-crud", homeController.displayGetCRUD);
    // action for create new user
    router.post("/post-crud", homeController.postCRUD);
    // display edit form
    router.get("/edit-crud", homeController.getEditCRUD);
    // action for edit
    router.post("/put-crud", homeController.putCRUD);
    // action for delete a new user
    router.get("/delete-crud", homeController.deleteCRUD);

    //api
    router.post("/api/login", userController.handleLogin);
    router.get("/api/get-all-users", userController.handleGetAllUsers);
    router.post("/api/create-new-user", userController.handleCreateNewUser);
    router.put("/api/edit-user", userController.handleEditUser);
    router.delete("/api/delete-user", userController.handleDeleteUser);

    router.get("/allcode", userController.getAllCode);

    return app.use("/", router);
};

module.exports = initWebRoutes;
