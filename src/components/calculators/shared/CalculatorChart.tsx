// src/components/calculators/shared/CalculatorChart.tsx
import React from 'react';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  description?: string;
}

interface CalculatorChartProps {
  data: ChartDataPoint[];
  type: 'bar' | 'pie' | 'line';
  title?: string;
  height?: number;
  color?: 'blue' | 'green' | 'amber' | 'yellow' | 'red' | 'violet' | 'indigo';
  showValues?: boolean;
  showLegend?: boolean;
  className?: string;
}

const CalculatorChart: React.FC<CalculatorChartProps> = ({
  data,
  type,
  title,
  height = 200,
  color = 'blue',
  showValues = true,
  showLegend = true,
  className = '',
}) => {
  const colors = {
    blue: ['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'],
    green: ['#22c55e', '#4ade80', '#86efac', '#bbf7d0'],
    amber: ['#f59e0b', '#fbbf24', '#fcd34d', '#fef3c7'],
    yellow: ['#eab308', '#facc15', '#fde047', '#fef08a'],
    red: ['#ef4444', '#f87171', '#fca5a5', '#fecaca'],
    violet: ['#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff'],
    indigo: ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'],
  };

  const colorPalette = colors[color];
  const maxValue = Math.max(...data.map(d => d.value));

  const getIcon = () => {
    switch (type) {
      case 'bar':
        return <BarChart3 className="w-5 h-5" />;
      case 'pie':
        return <PieChart className="w-5 h-5" />;
      case 'line':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <BarChart3 className="w-5 h-5" />;
    }
  };

  const renderBarChart = () => (
    <div className="space-y-3">
      {data.map((item, index) => {
        const percentage = (item.value / maxValue) * 100;
        const itemColor = item.color || colorPalette[index % colorPalette.length];
        
        return (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-700">{item.label}</span>
              {showValues && (
                <span className="font-semibold" style={{ color: itemColor }}>
                  {item.value.toLocaleString()}
                </span>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: itemColor,
                }}
              />
            </div>
            {item.description && (
              <p className="text-xs text-gray-500">{item.description}</p>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;

    return (
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="relative">
          <svg width="160" height="160" className="transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="20"
            />
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage * 4.4} 440`;
              const strokeDashoffset = -cumulativePercentage * 4.4;
              const itemColor = item.color || colorPalette[index % colorPalette.length];
              
              cumulativePercentage += percentage;
              
              return (
                <circle
                  key={item.label}
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke={itemColor}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 ease-out"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {total.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </div>
        </div>
        
        {showLegend && (
          <div className="space-y-2">
            {data.map((item, index) => {
              const percentage = ((item.value / total) * 100).toFixed(1);
              const itemColor = item.color || colorPalette[index % colorPalette.length];
              
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: itemColor }}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700">
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.value.toLocaleString()} ({percentage}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderLineChart = () => (
    <div className="relative" style={{ height }}>
      <svg width="100%" height="100%" className="absolute inset-0">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Data points and line */}
        {data.length > 1 && (
          <g>
            {data.map((item, index) => {
              if (index === 0) return null;
              
              const x1 = (index - 1) * (100 / (data.length - 1)) + '%';
              const y1 = 100 - (data[index - 1].value / maxValue) * 80 + '%';
              const x2 = index * (100 / (data.length - 1)) + '%';
              const y2 = 100 - (item.value / maxValue) * 80 + '%';
              
              return (
                <line
                  key={`line-${index}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={colorPalette[0]}
                  strokeWidth="3"
                  className="transition-all duration-500"
                />
              );
            })}
            
            {data.map((item, index) => {
              const x = index * (100 / (data.length - 1)) + '%';
              const y = 100 - (item.value / maxValue) * 80 + '%';
              
              return (
                <circle
                  key={`point-${index}`}
                  cx={x}
                  cy={y}
                  r="4"
                  fill={colorPalette[0]}
                  className="transition-all duration-500"
                />
              );
            })}
          </g>
        )}
      </svg>
      
      {/* Labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
        {data.map((item, index) => (
          <span key={`label-${index}`} className="text-center">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart();
      case 'pie':
        return renderPieChart();
      case 'line':
        return renderLineChart();
      default:
        return renderBarChart();
    }
  };

  return (
    <div className={`enhanced-panel p-6 ${className}`}>
      {title && (
        <div className="flex items-center gap-2 mb-6">
          {getIcon()}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      
      <div style={{ minHeight: height }}>
        {renderChart()}
      </div>
    </div>
  );
};

export default CalculatorChart;