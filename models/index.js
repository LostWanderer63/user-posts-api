const sequelize = require('../config/database');
const User = require('./User');
const Post = require('./Post');

// One-to-Many: one user has many posts, each post belongs to one user.
// Adds a userId foreign key column to the posts table.
User.hasMany(Post, {
  foreignKey: { name: 'userId', allowNull: false },
  as: 'posts',
  onDelete: 'CASCADE',
});
Post.belongsTo(User, {
  foreignKey: { name: 'userId', allowNull: false },
  as: 'user',
});

module.exports = { sequelize, User, Post };
