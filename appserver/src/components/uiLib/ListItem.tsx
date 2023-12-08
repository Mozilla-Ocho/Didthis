import React from 'react'
import styles from './ListItem.module.css'
import FileTextIcon from '@/assets/icons/file-text'
import LogOutIcon from '@/assets/icons/log-out'
import UserX from '@/assets/icons/userx'
import ChevronRight from '@/assets/icons/chevron-right'


export default function ListItem({href, LegalDoc, LogOut, DeleteAcct, textlabel}:any){
        
        if (LegalDoc) {
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
        if (LogOut) {
        return (      
            <a className={styles.listitem} href={href}>
                <div className={styles.listitemlabel}>
                    <div className={styles.listitemicon}>
                         <LogOutIcon />
                    </div>
                    <div> {textlabel} </div>
                </div>
            </a>
            );
        }
        if (DeleteAcct) {
            return (      
                <a className={styles.listitem} href={href}>
                    <div className={styles.listitemlabel}>
                        <div className={styles.listitemicon}>
                             <UserX />
                        </div>
                        <div> {textlabel} </div>
                    </div>
                </a>
                );
            }
        return (      
            <a className={styles.listitem} href={href}>
                <div className={styles.listitemlabel}>
                    <div className={styles.listitemicon}>
                    </div>
                    <div> {textlabel} </div>
                </div>
            </a>
          );
    }