"use client";

import { usePersianFont } from "persian-fontkit/hooks";
import styles from "./page.module.css";

export default function Home() {
  // Load Vazir font dynamically
  usePersianFont({
    family: "Vazir",
    weight: [400, 700],
    subsets: ["farsi", "latin"],
    basePath: "/fonts/optimized",
  });

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>🎨 Persian FontKit</h1>
          <p className={styles.subtitle}>
            بهینه‌سازی خودکار فونت‌های فارسی برای Next.js و React
          </p>
        </header>

        <section className={styles.demo}>
          <div className={styles.card}>
            <h2>نمونه متن فارسی</h2>
            <p className={styles.normalText}>
              این یک متن نمونه با وزن معمولی (۴۰۰) است که با استفاده از فونت
              بهینه‌شده Vazir نمایش داده می‌شود.
            </p>
            <p className={styles.boldText}>
              این متن با وزن ضخیم (۷۰۰) است و سرعت بارگذاری بسیار بهتری نسبت به
              فونت‌های بهینه‌نشده دارد.
            </p>
          </div>

          <div className={styles.card}>
            <h2>English Text Sample</h2>
            <p className={styles.normalText}>
              This is a sample text in regular weight (400) rendered using the
              optimized Vazir font.
            </p>
            <p className={styles.boldText}>
              This text is in bold weight (700) and loads much faster than
              non-optimized fonts.
            </p>
          </div>

          <div className={styles.card}>
            <h2>اعداد و علائم</h2>
            <p className={styles.normalText}>
              اعداد فارسی: ۰ ۱ ۲ ۳ ۴ ۵ ۶ ۷ ۸ ۹
            </p>
            <p className={styles.normalText}>
              اعداد انگلیسی: 0 1 2 3 4 5 6 7 8 9
            </p>
            <p className={styles.normalText}>علائم: ! ؟ ، ؛ « » ( ) {} [ ]</p>
          </div>
        </section>

        <section className={styles.features}>
          <h2>ویژگی‌های persian-fontkit</h2>
          <div className={styles.featureGrid}>
            <div className={styles.feature}>
              <span className={styles.icon}>⚡</span>
              <h3>سریع</h3>
              <p>کاهش ۶۰-۸۰٪ حجم فونت</p>
            </div>
            <div className={styles.feature}>
              <span className={styles.icon}>🎯</span>
              <h3>دقیق</h3>
              <p>Subsetting هوشمند کاراکترها</p>
            </div>
            <div className={styles.feature}>
              <span className={styles.icon}>🔧</span>
              <h3>آسان</h3>
              <p>نصب و استفاده ساده</p>
            </div>
            <div className={styles.feature}>
              <span className={styles.icon}>⚛️</span>
              <h3>مدرن</h3>
              <p>پشتیبانی کامل از React و Next.js</p>
            </div>
          </div>
        </section>

        <section className={styles.usage}>
          <h2>نحوه استفاده</h2>
          <pre className={styles.code}>
            {`// Install
npm install persian-fontkit

// Optimize fonts
npx persian-fontkit optimize ./public/fonts --output ./dist/fonts

// Use in React
import { usePersianFont } from 'persian-fontkit/hooks';

function MyComponent() {
  usePersianFont({
    family: 'Vazir',
    weight: [400, 700],
    subsets: ['farsi', 'latin'],
  });
  
  return <div style={{ fontFamily: 'Vazir' }}>سلام دنیا</div>;
}`}
          </pre>
        </section>

        <footer className={styles.footer}>
          <p>Made with ❤️ for the Persian web community</p>
          <p>
            <a
              href="https://github.com/yourusername/persian-fontkit"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            {" • "}
            <a
              href="https://www.npmjs.com/package/persian-fontkit"
              target="_blank"
              rel="noopener noreferrer"
            >
              npm
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
