import React, { useState, useEffect } from "react";
import axios from "axios";
import { TagCloud } from "react-tagcloud";
import { useSpring, animated } from "react-spring";
import { Select, MenuItem } from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { Typography } from "@mui/material";

const WorldGraphics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [highlightedWord, setHighlightedWord] = useState(null);
    const [selectedWord, setSelectedWord] = useState(null);
    const [filter, setFilter] = useState("1");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem("token");
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
    }, [filter]);

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
        setFilter(event.target.value);
    };

    return (
        <div style={{ width: '100%', padding: '20px' }}>
            <Typography variant="h5" style={{ fontWeight: 'bold', fontFamily: 'Segoe UI', fontSize: 22 }}>Cloud Positive Word</Typography>  
            <div>
                {/* <Select
                    color="success"
                    value={filter}
                    onChange={handleFilterChange}
                    displayEmpty
                    style={{ width: "100%", maxWidth: "200px", marginBottom: '10px' }}
                >
                    <MenuItem value="1" startIcon={<ThumbUpIcon />}>Positive</MenuItem>
                    <MenuItem value="0" startIcon={<ThumbDownIcon />}>Negative</MenuItem>
                </Select> */}
                {loading && <p>Carregando...</p>}
                {error && <p>{error}</p>}
                {data && (
                    <div>
                        <TagCloud
                            minSize={12}
                            maxSize={35}
                            tags={data.map((item) => ({ value: item.word, count: Number(item.count) }))}
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
        </div>
    );
};

export default WorldGraphics;