import React from 'react'
import styles from './ListItem.module.css'
import FileTextIcon from '@/assets/icons/file-text'
import ChevronRight from '@/assets/icons/chevron-right'
import Link from './Link'

export default function ListItemLink({href, LegalDoc, textlabel, onClick}:any){
        if (LegalDoc) {
        return (      
            <Link className={`${styles.listitem} ${styles.border}`} href={href} onClick={onClick}>
                <div className={styles.listitemlabel}>
                    <div className={styles.listitemicon}>
                        <FileTextIcon />
                    </div>
                    <div> {textlabel} </div>
                </div>
                <div className={styles.listitemicon}>
                    <ChevronRight />
                </div>
            </Link>
          );
        }
    return (
        <Link className={`${styles.listitem} ${styles.border}`} href={href} onClick={onClick}>
            <div className={styles.listitemlabel}>
                <div className={styles.listitemicon}>
                    <FileTextIcon />
                </div>
                <div> {textlabel} </div>
            </div>
        </Link>
    );
}