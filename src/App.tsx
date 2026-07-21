import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-fox-toast";
import AppRoutes from "./routes";
import { Footer } from "./components/common";
import GoToTop from "./components/common/GoToTop";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen">
        <main>
          <AppRoutes />
        </main>

        <Footer />
        <GoToTop />
        <ToastContainer position="top-right" />
      </div>
    </Router>
  );
};

export default App;
