export const generateStaticParams = () => {
  return [{ id: "_" }];
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
