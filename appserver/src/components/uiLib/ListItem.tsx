import React, { CSSProperties, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import styles from './ListItem.module.css'
import settingsGear from '@/assets/img/settings-gear.svg'

function ListItem() {

    return (
      <div className={styles.listitem}>
        <div className={styles.listitemlabel}>
            <div className={styles.listitemicon}>LI</div>
            <div>Label Prop</div>
        </div>

        <div className={styles.listitemicon}>
            <Icon src="settingsGear"></Icon>
        </div>
      </div>
    );
  }

export default ListItem