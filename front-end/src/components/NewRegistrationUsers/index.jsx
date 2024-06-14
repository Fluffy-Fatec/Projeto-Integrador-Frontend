import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

function NewRegistrationUsers() {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `http://localhost:8080/auth/log/group`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(url, { headers });
        const counts = response.data;
        console.log(counts);

        const labels = counts.map((data) => data.dateTime);
        const series = counts.map((data) => data.countNewUsers);

        const colors = ["#ef476f", "#ffd166", "#06d6a0"];

        const chartData = {
          options: {
            chart: {
              background: "transparent",
              type: "bar",
              toolbar: {
                show: false,
              },
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: "55%",
                endingShape: "rounded",
                distributed: true,
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
            fill: {
              colors: series.map((_, index) => colors[index % colors.length]),
            },
            title: {
              text: "New Registered Users by Date",
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
              name: "New Users",
              data: series,
            },
          ],
        };

        setChartData(chartData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data.");
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
        type="bar"
        height={250}
      />
    </div>
  );
}

export default NewRegistrationUsers;
