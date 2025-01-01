module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('users', [
    {
      email: 'john.doe@example.com',
      phoneNumber: '1234567890',
      password: 'hashed_password_1'
    },
    {
      email: 'jane.doe@example.com',
      phoneNumber: '0987654321',
      password: 'hashed_password_2'
    }
  ]),
  
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('users', null, {})
};
