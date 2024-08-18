import { SignOutButton, SignedIn, OrganizationSwitcher } from "@clerk/nextjs"
import Link from "next/link"
import Image from "next/image"

const Topbar = () => {
    
    return (
        <nav className="topbar">
            <Link href="/" className="flex items-center gap-4">
                <Image src="assets/logo.svg" width={40} height={40} alt={"logo"} />
                <p className="text-heading3-bold text-light-1 max-xs:hidden">Threads</p>
            </Link>
            <div className="flex items-center gap-1">
                <div className="block md:hidden">
                    <SignedIn>
                        <SignOutButton>
                            <div className="flex cursor-pointer">
                                <Image
                                    src="assets/logout.svg"
                                    alt="logout"
                                    width={24}
                                    height={24}
                                />
                            </div>
                        </SignOutButton>
                    </SignedIn>
                </div>
                <OrganizationSwitcher 
                    appearance={{
                        elements: {
                            organizationSwitcherTrigger: "py-2 px-4"
                        }
                    }}
                />
            </div>
        </nav>
    )
}
export default Topbar