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
        const url = `http://localhost:8080/auth/log/login`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(url, { headers });
        const dataByMonth = response.data;

        // Extract labels and series data
        const labels = dataByMonth.map(item => item.dateTime);
        const series = dataByMonth.map(item => item.countNewUsers);

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
              text: "Access per Month",
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
              name: "New Registrations",
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