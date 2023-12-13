import React from 'react'
import styles from './ListItem.module.css'
import FileTextIcon from '@/assets/icons/file-text'
import LogOutIcon from '@/assets/icons/log-out'
import UserX from '@/assets/icons/userx'
import ChevronRight from '@/assets/icons/chevron-right'
import Link from './Link'


export default function ListItem({href, LegalDoc, LogOut, DeleteAcct, textlabel}:any){
        
        if (LegalDoc) {
        return (      
            <Link className={`${styles.listitem} ${styles.border}`} href={href}>
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
        if (LogOut) {
        return (      
            <Link className={styles.listitem} href={href}>
                <div className={styles.listitemlabel}>
                    <div className={styles.listitemicon}>
                         <LogOutIcon />
                    </div>
                    <div> {textlabel} </div>
                </div>
            </Link>
            );
        }
        if (DeleteAcct) {
            return (      
                <Link className={`${styles.listitem} ${styles.border}`} href={href}>
                    <div className={styles.listitemlabel}>
                        <div className={styles.listitemicon}>
                             <UserX />
                        </div>
                        <div> {textlabel} </div>
                    </div>
                </Link>
                );
            }
        return (      
            <Link className={styles.listitem} href={href}>
                <div className={styles.listitemlabel}>
                    <div className={styles.listitemicon}>
                    </div>
                    <div> {textlabel} </div>
                </div>
            </Link>
          );
    }
