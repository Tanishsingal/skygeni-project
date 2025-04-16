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

    // Responsive dimensions
    const margin = {
      top: 0,
      right: isMobile ? 45 : 60,
      bottom: 40,
      left: isMobile ? 0 : 60
    };
    const containerWidth = svgRef.current.parentElement?.offsetWidth || 0;

    const width = containerWidth - margin.left - margin.right;
    const height = data.length * (isMobile ? 50 : 40) + margin.top + margin.bottom;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const y = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, height])
      .padding(0.3);

    const x = d3.scaleLinear()
      .domain([0, type === 'count' ? d3.max(data, d => d.count)! : d3.max(data, d => d.acv)!])
      .range([0, width]);

    // Draw background bars
    svg.selectAll('.bar-bg')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar-bg')
      .attr('y', d => y(d.label)!)
      .attr('x', 0)
      .attr('height', y.bandwidth())
      .attr('width', width)
      .attr('fill', '#BFBFBF')
      .attr('rx', 2)
      .attr('ry', 2);

    // Draw main bars
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('y', d => y(d.label)!)
      .attr('x', d => (width - x(type === 'count' ? d.count : d.acv)) / 2) 
      .attr('height', y.bandwidth())
      .attr('width', d => x(type === 'count' ? d.count : d.acv))
      .attr('fill', '#4CAF50')
      .style('margin', '0 auto')
      .attr('rx', 2)
      .attr('ry', 2);

    // Add stage labels
    svg.selectAll('.stage-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'stage-label')
      .attr('y', d => y(d.label)! + y.bandwidth() / 2)
      .attr('x', isMobile ? 0 : -60)
      .style('font-size', '14px')
      .attr('fill', '#374151')
      .text(d => d.label);

    // Add value labels
    svg.selectAll('.value-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'value-label')
      .attr('y', d => y(d.label)! + y.bandwidth() / 2)
      .attr('x', d => (width - x(type === 'count' ? d.count : d.acv)) / 2 + x(type === 'count' ? d.count : d.acv) / 2)
      .style('font-size', '14px')
      .attr('fill', '#ffffff') 
      .style('text-anchor', 'middle') 
      .text(d => type === 'count' ? d.count : `$${d.acv.toLocaleString()}`);

    // Add percentage labels below bars
    svg.selectAll('.percentage-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'percentage-label')
      .attr('y', d => y(d.label)! - 3) // Position above the bar
      .attr('x', width / 2)
      .style('font-size', '12px')
      .text(d => {
      const nextIndex = data.indexOf(d);
      if (nextIndex > 0 && nextIndex < data.length) {
        return type === 'count' ? `${Math.floor(d.diffRate * 100)}%` : `${Math.ceil(d.diffacvRate * 100)}%`;
      }
      return '';
      });

    // Add win rate labels on the right
    svg.selectAll('.win-rate-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'win-rate-label')
      .attr('y', d => y(d.label)! + y.bandwidth() / 2)
      .attr('x', width +10)
      .attr('dy', '.35em')
      .attr('fill', '#10b981')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text(d => type === 'count' ? d.winRateByCount : d.winRateByACV);

  }, [data, type, isMobile]);

  return (
    <Card elevation={3} sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, mb: 3 }}>
          Win Rate by {type === 'count' ? 'opportunity count' : 'ACV'}: {winRate}
        </Typography>
        <br/>
        <div className="overflow-x-auto">
          <svg ref={svgRef}></svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default PipelineChart;