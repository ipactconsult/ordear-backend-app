const exp=require('express')
const route=exp.Router()
const ExecutorManagementController= require('../controllers/ExecutorsManagement')
route.post('/add_employee',ExecutorManagementController.AddExecutor)
route.post('/assign_post_to_employee/:id_emp',ExecutorManagementController.AssignRoleToExecutor)
route.get('/get_role/:id_emp',ExecutorManagementController.GetRole)
route.get("/view_profile/:id",ExecutorManagementController.RetrieveExecutor)
route.put("/edit_profile/:id",ExecutorManagementController.Edit_Executor)
route.get('/list/:id_rest',ExecutorManagementController.DisplayEmployeesByRestaurant)

module.exports=route