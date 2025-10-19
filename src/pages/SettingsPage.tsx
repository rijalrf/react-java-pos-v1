import Card from '@/components/ui/Card'

import styles from './SettingsPage.module.css'

const SettingsPage = () => {
  return (
    <div className={styles.wrapper}>
      <Card elevated>
        <h2>Pengaturan Sistem</h2>
        <p>
          Atur konfigurasi dasar aplikasi, termasuk URL API, informasi outlet,
          dan preferensi operasional lainnya.
        </p>
        <dl>
          <div>
            <dt>Base URL API</dt>
            <dd>http://localhost:5100/api/v1</dd>
          </div>
          <div>
            <dt>Port Aplikasi Frontend</dt>
            <dd>3100</dd>
          </div>
          <div>
            <dt>Bahasa Antarmuka</dt>
            <dd>Indonesia</dd>
          </div>
        </dl>
      </Card>
    </div>
  )
}

export default SettingsPage
