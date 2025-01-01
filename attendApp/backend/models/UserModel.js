const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize('attend', 'root', 'root', {
  host: 'db',
  port: 3306,
  dialect: 'mysql',
});

class User extends Model {
  static init(sequelize) {
    super.init({
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isNumeric: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'User',
      timestamps: false,
      tableName: 'users',
    });
  }

  static hashPassword(password) {
    // Implement password hashing logic here, e.g., using bcrypt
  }
}

User.init(sequelize);

module.exports = User;