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
  emailjs.init({ publicKey: "kPy0S-rBy3x5omKHQ" }); 
  // Thay YOUR_USER_ID bằng User ID của bạn

  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault(); // Ngăn chặn tải lại trang khi gửi biểu mẫu

    let formData = {
      name: document.querySelector('input[name="name"]').value,
      email: document.querySelector('input[name="email"]').value,
      phone: document.querySelector('input[name="phone"]').value,
      message: document.querySelector('textarea[name="message"]').value,
    };

    emailjs
      .send("service_zf2ej2t", "template_e3iurgn", formData) // Thay bằng Service ID và Template ID
      .then(
        function (response) {
          alert("Gửi tin nhắn thành công!");
        },
        function (error) {
          alert("Gửi tin nhắn thất bại: " + JSON.stringify(error));
        }
      );
  });
});
