let RATE = 0;
let CURRENCY_MODE = 'USD_TRY';

const SELECTORS = [
    '.discount_final_price',
    '.discount_original_price',
    '.game_area_dlc_price',
    '.price',
    '#header_wallet_balance',
    '.account_name',
    '.game_area_purchase_game_dropdown_menu_item_text',
    '#search_suggestion_contents .match_subtitle',
    '.sale_price',
    '.normal_price',
    '.market_commodity_orders_header_promote',
    '#orders_histogram .jqplot-xaxis-tick',
    '#pricehistory .jqplot-yaxis-tick',
    '.salepreviewwidgets_StoreSalePriceBox_Wh0L8',
    '.salepreviewwidgets_StoreOriginalPrice_1EKGZ',
    '._3fFFsvII7Y2KXNLDk_krOW',
    '._3j4dI1yA7cRfCvK8h406OB',
    '.game_purchase_price .price',
    '.game_purchase_price .price .es_regional_onmouse .es_regional_icon'
].map(s => s + ':not(.steam-try)').join(', ');

const REGEX_USD = /\$\s*([0-9,.]+\d{2})\s*(USD)?/;
const REGEX_EUR = /([0-9,.]+\d{2})\s*€/;
const REGEX_TRY = /([0-9,.]+\d{2})\s*TL/;

async function updatePrices() {
    if (!chrome.runtime?.id) return;
    try {
        const settings = await chrome.storage.sync.get(['status', 'show_usd', 'show_original_usd', 'hide_discount', 'currency_mode']);
        const extStatus = settings.status ?? true;
        const showUsd = settings.show_usd ?? false;
        const showOriginalUsd = settings.show_original_usd ?? false;
        const hideDiscount = settings.hide_discount ?? false;
        const newCurrencyMode = settings.currency_mode ?? 'USD_TRY';

        if (newCurrencyMode !== CURRENCY_MODE) {
            CURRENCY_MODE = newCurrencyMode;
            await fetchCurrency();
            return;
        }

    const existingStyles = document.querySelectorAll('style.steam-try-style');
    existingStyles.forEach(s => s.remove());

    if (!extStatus) {
        document.querySelectorAll('.steam-try-hide, .steam-try-hide-force').forEach(el => {
            el.style.display = '';
            el.classList.remove('steam-try-hide');
            el.classList.remove('steam-try-hide-force');
        });
        document.querySelectorAll('.steam-try').forEach(el => {
            if (el.dataset.originalText) {
                el.innerText = el.dataset.originalText;
            }
            el.classList.remove('steam-try');
            el.classList.remove('steam-try-force-visible');
        });
        document.querySelectorAll('.steam-try-hide').forEach(el => {
            el.style.display = '';
            el.classList.remove('steam-try-hide');
        });
        return;
    }

    if (showUsd || hideDiscount) {
        const style = document.createElement('style');
        style.className = 'steam-try-style';
        style.innerHTML = `
            ${showUsd ? '.steam-try { font-size: 0.9em!important; display: inline-block!important; visibility: visible!important; }' : ''}
            ${hideDiscount ? `
                .steam-try-hide, 
                .discount_pct, 
                .cnkoFkzVCby40gJ0jGGS4, 
                ._3fFFsvII7Y2KXNLDk_krOW, 
                .discount_original_price, 
                .salepreviewwidgets_StoreSaleDiscountBox_2_S_g,
                .salepreviewwidgets_StoreOriginalPrice_1EKGZ { 
                    display: none !important; 
                    visibility: hidden !important; 
                    opacity: 0 !important;
                    width: 0 !important;
                    height: 0 !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                .steam-try-force-visible._3fFFsvII7Y2KXNLDk_krOW,
                .steam-try-force-visible.discount_original_price,
                .steam-try-force-visible.cnkoFkzVCby40gJ0jGGS4 {
                    display: none !important;
                }
            ` : ''}
            .steam-try-force-visible {
                display: inline-block !important;
                visibility: visible !important;
                opacity: 1 !important;
                position: relative !important;
                z-index: 99 !important;
            }
            .game_purchase_action_bg .steam-try {
                color: #ffffff !important;
            }
        `;
        document.head.appendChild(style);
    }

    if (hideDiscount) {
        const discountSelectors = [
            '.discount_pct',
            '.cnkoFkzVCby40gJ0jGGS4',
            '.salepreviewwidgets_StoreSaleDiscountBox_2_S_g',
            '.discount_original_price',
            '.salepreviewwidgets_StoreOriginalPrice_1EKGZ',
            '._3fFFsvII7Y2KXNLDk_krOW',
            '.StoreOriginalPrice',
            '._3NhLu7mTdty7JufpSpz6Re'
        ].join(', ');
        document.querySelectorAll(discountSelectors).forEach(el => {
            if (el.classList.contains('_3fFFsvII7Y2KXNLDk_krOW')) {
                const parent = el.parentElement;
                const hasFinalPrice = parent.querySelector('._3j4dI1yA7cRfCvK8h406OB');
                if (hasFinalPrice) {
                    el.classList.add('steam-try-hide');
                }
            } else if (el.classList.contains('_3NhLu7mTdty7JufpSpz6Re')) {
                const hasOriginal = el.querySelector('._3fFFsvII7Y2KXNLDk_krOW');
                const hasFinal = el.querySelector('._3j4dI1yA7cRfCvK8h406OB');
                if (hasOriginal && hasFinal) {
                    hasOriginal.classList.add('steam-try-hide');
                }
            } else {
                el.classList.add('steam-try-hide');
            }
        });
    } else {
        document.querySelectorAll('.steam-try-hide, .steam-try-hide-force, .discount_pct, .cnkoFkzVCby40gJ0jGGS4, ._3fFFsvII7Y2KXNLDk_krOW, .discount_original_price, .salepreviewwidgets_StoreSaleDiscountBox_2_S_g, .salepreviewwidgets_StoreOriginalPrice_1EKGZ').forEach(el => {
            el.style.display = '';
            el.classList.remove('steam-try-hide');
            el.classList.remove('steam-try-hide-force');
        });
    }

    const elements = document.querySelectorAll(SELECTORS + ', .steam-try, ._3fFFsvII7Y2KXNLDk_krOW, ._3j4dI1yA7cRfCvK8h406OB, .game_purchase_price.price, .game_area_dlc_price, .discount_final_price, .normal_price');

    elements.forEach((element) => {
        // Element zaten bir steam-try işlemi görmüşse ve metin eklentinin formatındaysa (USD + TL)
        // dataset üzerinden orijinal metni alarak işlem yapmalıyız.
        let text = element.dataset.originalText || element.innerText;
        
        const sourceCurrency = CURRENCY_MODE.split('_')[0];
        const targetCurrency = CURRENCY_MODE.split('_')[1];
        
        let regex, symbol;
        if (sourceCurrency === 'EUR') {
            regex = REGEX_EUR;
            symbol = '€';
        } else if (sourceCurrency === 'TRY') {
            regex = REGEX_TRY;
            symbol = 'TL';
        } else {
            regex = REGEX_USD;
            symbol = '$';
        }

        // Metin hem sembolü içermeli hem de regex ile eşleşmeli
        const matches = text.match(regex);
        if (!matches && !element.dataset.originalText) return;

        if (!element.dataset.originalText) {
            element.dataset.originalText = text;
        }

        if (!matches) {
            if (element.innerText !== element.dataset.originalText) {
                element.innerText = element.dataset.originalText;
            }
            return;
        }

        const sourcePriceStr = matches[1].replace(/\./g, '').replace(',', '.');
        const sourcePrice = parseFloat(sourcePriceStr);
        const targetPrice = sourcePrice * RATE;

        const isOldPrice = element.classList.contains('discount_original_price') || 
                          element.classList.contains('salepreviewwidgets_StoreOriginalPrice_1EKGZ') ||
                          (element.classList.contains('_3fFFsvII7Y2KXNLDk_krOW') && element.parentElement.classList.contains('_3NhLu7mTdty7JufpSpz6Re'));

        const isFinalPrice = element.classList.contains('discount_final_price') ||
                            element.classList.contains('salepreviewwidgets_StoreSalePriceBox_Wh0L8') ||
                            element.classList.contains('game_purchase_price') ||
                            element.classList.contains('price');

        // İndirim yoksa ve USD gösterimi aktifse, orijinal USD fiyatını bırak (eklenti yokmuş gibi davran)
        const isDiscounted = document.querySelector('.discount_pct') || element.closest('.discount_block');
        if (showUsd && !isDiscounted && isFinalPrice) {
            if (element.innerText !== element.dataset.originalText) {
                element.innerText = element.dataset.originalText;
            }
            element.classList.remove('steam-try');
            element.classList.remove('steam-try-force-visible');
            return;
        }

        if (showOriginalUsd && !hideDiscount && isOldPrice) {
            if (element.innerText !== element.dataset.originalText) {
                element.innerText = element.dataset.originalText;
            }
            element.classList.remove('steam-try');
            return;
        }

        element.classList.add("steam-try");

        let newText = '';
        const targetSymbol = targetCurrency === 'TRY' ? 'TL' : (targetCurrency === 'EUR' ? '€' : '$');
        if (showUsd) {
            const hasSourceSuffix = text.includes(sourceCurrency);
            newText = `${sourcePrice.toFixed(2)}${symbol}${hasSourceSuffix ? ' ' + sourceCurrency : ''} (${targetPrice.toFixed(2)} ${targetSymbol})`;
        } else {
            newText = `${targetPrice.toFixed(2)} ${targetSymbol}`;
        }

        // MutationObserver döngüsünü ve fiyat kaybolmasını engellemek için
        if (element.innerHTML !== newText) {
            element.innerHTML = newText;
            
            // Eğer element gizlenmesi gereken bir indirimli fiyatsa force-visible ekleme
            const isDiscountElement = element.classList.contains('discount_original_price') || 
                                    element.classList.contains('salepreviewwidgets_StoreOriginalPrice_1EKGZ') ||
                                    element.classList.contains('_3fFFsvII7Y2KXNLDk_krOW') ||
                                    element.classList.contains('cnkoFkzVCby40gJ0jGGS4') ||
                                    element.classList.contains('discount_pct');

            if (hideDiscount && isDiscountElement) {
                element.classList.remove('steam-try-force-visible');
                element.style.setProperty('display', 'none', 'important');
                return;
            }

            element.classList.add('steam-try-force-visible');
            
            if (element.style.display === 'none') {
                element.style.setProperty('display', 'inline-block', 'important');
            }
        }
    });
    } catch (e) {
        if (e.message.includes('Extension context invalidated')) {
            console.log('[Steam TRY] Extension updated or reloaded. Please refresh the page.');
        }
    }
}

async function start() {
    await updatePrices();

    const observer = new MutationObserver(() => {
        updatePrices();
    });

    observer.observe(document, {childList: true, subtree: true});

    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'sync') {
            updatePrices();
        }
    });
}


async function fetchCurrency() {
    console.log("[Steam Price Converter] Fetching currency for mode: " + CURRENCY_MODE);
    const [base, target] = CURRENCY_MODE.split('_');
    
    // Primary API: Frankfurter
    try {
        const res = await fetch(`https://api.frankfurter.dev/v2/rates?base=${base}&quotes=${target}`);
        const data = await res.json();
        
        let fetchedRate = null;
        if (Array.isArray(data) && data.length > 0) {
            fetchedRate = data[0].rate;
        } else if (data && data.rates && data.rates[target]) {
            fetchedRate = data.rates[target];
        }

        if (fetchedRate !== null) {
            RATE = fetchedRate;
            console.log(`[Steam Price Converter] Rate fetched (Frankfurter): 1 ${base} = ${RATE} ${target}`);
            await finalizeFetch();
            return;
        }
    } catch (error) {
        console.error("[Steam Price Converter] Frankfurter API failed, trying Binance backup...", error);
    }

    // Backup API: Binance (Supports USD_TRY, USD_EUR, EUR_USD, EUR_TRY, TRY_USD, TRY_EUR)
    try {
        let binanceRate = null;

        if (CURRENCY_MODE === 'USD_TRY') {
            const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=USDTTRY`);
            const data = await res.json();
            if (data && data.price) binanceRate = parseFloat(data.price);
        } else if (CURRENCY_MODE === 'USD_EUR') {
            const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=EURUSDT`);
            const data = await res.json();
            if (data && data.price) binanceRate = 1 / parseFloat(data.price);
        } else if (CURRENCY_MODE === 'EUR_USD') {
            const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=EURUSDT`);
            const data = await res.json();
            if (data && data.price) binanceRate = parseFloat(data.price);
        } else if (CURRENCY_MODE === 'EUR_TRY') {
            // EUR/TRY = (EUR/USD) * (USD/TRY)
            const resEurUsd = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=EURUSDT`);
            const dataEurUsd = await resEurUsd.json();
            const resUsdTry = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=USDTTRY`);
            const dataUsdTry = await resUsdTry.json();
            if (dataEurUsd.price && dataUsdTry.price) {
                binanceRate = parseFloat(dataEurUsd.price) * parseFloat(dataUsdTry.price);
            }
        } else if (CURRENCY_MODE === 'TRY_USD') {
            const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=USDTTRY`);
            const data = await res.json();
            if (data && data.price) binanceRate = 1 / parseFloat(data.price);
        } else if (CURRENCY_MODE === 'TRY_EUR') {
            // TRY/EUR = (TRY/USD) * (USD/EUR) = (1 / (USD/TRY)) * (1 / (EUR/USD))
            const resUsdTry = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=USDTTRY`);
            const dataUsdTry = await resUsdTry.json();
            const resEurUsd = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=EURUSDT`);
            const dataEurUsd = await resEurUsd.json();
            if (dataUsdTry.price && dataEurUsd.price) {
                binanceRate = 1 / (parseFloat(dataUsdTry.price) * parseFloat(dataEurUsd.price));
            }
        }

        if (binanceRate !== null) {
            RATE = binanceRate;
            console.log(`[Steam Price Converter] Rate fetched (Binance): 1 ${base} = ${RATE} ${target}`);
            await finalizeFetch();
            return;
        }
    } catch (error) {
        console.error("[Steam Price Converter] Binance backup API also failed:", error);
    }
}

async function finalizeFetch() {
    if (CURRENCY_MODE === 'USD_TRY') {
        console.log("[Steam Price Converter] Running start for first time..");
        await start();
    } else {
        await updatePrices();
    }
}

fetchCurrency();
