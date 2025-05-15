document.addEventListener('DOMContentLoaded', function () {
    const apiKey = 'd0d0l0pr01qm2sk77rb0d0d0l0pr01qm2sk77rbg';
    const marketCardsContainer = document.getElementById('marketCards');
    const titleElement = document.querySelector('.market-title');
          
    const stockData = {
        germany: [
            { name: "SAP", symbol: "SAP", company: "SAP SE" },
            { name: "Siemens", symbol: "SIEGY", company: "Siemens AG" },
            { name: "Volkswagen", symbol: "VWAGY", company: "Volkswagen AG" },
            { name: "BASF", symbol: "BASFY", company: "BASF SE" },
            { name: "Allianz", symbol: "ALV", company: "Allianz SE" },
            { name: "Deutsche Bank", symbol: "DB", company: "Deutsche Bank AG" },
            { name: "BMW", symbol: "BMWYY", company: "BMW AG" },
            { name: "Adidas", symbol: "ADDYY", company: "Adidas AG" }
        ],
        usa: [
            { name: "Apple", symbol: "AAPL", company: "Apple Inc." },
            { name: "Microsoft", symbol: "MSFT", company: "Microsoft Corp." },
            { name: "Amazon", symbol: "AMZN", company: "Amazon.com Inc." },
            { name: "Tesla", symbol: "TSLA", company: "Tesla Inc." },
            { name: "Google", symbol: "GOOGL", company: "Alphabet Inc." },
            { name: "Meta", symbol: "META", company: "Meta Platforms Inc." },
            { name: "NVIDIA", symbol: "NVDA", company: "NVIDIA Corporation" },
            { name: "Netflix", symbol: "NFLX", company: "Netflix Inc." }
        ],
        uk: [
            { name: "HSBC", symbol: "HSBC", company: "HSBC Holdings" },
            { name: "Unilever", symbol: "UL", company: "Unilever PLC" },
            { name: "BP", symbol: "BP", company: "BP PLC" },
            { name: "GlaxoSmithKline", symbol: "GSK", company: "GSK PLC" },
            { name: "AstraZeneca", symbol: "AZN", company: "AstraZeneca PLC" },
            { name: "Rolls-Royce", symbol: "RR", company: "Rolls-Royce Holdings" },
            { name: "Barclays", symbol: "BCS", company: "Barclays PLC" },
            { name: "Rio Tinto", symbol: "RIO", company: "Rio Tinto Group" }
        ],
        turkey: [
            { name: "Garanti", symbol: "GARAN.IS", company: "Garanti BBVA" },
            { name: "Akbank", symbol: "AKBNK.IS", company: "Akbank T.A.Ş." },
            { name: "THY", symbol: "THYAO.IS", company: "Türk Hava Yolları" },
            { name: "Koç Holding", symbol: "KCHOL.IS", company: "Koç Holding A.Ş." },
            { name: "BIM", symbol: "BIMAS.IS", company: "BİM Birleşik Mağazalar" },
            { name: "Tüpraş", symbol: "TUPRS.IS", company: "Tüpraş" },
            { name: "Sabancı Holding", symbol: "SAHOL.IS", company: "Sabancı Holding" },
            { name: "Vestel", symbol: "VESTL.IS", company: "Vestel Elektronik" }
        ],
        japan: [
            { name: "Toyota", symbol: "TM", company: "Toyota Motor Corp." },
            { name: "Sony", symbol: "SONY", company: "Sony Group Corp." },
            { name: "Nintendo", symbol: "NTDOY", company: "Nintendo Co., Ltd." },
            { name: "Honda", symbol: "HMC", company: "Honda Motor Co." },
            { name: "SoftBank", symbol: "SFTBY", company: "SoftBank Group Corp." },
            { name: "Mitsubishi", symbol: "MITSY", company: "Mitsubishi Corp." },
           
        ],
        china: [
            { name: "Alibaba", symbol: "BABA", company: "Alibaba Group" },
            { name: "JD.com", symbol: "JD", company: "JD.com Inc." },
            { name: "Tencent", symbol: "TCEHY", company: "Tencent Holdings" },
            { name: "Baidu", symbol: "BIDU", company: "Baidu Inc." },
            { name: "Ping An", symbol: "PNGAY", company: "Ping An Insurance" },
            { name: "Meituan", symbol: "MPNGF", company: "Meituan Dianping" },
            { name: "Xiaomi", symbol: "XIACF", company: "Xiaomi Corporation" },
            { name: "BYD", symbol: "BYDDF", company: "BYD Company Ltd." }
        ],
        france: [
            { name: "LVMH", symbol: "LVMUY", company: "LVMH Moët Hennessy" },
            { name: "TotalEnergies", symbol: "TTE", company: "TotalEnergies SE" },
            { name: "L'Oréal", symbol: "LRLCY", company: "L'Oréal SA" },
            { name: "Airbus", symbol: "EADSY", company: "Airbus SE" },
            { name: "BNP Paribas", symbol: "BNPQY", company: "BNP Paribas SA" },
            { name: "Sanofi", symbol: "SNY", company: "Sanofi SA" }
        ],
        south_korea: [
            { name: "Samsung", symbol: "SSNLF", company: "Samsung Electronics" },
            { name: "Hyundai", symbol: "HYMTF", company: "Hyundai Motor Co." },
            { name: "LG", symbol: "LPL", company: "LG Corporation" },
            { name: "SK Hynix", symbol: "HXSCL", company: "SK Hynix Inc." },
            { name: "POSCO", symbol: "PKX", company: "POSCO Holdings" }
        ],
        india: [
            { name: "Infosys", symbol: "INFY", company: "Infosys Limited" },
            { name: "HDFC Bank", symbol: "HDB", company: "HDFC Bank Ltd." },
            { name: "Wipro", symbol: "WIT", company: "Wipro Ltd" },
            { name: "Mahindra & Mahindra", symbol: "M&M", company: "Mahindra & Mahindra Ltd" },
        ],
        brazil: [
            { name: "Petrobras", symbol: "PBR", company: "Petróleo Brasileiro" },
            { name: "Vale", symbol: "VALE", company: "Vale S.A." },
            { name: "Itaú Unibanco", symbol: "ITUB", company: "Itaú Unibanco" },
            { name: "Ambev", symbol: "ABEV", company: "Ambev S.A." }
        ]
    };

    // Sayfa yüklendiğinde otomatik olarak ülke verilerini yükle
    function loadInitialCountry() {
        const urlParams = new URLSearchParams(window.location.search);
        const country = urlParams.get('country') || 'germany'; // Varsayılan olarak Germany
        
        // Başlığı güncelle
        titleElement.textContent = country.charAt(0).toUpperCase() + country.slice(1);
        
        // Hisse verilerini yükle
        renderStocks(stockData[country]);
    }

    // Dropdown menü tıklamalarını işle
    document.querySelectorAll('[data-country]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const country = el.getAttribute('data-country');
            
            // URL'yi güncelle (sayfayı yenilemeden)
            window.history.pushState({}, '', `?country=${country}`);
            
            // Başlık ve hisseleri güncelle
            titleElement.textContent = country.charAt(0).toUpperCase() + country.slice(1);
            renderStocks(stockData[country]);
        });
    });

    // Popstate event (geri/ileri butonları için)
    window.addEventListener('popstate', function() {
        loadInitialCountry();
    });

    function renderStocks(stocks) {
        marketCardsContainer.innerHTML = '';
        stocks.forEach(stock => {
            const card = document.createElement('div');
            card.className = 'market-card';
            card.setAttribute('data-symbol', stock.symbol);
            card.innerHTML = `
                <div class="card-header">
                    <img src="" class="stock-icon" />
                    <div class="stock-info">
                        <div class="stock-name">${stock.name}</div>
                        <div class="stock-company">${stock.company}</div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="stock-price">-</div>
                    <div class="stock-change">-</div>
                </div>
            `;
            marketCardsContainer.appendChild(card);
            fetchStockData(stock.symbol, card);
            fetchCompanyLogo(stock.symbol, card);
        });
    }

    async function fetchStockData(symbol, cardElement) {
        try {
            const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();
            const { c: currentPrice, o: openPrice } = data;

            const priceElement = cardElement.querySelector('.stock-price');
            const changeElement = cardElement.querySelector('.stock-change');

            if (currentPrice && openPrice && openPrice !== 0) {
                const price = parseFloat(currentPrice).toFixed(2);
                const changePercent = (((currentPrice - openPrice) / openPrice) * 100).toFixed(2);

                priceElement.textContent = `$${price}`;
                changeElement.textContent = `${changePercent >= 0 ? '+' : ''}${changePercent}%`;
                changeElement.className = 'stock-change ' + (changePercent >= 0 ? 'positive' : 'negative');
            } else {
                priceElement.textContent = 'Veri yok';
                changeElement.textContent = '';
                cardElement.style.opacity = '0.6';
            }
        } catch (error) {
            console.error(`${symbol} için veri alınamadı`, error);
        }
    }

    async function fetchCompanyLogo(symbol, cardElement) {
        try {
            const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.logo) {
                const img = cardElement.querySelector('.stock-icon');
                img.src = data.logo;
                img.alt = `${symbol} logo`;
            }
        } catch (err) {
            console.warn(`${symbol} için logo çekilemedi`);
        }
    }

    // Sayfa yüklendiğinde ilk ülkeyi yükle
    loadInitialCountry();
});