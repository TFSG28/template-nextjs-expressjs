import Link from "next/link";

export default function Header() {
    return (
        <header className="text-white px-8 py-4 flex items-center justify-between">
            <Link href="/">
                <p>Header</p>
            </Link>
        </header>
    )
}
