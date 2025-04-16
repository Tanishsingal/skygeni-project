import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, CircularProgress } from '@mui/material';
import { AppDispatch, RootState } from './store/store';
import { fetchPipelineData } from './store/pipelineSlice';
import PipelineChart from './components/PipelineChart';
import PipelineTable from './components/PipelineTable';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { stages, summary, loading, error } = useSelector((state: RootState) => state.pipeline);

  useEffect(() => {
    dispatch(fetchPipelineData());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <Container maxWidth="xl" className="py-8">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <PipelineChart 
            data={stages} 
            type="count" 
            winRate={summary?.overallWinRateByCount || '0%'} 
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <PipelineChart 
            data={stages} 
            type="acv" 
            winRate={summary?.overallWinRateByACV || '0%'} 
          />
        </Grid>
       
        <Grid item xs={12} sm={6}>
          <PipelineTable data={stages} type="count" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <PipelineTable data={stages} type="acv" />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;