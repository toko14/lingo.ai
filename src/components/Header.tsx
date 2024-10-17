import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-full" />
          <span className="ml-2 text-xl font-bold">Lingo!!</span>
        </Link>
        <Button variant="outline">ログイン</Button>
      </div>
    </header>
  );
}
