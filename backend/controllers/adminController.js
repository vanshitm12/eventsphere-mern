const Event = require('../models/Event');
const User = require('../models/User');

exports.stats = async (req, res) => {
  const totalEvents = await Event.countDocuments();
  const totalUsers = await User.countDocuments();
  const upcoming = await Event.find({ date: { $gte: new Date() } }).countDocuments();
  res.json({ totalEvents, totalUsers, upcoming });
};
