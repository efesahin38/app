document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'd0d0l0pr01qm2sk77rb0d0d0l0pr01qm2sk77rbg';
    const marketCards = document.querySelectorAll('.market-card');

    marketCards.forEach(card => {
        const symbol = card.getAttribute('data-symbol');
        fetchCleanStockNews(symbol, card);
    });

    async function fetchCleanStockNews(symbol, cardElement) {
        try {
            const newsContainer = cardElement.querySelector('.stock-news');
            if (!newsContainer) return;

            newsContainer.innerHTML = '<div class="loading">News are loading</div>';

            const toDate = new Date();
            const fromDate = new Date();
            fromDate.setDate(toDate.getDate() - 7);
            
            const response = await fetch(
                `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${formatDate(fromDate)}&to=${formatDate(toDate)}&token=${apiKey}`
            );
            
            const newsData = await response.json();

            // Unique news filter
            const uniqueNews = [];
            const seenHeadlines = new Set();
            
            newsData.forEach(item => {
                if (item.headline && item.url && !seenHeadlines.has(item.headline)) {
                    seenHeadlines.add(item.headline);
                    uniqueNews.push(item);
                }
            });

            if (uniqueNews.length > 0) {
                // Show only 1-2 most recent news
                const newsToShow = uniqueNews.slice(0, 2);
                newsContainer.innerHTML = newsToShow.map(news => `
                    <div class="news-item">
                        <p class="news-headline">${cleanSourceText(news.headline)}</p>
                        ${news.summary ? `<p class="news-brief">${cleanSourceText(news.summary)}</p>` : ''}
                    </div>
                `).join('');
            } else {
                newsContainer.innerHTML = '<div class="no-news">Son haber bulunamadı</div>';
            }
        } catch (error) {
            console.error('Haber çekme hatası:', error);
            newsContainer.innerHTML = '<div class="error">Haberler geçici olarak ulaşılamıyor</div>';
        }
    }

    function cleanSourceText(text) {
        return text
            .replace(/ - Yahoo Finance$/, '')
            .replace(/^yahoo\/finance/i, '')
            .replace(/^source:/i, '')
            .trim();
    }

    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }
});