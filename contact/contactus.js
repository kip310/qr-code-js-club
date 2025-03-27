const inputs = document.querySelectorAll(".input");

function focusFunc() {
  let parent = this.parentNode;
  parent.classList.add("focus");
}

function blurFunc() {
  let parent = this.parentNode;
  if (this.value.trim() === "") {
    parent.classList.remove("focus");
  }
}

inputs.forEach((input) => {
  input.addEventListener("focus", focusFunc);
  input.addEventListener("blur", blurFunc);
});

document.addEventListener("DOMContentLoaded", function () {
  emailjs.init({ publicKey: "kPy0S-rBy3x5omKHQ" }); // Keep your public key

  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page reload on form submission

    let name = document.querySelector('input[name="name"]').value.trim();
    let email = document.querySelector('input[name="email"]').value.trim();
    let phone = document.querySelector('input[name="phone"]').value.trim();
    let message = document.querySelector('textarea[name="message"]').value.trim();

    // Validation
    if (!name || !email || !phone || !message) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    // Check if phone number has more than 9 digits
    const phoneDigits = phone.replace(/\D/g, ""); // Remove non-digit characters
    if (phoneDigits.length <= 9) {
      alert("Phone number has more than 9 digits.");
      return;
    }

    let formData = {
      name,
      email,
      phone,
      message,
    };

    emailjs
      .send("service_zf2ej2t", "template_e3iurgn", formData) // Keep your service ID and template ID
      .then(
        function (response) {
          alert("Gửi tin nhắn thành công!");
          document.querySelector("form").reset(); // Reset form after successful submission
          inputs.forEach((input) => input.parentNode.classList.remove("focus")); // Remove focus states
        },
        function (error) {
          alert("Gửi tin nhắn thất bại: " + JSON.stringify(error));
        }
      );
  });
});
