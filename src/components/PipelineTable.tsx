import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper, IconButton} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import type { PipelineStage } from '../types/pipeline';

interface PipelineTableProps {
  data: PipelineStage[];
  type: 'count' | 'acv';
}

const PipelineTable = ({ data, type }: PipelineTableProps) => {
  const handleCopy = () => {
    const tableText = data
      .map(stage => 
        `${stage.label}\t${type === 'count' ? stage.count.toLocaleString() : `$${stage.acv.toLocaleString()}`}\t${type === 'count' ? stage.lostCount.toLocaleString() : `$${stage.lostACV.toLocaleString()}`}\t${type === 'count' ? stage.movedToNextCount.toLocaleString() : `$${stage.movedToNextACV.toLocaleString()}`}\t${type === 'count' ? stage.winRateByCount : stage.winRateByACV}`
      )
      .join('\n');
    navigator.clipboard.writeText(tableText);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={handleCopy} aria-label="Copy table data">
          <ContentCopyIcon />
        </IconButton>
      </div>
    <TableContainer component={Paper} elevation={0} sx={{ mb: 4 }} >
      <Table className='border-black'>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 500 }}>Stage</TableCell>
            <TableCell align="right" sx={{ fontWeight: 500 }}>Came to Stage</TableCell>
            <TableCell align="right" sx={{ fontWeight: 500, bgcolor: '#d32f2f' }}>Lost/Disqualified from Stage</TableCell>
            <TableCell align="right" sx={{ fontWeight: 500, bgcolor: '#2e7d32' }}>Moved to next stage</TableCell>
            <TableCell align="right" sx={{ fontWeight: 500 }}>Win Rate %</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((stage) => (
            <TableRow key={stage.label}>
              <TableCell sx={{ 
                  fontWeight: stage.label === 'Won' ? 500 : 400,
                  bgcolor: stage.label === 'Won' ? '#f5f5f5' : 'transparent'}}>
                {stage.label}
              </TableCell>
              <TableCell align="right" sx={{ 
                  fontWeight: stage.label === 'Won' ? 500 : 400,
                  bgcolor: stage.label === 'Won' ? '#2e7d32' : 'transparent'
                }}
              >
                {type === 'count' 
                  ? stage.count.toLocaleString()
                  : `$${stage.acv.toLocaleString()}`}
              </TableCell>
              <TableCell 
                align="right"
                sx={{ 
                  color: '#d32f2f',
                  bgcolor: stage.label === 'Won' ? '#f5f5f5' : 'transparent'
                }}
              >
                {type === 'count'
                  ? stage.lostCount.toLocaleString()
                  : `$${stage.lostACV.toLocaleString()}`}
              </TableCell>
              <TableCell 
                align="right"
                sx={{ 
                  color: '#2e7d32',
                  bgcolor: stage.label === 'Won' ? '#f5f5f5' : 'transparent'
                }}
              >
                {type === 'count'
                  ? stage.movedToNextCount.toLocaleString()
                  : `$${stage.movedToNextACV.toLocaleString()}`}
              </TableCell>
              <TableCell align="right"
                sx={{fontWeight:400,
                  bgcolor: stage.label === 'Won' ? '#f5f5f5' : 'transparent'
                }}
              >
                {type === 'count'
                  ? stage.winRateByCount
                  : stage.winRateByACV}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
          <TableCell sx={{ 
                  fontWeight: 400 }}>
                Total
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 500}}>
                -
              </TableCell>
              <TableCell align="right" sx={{ color: '#fffff'}}>
                {type==="count" ? 21 : "878,043"}
              </TableCell>
              <TableCell align="right" sx={{ color: '#2e7d32'}}>
                -
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 500 }}>
                -
              </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
};

export default PipelineTable;