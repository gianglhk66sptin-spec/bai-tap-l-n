$(document).ready(function () {

  /* =====================================================
     1. DANH SÁCH CÔNG VIỆC
  ===================================================== */

  let tasks = [];


  /* HIỂN THỊ CÔNG VIỆC */
  function showTasks() {

      let keyword = $("#searchTask").val().toLowerCase();
      let person = $("#filterPerson").val();
      let status = $("#filterStatus").val();


      let result = tasks.filter(function (task) {

          let checkName =
              task.name.toLowerCase().includes(keyword);

          let checkPerson =
              person === "" || task.person === person;

          let checkStatus =
              status === "" || task.status === status;

          return checkName && checkPerson && checkStatus;
      });


      if (result.length === 0) {

          $("#taskList").html(`
              <div class="empty">

                  <i class="bi bi-clipboard-check"></i>

                  <p>Chưa có công việc phù hợp</p>

                  <small>
                      Hãy thêm công việc đầu tiên cho nhóm.
                  </small>

              </div>
          `);

          updateStatistics();

          return;
      }


      let html = "";


      result.forEach(function (task) {

          let statusText = "Chưa làm";

          if (task.status === "doing") {
              statusText = "Đang làm";
          }

          if (task.status === "done") {
              statusText = "Hoàn thành";
          }


          html += `

              <div class="task">

                  <div class="task-title">

                      <strong>
                          ${task.name}
                      </strong>

                      <span>
                          ${statusText}
                      </span>

                  </div>


                  <small>
                      ${task.note || "Không có ghi chú"}
                  </small>


                  <div class="task-info">

                      <span>
                          👤 ${task.person}
                      </span>

                      <span>
                          📅 ${task.deadline || "Chưa đặt"}
                      </span>

                      <span>
                          ⭐ ${task.priority}
                      </span>

                  </div>


                  <button onclick="changeStatus(${task.id})">
                      Đổi trạng thái
                  </button>


                  <button onclick="deleteTask(${task.id})">
                      Xóa
                  </button>

              </div>

          `;
      });


      $("#taskList").html(html);

      updateStatistics();
  }



  /* =====================================================
     2. THÊM CÔNG VIỆC
  ===================================================== */

  $("#taskForm").submit(function (event) {

      event.preventDefault();


      let name = $("#taskName").val().trim();


      if (name === "") {

          alert("Vui lòng nhập tên công việc!");

          return;
      }


      let task = {

          id: Date.now(),

          name: name,

          person: $("#taskPerson").val(),

          deadline: $("#taskDeadline").val(),

          priority: $("#taskPriority").val(),

          note: $("#taskNote").val(),

          status: "todo"

      };


      tasks.push(task);


      this.reset();


      showTasks();


      alert("Đã thêm công việc thành công!");
  });



  /* =====================================================
     3. TÌM KIẾM + LỌC
  ===================================================== */

  $("#searchTask").on("input", function () {

      showTasks();

  });


  $("#filterPerson").change(function () {

      showTasks();

  });


  $("#filterStatus").change(function () {

      showTasks();

  });



  /* =====================================================
     4. ĐỔI TRẠNG THÁI
  ===================================================== */

  window.changeStatus = function (id) {

      let task = tasks.find(function (item) {

          return item.id === id;

      });


      if (!task) {
          return;
      }


      if (task.status === "todo") {

          task.status = "doing";

      }
      else if (task.status === "doing") {

          task.status = "done";

      }
      else {

          task.status = "todo";

      }


      showTasks();
  };



  /* =====================================================
     5. XÓA CÔNG VIỆC
  ===================================================== */

  window.deleteTask = function (id) {

      if (
          confirm("Bạn có chắc muốn xóa công việc này không?")
      ) {

          tasks = tasks.filter(function (task) {

              return task.id !== id;

          });

          showTasks();
      }
  };



  /* =====================================================
     6. CẬP NHẬT THỐNG KÊ
  ===================================================== */

  function updateStatistics() {

      let total = tasks.length;


      let done = tasks.filter(function (task) {

          return task.status === "done";

      }).length;


      let percent = 0;


      if (total > 0) {

          percent =
              Math.round((done / total) * 100);

      }


      $("#totalTask").text(total);

      $("#doneTask").text(done);

      $("#totalPercent").text(percent + "%");

      $("#percent").text(percent + "%");

      $("#progressBar").css(
          "width",
          percent + "%"
      );

      $("#doneWarning").text(done);


      /* Công việc quá hạn */

      let today =
          new Date().toISOString().split("T")[0];


      let overdue = tasks.filter(function (task) {

          return (
              task.deadline &&
              task.deadline < today &&
              task.status !== "done"
          );

      }).length;


      $("#overdue").text(overdue);
  }



  /* =====================================================
     7. NHẬT KÝ
  ===================================================== */

  $("#journalForm").submit(function (event) {

      event.preventDefault();


      let date = $("#journalDate").val();

      let content =
          $("#journalContent").val().trim();


      if (date === "" || content === "") {

          alert(
              "Vui lòng nhập đầy đủ ngày và nội dung!"
          );

          return;
      }


      $(".journal-empty").remove();


      let html = `

          <div class="journal-item">

              <strong>
                  ${date}
              </strong>

              <span>
                  ${content}
              </span>

          </div>

      `;


      $("#journalList").prepend(html);


      this.reset();


      alert("Đã thêm nhật ký!");
  });



  /* =====================================================
     8. CHẾ ĐỘ SÁNG / TỐI
  ===================================================== */

  $("#themeBtn").click(function () {

      $("body").toggleClass("dark");


      if ($("body").hasClass("dark")) {

          $(this).html(
              '<i class="bi bi-sun"></i>'
          );

          localStorage.setItem(
              "theme",
              "dark"
          );

      }
      else {

          $(this).html(
              '<i class="bi bi-moon-stars"></i>'
          );

          localStorage.setItem(
              "theme",
              "light"
          );
      }

  });


  /* Giữ chế độ sau khi tải lại trang */

  if (
      localStorage.getItem("theme")
      === "dark"
  ) {

      $("body").addClass("dark");

      $("#themeBtn").html(
          '<i class="bi bi-sun"></i>'
      );
  }



  /* =====================================================
     9. KIỂM TRA FORM LIÊN HỆ
  ===================================================== */

  $("#contactForm").submit(function (event) {

      event.preventDefault();


      $("#nameError").text("");
      $("#phoneError").text("");
      $("#emailError").text("");
      $("#messageError").text("");

      $("#successMessage").text("");


      let name =
          $("#name").val().trim();

      let phone =
          $("#phone").val().trim();

      let email =
          $("#email").val().trim();

      let message =
          $("#message").val().trim();


      let valid = true;



      /* HỌ TÊN */

      if (name.length < 2) {

          $("#nameError").text(
              "Họ tên phải có từ 2 ký tự."
          );

          valid = false;
      }



      /* SỐ ĐIỆN THOẠI */

      let phoneRegex =
          /^(0|\+84)[0-9]{9,10}$/;


      if (
          !phoneRegex.test(
              phone.replace(/\s/g, "")
          )
      ) {

          $("#phoneError").text(
              "Số điện thoại chưa đúng định dạng."
          );

          valid = false;
      }



      /* EMAIL */

      let emailRegex =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


      if (!emailRegex.test(email)) {

          $("#emailError").text(
              "Email chưa đúng định dạng."
          );

          valid = false;
      }



      /* NỘI DUNG */

      if (message.length < 5) {

          $("#messageError").text(
              "Vui lòng nhập nội dung liên hệ."
          );

          valid = false;
      }



      /* THÀNH CÔNG */

      if (valid) {

          $("#successMessage").text(
              "✓ Gửi liên hệ thành công!"
          );

          this.reset();
      }

  });



  /* =====================================================
     10. CHẠY LẦN ĐẦU
  ===================================================== */

  showTasks();

});
/* =====================================================
   TRANG CHI TIẾT THÀNH VIÊN
===================================================== */

const members = {

  minh: {
      name: "Nguyễn Công Minh",
      role: "Trưởng nhóm · UI/UX",
      image: "image/minh.jpg",

      job:
          "Quản lý nhóm và thiết kế giao diện website.",

      task:
          "Phân chia công việc, xây dựng giao diện và theo dõi tiến độ.",

      intro:
          "Minh là trưởng nhóm, phụ trách điều phối các thành viên và đảm bảo sản phẩm hoàn thành đúng kế hoạch."
  },


  giang: {
      name: "Lý Hương Giang",
      role: "Lập trình chức năng",
      image: "image/giang.jpg",

      job:
          "Phụ trách xây dựng các chức năng bằng JavaScript.",

      task:
          "Xây dựng chức năng thêm công việc, tìm kiếm, lọc và xử lý dữ liệu.",

      intro:
          "Giang phụ trách phần lập trình chức năng và tương tác của website."
  },


  nhi: {
      name: "Lê Thị Yến Nhi",
      role: "Nội dung · Kiểm thử",
      image: "image/nhi.jpg",

      job:
          "Phụ trách nội dung và kiểm tra sản phẩm.",

      task:
          "Kiểm tra lỗi, nội dung và đảm bảo các chức năng hoạt động đúng.",

      intro:
          "Nhi tham gia xây dựng nội dung và kiểm thử website."
  },


  thanh: {
      name: "Thanh",
      role: "Báo cáo · Tài liệu",
      image: "image/thanh.jpg",

      job:
          "Phụ trách báo cáo và tài liệu của nhóm.",

      task:
          "Tổng hợp kết quả, viết README và chuẩn bị báo cáo.",

      intro:
          "Thanh phụ trách phần tài liệu và tổng hợp kết quả của nhóm."
  }

};


/* Lấy thành viên trên URL */

const urlParams =
  new URLSearchParams(window.location.search);

const memberId =
  urlParams.get("member");


/* Nếu đang ở trang thành viên */

if (
  memberId &&
  members[memberId] &&
  document.getElementById("memberName")
) {

  const member = members[memberId];


  document.getElementById("memberName")
      .textContent = member.name;


  document.getElementById("memberRole")
      .textContent = member.role;


  document.getElementById("memberImage")
      .src = member.image;


  document.getElementById("memberJob")
      .textContent = member.job;


  document.getElementById("memberTask")
      .textContent = member.task;


  document.getElementById("memberIntro")
      .textContent = member.intro;

}
