// Pipeline data types
export interface PipelineStage {
  label: string;
  acv: number;
  count: number;
  diffRate: number;
  diffacvRate: number;
  winRateByCount: string;
  winRateByACV: string;
  lostCount: number;
  lostACV: number;
  movedToNextCount: number;
  movedToNextACV: number;
}

export interface PipelineSummary {
  totalLostCount: number;
  totalLostACV: number;
  overallWinRateByCount: string;
  overallWinRateByACV: string;
}

export interface PipelineResponse {
  stages: PipelineStage[];
  summary: PipelineSummary;
}

export interface PipelineState {
  stages: PipelineStage[];
  summary: PipelineSummary | null;
  loading: boolean;
  error: string | null;
}