import { Router, type IRouter } from "express";
import healthRouter from "./health";
import carsRouter from "./cars";
import usersRouter from "./users";
import sellersRouter from "./sellers";
import buyersRouter from "./buyers";
import favoritesRouter from "./favorites";
import inquiriesRouter from "./inquiries";
import makesRouter from "./makes";
import statsRouter from "./stats";
import searchRouter from "./search";
import ogRouter from "./og";

const router: IRouter = Router();

router.use(ogRouter);
router.use(healthRouter);
router.use(carsRouter);
router.use(usersRouter);
router.use(sellersRouter);
router.use(buyersRouter);
router.use(favoritesRouter);
router.use(inquiriesRouter);
router.use(makesRouter);
router.use(statsRouter);
router.use(searchRouter);

export default router;
