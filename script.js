// Ambil elemen dari HTML
const form = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const pilihAudio = document.getElementById("pilihAudio");
const uploadAudio = document.getElementById("uploadAudio");
const audio = document.getElementById("audio");

// Ambil data dari localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Set default audio
audio.src = pilihAudio.value;

// Event dropdown audio
pilihAudio.addEventListener("change", () => {
    audio.src = pilihAudio.value;
});

// Event upload audio user
uploadAudio.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        audio.src = URL.createObjectURL(file);
    }
});

// Minta izin notifikasi
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

// Saat form disubmit
form.addEventListener("submit", function(e){
    e.preventDefault();

    const mapel = document.getElementById("mapel").value;
    const detail = document.getElementById("detail").value;
    const waktu = document.getElementById("waktu").value;

    const task = {
        mapel,
        detail,
        waktu,
        selesai: false
    };

    tasks.push(task);
    saveTasks();
    displayTasks();

    form.reset();
});

// Simpan ke localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Tampilkan daftar tugas
function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        // Checkbox selesai
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.selesai;
        checkbox.addEventListener("change", () => {
            task.selesai = checkbox.checked;
            saveTasks();
            displayTasks();
        });
        li.appendChild(checkbox);

        // Info tugas
        const info = document.createElement("div");
        info.textContent = `Mata Pelajaran: ${task.mapel} | Detail: ${task.detail} | ⏰ ${task.waktu}`;
        li.appendChild(info);

        // Tombol hapus
        const hapusBtn = document.createElement("button");
        hapusBtn.textContent = "Hapus";
        hapusBtn.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            displayTasks();
        });
        li.appendChild(hapusBtn);

        // Tandai class kalau selesai
        if(task.selesai){
            li.classList.add("completed");
        }

        taskList.appendChild(li);
    });
}

// Alarm + notifikasi per 5 menit
setInterval(() => {
    const now = new Date();
    tasks.forEach(task => {
        if(!task.selesai){
            const taskTime = new Date(task.waktu);
            if(now >= taskTime){
                if(Notification.permission === "granted"){
                    new Notification("📌 Pengingat Tugas", {
                        body: `Mata Pelajaran: ${task.mapel}\nDetail: ${task.detail}\nWaktu: ${task.waktu}`
                    });
                }
                audio.play();
            }
        }
    });
}, 300000); // 5 menit