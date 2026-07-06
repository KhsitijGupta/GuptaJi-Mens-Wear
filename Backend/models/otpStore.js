const otpData = new Map();

const EXPIRY = 5 * 60 * 1000; // 5 minutes

module.exports = {
  set(email, otp) {
    otpData.set(email, { otp, expires: Date.now() + EXPIRY, verified: false });
  },

  get(email) {
    const data = otpData.get(email);
    if (!data || Date.now() > data.expires) {
      otpData.delete(email);
      return null;
    }
    return data.otp;
  },

  verify(email) {
    const data = otpData.get(email);
    if (data) data.verified = true;
  },

  isVerified(email) {
    const data = otpData.get(email);
    return data?.verified;
  },

  clear(email) {
    otpData.delete(email);
  },
};
