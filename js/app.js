const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbz0T15NoP5NlYG0beyadxox91rk-U5pi2LVjcMhPJ0cF3J-0YerxGyZzW0-s8RSmnqpgw/exec"; 


const bengkel = sessionStorage.getItem('bengkel');
const pic = sessionStorage.getItem('pic');

if (!bengkel || !pic) {
  window.location.href = 'index.html';
}

document.getElementById('displayPIC').innerText = pic;
document.getElementById('namaBengkel').value = bengkel;

const hariIni = new Date();
const formattedDate = hariIni.toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' });
document.getElementById('tanggalInput').value = formattedDate;


document.getElementById('inputForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const btnSubmit = document.getElementById('btnSubmit');
  btnSubmit.disabled = true;
  btnSubmit.innerText = "Mengirim data...";

const payload = {
  namaBengkel: bengkel,
  noWO: document.getElementById('noWO').value.toUpperCase().trim(), 
  invoiceNo: document.getElementById('invoiceNo').value.toUpperCase().trim(),
  taxInvoiceNo: document.getElementById('taxInvoiceNo').value.toUpperCase().trim(),
  taxInvoiceDate: document.getElementById('taxInvoiceDate').value,
  fee: document.getElementById('fee').value,
  vat: document.getElementById('vat').value,
  tanggalInput: formattedDate,
  namaPic: pic.toUpperCase().trim()
};
  
  fetch(WEB_APP_URL, {
    method: 'POST',
    mode: 'no-cors',
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(() => {
    alert('Data Berhasil Disimpan ke Tab ' + bengkel);
   
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
