import AdminNav from "../components/admin/AdminNav";

export const metadata = {
    title: "Shop Admin",
    description: "Shop Admin Dashboard",
}

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <AdminNav />
      {children}
    </div>
  );
};

export default AdminLayout;
