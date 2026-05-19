const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbz0T15NoP5NlYG0beyadxox91rk-U5pi2LVjcMhPJ0cF3J-0YerxGyZzW0-s8RSmnqpgw/exec";

const bengkel = sessionStorage.getItem('bengkel');
if (!bengkel) {
  window.location.href = 'index.html';
}

document.getElementById('vendorTag').innerText = bengkel;

// GUNA: Membersihkan string mata uang atau format bawaan Google Sheet menjadi angka murni
const bersihkanAngka = (val) => {
  if (!val) return 0;  
  if (typeof val === 'number') return val;
  const angkaBersih = val.toString().replace(/[^0-9.-]/g, '');
  const hasil = parseFloat(angkaBersih);
  return isNaN(hasil) ? 0 : hasil;
};

// GUNA: Mengamankan format tanggal agar tidak crash saat fungsi .split() dieksekusi
const formatTanggalPajak = (val) => {
  if (!val) return '-';
  const strDate = val.toString();
  if (strDate.includes('T')) {
    return strDate.split('T')[0];
  }
  // Jika dari Google Sheet terkirim data format objek waktu mentah GMT
  if (strDate.includes('00:00:00')) {
    try {
      const d = new Date(val);
      if(!isNaN(d.getTime())) {
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      }
    } catch(e) { console.error(e); }
  }
  return strDate;
};

// Eksekusi Fetch Data dengan penanganan CORS redirect khas Google Web App
fetch(`${WEB_APP_URL}?bengkel=${encodeURIComponent(bengkel)}`, {
  method: 'GET',
  mode: 'cors',
  cache: 'no-cache'
})
  .then(response => {
    if (!response.ok) throw new Error('Jaringan bermasalah atau URL Apps Script salah.');
    return response.json();
  })
  .then(res => {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    if (res.status === "success" && res.data && res.data.length > 0) {
      res.data.forEach(row => {
        const tr = document.createElement('tr');

        const feeNominal = bersihkanAngka(row['FEE']);
        const vatNominal = bersihkanAngka(row['VAT']);

        // Sesuai dengan penambahan kolom Deskripsi sebelumnya, set colspan header di HTML dihitung menjadi 9 kolom
        tr.innerHTML = `
          <td>${row['Tanggal Input'] || '-'}</td>
          <td>${row['Nomor Working Order'] || '-'}</td>
          <td>${row['Invoice Number'] || '-'}</td>
          <td>${row['TAX Invoice Number'] || '-'}</td>
          <td>${formatTanggalPajak(row['TAX Invoice Date'])}</td>
          <td>Rp ${feeNominal.toLocaleString('id-ID')}</td>
          <td>Rp ${vatNominal.toLocaleString('id-ID')}</td>
          <td>${row['Nama PIC'] || '-'}</td>
          <td>${row['Deskripsi'] || '-'}</td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: #64748b;">Belum ada riwayat data untuk vendor ini.</td></tr>`;
    }
  })
  .catch(err => {
    console.error('Detail Error:', err);
    // Atur colspan ke 9 menyesuaikan total kolom tabel
    document.getElementById('tableBody').innerHTML = `<tr><td colspan="9" style="text-align: center; color: #ef4444; font-weight: 600;">Gagal memuat data dari database. Pastikan Apps Script sudah di-deploy ke versi terbaru.</td></tr>`;
  });
