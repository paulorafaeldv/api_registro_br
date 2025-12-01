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

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-background">

      {/* HEADER */}
      <div className="header-blur">
        <h2 className="fw-bold text-light">Informações sobre domínio:</h2>
        <p className="text-light">
          Aplicação desenvolvida para a cadeira de Front-End Frameworks com consumo da API pública do Registro.br
        </p>

        <h3 className="header-blur">Registre o domínio .br certo para você:</h3>

        {/* FORM */}
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

        {/* ERRO */}
        {error && <div className="alert alert-danger fw-bold mt-3">⚠️ {error}</div>}

        {/* RESULTADO */}
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

            {result.pubdate && (
              <p className="text-muted">
                <strong>Data de Registro:</strong>{" "}
                {new Date(result.pubdate).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RegistroList;
