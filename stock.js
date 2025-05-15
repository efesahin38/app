document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'd0d0l0pr01qm2sk77rb0d0d0l0pr01qm2sk77rbg';
    const marketCards = document.querySelectorAll('.market-card');
    
    marketCards.forEach(card => {
        const symbol = card.getAttribute('data-symbol');
        const adjustedSymbol = adjustSymbolForMarket(symbol);
        fetchStockData(adjustedSymbol, card);
        fetchCompanyLogo(adjustedSymbol, card);
    });

    async function fetchStockData(symbol, cardElement) {
        try {
            const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            const { c: currentPrice, o: openPrice } = data;

            if (currentPrice && openPrice && openPrice !== 0) {
                updateCard(cardElement, currentPrice, openPrice);
            } else {
                console.warn(`${symbol} için geçerli veri bulunamadı`);
                showUnavailableData(cardElement);
            }
        } catch (error) {
            console.error(`${symbol} verisi çekilirken hata:`, error);
            showUnavailableData(cardElement);
        }
    }
    
    function adjustSymbolForMarket(symbol) {
        // Alman hisselerini ABD sembolüne dönüştür
        const germanToUsSymbols = {
            "SAP": "SAP",       // NYSE - SAP SE
            "SIE": "SIEGY",     // OTC - Siemens AG
            "DBK": "DB",        // NYSE - Deutsche Bank
            "ALV": "ALIZY",     // OTC - Allianz SE
            "BAYN": "BAYRY",    // OTC - Bayer AG
            "BAS": "BASFY",     // OTC - BASF SE
            "VOW3": "VWAGY",    // OTC - Volkswagen AG
            "BMW": "BMWYY",     // OTC - BMW AG
            "ADS": "ADDYY",     // OTC - Adidas AG
            "DTE": "DTEGY",     // OTC - Deutsche Telekom
            "FME": "FMS",       // NYSE - Fresenius Medical Care
            "IFX": "IFNNY",     // OTC - Infineon Technologies
            "TKA": "TKAMY",     // OTC - Thyssenkrupp AG
            "CBK": "CRZBY",     // OTC - Commerzbank AG
            "HEN3": "HENKY"     // OTC - Henkel AG
        };

        // Eğer sembol ABD karşılığına sahipse, onu kullan
        return germanToUsSymbols[symbol] ? germanToUsSymbols[symbol] : symbol;
    }

    function updateCard(cardElement, currentPrice, openPrice) {
        const priceElement = cardElement.querySelector('.stock-price');
        const changeElement = cardElement.querySelector('.stock-change');

        const price = parseFloat(currentPrice).toFixed(2);
        const changePercent = (((currentPrice - openPrice) / openPrice) * 100).toFixed(2);

        priceElement.textContent = `$${price}`;
        changeElement.textContent = (changePercent >= 0 ? '+' : '') + `${changePercent}%`;

        changeElement.className = 'stock-change ' + (changePercent >= 0 ? 'positive' : 'negative');
    }

    function showUnavailableData(cardElement) {
        const priceElement = cardElement.querySelector('.stock-price');
        const changeElement = cardElement.querySelector('.stock-change');
        priceElement.textContent = 'Veri yok';
        changeElement.textContent = '';
        cardElement.style.opacity = '0.6';
    }
    
    async function fetchCompanyLogo(symbol, cardElement) {
        try {
            const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.logo) {
                const imgElement = cardElement.querySelector('.stock-icon');
                if (imgElement) {
                    imgElement.src = data.logo;
                    imgElement.alt = `${symbol} logo`;
                }
            }
        } catch (error) {
            console.warn(`${symbol} için logo çekilemedi:`, error);
        }
    }

    // Otomatik güncelleme
    setInterval(() => {
        marketCards.forEach(card => {
            const symbol = card.getAttribute('data-symbol');
            const adjustedSymbol = adjustSymbolForMarket(symbol);
            fetchStockData(adjustedSymbol, card);
        });
    }, 60000);
});
