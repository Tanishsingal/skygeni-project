import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, Typography, useTheme, useMediaQuery } from '@mui/material';
import type { PipelineStage } from '../types/pipeline';

interface PipelineChartProps {
  data: PipelineStage[];
  type: 'count' | 'acv';
  winRate: string;
}

const PipelineChart = ({ data, type, winRate }: PipelineChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    // Get container width for responsiveness
    const containerWidth = svgRef.current.parentElement?.offsetWidth || 0;

    // Responsive dimensions
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const width = containerWidth - margin.left - margin.right;
    const height = data.length * (isMobile ? 50 : 40) + margin.top + margin.bottom;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height);

    const chartGroup = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const y = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, height - margin.top - margin.bottom])
      .padding(0.3);

    const x = d3.scaleLinear()
      .domain([0, type === 'count' ? d3.max(data, d => d.count)! : d3.max(data, d => d.acv)!])
      .range([0, width]);

    // Draw background bars
    chartGroup.selectAll('.bar-bg')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar-bg')
      .attr('y', d => y(d.label)!)
      .attr('x', 0)
      .attr('height', y.bandwidth())
      .attr('width', width)
      .attr('fill', '#f3f4f6');

    // Draw main bars
    chartGroup.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('y', d => y(d.label)!)
      .attr('x', 0)
      .attr('height', y.bandwidth())
      .attr('width', d => x(type === 'count' ? d.count : d.acv))
      .attr('fill', '#4CAF50')
      .attr('rx', 2)
      .attr('ry', 2);

    // Add stage labels
    chartGroup.selectAll('.stage-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'stage-label')
      .attr('y', d => y(d.label)! + y.bandwidth() / 2)
      .attr('x', -10)
      .attr('dy', '.35em')
      .attr('text-anchor', 'end')
      .style('font-size', isMobile ? '12px' : '14px')
      .attr('fill', '#374151')
      .text(d => d.label);

    // Add value labels
    chartGroup.selectAll('.value-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'value-label')
      .attr('y', d => y(d.label)! + y.bandwidth() / 2)
      .attr('x', d => x(type === 'count' ? d.count : d.acv) + 5)
      .attr('dy', '.35em')
      .style('font-size', isMobile ? '12px' : '14px')
      .attr('fill', '#374151')
      .text(d => type === 'count' ? d.count : `$${d.acv.toLocaleString()}`);

  }, [data, type, isMobile]);

  return (
    <Card elevation={0} sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, mb: 3 }}>
          Win Rate by {type === 'count' ? 'opportunity count' : 'ACV'}: {winRate}
        </Typography>
        <div style={{ width: '100%' }}>
          <svg ref={svgRef}></svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default PipelineChart;
