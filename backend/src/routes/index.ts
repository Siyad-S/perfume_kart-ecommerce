import { Router } from 'express';
import userRouter from './user.route'
import productRouter from './product.route'
import brandRouter from './brand.route'
import categoryRouter from './category.route'
import fileRouter from './file.route'
import bannerRouter from './banner.route'
import paymentRouter from './payment.route'
import orderRouter from './order.route'

const router = Router();
//user route
router.use('/user', userRouter)

//product route
router.use('/product', productRouter)

//brand route
router.use('/brand', brandRouter)

//category route
router.use('/category', categoryRouter)

//files route
router.use('/file', fileRouter)

//banner route
router.use('/banner', bannerRouter)

//payment route
router.use('/payment', paymentRouter)

//order route
router.use('/order', orderRouter)

export default router;