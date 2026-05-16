import * as UserModel from '../models/userModel.js';
import * as LoginAttemptModel from '../models/loginAttemptModel.js';

export const showAdminPanel = (req, res) => {
  const users = UserModel.getAll();
  const loginAttempts = LoginAttemptModel.getAll();
  res.render('admin', {
    user: req.user,
    users,
    loginAttempts,
    csrfToken: res.locals.csrfToken
  });
};

export const deleteUser = (req, res) => {
  const { userId } = req.body;
  UserModel.deleteById(userId);
  res.redirect('/admin');
};
