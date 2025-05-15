document.addEventListener('DOMContentLoaded', function() {
    const API_KEY = 'YOUR_ALPHA_VANTAGE_API_KEY';
    let msftChart;
    let updateInterval;
    const stockSymbol = 'MSFT';

    // Daha güvenli veri çekme fonksiyonu
    const fetchStockData = async (timeframe = 'monthly') => {
        try {
            let url, functionName;
            
            switch(timeframe) {
                case 'daily':
                    functionName = 'TIME_SERIES_INTRADAY';
                    url = `https://www.alphavantage.co/query?function=${functionName}&symbol=${stockSymbol}&interval=60min&apikey=${API_KEY}&outputsize=compact`;
                    break;
                case 'monthly':
                    functionName = 'TIME_SERIES_MONTHLY';
                    url = `https://www.alphavantage.co/query?function=${functionName}&symbol=${stockSymbol}&apikey=${API_KEY}`;
                    break;
                default: // yearly için farklı bir endpoint
                    functionName = 'TIME_SERIES_MONTHLY'; // Yıllık veri için aylık veriyi kullanacağız
                    url = `https://www.alphavantage.co/query?function=${functionName}&symbol=${stockSymbol}&apikey=${API_KEY}`;
            }

            const response = await fetch(url);
            const data = await response.json();
            
            // API hata kontrolü
            if (data['Error Message'] || data['Note']) {
                console.error('API Error:', data['Error Message'] || data['Note']);
                return null;
            }
            
            return processAPIData(data, timeframe);
            
        } catch (error) {
            console.error('API connection error:', error);
            return null;
        }
    };

    // Daha güvenli veri işleme
    const processAPIData = (apiData, timeframe) => {
        try {
            let timeSeriesKey, labels = [], prices = [];
            
            // Doğru zaman serisi anahtarını belirle
            if (timeframe === 'daily') {
                timeSeriesKey = 'Time Series (60min)';
            } else if (timeframe === 'monthly') {
                timeSeriesKey = 'Monthly Time Series';
            } else {
                timeSeriesKey = 'Monthly Time Series'; // Yıllık için aylık veriyi kullan
            }

            // Veri kontrolü
            if (!apiData || !apiData[timeSeriesKey]) {
                console.error('Invalid API data structure:', apiData);
                return generateFallbackData(timeframe);
            }

            const timeSeries = apiData[timeSeriesKey];
            const sortedEntries = Object.entries(timeSeries)
                .sort((a, b) => new Date(a[0]) - new Date(b[0]));
            
            // Son 15 veri noktasını al
            const recentData = sortedEntries.slice(-15);
            
            recentData.forEach(([date, values]) => {
                if (!values || !values['4. close']) {
                    console.warn('Missing data for date:', date);
                    return;
                }
                
                if (timeframe === 'daily') {
                    labels.push(new Date(date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
                } else if (timeframe === 'monthly') {
                    labels.push(new Date(date).toLocaleDateString([], {month: 'short'}));
                } else {
                    // Yıllık veri için sadece yılı göster
                    labels.push(new Date(date).getFullYear());
                }
                prices.push(parseFloat(values['4. close']));
            });

            return { labels, prices };
            
        } catch (error) {
            console.error('Data processing error:', error);
            return generateFallbackData(timeframe);
        }
    };

    // API hatası durumunda yedek veri oluştur
    const generateFallbackData = (timeframe) => {
        console.warn('Using fallback data for', timeframe);
        const now = new Date();
        let labels, prices;
        
        if (timeframe === 'daily') {
            labels = Array.from({length: 10}, (_, i) => {
                const d = new Date(now);
                d.setHours(now.getHours() - i);
                return d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            }).reverse();
            prices = labels.map((_, i) => 430 + Math.random() * 10 - 5);
        } else if (timeframe === 'monthly') {
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
            prices = [400, 410, 415, 430, 435, 440, 445];
        } else {
            labels = ['2020', '2021', '2022', '2023', '2024'];
            prices = [160, 240, 250, 330, 435];
        }
        
        return { labels, prices };
    };

    // Hisse verilerini güncelle
    const updateStockData = async () => {
        try {
            const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${API_KEY}`;
            const response = await fetch(quoteUrl);
            const data = await response.json();
            
            // API hata kontrolü
            if (data['Error Message'] || data['Note'] || !data['Global Quote']) {
                console.error('Quote API Error:', data['Error Message'] || data['Note'] || 'Invalid data');
                setFallbackPrice();
                return;
            }
            
            const quote = data['Global Quote'];
            const price = quote['05. price'];
            const change = quote['10. change percent'];
            
            if (!price || !change) {
                console.error('Invalid quote data:', quote);
                setFallbackPrice();
                return;
            }
            
            updatePriceDisplay(price, change);
            
        } catch (error) {
            console.error('Quote fetch error:', error);
            setFallbackPrice();
        }
    };

    // Yedek fiyat gösterimi
    const setFallbackPrice = () => {
        const fallbackPrice = (435 + Math.random() * 2 - 1).toFixed(2);
        const fallbackChange = (Math.random() > 0.5 ? '+' : '-') + (Math.random() * 2).toFixed(2) + '%';
        updatePriceDisplay(fallbackPrice, fallbackChange);
    };

    // Fiyat görüntüleme
    const updatePriceDisplay = (price, change) => {
        const priceElement = document.querySelector('.stock-price');
        const changeElement = document.querySelector('.stock-change');
        
        priceElement.textContent = `$${parseFloat(price).toFixed(2)}`;
        changeElement.textContent = change;
        
        if (change.startsWith('-')) {
            changeElement.classList.remove('positive');
            changeElement.classList.add('negative');
        } else {
            changeElement.classList.remove('negative');
            changeElement.classList.add('positive');
        }
    };

    // Grafik oluştur/güncelle
    const renderMSFTChart = async (timeframe = 'monthly') => {
        try {
            const chartData = await fetchStockData(timeframe);
            if (!chartData) return;
            
            const ctx = document.getElementById('msftChart').getContext('2d');
            
            if (msftChart) {
                msftChart.destroy();
            }
            
            msftChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: `${stockSymbol} Stock Price (USD)`,
                        data: chartData.prices,
                        borderColor: '#f7931a',
                        backgroundColor: 'rgba(247, 147, 26, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true,
                        pointRadius: 0,
                        pointHoverRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: (context) => `$${context.parsed.y.toFixed(2)}`
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            ticks: {
                                callback: (value) => '$' + value.toFixed(2)
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
            
        } catch (error) {
            console.error('Chart rendering error:', error);
        }
    };

    // Zaman aralığı butonları
    const setupTimeframeButtons = () => {
        const buttons = document.querySelectorAll('.timeframe-btn');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                buttons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                renderMSFTChart(this.dataset.timeframe);
            });
        });
    };

    // Uygulamayı başlat
    const init = async () => {
        await updateStockData();
        await renderMSFTChart();
        setupTimeframeButtons();
        
        // 5 dakikada bir güncelle (API limitlerine dikkat)
        updateInterval = setInterval(async () => {
            await updateStockData();
            const activeTimeframe = document.querySelector('.timeframe-btn.active').dataset.timeframe;
            await renderMSFTChart(activeTimeframe);
        }, 300000);
    };

    init();
});