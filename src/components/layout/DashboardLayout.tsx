import { Outlet } from 'react-router-dom'

import Sidebar from '@/components/navigation/Sidebar'

import TopBar from './TopBar'
import styles from './DashboardLayout.module.css'

const DashboardLayout = () => {
  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.panel}>
        <TopBar />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
