"use client";

import { NextSeo } from 'next-seo';
import Link from 'next/link';
import styles from './not-found.module.scss';
import paths from '@/paths';

export default function NotFound() {
    return (
        <>
            <NextSeo title="404 - Page Not Found" />
            <div className={styles.wrapper}>
                <div className={styles.content}>
                    <h1>404 - Page Not Found</h1>
                    <p>You either tried some shady route or you came here by mistake.
                        Whichever it is, try using the navigation.</p>
                    <Link href={paths.dashboard.bookImport} className={styles.link}>
                        Go back to Home
                    </Link>
                </div>
            </div>
        </>
    );
}
