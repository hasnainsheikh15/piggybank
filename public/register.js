const emailStep = document.getElementById("step-email");
const otpStep = document.getElementById("step-otp");
const successStep = document.getElementById("step-success");

const sendOtpBtn = document.getElementById("sendOtpBtn");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const resendOtp = document.getElementById("resendOtp");

sendOtpBtn.addEventListener("click", () => {
  const email = document.getElementById("emailInput").value;

  if (!email) {
    alert("Enter a valid email");
    return;
  }

  // TODO: CALL API → /send-otp
  console.log("Sending OTP to:", email);

  emailStep.style.display = "none";
  otpStep.style.display = "block";
});

verifyOtpBtn.addEventListener("click", () => {
  const otp = document.getElementById("otpInput").value;

  if (otp.length !== 6) {
    alert("Enter a valid 6 digit OTP");
    return;
  }

  // TODO: CALL API → /verify-otp
  console.log("Verifying OTP", otp);

  otpStep.style.display = "none";
  successStep.style.display = "block";
});

resendOtp.addEventListener("click", () => {
  console.log("Resending OTP…");
  alert("OTP Resent!");
});
