import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

const App = () => {
    const navigate = useNavigate();

    return (
        <div className="app-container">
            <header className="header">
                <h1>Bem-vindo ao Meu Site com React</h1>
                <nav className="nav">
                    <button onClick={() => navigate("/about")}>Sobre</button>
                    <button onClick={() => navigate("/services")}>Serviços</button>
                    <button onClick={() => navigate("/contact")}>Contato</button>
                </nav>
            </header>
            <main className="main">
                <div className="hero">
                    <h1 className="hero-title">Desenvolvendo com Dedicação</h1>
                    <p className="hero-subtitle">
                        Transformando ideias em experiências digitais incríveis
                    </p>
                </div>
                <div className="cards-container">
                    <div className="card">
                        <h2 className="card-category">Serviços</h2>
                        <h3 className="card-title">Acesse Agora</h3>
                        <p className="card-description">
                            Faça login para não perder nenhuma novidade e ter acesso a recursos exclusivos. Mantenha-se atualizado com nossas últimas ofertas.
                        </p>
                        <button 
                            className="card-button primary"
                            onClick={() => navigate("/payment")}
                        >
                            Acessar Serviços
                        </button>
                        <a href="#" className="card-link">Saiba Mais</a>
                    </div>
                    <div className="card">
                        <h2 className="card-category">Conta</h2>
                        <h3 className="card-title">Cadastre-se</h3>
                        <p className="card-description">
                            Crie sua conta e aproveite os benefícios:
                            • Conteúdo exclusivo
                            • Descontos especiais
                            • Acesso antecipado
                            • Suporte prioritário
                        </p>
                        <button 
                            className="card-button primary"
                            onClick={() => navigate("/signup")}
                        >
                            Criar Conta
                        </button>
                        <a href="#" className="card-link">Ver Planos</a>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
