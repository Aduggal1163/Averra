import ServiceBooking from '../models/ServiceBooking.model.js'
import User from '../models/User.model.js'
export const bookingServiceProvider = async (req, res) => {
    try {
        const { serviceprovider_id, service, dateTime } = req.body;
        const resident_id = req.user.id;// from requireSignIn middleware
        if (!serviceprovider_id || !service || !dateTime) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const provider = await User.findById(serviceprovider_id);
        console.log(provider.role);
        if (!provider || provider.role !== 'service_provider') {
            return res.status(400).json({ message: "User not found" });
        }
        if (!provider.services_offered.includes(service)) {
            return res.status(400).json({ message: "This provider doesn't offer the selected service" });
        }
        const booking = await ServiceBooking.create({
            resident_id,
            serviceprovider_id,
            service,
            dateTime
        });

        res.status(201).json({
            message: "Service booked successfully",
            booking
        });

    } catch (error) {
        console.error("Booking error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getResidentBooking = async(req,res)=>{
    try {
        const resident_id=req.user.id;
        const bookings= await ServiceBooking.find({resident_id}).populate('serviceprovider_id','name services_offered');
        res.status(200).json({
            message:"Bookings retrieved successfully",
            bookings
        })
    } catch (error) {
        console.error("Resident Booking Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
    }
}
export const getProviderBooking = async(req,res)=>{
    try {
        const serviceprovider_id=req.user.id;
        const bookings= await ServiceBooking.find({serviceprovider_id}).populate('resident_id','name email');
        res.status(201).json({
            message:"Bookings retrieved successfully",
            bookings
        })
    } catch (error) {
        console.error("Provider Booking Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
    }
}
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await ServiceBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.serviceprovider_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ message: `Booking ${status}`, booking });
  } catch (error) {
    console.error("Update Booking Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
