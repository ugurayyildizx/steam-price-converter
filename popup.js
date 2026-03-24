chrome.storage.sync.get(['status', 'show_usd', 'show_original_usd', 'hide_discount', 'currency_mode'], function (result) {
    document.querySelector('#statusCheck').checked = result.status !== undefined ? result.status : true;
    document.querySelector('#showUsdCheck').checked = result.show_usd !== undefined ? result.show_usd : false;
    document.querySelector('#showOriginalUsdCheck').checked = result.show_original_usd !== undefined ? result.show_original_usd : false;
    document.querySelector('#hideDiscountCheck').checked = result.hide_discount !== undefined ? result.hide_discount : false;

    const currencyMode = result.currency_mode || 'USD_TRY';
    document.querySelectorAll('.currency-option').forEach(opt => {
        if (opt.dataset.currency === currencyMode) {
            opt.classList.add('active');
        } else {
            opt.classList.remove('active');
        }
    });
});

document.querySelectorAll('.currency-option').forEach(option => {
    option.addEventListener('click', function() {
        const mode = this.dataset.currency;
        document.querySelectorAll('.currency-option').forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        chrome.storage.sync.set({ currency_mode: mode });
    });
});

document.querySelector('#statusCheck').addEventListener('change', function () {
    chrome.storage.sync.set({status: this.checked});
});
document.querySelector('#showUsdCheck').addEventListener('change', function () {
    chrome.storage.sync.set({show_usd: this.checked});
});
document.querySelector('#showOriginalUsdCheck').addEventListener('change', function () {
    chrome.storage.sync.set({show_original_usd: this.checked});
});
document.querySelector('#hideDiscountCheck').addEventListener('change', function () {
    chrome.storage.sync.set({hide_discount: this.checked});
});