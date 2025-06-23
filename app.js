function calculatePrice() {
  const ticketType = document.getElementById("ticket-type").value;
  const date = new Date(document.getElementById("date").value);
  const isWeekend = [0, 6].includes(date.getDay()); // 0: Chủ Nhật, 6: Thứ Bảy

  const adults = parseInt(document.getElementById("adults").value) || 0;
  const children = parseInt(document.getElementById("children").value) || 0;

  let adultPrice = 0,
    childPrice = 0;

  if (ticketType === "OCP2" || ticketType === "OCP3") {
    // Vé công viên đơn
    adultPrice = isWeekend ? 279000 : 235000;
    childPrice = isWeekend ? 200000 : 142000;
  } else {
    // Combo 2 công viên
    adultPrice = isWeekend ? 380000 : 279000;
    childPrice = isWeekend ? 270000 : 220000;
  }

  const total = adults * adultPrice + children * childPrice;

  document.getElementById("summary").innerHTML = `
      <div>Ngày: <strong>${date.toLocaleDateString("vi-VN")}</strong> (${
    isWeekend ? "Cuối tuần" : "Ngày thường"
  })</div>
      <div>Loại vé: <strong>${
        ticketType === "combo" ? "Combo 2 công viên" : "1 công viên"
      }</strong></div>
      <div>Người lớn: ${adults} x ${adultPrice.toLocaleString()}đ</div>
      <div>Trẻ em: ${children} x ${childPrice.toLocaleString()}đ</div>
      <div class="mt-2 text-xl">Tổng tiền: <strong>${total.toLocaleString()}đ</strong></div>
    `;
}
console.log(emailjs);
// emailjs.init({ publicKey: "LF-Rgs5sge0CyNGl5" });

let lastBooking = {};

function openBookingForm() {
  const dateInput = document.getElementById("date");
  const adults = parseInt(document.getElementById("adults").value) || 0;
  const children = parseInt(document.getElementById("children").value) || 0;

  // Reset lỗi trước đó
  document.getElementById("error-date").classList.add("hidden");
  document.getElementById("error-people").classList.add("hidden");

  let hasError = false;

  // Kiểm tra ngày
  if (!dateInput.value) {
    document.getElementById("error-date").classList.remove("hidden");
    hasError = true;
  }

  // Kiểm tra số người
  if (adults === 0 && children === 0) {
    document.getElementById("error-people").classList.remove("hidden");
    hasError = true;
  }

  if (!hasError) {
    document.getElementById("booking-form").classList.remove("hidden");
  }
}

function closeBookingForm() {
  document.getElementById("booking-form").classList.add("hidden");
}

function validatePhoneNumber(phone) {
  const regex = /^(0|\+84)[0-9]{9,10}$/;
  return regex.test(phone);
}

function submitBookingForm(e) {
  e.preventDefault();

  const name = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();

  if (name.length < 2) {
    alert("Tên ít nhất 2 ký tự");
    return;
  }

  if (!validatePhoneNumber(phone)) {
    alert("Số không hợp lệ");
    return;
  }

  const message = `
      Họ tên: ${name}
      Số điện thoại: ${phone}
      Email: ${email || "(không có)"}
      Loại vé: ${lastBooking.type}
      Ngày đi: ${lastBooking.dateType}
      Người lớn: ${lastBooking.adults}
      Trẻ em: ${lastBooking.children}
      Tổng tiền: ${lastBooking.total}đ
    `;

  emailjs
    .send("service_4h5y42l", "YOUR_TEMPLATE_ID", {
      to_email: "dokhoahaiphong4@gmail.com",
      from_name: name,
      message: message,
    })
    .then(
      () => {
        alert("Đã liên hệ chủ shop! Quý khách vui lòng chờ!");

        // Clear form
        document.getElementById("fullName").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("email").value = "";

        // Clear booking input
        document.getElementById("date").value = "";
        document.getElementById("adults").value = "";
        document.getElementById("children").value = "";

        document.getElementById("summary").innerHTML =
          "Hãy chọn loại vé và điền thông tin để xem tổng tiền.";
        closeBookingForm();
      },
      (err) => {
        alert("Gửi thất bại. Vui lòng thử lại.");
        console.error(err);
      }
    );
}
