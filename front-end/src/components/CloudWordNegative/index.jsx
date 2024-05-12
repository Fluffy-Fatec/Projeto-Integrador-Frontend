import { Button, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactWordcloud from "react-wordcloud";

const WorldGraphics = ({ token, selectedSent }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [highlightedWord, setHighlightedWord] = useState(null);
    const [selectedWord, setSelectedWord] = useState(null);
    const [filter, setFilter] = useState(selectedSent || "1");

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!token) {
                    setError("Token de autenticação não encontrado.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get("http://localhost:8080/graphics/word", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const filteredData = response.data.filter(item => item.sentiment === filter);
                setData(filteredData);
                setLoading(false);
            } catch (error) {
                setError("Ocorreu um erro ao buscar os dados.");
                setLoading(false);
            }
        };

        fetchData();
    }, [token, filter, selectedSent]);

    const handleWordClick = (word) => {
        setSelectedWord(word.text);
    };

    const handleFilterChange = (event) => {
        setSelectedWord(null);
        setFilter(event.target.value);
    };

    return (
        <>
            <Typography variant="h5" style={{ padding: '20px', fontWeight: 'bold', fontFamily: 'Segoe UI', fontSize: '12px', color: '#888888' }}>Cloud Sentiment Word</Typography>
            <div>
                {loading && <p>Carregando...</p>}
                {error && <p>{error}</p>}
                {data && (
                    <div style={{ width: "400px", height: "300px" }}>
                        <ReactWordcloud
                            options={{
                                rotations: 2,
                                rotationAngles: [-90, 0],
                                colors: ['#06d6a0', '#ef476f', '#ffd166'],
                                fontSizes: [25, 45],
                            }}
                            callbacks={{
                                onWordClick: handleWordClick,
                                onWordMouseOver: (word) => setHighlightedWord(word),
                                onWordMouseOut: () => setHighlightedWord(null),
                            }}
                            words={data.slice(0, 25).map((item) => ({
                                text: item.word,
                                value: Number(item.count),
                            }))}
                        />
                    </div>
                )}
                {selectedWord && (
                    <div>
                        <p>Você clicou na palavra: {selectedWord}</p>
                        <Button variant="text" onClick={() => setSelectedWord(null)}>Voltar</Button>
                    </div>
                )}
            </div>
        </>
    );
};

export default WorldGraphics;
