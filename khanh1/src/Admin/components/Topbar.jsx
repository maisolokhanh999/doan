import { useTranslation } from 'react-i18next';

const Topbar = () => {
    const { t } = useTranslation();

    return (
        <header className="topbar">
            <div className="topbar-left">
                <div className="menu-toggle" id="menuToggle">
                    <span className="material-symbols-outlined text-primary" data-icon="menu">menu</span>
                </div>
                <h2 className="topbar-title">{t('topbar.brand_title')}</h2>
            </div>
            <div className="topbar-right">
                <button className="icon-btn">
                    <span className="material-symbols-outlined icon-color"
                        data-icon="notifications">notifications</span>
                </button>
                <button className="icon-btn">
                    <span className="material-symbols-outlined icon-color" data-icon="settings">settings</span>
                </button>
                <div className="user-avatar">
                    <img alt="User profile"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqhEAbA4EXQ7wG2xvoayV5VENUqboy7giqs1GlJUIa_3u_BbPBqbRs7Jv40jrsBLoI7IzOO34MVmG2jMm_JvMzLTahfZv7T3jE105gwRPOZ0QBM6wAT0__PLqxOVtrE1-o7c1ROxK1L58-dO6I6o8aRw7sRW27n7rmKnRfwtTgoXy9EY_lMqg4C1yHovxdiTHL0kplZ3kLkPRuJPu-emGElYiDDi5Q1F3cNSS0XGamNVaRf0gwafPCHENnGU8XGYSPdOCVF2dQ6K_b" />
                </div>
            </div>
        </header>
    );
};

export default Topbar;