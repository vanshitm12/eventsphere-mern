const Event = require('../models/Event');
const User = require('../models/User');
const QRCode = require('qrcode');

exports.registerForEvent = async (req, res) => {
  try {
    const userId = req.user.id;          // from auth middleware
    const eventId = req.params.eventId;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if already registered
    if (event.registeredUsers.includes(userId)) {
      return res.status(400).json({ message: "Already registered" });
    }

    event.registeredUsers.push(userId);
    await event.save();

    // Generate QR code
    const qrCode = await QRCode.toDataURL(`${eventId}-${userId}`);

    res.json({ message: "Registered successfully", qrCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};