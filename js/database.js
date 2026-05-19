const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbz0T15NoP5NlYG0beyadxox91rk-U5pi2LVjcMhPJ0cF3J-0YerxGyZzW0-s8RSmnqpgw/exec";

const bengkel = sessionStorage.getItem('bengkel');
if (!bengkel) {
  window.location.href = 'index.html';
}

document.getElementById('vendorTag').innerText = bengkel;

fetch(`${WEB_APP_URL}?bengkel=${encodeURIComponent(bengkel)}`)
  .then(response => response.json())
  .then(res => {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    if(res.status === "success" && res.data.length > 0) {
res.data.forEach(row => {
  const tr = document.createElement('tr');
    const bersihkanAngka = (val) => {
    if (!val) return 0;  
    if (typeof val === 'number') return val;
    const angkaBersih = val.toString().replace(/[^0-9.-]/g, '');
    const hasil = parseFloat(angkaBersih);
    return isNaN(hasil) ? 0 : hasil;
  };

  const feeNominal = bersihkanAngka(row['FEE']);
  const vatNominal = bersihkanAngka(row['VAT']);

  tr.innerHTML = `
    <td>${row['Tanggal Input'] || '-'}</td>
    <td>${row['Nomor Working Order'] || '-'}</td>
    <td>${row['Invoice Number'] || '-'}</td>
    <td>${row['TAX Invoice Number'] || '-'}</td>
    <td>${row['TAX Invoice Date'] ? row['TAX Invoice Date'].split('T')[0] : '-'}</td>
    <td>Rp ${feeNominal.toLocaleString('id-ID')}</td>
    <td>Rp ${vatNominal.toLocaleString('id-ID')}</td>
    <td>${row['Nama PIC'] || '-'}</td>
    <td>${row['Deskripsi'] || '-'}</td>
  `;
  tbody.appendChild(tr);
});
    } else {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #64748b;">Belum ada riwayat data untuk vendor ini.</td></tr>`;
    }
  })
  .catch(err => {
    console.error(err);
    document.getElementById('tableBody').innerHTML = `<tr><td colspan="8" style="text-align: center; color: #ef4444;">Gagal memuat data dari database.</td></tr>`;
  });
