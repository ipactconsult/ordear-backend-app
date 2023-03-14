const exp=require('express')
const route=exp.Router()

const PostManagementController=require('../controllers/PostsManagement')
route.post('/add_post',PostManagementController.addPost)
route.get('/get_posts',PostManagementController.display)
route.get('/get_posts/:id',PostManagementController.retrieve)
route.put('/edit_post/:id',PostManagementController.Edit)
module.exports=route