import { faFileCsv } from '@fortawesome/free-solid-svg-icons/faFileCsv'; // Importe também o ícone CSV, se ainda não estiver importado
import { faFileImage } from '@fortawesome/free-solid-svg-icons/faFileImage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Grid, Typography } from "@mui/material";
import axios from "axios";
import domToImage from 'dom-to-image';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import React, { useEffect, useRef, useState } from "react";
import ReactWordcloud from "react-wordcloud";

const WordGraphics = ({ token, selectedSent }) => {
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

    const handleExportJpgClick = () => {
        if (chartRef.current) {
            setLoading(true);

            domToImage.toJpeg(chartRef.current, { quality: 0.95, bgcolor: '#ffffff'})
                .then((dataUrl) => {
                    const link = document.createElement('a');
                    link.download = 'wordcloud.jpg';
                    link.href = dataUrl;
                    link.click();
                    setLoading(false);
                })
                .catch((error) => {
                    setError('Erro ao exportar gráfico para JPG.');
                    setLoading(false);
                });
        }
    };

    const handleExportCsvClick = () => {
        if (data) {
            const csv = Papa.unparse(data); 
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
            saveAs(blob, 'wordcloud.csv');
        }
    };

    return (
        <>
        <br />
            <Grid container alignItems="center" spacing={2}>
                <Grid item xs={10}>
                    <Typography variant="h5" style={{ fontWeight: 'bold', fontFamily: 'Segoe UI', fontSize: '12px', color: '#888888', marginLeft: "10px" }}>Cloud Sentiment Word</Typography>
                </Grid>
                <Grid item xs={0.7}>
                    <FontAwesomeIcon icon={faFileCsv} onClick={handleExportCsvClick} style={{ cursor: 'pointer', color: '#888888', fontSize: '15px' }} />
                </Grid>
                <Grid item xs={0.7}>
                    <FontAwesomeIcon icon={faFileImage} onClick={handleExportJpgClick} style={{ cursor: 'pointer', color: '#888888', fontSize: '15px' }} />
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

export default WordGraphics;
