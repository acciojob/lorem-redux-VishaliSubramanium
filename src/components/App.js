import React, { useEffect } from 'react';
import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import './../styles/App.css';

export const fetchLoremData = createAsyncThunk(
  'lorem/fetchLoremData',
  async () => {
    const response = await axios.get('https://api.lorem.com/ipsum');
    return response.data;
  }
);

const loremSlice = createSlice({
  name: 'lorem',
  initialState: {
    data: null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoremData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLoremData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchLoremData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

const store = configureStore({
  reducer: {
    lorem: loremSlice.reducer
  }
});

function LoremComponent() {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.lorem);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchLoremData());
    }
  }, [status, dispatch]);

  return (
    <div>
      <h1>Lorem Ipsum App</h1>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && data && (
        <div>
          <h2>{data.title}</h2>
          <p>{data.body}</p>
        </div>
      )}
    </div>
  );
}

const App = () => {
  return (
    <Provider store={store}>
      <div id="main">
        <LoremComponent />
      </div>
    </Provider>
  );
};

export default App;
