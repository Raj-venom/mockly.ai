interface LayoutProps {
    children: React.ReactNode;
};


const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 bg-muted">
            <div className="w-full max-w-sm md:max-w-3xl">
                {children}
            </div>
        </div>
    );
}

export default Layout;
