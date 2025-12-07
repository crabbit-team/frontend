import { Outlet } from "react-router-dom";
import { Header } from "../common/header";
import { Footer } from "../common/footer";


export function Layout() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-tech selection:bg-carrot-orange selection:text-carrot-orange-foreground">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8 relative">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-carrot-orange/5 via-transparent to-transparent opacity-50" />
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}
