// Chọn qua lại giữa các trang trên menu -------------------------------------------------------
function openTab(tabId, element) {
  // Ẩn tất cả tab có class tab-content
  document
    .querySelectorAll(".tab-content")
    .forEach((el) => (el.style.display = "none"));

  // Hiện tab được chọn
  document.getElementById(tabId).style.display = "block";

  // Xóa trạng thái active của tất cả nút
  document
    .querySelectorAll(".tab-menu button")
    .forEach((btn) => btn.classList.remove("active"));

  // Thêm active cho nút được chọn
  element.classList.add("active");
}

// Hiển thị thời gian trên trang chính ----------------------------------------------------------
const timeElement = document.querySelector(".time");
const dateElement = document.querySelector(".date");

/**
 * @param {Date} date
 */
function formatTime(date) {
  const hour12 = date.getHours() % 12 || 12;
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const isAm = date.getHours() < 12;

  return `${hour12.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${
    isAm ? "AM" : "PM"
  }`;
}

/**
 * @param {Date} date
 */
function formatDate(date) {
  const DAYS = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];
  return `${DAYS[date.getDay()]}, ngày ${date.getDate()} tháng ${
    date.getMonth() + 1
  } năm ${date.getFullYear()}`;
}

setInterval(() => {
  const now = new Date();
  timeElement.textContent = formatTime(now);
  dateElement.textContent = formatDate(now);
}, 200);

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const tabId = params.get("tab");

  // MỞ TAB THEO URL
  if (tabId) {
    const tabElement = document.getElementById(tabId);

    if (tabElement) {
      // Ẩn tất cả tab
      document.querySelectorAll(".tab-content").forEach((el) => {
        el.style.display = "none";
      });

      // Hiện tab được chọn
      tabElement.style.display = "block";

      // Bỏ class 'active' của tất cả nút
      document.querySelectorAll(".tab-menu button").forEach((btn) => {
        btn.classList.remove("active");
      });

      // Tìm nút có onclick gọi openTab với tabId tương ứng
      const matchingButton = Array.from(
        document.querySelectorAll(".tab-menu button")
      ).find((btn) =>
        btn.getAttribute("onclick")?.includes(`openTab('${tabId}'`)
      );

      if (matchingButton) {
        matchingButton.classList.add("active");
      }
    }
  }

  if (params.has("success") && params.get("success") === "registered") {
    const username = params.get("username") || "";
    showToast(`Đã thêm ${username} vào danh sách thành viên!`);
  }

  // Xóa query string sau khi hiển thị toast
  window.history.replaceState({}, document.title, window.location.pathname);
});

// Hiển thị Toast khi làm gì đó thành công --------------------------------------------------------
function showToast(message, isError = false) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = "toast";
  if (isError) toast.classList.add("error");

  document.body.appendChild(toast);

  // cho browser nhận class show
  setTimeout(() => toast.classList.add("show"), 10);

  // 2.5 giây sau ẩn toast
  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hide");
    setTimeout(() => toast.remove(), 500); // xóa khỏi DOM sau khi ẩn
  }, 2500);
}

// Hiện popup khi xoá người dùng để xác nhận ---------------------------------------------------
let selectedUserId = null;
function openDeletePopup(userId) {
  selectedUserId = userId;
  document.getElementById("popup").classList.add("active");
}

function closeDeletePopup() {
  document.getElementById("popup").classList.remove("active");
}

async function deleteUser(userId) {
  try {
    const response = await fetch(`/users/${userId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // Xoá hàng khỏi bảng
      const row = document.getElementById(`user-${userId}`);
      if (row) row.remove();

      // Dùng toast của bạn
      showToast("Xoá thành công!");
    } else {
      showToast("Xoá thất bại!", true);
    }
  } catch (error) {
    console.error(error);
    showToast("Đã xảy ra lỗi!", true);
  }
}

document
  .getElementById("confirm-delete")
  .addEventListener("click", async () => {
    if (selectedUserId) {
      await deleteUser(selectedUserId);
      closeDeletePopup();
    }
  });
