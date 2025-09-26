import React from 'react';
import Chart from 'react-apexcharts';

interface LineChartProps {
    labels: string[];
    series: { name: string; data: number[] }[];
    title: string;
}
/* The Line chart component that takes the parameters that make up the chart that is 
the chart title, labels and values
*/
const LineChart: React.FC<LineChartProps> = ({ labels, series, title }) => {
    // The line chart details
    const chartOptions: ApexCharts.ApexOptions = {
        series: series.map((data) => ({
            name: data.name,
            data: data.data,
        })),
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
        },
        legend: {
            position: 'top',
        },

        colors: ['#3F91F6', '#60D065', '#FFB155'],
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5,
            },
        },
        xaxis: {
            categories: labels,
        },
    };

    return (
        <div className="w-[48%] rounded-lg bg-white">
            <div className="w-full flex justify-between">
                <h1 className="text-left font-bold text-2xl pl-10 pt-6">{title}</h1>
            </div>
            <div className="mt-6 flex justify-center ">
                <Chart options={chartOptions} series={chartOptions.series} type="line" width="500" />
            </div>
        </div>
    );
};

export default LineChart;