import { Router, type IRouter } from "express";
import healthRouter from "./health";
import dashboardRouter from "./dashboard";
import serviceLinesRouter from "./service-lines";
import leadSourcesRouter from "./lead-sources";
import campaignsRouter from "./campaigns-routes";
import bookingsRouter from "./bookings";
import contentRouter from "./content-routes";
import agentsRouter from "./agents-routes";
import alertsRouter from "./alerts-routes";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dashboardRouter);
router.use(serviceLinesRouter);
router.use(leadSourcesRouter);
router.use(campaignsRouter);
router.use(bookingsRouter);
router.use(contentRouter);
router.use(agentsRouter);
router.use(alertsRouter);

export default router;
