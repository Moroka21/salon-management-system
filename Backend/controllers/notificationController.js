const { Notification } = require('../models');

const listNotifications = async (req, res, next) => {
  try {
    res.json(
      await Notification.findAll({
        where: { userId: req.user.id },
        order: [['createdAt', 'DESC']],
      })
    );
  } catch (error) {
    next(error);
  }
};

const markRead = async (req, res, next) => {
  try {
    await Notification.update({ isRead: true }, { where: { id: req.params.id, userId: req.user.id } });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};

module.exports = { listNotifications, markRead };
