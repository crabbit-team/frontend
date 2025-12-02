import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './App.css';

export function App() {
  return (
    <div className="app-root">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;


