module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('organizers', [
    {
      email: 'organizer1@example.com',
      permissions: JSON.stringify(['manageEvents', 'manageAttendees']),
      passwordHash: 'hashedPassword1',
      primaryOrganizerId: 1
    },
    {
      email: 'organizer2@example.com',
      permissions: JSON.stringify(['manageSponsors']),
      passwordHash: 'hashedPassword2',
      primaryOrganizerId: 1
    }
  ]),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('organizers', null, {})
};
