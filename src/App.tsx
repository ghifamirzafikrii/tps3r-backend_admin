import AppRoutes from './routes/AppRoutes';

// Debug logging
console.log('[App.tsx] App component rendering...');

const App = () => {
  console.log('[App.tsx] App rendered');
  return <AppRoutes />;
};

export default App;