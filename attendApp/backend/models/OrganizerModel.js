const { Model, DataTypes, Sequelize } = require('sequelize');

const sequelize = new Sequelize('attend', 'root', 'root', {
  host: 'db',
  port: 3306,
  dialect: 'mysql',
  logging: false,
});

class Organizer extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      permissions: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      primaryOrganizerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'Organizer',
      tableName: 'organizers',
      timestamps: false,
    });
  }
}

module.exports = Organizer;