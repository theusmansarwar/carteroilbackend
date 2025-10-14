const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "mail.carteroilusa.com", // Carter Oil mail server
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // e.g. info@carteroilusa.com
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmailToCompany = ({ email, name, lastname, subject, phone, query }, res) => {
  // ✅ 1. Email to the Customer
  const customerMailOptions = {
    from: `"Carter Oil USA" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Thank You for Contacting Carter Oil USA`,
    html: `
      <body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f4f4f4;">
        <table cellpadding="0" cellspacing="0" border="0" 
          style="width:100%; background-color:#f4f4f4; padding:20px; text-align:center;">
          <tr>
            <td>
              <table cellpadding="0" cellspacing="0" border="0" 
                style="max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:8px; 
                overflow:hidden; box-shadow:0 4px 6px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background-color:#003366; padding:20px; text-align:center;">
                    <h1 style="color:#ffffff; margin:0; font-size:22px;">Thank You for Contacting Carter Oil USA</h1>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:20px; text-align:left; color:#333;">
                    <p style="font-size:16px;">Dear ${name} ${lastname},</p>
                    <p style="font-size:16px; margin:16px 0;">
                      Thank you for reaching out to <strong>Carter Oil USA</strong>. 
                      We have received your inquiry and one of our team members will get back to you shortly.
                    </p>
                    <p style="font-size:16px;">
                      Carter Oil delivers trusted lubricants and oilfield services worldwide, 
                      combining over 125 years of expertise with advanced technology and safety.
                    </p>
                    <p style="margin-top:16px; font-size:16px;">Best regards,</p>
                    <p style="font-weight:bold; font-size:16px;">Carter Oil USA Team</p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background-color:#f4f4f4; padding:10px; text-align:center; font-size:14px; color:#777;">
                    <p style="margin:0;">&copy; 2025 Carter Oil USA. All rights reserved.</p>
                    <p style="margin:0;">
                      Visit us: <a href="https://carteroilusa.com" style="color:#003366; text-decoration:none;">carteroilusa.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    `,
  };

  // ✅ 2. Email to the Admin
  const adminMailOptions = {
    from: `"Carter Oil USA" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Inquiry from ${name} ${lastname}`,
    html: `
      <body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f4f4f4;">
        <table cellpadding="0" cellspacing="0" border="0" 
          style="width:100%; background-color:#f4f4f4; padding:20px; text-align:center;">
          <tr>
            <td>
              <table cellpadding="0" cellspacing="0" border="0" 
                style="max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:8px; 
                overflow:hidden; box-shadow:0 4px 6px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background-color:#003366; padding:20px; text-align:center;">
                    <h1 style="color:#ffffff; margin:0; font-size:22px;">New Lead Received</h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:20px; text-align:left; color:#333;">
                    <p><strong>Name:</strong> ${name} ${lastname}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong></p>
                    <p>${query}</p>

                    <p style="margin:20px 0;">
                      <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" 
                        style="display:inline-block; background-color:#003366; color:#ffffff; 
                        padding:10px 20px; text-decoration:none; border-radius:4px; font-size:14px;">
                        Reply to Lead
                      </a>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color:#f4f4f4; padding:10px; text-align:center; font-size:14px; color:#777;">
                    <p style="margin:0;">This is an automated email. Please do not reply directly.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    `,
  };

  // ✅ Send both emails
  transporter.sendMail(customerMailOptions, (error) => {
    if (error) {
      console.error("Error sending email to customer:", error);
      return res.status(500).json({ status: 500, message: "Error sending email to customer" });
    }

    transporter.sendMail(adminMailOptions, (adminError) => {
      if (adminError) {
        console.error("Error sending email to admin:", adminError);
        return res.status(500).json({ status: 500, message: "Error sending email to admin" });
      }

      return res.status(200).json({ status: 200, message: "Emails sent successfully" });
    });
  });
};

module.exports = { sendEmailToCompany };
