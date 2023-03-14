const AuthRoutes= require("./Auth")
const MailRoutes= require("./Mailing")
const paymentRoutes = require("./Payment")
const { createProxyMiddleware } = require('http-proxy-middleware');
const exp=require('express')

const route=exp.Router()
route.use(exp.json());
route.use(exp.urlencoded());
route.use('/employees',require('./EmployeeManagment'),createProxyMiddleware({ target: 'http://localhost:8000', changeOrigin: true }))
route.use('/customers',AuthRoutes,createProxyMiddleware({ target: 'http://localhost:8000', changeOrigin: true }))
route.use('/mail',MailRoutes,createProxyMiddleware({ target: 'http://localhost:8000', changeOrigin: true }))
route.use('/customer_payments',paymentRoutes,createProxyMiddleware({ target: 'http://localhost:8000', changeOrigin: true }))
route.use('/images',require('./uploadroutes'),createProxyMiddleware({ target: 'http://localhost:8000', changeOrigin: true }))
route.use('/restaurant',require('./RestaurantManagment'),createProxyMiddleware({ target: 'http://localhost:8000', changeOrigin: true }))
route.use('/posts',require('./PostMangment'),createProxyMiddleware({ target: 'http://localhost:8000', changeOrigin: true }))
route.use('/resp',require('./ResponsibleAuth'),createProxyMiddleware({ target: 'http://localhost:8000', changeOrigin: true }))
route.use('/franchises',require('./FranchiseMangement'),createProxyMiddleware({ target: 'http://localhost:8000', changeOrigin: true }))
module.exports=route