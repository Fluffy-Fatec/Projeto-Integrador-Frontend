import { Button, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";
import { TagCloud } from "react-tagcloud";

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

    const wordTransitionProps = useSpring({
        scale: highlightedWord ? 1.2 : 1,
        config: { tension: 300, friction: 10 },
    });

    const handleMouseEnter = (word) => {
        setHighlightedWord(word);
    };

    const handleMouseLeave = () => {
        setHighlightedWord(null);
    };

    const handleWordClick = (word) => {
        setSelectedWord(word);
    };

    const handleFilterChange = (event) => {
        setSelectedWord(null);
        // setFilter(event.target.value);
    };

    return (
        <>
            <Typography variant="h5" style={{ padding: '20px', fontWeight: 'bold', fontFamily: 'Segoe UI', fontSize: 20 }}>Cloud Sentiment Word</Typography>
            <div>

                {loading && <p>Carregando...</p>}
                {error && <p>{error}</p>}
                {data && (
                    <div style={{ width: "370px", height: "45px", marginLeft: "20px" }}>
                        <TagCloud
                            minSize={12}
                            maxSize={35}
                            tags={data
                                .slice(0, 25)
                                .map((item) => ({ value: item.word, count: Number(item.count) }))
                            }
                            onMouseEnter={(word) => handleMouseEnter(word)}
                            onMouseLeave={() => handleMouseLeave()}
                            onClick={(word) => handleWordClick(word)}
                            renderer={(tag, size, color) => (
                                <animated.span
                                    key={tag.value}
                                    style={{
                                        cursor: "pointer",
                                        fontSize: `${size}px`,
                                        margin: "3px",
                                        padding: "3px",
                                        display: "inline-block",
                                        color: highlightedWord === tag.value ? "red" : color,
                                        transform: wordTransitionProps.scale.interpolate(scale => `scale(${scale})`),
                                    }}
                                >
                                    {tag.value}
                                </animated.span>
                            )}
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
