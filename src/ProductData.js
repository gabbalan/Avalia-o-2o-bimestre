import React, { useState } from "react";
import axios from "axios";

const ProductDataForm = () => {
    const baseURL = "http://localhost:8086"; // URL do backend
    const [formData, setFormData] = useState({
        id: "",
        nome: "",
        descricao: "",
        preco: "",
        estoque: "",
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSearch = async () => {
        if (!formData.nome) {
            setErrorMessage("Por favor, informe o Nome do produto.");
            setSuccessMessage("");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/products/allProducts?nome=${formData.nome}`);
            if (response.status === 200 && response.data.length > 0) {
                const product = response.data[0]; // Primeiro produto encontrado
                setFormData({
                    id: product.id,
                    nome: product.nome,
                    descricao: product.descricao,
                    preco: product.preco,
                    estoque: product.estoque,
                });
                setSuccessMessage("Produto encontrado!");
                setErrorMessage("");
            } else {
                setErrorMessage("Produto não encontrado.");
                setSuccessMessage("");
            }
        } catch (error) {
            console.error("Erro ao buscar produto:", error);
            setErrorMessage("Erro ao buscar produto. Verifique o console para mais detalhes.");
            setSuccessMessage("");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const productData = {
                nome: formData.nome,
                descricao: formData.descricao,
                preco: parseFloat(formData.preco),
                estoque: parseInt(formData.estoque),
            };

            const response = await axios.post(`${baseURL}/products/newProduct`, productData);

            if (response.status === 201) {
                setSuccessMessage(`Produto "${formData.nome}" adicionado com sucesso!`);
                setErrorMessage("");
                handleClear();
            } else {
                setErrorMessage("Erro ao salvar produto.");
                setSuccessMessage("");
            }
        } catch (error) {
            console.error("Erro ao salvar produto:", error);
            setErrorMessage("Erro ao salvar produto. Verifique o console para mais detalhes.");
            setSuccessMessage("");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!formData.id) {
            setErrorMessage("Por favor, informe o ID do produto para atualizar.");
            setSuccessMessage("");
            return;
        }

        setLoading(true);
        try {
            const productData = {
                id: formData.id,
                nome: formData.nome,
                descricao: formData.descricao,
                preco: parseFloat(formData.preco),
                estoque: parseInt(formData.estoque),
            };

            const response = await axios.put(`${baseURL}/products/updateProduct`, productData);

            if (response.status === 200) {
                setSuccessMessage(`Produto "${formData.nome}" atualizado com sucesso!`);
                setErrorMessage("");
                handleClear();
            } else {
                setErrorMessage("Erro ao atualizar produto.");
                setSuccessMessage("");
            }
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
            setErrorMessage("Erro ao atualizar produto. Verifique o console para mais detalhes.");
            setSuccessMessage("");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!formData.id) {
            setErrorMessage("Por favor, informe o ID do produto para deletar.");
            setSuccessMessage("");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.delete(`${baseURL}/products/deleteProduct`, {
                data: { id: formData.id },
            });

            if (response.status === 200) {
                setSuccessMessage(`Produto "${formData.nome}" deletado com sucesso!`);
                setErrorMessage("");
                handleClear();
            } else {
                setErrorMessage("Erro ao deletar produto.");
                setSuccessMessage("");
            }
        } catch (error) {
            console.error("Erro ao deletar produto:", error);
            setErrorMessage("Erro ao deletar produto. Verifique o console para mais detalhes.");
            setSuccessMessage("");
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setFormData({
            id: "",
            nome: "",
            descricao: "",
            preco: "",
            estoque: "",
        });
        setErrorMessage("");
        setSuccessMessage("");
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <form onSubmit={handleSave}>
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-group">
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
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Descrição:</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="descricao"
                                        value={formData.descricao}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Preço:</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="preco"
                                        value={formData.preco}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Estoque:</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="estoque"
                                        value={formData.estoque}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center gap-3 mt-4">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? "Adicionando..." : "Adicionar"}
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleSearch} disabled={loading}>
                                {loading ? "Buscando..." : "Buscar"}
                            </button>
                            <button type="button" className="btn btn-success" onClick={handleUpdate} disabled={loading}>
                                {loading ? "Atualizando..." : "Atualizar"}
                            </button>
                            <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={loading}>
                                {loading ? "Deletando..." : "Deletar"}
                            </button>
                        </div>
                    </form>
                    <p className="text-muted mt-3">Para buscar um produto, utilize apenas o nome do produto.</p>
                    {successMessage && (
                        <div className="alert mt-3 alert-success">
                            {successMessage}
                        </div>
                    )}
                    {errorMessage && (
                        <div className="alert mt-3 alert-danger">
                            {errorMessage}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDataForm;
