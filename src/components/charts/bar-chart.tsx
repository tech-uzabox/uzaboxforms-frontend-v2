import React from 'react';
import Chart from 'react-apexcharts';

interface BarChartProps {
   labels: string[];
   series: { name: string; data: number[] }[];
   subtitle?: string;
}
/* The bar chart component that takes the parameters that make up the chart that is 
the chart title, labels and values
*/
const BarChart: React.FC<BarChartProps> = ({ labels, series }) => {
   // Chart details and styles
   const chartOptions: ApexCharts.ApexOptions = {
      series: series.map((data) => ({
         name: data.name,
         data: data.data,
      })),
      plotOptions: {
         bar: {
            borderRadius: 4,
            horizontal: false,
         },
      },
      legend: {
         position: 'top',
      },
      theme: {
         monochrome: {
            enabled: true,
            color: '#012473',
            shadeTo: 'light',
            shadeIntensity: 1.1
         }
      },
      dataLabels: {
         enabled: false,
      },
      xaxis: {
         categories: labels,
      },
      responsive: [
         {
            breakpoint: 312,
            options: {
               plotOptions: {
                  width: 312,
               },
            },
         },
      ],
   };

   return (
      <div className="sm:w-full rounded-lg bg-white">
         {/* <div className="w-full flex flex-col">
            <h1 className="text-left font-bold text-2xl">{title}</h1>
            <p className="text-sm  text-slate-600">{subtitle}</p>
         </div> */}
         <Chart options={chartOptions} series={chartOptions.series} type="bar" width="100%" height={300} />
      </div>
   );
};

export default BarChart;