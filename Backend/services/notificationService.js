const nodemailer = require('nodemailer');
const { Notification, User } = require('../models');

const createTransporter = () => {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
};

const sendEmail = async ({ to, subject, text }) => {
  const transporter = createTransporter();
  if (!transporter) return null;
  return transporter.sendMail({
    from: process.env.MAIL_FROM || 'Salon System <no-reply@salon.local>',
    to,
    subject,
    text,
  });
};

const notifyUser = async ({ userId, appointmentId = null, type, title, message, email = false }) => {
  const notification = await Notification.create({
    userId,
    appointmentId,
    type,
    title,
    message,
    channel: 'InApp',
  });

  if (email) {
    const user = await User.findByPk(userId);
    if (user?.email) {
      await sendEmail({ to: user.email, subject: title, text: message });
      notification.sentAt = new Date();
      await notification.save();
    }
  }

  return notification;
};

module.exports = { notifyUser, sendEmail };
