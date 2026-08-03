var e=`import { Select } from "@legalforce/aegis-react";

import { usePaletteLabContext } from "../../store/context";

const NEW_PROJECT_SENTINEL = "__new__";

export const ProjectSelector = () => {
  const { state, dispatch } = usePaletteLabContext();
  const options = [
    ...state.projects.map((project) => ({ label: project.name, value: project.id })),
    { value: NEW_PROJECT_SENTINEL, label: "新規プロジェクト..." },
  ];

  return (
    <Select
      options={options}
      placeholder="Select project"
      value={state.activeProjectId ?? undefined}
      onChange={(value) => {
        if (value === NEW_PROJECT_SENTINEL) {
          dispatch({ type: "ADD_PROJECT", payload: { name: "New project" } });
          return;
        }
        if (value) {
          dispatch({ type: "SELECT_PROJECT", payload: { projectId: value } });
        }
      }}
    />
  );
};
`;export{e as default};