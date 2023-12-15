import React from 'react'
import styles from './ListItem.module.css'
import Info from '@/assets/icons/info'
import Button from './Button'

export default function ListItemBtn({href, LegalDoc, textlabel, onClick}:any){
    return (
        <Button className={styles.listitembtn} onClick={onClick} intent="list" >
            <div className={styles.listitemlabel}>
                <div className={styles.listitemicon}>
                    <Info />
                </div>
                {textlabel}
            </div>
        </Button>
    );
}