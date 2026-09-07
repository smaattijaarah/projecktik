// ======================================
// DATA ABSENSI
// ======================================

let attendanceData =
    JSON.parse(localStorage.getItem("attendanceData")) || [];


// ======================================
// ELEMENT
// ======================================

const form = document.getElementById("attendanceForm");

const nisInput = document.getElementById("nis");
const namaInput = document.getElementById("nama");
const kelasInput = document.getElementById("kelas");
const statusInput = document.getElementById("status");

const table = document.getElementById("attendanceTable");
const emptyMessage = document.getElementById("emptyMessage");

const searchInput = document.getElementById("searchInput");
const filterKelas = document.getElementById("filterKelas");
const filterStatus = document.getElementById("filterStatus");


// ======================================
// JAM & TANGGAL
// ======================================

function updateDateTime() {

    const now = new Date();

    const date = now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const time = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    document.getElementById("currentDate").textContent = date;

    document.getElementById("currentTime").textContent = time;
}

setInterval(updateDateTime, 1000);

updateDateTime();


// ======================================
// SIMPAN ABSENSI
// ======================================

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const now = new Date();

    const data = {

        id: Date.now(),

        tanggal: now.toLocaleDateString("id-ID"),

        waktu: now.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit"
        }),

        nis: nisInput.value.trim(),

        nama: namaInput.value.trim(),

        kelas: kelasInput.value,

        status: statusInput.value

    };


    attendanceData.unshift(data);

    saveData();

    renderTable();

    updateStatistics();

    form.reset();

    alert("Absensi berhasil disimpan!");

});


// ======================================
// LOCAL STORAGE
// ======================================

function saveData() {

    localStorage.setItem(
        "attendanceData",
        JSON.stringify(attendanceData)
    );

}


// ======================================
// TAMPILKAN DATA
// ======================================

function renderTable() {

    const search = searchInput.value
        .toLowerCase()
        .trim();

    const kelas = filterKelas.value;

    const status = filterStatus.value;


    const filteredData = attendanceData.filter(item => {

        const matchesSearch =
            item.nama.toLowerCase().includes(search) ||
            item.nis.toLowerCase().includes(search);

        const matchesKelas =
            kelas === "" || item.kelas === kelas;

        const matchesStatus =
            status === "" || item.status === status;

        return (
            matchesSearch &&
            matchesKelas &&
            matchesStatus
        );

    });


    table.innerHTML = "";


    if (filteredData.length === 0) {

        emptyMessage.style.display = "block";

        return;

    }


    emptyMessage.style.display = "none";


    filteredData.forEach((item, index) => {

        const row = document.createElement("tr");


        let statusClass = "";

        if (item.status === "Hadir") {
            statusClass = "status-hadir";
        }

        else if (item.status === "Izin") {
            statusClass = "status-izin";
        }

        else if (item.status === "Sakit") {
            statusClass = "status-sakit";
        }

        else if (item.status === "Alpa") {
            statusClass = "status-alpa";
        }


        row.innerHTML = `

            <td>${index + 1}</td>

            <td>${item.tanggal}</td>

            <td>${item.waktu}</td>

            <td>${item.nis}</td>

            <td>
                <strong>${item.nama}</strong>
            </td>

            <td>
                ${item.kelas}
            </td>

            <td>
                <span class="status ${statusClass}">
                    ${item.status}
                </span>
            </td>

            <td>

                <button
                    class="btn-delete"
                    onclick="deleteAttendance(${item.id})">
                    🗑
                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


// ======================================
// HAPUS DATA
// ======================================

function deleteAttendance(id) {

    const confirmDelete =
        confirm("Apakah Anda yakin ingin menghapus data ini?");


    if (!confirmDelete) {
        return;
    }


    attendanceData =
        attendanceData.filter(item => item.id !== id);


    saveData();

    renderTable();

    updateStatistics();

}


// ======================================
// STATISTIK
// ======================================

function updateStatistics() {

    const hadir =
        attendanceData.filter(
            item => item.status === "Hadir"
        ).length;


    const izin =
        attendanceData.filter(
            item => item.status === "Izin"
        ).length;


    const sakit =
        attendanceData.filter(
            item => item.status === "Sakit"
        ).length;


    const alpa =
        attendanceData.filter(
            item => item.status === "Alpa"
        ).length;


    document.getElementById("totalHadir")
        .textContent = hadir;

    document.getElementById("totalIzin")
        .textContent = izin;

    document.getElementById("totalSakit")
        .textContent = sakit;

    document.getElementById("totalAlpa")
        .textContent = alpa;

}


// ======================================
// FILTER & SEARCH
// ======================================

searchInput.addEventListener(
    "input",
    renderTable
);

filterKelas.addEventListener(
    "change",
    renderTable
);

filterStatus.addEventListener(
    "change",
    renderTable
);


// ======================================
// LOAD DATA SAAT HALAMAN DIBUKA
// ======================================

renderTable();

updateStatistics();