import express from 'express'
const router = express.Router()

import orderController from "../../controllers/student-controller/order-controller.js";

const { createOrder, capturePaymentAndFinalizeOrder } = orderController;

router.post("/create", createOrder);
router.post("/capture", capturePaymentAndFinalizeOrder);

export default router;
