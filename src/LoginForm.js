import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [responseMessage, setResponseMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const baseURL = 'http://localhost:8086';
            const response = await axios.post(`${baseURL}/users/login`, formData);

            if (response.status === 200) {
                const { Token } = response.data; // Supondo que o token JWT seja retornado como "Token"
                localStorage.setItem('authToken', Token); // Armazena o token no localStorage
                setResponseMessage('Login realizado com sucesso!');
                setIsError(false);

                // Opcional: Redirecionar ou executar outra ação
                // window.location.href = '/dashboard'; // Redireciona para outra página
            } else {
                setResponseMessage('Erro ao realizar login. Tente novamente.');
                setIsError(true);
            }
        } catch (error) {
            console.error('Erro ao realizar login:', error.response?.data || error.message);
            setResponseMessage('Erro ao realizar login. Verifique suas credenciais.');
            setIsError(true);
        }
    };

    return (
        <div className="login-form">
            <h3>Login</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        className="form-control"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Senha:</label>
                    <input
                        className="form-control"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Login</button>
            </form>
            {responseMessage && (
                <div className={`alert mt-3 ${isError ? 'alert-danger' : 'alert-success'}`}>
                    {responseMessage}
                </div>
            )}
        </div>
    );
};

export default LoginForm;
