import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PipelineState, PipelineResponse } from '../types/pipeline';

export const fetchPipelineData = createAsyncThunk(
  'pipeline/fetchData',
  async () => {
    const response = await fetch('http://localhost:3000/api/pipeline');
    if (!response.ok) {
      throw new Error('Failed to fetch pipeline data');
    }
    const data: PipelineResponse = await response.json();
    return data;
  }
);

const initialState: PipelineState = {
  stages: [],
  summary: null,
  loading: false,
  error: null,
};

const pipelineSlice = createSlice({
  name: 'pipeline',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPipelineData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPipelineData.fulfilled, (state, action) => {
        state.loading = false;
        state.stages = action.payload.stages;
        state.summary = action.payload.summary;
      })
      .addCase(fetchPipelineData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch pipeline data';
      });
  },
});

export default pipelineSlice.reducer;