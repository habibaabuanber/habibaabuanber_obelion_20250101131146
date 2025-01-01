const { Model, DataTypes, Sequelize } = require('sequelize');

const sequelize = new Sequelize('attend', 'root', 'root', {
  host: 'db',
  port: 3306,
  dialect: 'mysql'
});

class Attendee extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'Attendees',
      timestamps: false
    });
  }
}

Attendee.init(sequelize);

module.exports = Attendee;