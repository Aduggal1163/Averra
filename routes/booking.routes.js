import {Router} from "express";
import {requireSignIn} from '../middlewares/auth.js'
import { bookingServiceProvider, getProviderBooking, getResidentBooking, updateBookingStatus } from "../controllers/booking.controller.js";
const router=Router();
router.post("/book-service",requireSignIn,bookingServiceProvider);
router.get("/resident-booking",requireSignIn,getResidentBooking);
router.get("/provider-booking",requireSignIn,getProviderBooking);
router.post("/status/:bookingId",requireSignIn,updateBookingStatus);
export default router;