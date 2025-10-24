const Event = require('../models/Event');
const Registration = require('../models/Registration');
const QRCode = require('qrcode');

exports.getAll = async (req, res) => {
  const q = {};
  if (req.query.category) q.category = req.query.category;
  if (req.query.search) q.title = { $regex: req.query.search, $options: 'i' };
  const events = await Event.find(q).sort({ date: 1 });
  res.json(events);
};

exports.getOne = async (req, res) => {
  const ev = await Event.findById(req.params.id).populate('registeredUsers', 'name email');
  if (!ev) return res.status(404).json({ message: 'Event not found' });
  res.json(ev);
};

exports.create = async (req, res) => {
  const payload = req.body;
  try {
    const event = await Event.create(payload);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  const ev = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!ev) return res.status(404).json({ message: 'Event not found' });
  res.json(ev);
};

exports.remove = async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};

exports.registerForEvent = async (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.user._id;
  const event = await Event.findById(eventId);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  if (event.capacity && event.registeredUsers.length >= event.capacity) {
    return res.status(400).json({ message: 'Event full' });
  }

  if (event.registeredUsers.find(id => id.toString() === userId.toString())) {
    return res.status(400).json({ message: 'Already registered' });
  }

  event.registeredUsers.push(userId);
  await event.save();

  const qrPayload = `event:${eventId};user:${userId};ts:${Date.now()}`;
  const qrDataURI = await QRCode.toDataURL(qrPayload);

  const reg = await Registration.create({
    userId,
    eventId,
    qrCodeDataURI: qrDataURI
  });

  res.json({ message: 'Registered', registration: reg });
};

exports.getParticipants = async (req, res) => {
  const eventId = req.params.eventId;
  const regs = await Registration.find({ eventId }).populate('userId', 'name email');
  res.json(regs);
};
