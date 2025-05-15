document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const authLinks = document.getElementById('authLinks');
    const portfolioItem = document.getElementById('portfolio-item');
    
    if (!authLinks) return;
    
    if (isLoggedIn) {
        // Log out butonu
        authLinks.innerHTML = '<a href="#" id="logoutBtn" class="login">Log out</a>';
        
        // Portfolio linkini göster
        if (portfolioItem) {
            portfolioItem.style.display = 'block';
            portfolioItem.innerHTML = '<a href="portfolio.html">Portfolio</a>';
        }
        
        document.getElementById('logoutBtn').addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.removeItem('isLoggedIn');
            window.location.href = 'login.html';
        });
    } else {
        // Log in/Sign up butonları
        authLinks.innerHTML = `
            <a href="login.html" class="login">Log in</a>
            <a href="signup.html" class="signup">Sign up</a>
        `;
        
        // Portfolio linkini gizle
        if (portfolioItem) {
            portfolioItem.style.display = 'none';
        }
    }
});