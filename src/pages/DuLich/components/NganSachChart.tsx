import React from 'react';
import Chart from 'react-apexcharts';
import { Card } from 'antd';
import type { NganSach, LichTrinh } from '@/types/duLich';

interface NganSachChartProps {
  nganSach: NganSach;
  lichTrinh: LichTrinh;
  type: 'pie' | 'bar';
}

const NganSachChart: React.FC<NganSachChartProps> = ({ nganSach, lichTrinh, type }) => {
  if (type === 'pie') {
    const options: any = {
      chart: {
        type: 'donut',
      },
      labels: ['Ăn uống', 'Lưu trú', 'Di chuyển', 'Vui chơi', 'Khác'],
      colors: ['#1890ff', '#52c41a', '#faad14', '#fadb14', '#bfbfbf'],
      legend: {
        position: 'bottom',
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => {
          return val.toFixed(1) + '%';
        }
      },
      tooltip: {
        y: {
          formatter: (val: number) => {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
          }
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Tổng chi phí',
                formatter: () => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', notation: 'compact' }).format(nganSach.tong)
              }
            }
          }
        }
      }
    };

    const series = [
      nganSach.anUong,
      nganSach.luuTru,
      nganSach.diChuyen,
      nganSach.vuiChoi || 0,
      nganSach.khac || 0,
    ];

    return (
      <Chart
        options={options}
        series={series}
        type="donut"
        width="100%"
        height={350}
      />
    );
  }

  // Bar chart by day
  const daysCount = Math.ceil(
    (new Date(lichTrinh.ngayKetThuc).getTime() - new Date(lichTrinh.ngayBatDau).getTime()) / (1000 * 3600 * 24)
  ) + 1;
  const categories = Array.from({ length: daysCount }, (_, i) => `Ngày ${i + 1}`);
  const data = Array.from({ length: daysCount }, (_, i) => {
    const day = i + 1;
    return lichTrinh.cacDiem
      .filter((p) => p.ngay === day)
      .reduce((sum, p) => 
        sum + (p.diemDen.chiPhi.anUong + p.diemDen.chiPhi.luuTru + p.diemDen.chiPhi.diChuyen) * lichTrinh.soNguoi, 
        0
      );
  });

  const options: any = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '45%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#1890ff'],
    xaxis: {
      categories,
    },
    yaxis: {
      title: {
        text: 'Chi phí (VNĐ)',
      },
      labels: {
        formatter: (val: number) => {
          return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', notation: 'compact' }).format(val);
        }
      }
    },
    tooltip: {
      y: {
        formatter: (val: number) => {
          return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
        }
      }
    }
  };

  const series = [
    {
      name: 'Chi phí',
      data,
    },
  ];

  return (
    <Chart
      options={options}
      series={series}
      type="bar"
      width="100%"
      height={350}
    />
  );
};

export default NganSachChart;
