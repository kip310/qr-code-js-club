  const inputs = document.querySelectorAll(".input");

  function focusFunc() {
    let parent = this.parentNode;
    parent.classList.add("focus");
  }

  function blurFunc() {
    let parent = this.parentNode;
    if (this.value == "") {
      parent.classList.remove("focus");
    }
  }

  inputs.forEach((input) => {
    input.addEventListener("focus", focusFunc);
    input.addEventListener("blur", blurFunc);
  });

  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("contact-form").addEventListener("submit", async function (event) {
      event.preventDefault();

      let name = document.querySelector('input[name="name"]').value.trim();
      let email = document.querySelector('input[name="email"]').value.trim();
      let phone = document.querySelector('input[name="phone"]').value.trim();
      let message = document.querySelector('textarea[name="message"]').value.trim();

      if (!name || !email || !phone || !message) {
        alert("Vui lòng điền đầy đủ tất cả các trường thông tin!");
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        alert("Vui lòng nhập địa chỉ email hợp lệ!");
        return;
      }

      const formData = {
        from_name: name,
        to_email: email,
        phone: phone,
        message: message,
      };

      try {
        const response = await fetch("https://send-mail.duckip310.workers.dev/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert("Gửi tin nhắn thành công!");
          document.getElementById("contact-form").reset();
          inputs.forEach((input) => input.parentNode.classList.remove("focus"));
        } else {
          alert("Gửi tin nhắn thất bại: " + (await response.text()));
        }
      } catch (error) {
        alert("Đã xảy ra lỗi: " + error.message);
      }
    });
  });