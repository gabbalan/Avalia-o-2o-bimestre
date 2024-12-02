import React, { useState } from 'react';
import axios from 'axios';

const CartForm = ({ userId, cartItems, setCartItems }) => {
    const [responseMessage, setResponseMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const baseURL = 'http://localhost:8086';

    const handleRemoveItem = async (cartItemId) => {
        if (!cartItemId) {
            setResponseMessage('Erro: ID do item inválido.');
            setIsError(true);
            console.error('ID do item inválido:', cartItemId);
            return;
        }

        try {
            console.log(`Removendo item: UserID=${userId}, CartItemID=${cartItemId}`);
            const response = await axios.delete(`${baseURL}/carts/removeItem/${userId}/${cartItemId}`);
            if (response.status === 200) {
                setResponseMessage('Item removido com sucesso!');
                // Atualiza o estado do carrinho removendo o item correspondente
                setCartItems((prevItems) => prevItems.filter((item) => item.id !== cartItemId));
                setIsError(false);
            } else {
                setResponseMessage('Erro ao remover item.');
                setIsError(true);
            }
        } catch (error) {
            console.error('Erro ao remover item:', error);
            setResponseMessage('Erro ao remover item.');
            setIsError(true);
        }
    };

    const calcularTotal = () => {
        return cartItems.reduce((total, item) => {
            const preco = Number(item.precoUnitario || item.preco || 0);
            const quantidade = Number(item.quantidade || 0);
            return total + preco * quantidade;
        }, 0);
    };

    const handleFinalizarCompra = async () => {
        try {
            const response = await axios.post(`${baseURL}/carts/finalizarCompra`, { userId });
            if (response.status === 200) {
                setResponseMessage('Compra finalizada com sucesso!');
                setIsError(false);
                setCartItems([]); // Limpa o carrinho
            }
        } catch (error) {
            console.error('Erro ao finalizar compra:', error);
            setResponseMessage('Erro ao finalizar compra.');
            setIsError(true);
        }
    };

    return (
        <div className="cart-form">
            <h3>Carrinho de Compras</h3>
            {cartItems.length === 0 ? (
                <p>Seu carrinho está vazio</p>
            ) : (
                <div>
                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            <h4>{item.nome || item.productName}</h4>
                            <p>Descrição: {item.descricao || 'Sem descrição disponível'}</p>
                            <p>Preço Unitário: R$ {Number(item.precoUnitario || item.preco || 0).toFixed(2)}</p>
                            <p>Quantidade: {item.quantidade}</p>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleRemoveItem(item.id)}
                            >
                                Remover
                            </button>
                        </div>
                    ))}
                    <div className="cart-total mt-4">
                        <h4>Total do Carrinho: R$ {calcularTotal().toFixed(2)}</h4>
                        <button
                            className="btn btn-success"
                            onClick={handleFinalizarCompra}
                        >
                            Finalizar Compra
                        </button>
                    </div>
                </div>
            )}
            {responseMessage && (
                <div className={`alert mt-3 ${isError ? 'alert-danger' : 'alert-success'}`}>
                    {responseMessage}
                </div>
            )}
        </div>
    );
};

export default CartForm;
