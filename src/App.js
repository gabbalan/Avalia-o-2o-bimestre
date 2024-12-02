import React, { useState, useEffect } from 'react';
import UserAccountForm from './UserAccountForm';
import LoginForm from './LoginForm';
import CartForm from './CartForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductDataform from './ProductData';
import FornecedorForm from './FornecedorForm';
import axios from 'axios';

function App() {
    const [currentPage, setCurrentPage] = useState('landing');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [produtos, setProdutos] = useState([]);

    const baseURL = "http://localhost:8086";

    // Função para buscar produtos do backend
    const fetchProdutos = async () => {
        try {
            const response = await axios.get(`${baseURL}/products/allProducts`);
            console.log('Produtos recebidos:', response.data);
            if (response.status === 200) {
                setProdutos(Array.isArray(response.data) ? response.data : []);
            }
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };

    useEffect(() => {
        fetchProdutos();
    }, []);

    const handleNavClick = (page) => {
        setCurrentPage(page);
        if (page === 'logout') {
            setIsLoggedIn(false);
            setCurrentPage('landing');
        }
    };

    return (
        <div className="App">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
                <div className="container">
                    <a className="navbar-brand fw-bold" href="#" onClick={() => handleNavClick('landing')}>
                        Loja
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            {!isLoggedIn && (
                                <>
                                    <li className="nav-item mx-2">
                                        <button
                                            className="btn btn-outline-light"
                                            onClick={() => handleNavClick('createAccount')}
                                        >
                                            Criar Conta
                                        </button>
                                    </li>
                                    <li className="nav-item mx-2">
                                        <button
                                            className="btn btn-outline-light"
                                            onClick={() => handleNavClick('login')}
                                        >
                                            Login
                                        </button>
                                    </li>
                                    <li className="nav-item mx-2">
                                        <button
                                            className="btn btn-outline-light"
                                            onClick={() => handleNavClick('produtos')}
                                        >
                                            Produtos
                                        </button>
                                    </li>
                                    <li className="nav-item mx-2">
                                        <button
                                            className="btn btn-outline-light position-relative"
                                            onClick={() => handleNavClick('carrinho')}
                                        >
                                            Carrinho
                                            {cartItems.length > 0 && (
                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                    {cartItems.length}
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                    <li className="nav-item mx-2">
                                        <button
                                            className="btn btn-outline-light"
                                            onClick={() => handleNavClick('fornecedor')}
                                        >
                                            Fornecedor
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container">
                {currentPage === 'landing' && (
                    <div className="mt-4">
                        <h2 className="text-center mb-4">Nossos Produtos</h2>
                        <div className="row g-3">
                            {produtos.length > 0 ? (
                                produtos.map((produto) => (
                                    <div key={produto.id} className="col-6 col-md-4 col-lg-3">
                                        <div className="card h-100">
                                            <div className="card-body">
                                                <h5 className="card-title">{produto.nome}</h5>
                                                <p className="card-text">
                                                    <small className="text-muted">{produto.descricao}</small>
                                                </p>
                                                <p className="card-text">
                                                    <strong>R$ {Number(produto.preco || 0).toFixed(2)}</strong>
                                                </p>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => {
                                                        setCartItems([...cartItems, { ...produto, quantidade: 1 }]);
                                                    }}
                                                >
                                                    Adicionar ao Carrinho
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center">Nenhum produto disponível no momento.</p>
                            )}
                        </div>
                    </div>
                )}

                {currentPage === 'createAccount' && (
                    <div className="mt-4">
                        <UserAccountForm />
                    </div>
                )}

                {currentPage === 'login' && (
                    <div className="mt-4">
                        <LoginForm />
                    </div>
                )}

                {currentPage === 'logout' && (
                    <div className="mt-4">
                        <h4>Você saiu com sucesso.</h4>
                    </div>
                )}

                {currentPage === 'produtos' && (
                    <div className="mt-4">
                        <ProductDataform />
                    </div>
                )}

                {currentPage === 'carrinho' && (
                    <div className="mt-4">
                        <CartForm cartItems={cartItems} setCartItems={setCartItems} />
                    </div>
                )}

                {currentPage === 'fornecedor' && (
                    <div className="mt-4">
                        <FornecedorForm />
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
