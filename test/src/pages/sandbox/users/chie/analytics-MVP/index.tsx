import { Route, Routes } from "react-router-dom";
import { Container } from "./Container";
import { AnalyticsMvpLocaleProvider } from "./contexts/LocaleContext";
import { Layout } from "./Layout";

export default function AnalyticsMvp() {
  return (
    <AnalyticsMvpLocaleProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Container />} />
        </Route>
      </Routes>
    </AnalyticsMvpLocaleProvider>
  );
}
