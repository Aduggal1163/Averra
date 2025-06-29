import {Router} from "express";
import {requireSignIn} from '../middlewares/auth.js'
import { bookingServiceProvider, getAllBookings, getProviderBooking, getResidentBooking, updateBookingStatus } from "../controllers/booking.controller.js";
const router=Router();
router.post("/book-service",requireSignIn,bookingServiceProvider);
router.get("/resident-booking",getResidentBooking);
router.get("/provider-booking",requireSignIn,getProviderBooking);
router.post("/status/:bookingId",requireSignIn,updateBookingStatus);
router.get("/allbookings",requireSignIn,getAllBookings)
export default router;