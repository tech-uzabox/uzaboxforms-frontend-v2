import React from 'react';
import Chart from 'react-apexcharts';
interface PieChartProps {
    labels: string[];
    series: number[];
    width?: number;
}
/* The Pie chart component that takes the parameters that make up the chart that is 
the chart title, labels and values
*/


const PieChart: React.FC<PieChartProps> = ({ labels, series, width }) => {
    // Chart details
    const chartOptions: ApexCharts.ApexOptions = {
        labels,
        series: series.map((value) => Number(value)),
        chart: {
            width: 450,
            type: 'donut',
        },
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            // floating: false,
            // offsetX: 25,
            onItemClick: {
                toggleDataSeries: true
            },
        },
        dataLabels: {
            enabled: true,
            formatter: function (val: number) {
                return Math.floor(val) + "%"
            },
        },
        theme: {
            monochrome: {
                enabled: true,
                color: '#012473',
                shadeTo: 'light',
                shadeIntensity: 1.1
            }
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            },
        ],
        tooltip: {
            shared: true,
            hideEmptySeries: false,
        }
    };

    return (
        <Chart options={chartOptions} series={series} type="donut" width={width ?? 360} />
    );
};

export default PieChart;