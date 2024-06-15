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
        const url = `http://localhost:8080/ia/accuracy/month`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(url, { headers });
        const dataByMonth = response.data;

        const monthlyAverages = {};
        Object.keys(dataByMonth).forEach(month => {
          const monthData = dataByMonth[month];
          const totalScore = monthData.reduce((sum, data) => sum + data.iaScore, 0);
          const averageScore = totalScore / monthData.length;
          monthlyAverages[month] = averageScore.toFixed(2);
        });

        const sortedMonths = Object.keys(monthlyAverages).sort();

        const labels = sortedMonths.map(month => month);
        const series = sortedMonths.map(month => parseFloat(monthlyAverages[month]));

        const chartData = {
          options: {
            chart: {
              background: "transparent",
              type: "line",
              toolbar: {
                show: false,
              },
            },
            dataLabels: {
              enabled: false,
            },
            xaxis: {
              categories: labels,
              labels: {
                style: {
                  fontSize: "12px",
                  fontFamily: "Segoe UI",
                },
              },
            },
            yaxis: {
              labels: {
                style: {
                  fontSize: "12px",
                  fontFamily: "Segoe UI",
                },
              },
            },
            colors: ["#06d6a0"],
            title: {
              text: "Accesses to the platform per month",
              align: "left",
              style: {
                fontSize: "12px",
                fontWeight: "bold",
                fontFamily: "Segoe UI",
                color: "#888888",
              },
            },
            legend: {
              show: false,
            },
          },
          series: [
            {
              name: "Average Accuracy",
              data: series,
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
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={250}
      />
    </div>
  );
}

export default NewRegistrationUsers;
