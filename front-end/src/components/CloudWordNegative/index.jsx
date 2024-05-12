import { FileDownloadOutlined as FileDownloadOutlinedIcon } from '@mui/icons-material';
import { Button, Grid, Typography } from "@mui/material";
import axios from "axios";
import domToImage from 'dom-to-image';
import React, { useEffect, useRef, useState } from "react";
import ReactWordcloud from "react-wordcloud";

const WorldGraphics = ({ token, selectedSent }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [highlightedWord, setHighlightedWord] = useState(null);
    const [selectedWord, setSelectedWord] = useState(null);
    const [filter, setFilter] = useState(selectedSent || "1");
    const chartRef = useRef(null);

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

    const handleExportClick = () => {
        if (chartRef.current) {
            setLoading(true);

            domToImage.toPng(chartRef.current, { bgcolor: '#ffffff' })
                .then((dataUrl) => {
                    const link = document.createElement('a');
                    link.download = 'wordcloud.png';
                    link.href = dataUrl;
                    link.click();
                    setLoading(false);
                })
                .catch((error) => {
                    setError('Erro ao exportar gráfico para PNG.');
                    setLoading(false);
                });
        }
    };

    return (
        <>
            <Grid container alignItems="center" spacing={2}>
                <Grid item xs={10.5}>
                    <Typography variant="h5" style={{ fontWeight: 'bold', fontFamily: 'Segoe UI', fontSize: '12px', color: '#888888', marginLeft: "10px" }}>Cloud Sentiment Word</Typography>
                </Grid>
                <Grid item xs={1}>
                    <FileDownloadOutlinedIcon onClick={handleExportClick} style={{ cursor: 'pointer', color: '#888888', fontSize: '20px' }} />
                </Grid>
            </Grid>

            <div>
                {loading && <p>Carregando...</p>}
                {error && <p>{error}</p>}
                {data && (
                    <div style={{ maxWidth: "100%", height: "300px" }} ref={chartRef}>
                        <ReactWordcloud
                            options={{
                                rotations: 2,
                                rotationAngles: [-90, 0],
                                colors: ['#06d6a0', '#ef476f', '#ffd166'],
                                fontSizes: [22, 42],
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
