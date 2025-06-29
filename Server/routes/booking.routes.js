import {Router} from "express";
import {requireSignIn} from '../middlewares/auth.js'
import User from "../models/User.model.js";
import { bookingServiceProvider, getAllBookings, getAllServiceProviders, getProviderBooking, getResidentBooking, updateBookingStatus } from "../controllers/booking.controller.js";
const router=Router();
router.post("/book-service",requireSignIn,bookingServiceProvider);
router.get("/resident-booking",requireSignIn,getResidentBooking);
router.get("/provider-booking",requireSignIn,getProviderBooking);
router.post("/status/:bookingId",requireSignIn,updateBookingStatus);
router.get("/allbookings",requireSignIn,getAllBookings)
router.get("/all-providers", requireSignIn, getAllServiceProviders);
// Replace with your actual logic to fetch provider info
router.get('/provider-info', requireSignIn, async (req, res) => {
  try {
    const provider = await User.findById(req.user.id);
    res.json({
      earnings: provider.earnings || 0,
      services_offered: provider.services_offered || []
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;