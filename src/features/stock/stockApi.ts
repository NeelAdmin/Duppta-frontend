import { api } from '../../services/api';

// Define a type for the stock data
type Stock = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  // Add other stock properties as needed
};

// Extend the API with stock endpoints
export const stockApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all stocks
    getStocks: builder.query<Stock[], void>({
      query: () => 'stocks',
      providesTags: (result = []) => [
        'Stock',
        ...result.map(({ id }) => ({ type: 'Stock' as const, id })),
      ],
    }),
    
    // Get a single stock by ID
    getStock: builder.query<Stock, string>({
      query: (id) => `stocks/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Stock', id }],
    }),
    
    // Add a new stock
    addStock: builder.mutation<Stock, Omit<Stock, 'id'>>({
      query: (newStock) => ({
        url: 'stocks',
        method: 'POST',
        body: newStock,
      }),
      invalidatesTags: ['Stock'],
    }),
    
    // Update a stock
    updateStock: builder.mutation<Stock, Partial<Stock> & Pick<Stock, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `stocks/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Stock', id }],
    }),
    
    // Delete a stock
    deleteStock: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `stocks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Stock', id }],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in functional components
export const {
  useGetStocksQuery,
  useGetStockQuery,
  useAddStockMutation,
  useUpdateStockMutation,
  useDeleteStockMutation,
} = stockApi;
