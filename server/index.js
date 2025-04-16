import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Calculate pipeline metrics
function calculatePipelineMetrics(data) {
  const suspectStage = data[data.length-1];
  // console.log(suspectStage.count);

  return data.map(stage => {
    const winRateByCount = ((suspectStage.count / stage.count ) * 100).toFixed(0);
    const winRateByACV = ((suspectStage.acv /stage.acv ) * 100).toFixed(0);
    
    // Calculate lost/disqualified
    const nextStageIndex = data.findIndex(s => s.label === stage.label) + 1;
    const nextStage = data[nextStageIndex];
    
    const lostCount = nextStage ? stage.count - nextStage.count : 0;
    const lostACV = nextStage ? stage.acv - nextStage.acv : 0;
    
    return {
      ...stage,
      winRateByCount: `${winRateByCount}%`,
      winRateByACV: `${winRateByACV}%`,
      lostCount,
      lostACV,
      movedToNextCount: nextStage ? nextStage.count : 0,
      movedToNextACV: nextStage ? nextStage.acv : 0
    };
  });
}

app.get('/api/pipeline', async (req, res) => {
  try {
    const rawData = await fs.readFile(join(__dirname, 'data.json'), 'utf-8');
    const data = JSON.parse(rawData);
    const enrichedData = calculatePipelineMetrics(data);
  
    res.json({
      stages: enrichedData,
      summary: {
        totalLostCount: enrichedData.reduce((sum, stage) => sum + stage.lostCount, 0),
        totalLostACV: enrichedData.reduce((sum, stage) => sum + stage.lostACV, 0),
        overallWinRateByCount: enrichedData[0].winRateByCount,
        overallWinRateByACV: enrichedData[0].winRateByACV
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch pipeline data' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});