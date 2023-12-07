import React from 'react'
import styles from './ListItem.module.css'
import ExternalLinkIcon from '@/assets/icons/external-link'
import FileTextIcon from '@/assets/icons/file-text'
import LogOutIcon from '@/assets/icons/log-out'
import UserX from '@/assets/icons/userx'
import ChevronRight from '@/assets/icons/chevron-right'

const LeftIcon = ({file, logout, deleteacct}:any) => {
    return (
      {LeftIcon}
    );
  };
  

const ListItem = ({href, textlabel}:any) => {

    return (
      <a className={styles.listitem} href={href}>
        <div className={styles.listitemlabel}>
        <div className={styles.listitemicon}>
            <FileTextIcon />
        </div>
            <div> {textlabel} </div>
        </div>
        <div className={styles.listitemicon}>
            <ChevronRight />
        </div>
      </a>
    );
  }

export default ListItem