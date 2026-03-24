# Steam Fiyat Dönüştürücü (Steam Price Converter)

Steam Price Converter, Steam mağazası ve topluluk sayfalarındaki fiyatları dinamik olarak seçtiğiniz para birimine (TRY, EUR, USD) dönüştüren bir tarayıcı eklentisidir.

## Özellikler

- **Yüksek Erişilebilirlik**: Çift katmanlı API desteği. Frankfurter API ulaşılamaz olduğunda otomatik olarak **Binance API** devreye girer.
- **Çeşitli Para Birimi Modları**:
  - 🇹🇷 USD ➔ TRY (Varsayılan)
  - 🇪🇺 USD ➔ EUR
  - 🇺🇸 EUR ➔ USD
- **Akıllı İndirim Yönetimi**:
  - **Orijinal Fiyatları Göster**: Dönüştürülmüş fiyatın yanında orijinal değeri de gösterir (Örn: 150 TL ($4.50)).
  - **İndirim Detaylarını Gizle**: İndirim oranlarını ve eski (çizgili) fiyatları tamamen kaldırarak sadece final fiyatını gösteren temiz bir arayüz sağlar.
- **Optimize Tasarım**: Ayarların hızlıca yapılabilmesi için bayrak ikonları içeren, modern ve kompakt arayüz.
- **Otomatik Güncelleme**: En güncel kurları gerçek zamanlı olarak otomatik çeker.

## Kurulum

1. Bu depoyu indirin veya klonlayın.
2. Chrome'da `chrome://extensions/` adresine gidin.
3. **Geliştirici modu**nu açın (sağ üst).
4. **Paketlenmemiş öğe yükle** butonuna tıklayın ve eklenti klasörünü seçin.

## Teknik Detaylar

- **Altyapı**: Saf JavaScript (Manifest V3)
- **Ana API**: [Frankfurter API](https://www.frankfurter.app/)
- **Yedek API**: [Binance API](https://api.binance.com/) (Yedekleme desteği)
- **Performans**: Dinamik içerikler için `MutationObserver` ve hız için CSS tabanlı gizleme kullanılır.

## Lisans

MIT - Copyright (c) 2026 Uğur Ayyıldız

---
[ugurayyildizx](https://github.com/ugurayyildizx) tarafından geliştirilmiştir.
