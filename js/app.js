const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbz0T15NoP5NlYG0beyadxox91rk-U5pi2LVjcMhPJ0cF3J-0YerxGyZzW0-s8RSmnqpgw/exec"; 

// Proteksi Halaman: Cek session login awal
const bengkel = sessionStorage.getItem('bengkel');
const pic = sessionStorage.getItem('pic');

if (!bengkel || !pic) {
  window.location.href = 'index.html';
}

// Render data otomatis di load awal
document.getElementById('displayPIC').innerText = pic;
document.getElementById('namaBengkel').value = bengkel;

const hariIni = new Date();
const formattedDate = hariIni.toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' });
document.getElementById('tanggalInput').value = formattedDate;

// Handler Post Data
document.getElementById('inputForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const btnSubmit = document.getElementById('btnSubmit');
  btnSubmit.disabled = true;
  btnSubmit.innerText = "Mengirim data...";

  const payload = {
    namaBengkel: bengkel,
    noWO: document.getElementById('noWO').value,
    invoiceNo: document.getElementById('invoiceNo').value,
    taxInvoiceNo: document.getElementById('taxInvoiceNo').value,
    taxInvoiceDate: document.getElementById('taxInvoiceDate').value,
    fee: document.getElementById('fee').value,
    vat: document.getElementById('vat').value,
    tanggalInput: formattedDate,
    namaPic: pic
  };

  // Menggunakan Fetch API Mode No-Cors / Cors terarah untuk integrasi Apps script
  fetch(WEB_APP_URL, {
    method: 'POST',
    mode: 'no-cors', // Penting untuk Apps Script Web App bypass pre-flight CORS
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(() => {
    alert('Data Berhasil Disimpan ke Tab ' + bengkel);
    // Reset Form isi kecuali yang disable
    document.getElementById('noWO').value = '';
    document.getElementById('invoiceNo').value = '';
    document.getElementById('taxInvoiceNo').value = '';
    document.getElementById('taxInvoiceDate').value = '';
    document.getElementById('fee').value = '';
    document.getElementById('vat').value = '';
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Terjadi kesalahan pengiriman data.');
  })
  .finally(() => {
    btnSubmit.disabled = false;
    btnSubmit.innerText = "Simpan Data ke Spreadsheet";
  });
});

function logout() {
  sessionStorage.clear();
  window.location.href = 'index.html';
}