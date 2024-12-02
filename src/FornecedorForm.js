import React, { useState, useEffect } from "react";
import axios from "axios";

const FornecedorForm = () => {
    const baseURL = "http://localhost:8086/fornecedores";
    const [formData, setFormData] = useState({
        nome: "",
        cnpj: "",
        endereco: "",
        produtoFornecido: "",
    });
    const [fornecedores, setFornecedores] = useState([]);
    const [cnpjBusca, setCnpjBusca] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
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
            const response = await axios.post(`${baseURL}/create`, formData);
            setResponseMessage("Fornecedor criado com sucesso!");
            setIsError(false);
            fetchFornecedores(); // Atualiza lista
        } catch (error) {
            console.error("Erro ao criar fornecedor:", error);
            setResponseMessage("Erro ao criar fornecedor.");
            setIsError(true);
        }
    };

    const fetchFornecedores = async () => {
        try {
            const response = await axios.get(`${baseURL}/all`);
            setFornecedores(response.data);
        } catch (error) {
            console.error("Erro ao buscar fornecedores:", error);
        }
    };

    const handleSearchByCnpj = async () => {
        try {
            const response = await axios.get(`${baseURL}/byCnpj?cnpj=${cnpjBusca}`);
            setFornecedores([response.data]);
        } catch (error) {
            console.error("Erro ao buscar fornecedor por CNPJ:", error);
            setFornecedores([]);
        }
    };

    useEffect(() => {
        fetchFornecedores();
    }, []);

    return (
        <div className="fornecedor-form">
            <h3>Cadastro de Fornecedores</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nome:</label>
                    <input
                        className="form-control"
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>CNPJ:</label>
                    <input
                        className="form-control"
                        type="text"
                        name="cnpj"
                        value={formData.cnpj}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Endereço:</label>
                    <input
                        className="form-control"
                        type="text"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Produto Fornecido:</label>
                    <input
                        className="form-control"
                        type="text"
                        name="produtoFornecido"
                        value={formData.produtoFornecido}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Cadastrar Fornecedor</button>
            </form>
            <hr />
            <h4>Buscar Fornecedor por CNPJ</h4>
            <div className="d-flex">
                <input
                    className="form-control me-2"
                    type="text"
                    value={cnpjBusca}
                    onChange={(e) => setCnpjBusca(e.target.value)}
                />
                <button className="btn btn-secondary" onClick={handleSearchByCnpj}>Buscar</button>
            </div>
            <hr />
            <h4>Lista de Fornecedores</h4>
            <ul>
                {fornecedores.map((fornecedor) => (
                    <li key={fornecedor.id}>
                        <strong>{fornecedor.nome}</strong> - {fornecedor.cnpj} - {fornecedor.endereco} - {fornecedor.produtoFornecido}
                    </li>
                ))}
            </ul>
            {responseMessage && (
                <div className={`alert mt-3 ${isError ? "alert-danger" : "alert-success"}`}>
                    {responseMessage}
                </div>
            )}
        </div>
    );
};

export default FornecedorForm;
