const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// ✅ CORRECT async function
const sendMail = async (to, otp) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject: `Your OTP Code is ${otp} - GuptaJi Mens Wear`,
      text: `Your GuptaJi Mens Wear security verification code is ${otp}. Use this code to verify your account securely. This code is valid for 5 minutes.`,
      html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GuptaJi Mens Wear OTP Verification</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

  <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    Your premium verification code is ${otp}. Welcome to GuptaJi Mens Wear.
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout:fixed;background-color:#f4f6f8;">
    <tr>
      <td align="center" style="padding: 30px 10px;">
        
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 15px 40px rgba(11,27,58,0.08);border: 1px solid #e1e8ed;">
          
          <tr>
            <td height="4" style="background:linear-gradient(90deg, #102a43 0%, #d4af37 50%, #102a43 100%); line-height:4px; font-size:0px;">&nbsp;</td>
          </tr>

          <tr>
            <td align="center" style="background-color:#102a43; padding:35px 20px 30px 20px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom:10px;">
                    <table border="0" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                      <tr>
                        <td align="center" style="border: 2px solid #d4af37; border-radius: 50%; padding: 12px; width: 40px; height: 40px;">
                          <span style="color:#d4af37; font-family:'Times New Roman', Times, serif; font-size:26px; font-weight:bold; line-height:1; display:block;">G</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 style="margin:0; font-family:'Cinzel', 'Times New Roman', Georgia, serif; color:#ffffff; font-size:24px; font-weight:700; letter-spacing:2px; text-transform:uppercase;">
                      GuptaJi Mens Wear
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:5px;">
                    <p style="margin:0; font-family:'Montserrat', Arial, sans-serif; color:#d4af37; font-size:12px; font-weight:500; letter-spacing:4px; text-transform:uppercase;">
                      Premium Men's Fashion
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:40px 35px 30px 35px; background-color:#ffffff;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom:15px;">
                    <h2 style="margin:0; font-family:'Cinzel', 'Times New Roman', Georgia, serif; color:#102a43; font-size:20px; font-weight:600; letter-spacing:1px;">
                      Welcome to GuptaJi Mens Wear
                    </h2>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:30px;">
                    <p style="margin:0; font-family:'Montserrat', Arial, sans-serif; color:#486581; font-size:14px; line-height:1.6; max-width:460px;">
                      Use the OTP below to verify your account securely and explore an elite shopping experience tailored just for you.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding-bottom:20px;">
                    <table border="0" cellpadding="0" cellspacing="0" style="margin:0 auto; box-shadow:0 10px 25px rgba(16,42,67,0.15);">
                      <tr>
                        <td align="center" style="background-color:#102a43; border-radius:12px; padding:18px 45px; border:1px solid #d4af37;">
                          <span style="font-family:'Courier New', Courier, monospace, sans-serif; color:#ffffff; font-size:32px; font-weight:700; letter-spacing:6px; line-height:1; display:block; padding-left:6px;">${otp}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding-bottom:35px;">
                    <p style="margin:0; font-family:'Montserrat', Arial, sans-serif; color:#627d98; font-size:13px;">
                      This secure OTP code is valid for <strong>5 minutes</strong>.<br />
                      Please do not share this credential with anyone.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding-bottom:15px;">
                    <table border="0" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                      <tr>
                        <td align="center" style="background-color:#102a43; border-radius:8px;">
                          <a href="https://www.guptajimenswear.com" target="_blank" style="display:inline-block; font-family:'Montserrat', Arial, sans-serif; font-size:14px; font-weight:600; color:#ffffff; text-decoration:none; padding:15px 35px; border-radius:8px; text-transform:uppercase; letter-spacing:2px; border: 1px solid #102a43;">
                            Shop Now
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="background-color:#f0f4f8; padding:25px 20px; border-top:1px solid #e1e8ed; border-bottom:1px solid #e1e8ed;">
              <p style="margin:0; font-family:'Cinzel', 'Times New Roman', Georgia, serif; color:#102a43; font-size:14px; font-weight:600; letter-spacing:1px; text-transform:uppercase; line-height:1.4;">
                "Discover the Latest Collection of Premium Men's Fashion"
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:35px 25px 25px 25px; background-color:#ffffff;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                
                <tr>
                  <td width="50%" align="left" style="padding-bottom:20px; padding-right:10px; vertical-align:middle;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:24px; padding-right:10px; vertical-align:middle;">👔</td>
                        <td style="font-family:'Montserrat', Arial, sans-serif; color:#102a43; font-size:13px; font-weight:600; vertical-align:middle;">Premium Quality</td>
                      </tr>
                    </table>
                  </td>
                  <td width="50%" align="left" style="padding-bottom:20px; padding-left:10px; vertical-align:middle;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:24px; padding-right:10px; vertical-align:middle;">🚚</td>
                        <td style="font-family:'Montserrat', Arial, sans-serif; color:#102a43; font-size:13px; font-weight:600; vertical-align:middle;">Fast Delivery</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td width="50%" align="left" style="padding-bottom:20px; padding-right:10px; vertical-align:middle;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:24px; padding-right:10px; vertical-align:middle;">💳</td>
                        <td style="font-family:'Montserrat', Arial, sans-serif; color:#102a43; font-size:13px; font-weight:600; vertical-align:middle;">Secure Payments</td>
                      </tr>
                    </table>
                  </td>
                  <td width="50%" align="left" style="padding-bottom:20px; padding-left:10px; vertical-align:middle;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:24px; padding-right:10px; vertical-align:middle;">🏷️</td>
                        <td style="font-family:'Montserrat', Arial, sans-serif; color:#102a43; font-size:13px; font-weight:600; vertical-align:middle;">Best Prices</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td width="50%" align="left" style="padding-bottom:10px; padding-right:10px; vertical-align:middle;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:24px; padding-right:10px; vertical-align:middle;">🔄</td>
                        <td style="font-family:'Montserrat', Arial, sans-serif; color:#102a43; font-size:13px; font-weight:600; vertical-align:middle;">Easy Exchange</td>
                      </tr>
                    </table>
                  </td>
                  <td width="50%" align="left" style="padding-bottom:10px; padding-left:10px; vertical-align:middle;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:24px; padding-right:10px; vertical-align:middle;">⭐</td>
                        <td style="font-family:'Montserrat', Arial, sans-serif; color:#102a43; font-size:13px; font-weight:600; vertical-align:middle;">Trusted Store</td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="background-color:#f8fafc; padding:20px 15px; border-top:1px solid #e1e8ed;">
              <p style="margin:0; font-family:'Montserrat', Arial, sans-serif; color:#627d98; font-size:11px; font-weight:500; letter-spacing:1px; line-height:1.8; text-transform:uppercase;">
                Shirts • T-Shirts • Jeans • Trousers • Jackets • Blazers • Kurta Pajama • Ethnic Wear • Formal Wear • Casual Wear • Accessories
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color:#102a43; padding:40px 30px 30px 30px; color:#cbd5e1; border-top:1px solid #d4af37;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom:20px;">
                    <h3 style="margin:0; font-family:'Cinzel', 'Times New Roman', Georgia, serif; color:#ffffff; font-size:16px; font-weight:600; letter-spacing:2px; text-transform:uppercase;">
                      GuptaJi Mens Wear
                    </h3>
                    <p style="margin:4px 0 0 0; font-family:'Montserrat', Arial, sans-serif; color:#d4af37; font-size:11px; font-weight:500; letter-spacing:2px; text-transform:uppercase;">
                      Premium Men's Fashion Store
                    </p>
                  </td>
                </tr>
                
                <tr>
                  <td align="center" style="padding-bottom:25px; border-bottom:1px solid #243e56;">
                    <p style="margin:4px 0; font-family:'Montserrat', Arial, sans-serif; font-size:13px; color:#9fb3c8; line-height:1.5;">
                      📍 Your Store Address<br />
                      📞 Phone: +91 XXXXXXXXXX | ✉️ Email: <a href="mailto:support@guptajimenswear.com" style="color:#d4af37; text-decoration:none;">support@guptajimenswear.com</a><br />
                      🌐 Website: <a href="https://www.guptajimenswear.com" target="_blank" style="color:#d4af37; text-decoration:none;">www.guptajimenswear.com</a>
                    </p>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding-top:25px;">
                    <p style="margin:3px 0; font-family:'Montserrat', Arial, sans-serif; font-size:11px; color:#627d98;">
                      &copy; 2026 GuptaJi Mens Wear. All Rights Reserved.
                    </p>
                    <p style="margin:3px 0; font-family:'Montserrat', Arial, sans-serif; font-size:11px; color:#486581;">
                      Developed & Managed by <a href="https://www.binarylogix.com" target="_blank" style="color:#627d98; text-decoration:underline;">Binarylogix Technologies LLP</a>.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully");
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

module.exports = sendMail;
