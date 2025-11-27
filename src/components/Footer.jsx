'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        <>
            {/* Bottom Bar */}
            <div className="flex justify-center items-center text-sm font-semibold text-white text-center bg-[#1a1818b6] py-2">
                <Link href="https://tekbooster.com/" target='_blank' className="hover:text-[#D1D5DB] text-lg" style={{ fontFamily: "Roboto Slab, serif" }}>
                    Design & Developed By <br className='lg:hidden' /> Tek Booster (Digital Marketing Company)
                </Link>
            </div>
        </>
    )
}

export default Footer