import { Router, type IRouter } from "express";
import healthRouter from "./health";
import wilayasRouter from "./wilayas";
import servicesRouter from "./services";
import appointmentsRouter from "./appointments";
import queuesRouter from "./queues";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(wilayasRouter);
router.use(servicesRouter);
router.use(appointmentsRouter);
router.use(queuesRouter);
router.use(adminRouter);

export default router;
