import { Route, Routes } from "react-router-dom";
import Departments from "./Departments";
import DesignAdjustments from "./DesignAdjustments";
import { Layout } from "./Layout";
import LegalAdvice from "./LegalAdvice";
import TeamMembers from "./TeamMembers";
import Templates from "./Templates";
import Workstreams from "./Workstreams";

export default function Analytics6() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<TeamMembers />} />
        <Route path="workstreams" element={<Workstreams />} />
        <Route path="legal-advice" element={<LegalAdvice />} />
        <Route path="departments" element={<Departments />} />
        <Route path="templates" element={<Templates />} />
        <Route path="design-adjustments" element={<DesignAdjustments />} />
      </Route>
    </Routes>
  );
}
