"use client";

import { navLinks } from "@/constants/links";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
// import { FaBars, FaCartShopping, FaXmark } from "react-icons/fa6";
import { FaBars, FaXmark } from "react-icons/fa6";
import logo from "../public/DIS_Logo_Dark.png";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);
    const closeMenu = useCallback(() => setIsOpen(false), []);

    return (
        <nav className="container flex flex-col justify-between py-2 md:flex-row">
            <div className="flex flex-row items-center justify-between">
                {/* LOGO */}
                <Link href={"/"}>
                    <Image src={logo} alt="Drive Insight Logo" width={140} />
                </Link>

                {/* HAMBURGER MENU */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleMenu}
                    className="md:hidden">
                    {isOpen ? <FaXmark /> : <FaBars />}
                </Button>
            </div>

            {/* MOBILE LINKS */}
            {isOpen && (
                <Card className="md:hidden">
                    <CardContent>
                        <NavLinks closeMenu={closeMenu} />
                    </CardContent>
                </Card>
            )}

            {/* DESKTOP LINKS */}
            <div className="hidden md:flex">
                <NavLinks closeMenu={closeMenu} />
            </div>
        </nav>
    );
};

const NavLinks = ({ closeMenu }: { closeMenu: () => void }) => {
    return (
        <div className="flex flex-col gap-2 font-semibold md:flex-row md:items-center md:gap-4">
            {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={closeMenu}>
                    {link.label}
                </Link>
            ))}
            <Link
                // href="https://www.ebay.com/itm/396119923371"
                href="https://github.com/Ninkuk/drive-insight-website"
                target="_blank"
                onClick={closeMenu}>
                <Button className="w-fit">
                    {/* <FaCartShopping className="mr-2" /> */}
                    See GitHub Repo
                    {/* Buy Now */}
                </Button>
            </Link>
        </div>
    );
};
