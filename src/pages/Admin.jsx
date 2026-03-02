import "./Admin.css";

const Admin = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    return(
        <div className="admin">

        <aside className={`sidebar ${menuOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-content">
                <h2>AgilCheck</h2>
            </div>

        </aside>
        </div>
    );
}
export default Admin;