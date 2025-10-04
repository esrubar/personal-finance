import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import '../styles/layout.scss';

type SiderBarProps = {
  children: ReactNode;
};

export default function SiderBar({ children }: SiderBarProps) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Finanzas</h2>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/expenses">Gastos</Link>
          <Link to="/categories">Categorías</Link>
          <Link to="/savings">Ahorros</Link>
          <Link to="/users">Usuarios</Link>
        </nav>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
