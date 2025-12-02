import React, { useState } from "react";
import "./registroList.css";

const API_BASE_URL = "https://brasilapi.com.br/api/registrobr/v1";

function RegistroList() {
  const [inputDomain, setInputDomain] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!inputDomain.trim()) {
      setError("Por favor, digite um nome de domínio completo (ex: site.com.br).");
      setResult(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const cleanDomain = inputDomain.toLowerCase().trim();
      const encodedDomain = cleanDomain.replace(/\./g, "%2E");
      const endpoint = `${API_BASE_URL}/${encodedDomain}`;

      const response = await fetch(endpoint);

      // 🛑 CORREÇÃO 1: Adiciona a verificação de status HTTP (resolve falhas por 404, acentos, etc.)
      if (!response.ok) {
        let errorMsg = `Erro ${response.status}: Falha ao buscar domínio.`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMsg = errorData.message;
          } else if (errorData.error) {
            errorMsg = errorData.error;
          }
        } catch {
          // Se não for JSON, usamos a mensagem padrão de status
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      // 🛑 CORREÇÃO 2: Usa o valor da mensagem de erro, não a string literal
      setError(err.message); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-background">

      <div className="header-blur">
        <h2 className="fw-bold text-light">Informações sobre domínio:</h2>
        <p className="text-light">
          Aplicação desenvolvida para a cadeira de Front-End Frameworks com consumo da API pública do Registro.br
        </p>

        <h3 className="header-blur">Registre o domínio .br certo para você:</h3>

        <form onSubmit={handleSearch} className="d-flex gap-2 mb-3">
          <input
            type="text"
            className="form-control input-custom"
            placeholder="Ex: google.com.br"
            value={inputDomain}
            onChange={(e) => setInputDomain(e.target.value)}
            disabled={loading}
          />

          <button type="submit" className="btn btn-custom fw-bold" disabled={loading}>
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </form>

        {error && (
            // Aplica result-box, fade-in, e um estilo visual de erro (borda vermelha)
          <div className="result-box mt-4 p-3 fade-in" style={{ border: '2px solid #dc3545' }}> 
                <h3 className="title-highlight" style={{ color: '#dc3545' }}>
                    <span role="img" aria-label="Atenção">⚠️</span> Erro na Busca
                </h3>
                <p style={{ fontSize: '18px', color: '#fff' }}>
                    {error}
                </p>
          </div>
        )}


        {result && !loading && (
          <div className="result-box mt-4 p-3 fade-in">
            <h3 className="title-highlight">Domínio: {result.domain}</h3>

            <p>
              <strong>Status:</strong>{" "}
              {result.status === "AVAILABLE" && (
                <span className="text-success fw-bold" >Livre para registro!</span>
              )}

              {result.status === "REGISTERED" && (
                <span className="text-danger fw-bold">Ocupado!</span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegistroList;
