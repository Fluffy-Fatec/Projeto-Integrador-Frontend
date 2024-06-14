import axios from "axios";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import Cookies from "js-cookie";

function NewRegistrationUsers() {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = `http://localhost:8080/ia/count/sentiment`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(url, { headers });
        const dataByMonth = response.data;

        const labels = Object.keys(dataByMonth).map(key => {
          const sentiment = parseInt(key);
          if (sentiment === 0) return "Negative";
          if (sentiment === 1) return "Neutral";
          if (sentiment === 2) return "Positive";
          return `Sentiment ${sentiment}`;
        });
        const series = Object.values(dataByMonth);

        const chartData = {
          options: {
            chart: {
              background: "transparent",
              type: "donut",
              toolbar: {
                show: false,
              },
            },
            plotOptions: {
              pie: {
                donut: {
                  size: '65%',
                }
              }
            },
            labels: labels,
            colors: ["#ef476f", "#ffd166", "#06d6a0"],
            title: {
              text: "Quantity AI Review",
              align: "left",
              style: {
                fontSize: "12px",
                fontWeight: "bold",
                fontFamily: "Segoe UI",
                color: "#888888",
              },
            },
            legend: {
              show: true,
              position: 'bottom',
              horizontalAlign: 'center',
              fontSize: '12px',
              fontFamily: 'Segoe UI',
              fontWeight: 'normal',
              markers: {
                width: 10,
                height: 10,
              },
              itemMargin: {
                horizontal: 10,
                vertical: 5,
              },
              formatter: function (val, opts) {
                return val + " - " + opts.w.globals.series[opts.seriesIndex];
              },
            },
          },
          series: series,
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
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="donut"
        height={250}
      />
    </div>
  );
}

export default NewRegistrationUsers;
