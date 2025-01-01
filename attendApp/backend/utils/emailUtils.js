const nodemailer = require('nodemailer');

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send an invitation email to an attendee
const sendInvitationEmail = async (attendeeEmail, attendeeName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: attendeeEmail,
    subject: 'Event Invitation',
    text: `Hello ${attendeeName},\n\nYou are invited to our event. Please RSVP at your earliest convenience.\n\nThank you!`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Invitation sent to ${attendeeEmail}`);
  } catch (error) {
    console.error(`Failed to send invitation to ${attendeeEmail}:`, error);
  }
};

// Export the sendInvitationEmail function
module.exports = { sendInvitationEmail };
