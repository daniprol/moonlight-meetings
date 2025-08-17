import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { IntlProvider } from "@/providers/IntlProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Explore from "./pages/Explore";
import MyStones from "./pages/MyStones";
import AddStone from "./pages/AddStone";
import Profile from "./pages/Profile";
import Stone from "./pages/Stone";
// import DevRoleSelector from "@/components/DevRoleSelector";
import BottomTabBar from "@/components/navigation/BottomTabBar";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <IntlProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/my-stones" element={<MyStones />} />
                <Route path="/add-stone" element={<AddStone />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/stone/:id" element={<Stone />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/404" element={<NotFound />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              {/* <DevRoleSelector /> */}
              <BottomTabBar />
            </BrowserRouter>
          </TooltipProvider>
        </IntlProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
