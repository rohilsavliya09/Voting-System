


import React from 'react';
import { Bar } from 'react-chartjs-2';
import './VotingGraph.css';

const VotingGraph = ({ chartData, chartOptions, getCandidateName }) => {
  // Enhanced chart options with custom tooltips
  const enhancedOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const uid = chartData.labels[context.dataIndex];
            const name = getCandidateName(uid);
            return `${label}: ${context.parsed.y} votes (${name} - ${uid})`;
          },
          title: (tooltipItems) => {
            const uid = tooltipItems[0].label;
            const name = getCandidateName(uid);
            return `Candidate: ${name} (${uid})`;
          }
        }
      }
    }
  };

  return (
    <div className="graph-container">
      <h2>Voting Results Graph</h2>
      <div className="chart-wrapper">
        <Bar 
          data={chartData} 
          options={enhancedOptions} 
        />
      </div>
    </div>
  );
};

export default VotingGraph;