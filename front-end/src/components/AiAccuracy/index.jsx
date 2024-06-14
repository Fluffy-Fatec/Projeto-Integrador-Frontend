import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const NewRegistrationUsers = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = Cookies.get("token");

  const formatDateTime = (iaDatetimeDeploy) => {
    const year = iaDatetimeDeploy[0];
    const month = iaDatetimeDeploy[1];
    const day = iaDatetimeDeploy[2];


    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/ia/accuracy/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const responseData = response.data;

        const lastTenEntries = responseData.slice(-10);

        const iaScore = lastTenEntries.map((entry) => entry.iaScore);
        const iaDatetimeDeploy = lastTenEntries.map((entry) => formatDateTime(entry.iaDatetimeDeploy));

        const colors = ["#ef476f", "#ffd166", "#06d6a0"];

        const chartData = {
          options: {
            chart: {
              background: "transparent",
              type: "bar",
              toolbar: { show: false },
            },
            plotOptions: {
              bar: {
                horizontal: false,
                distributed: true,
              },
            },
            xaxis: {
              categories: iaDatetimeDeploy,
              labels: {
                style: {
                  fontSize: "12px",
                },
              },
            },
            fill: {
              colors: iaDatetimeDeploy.map((_, index) => colors[index % colors.length]),
            },
            title: {
              text: "AI Accuracy (Last 10 Entries)",
              align: "left",
              style: {
                fontSize: "14px",
                fontWeight: "bold",
                fontFamily: "Segoe UI",
                color: "#888888",
              },
            },
          },
          series: [
            {
              name: "Score",
              data: iaScore,
            },
          ],
        };

        setChartData(chartData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Chart options={chartData.options} series={chartData.series} type="bar" height={250} />
    </div>
  );
};

export default NewRegistrationUsers;
