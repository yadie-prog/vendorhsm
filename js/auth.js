document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const bengkel = document.getElementById('bengkel').value;
  const pic = document.getElementById('pic').value.trim();
  
  if(bengkel && pic) {
    // Menyimpan data login di Session Storage agar aman dan hilang saat browser ditutup
    sessionStorage.setItem('bengkel', bengkel);
    sessionStorage.setItem('pic', pic);
    
    // Alihkan halaman otomatis
    window.location.href = 'dashboard.html';
  }
});