import { FC, useCallback } from "react";
import { Icons } from "../../commons/components";
import { GeneralModal } from "../../commons/components/modal";
import useCallApi from "../../hooks/useCallApi";
import { Mentor, mentorInitial } from "../../commons/model";

type AssignPanel = {
  mentor: Mentor;
};

/** TODO: Implement authentication */
const refreshToken = "dasdasdasdasdas";

const AssignPanel: FC<AssignPanel> = ({ mentor }) => {
  const { callApi, response, isLoading, error } =
    useCallApi<Mentor>(mentorInitial);

  // console.log({ response });

  const handleShowAssingedStudents = useCallback(() => {
    callApi(`mentor/students/${mentor.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShowAssingedClassrooms = useCallback(() => {
    callApi(`mentor/classrooms/${mentor.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex justify-between flex-wrap w-full px-1 border-t border-gray-200 pt-6">
      <div className="mx-4 mb-3">
        <GeneralModal
          title="Assinged Students"
          label="Students"
          icon={<Icons.ListStudentIcon />}
          handleSubmit={handleShowAssingedStudents}
        >
          <h1>Hi General modal</h1>
        </GeneralModal>
      </div>
      <div className="mx-4 mb-3">
        <GeneralModal
          title="Assinged Classrooms"
          label="Classrooms"
          icon={<Icons.ListClassroomIcon />}
          handleSubmit={handleShowAssingedClassrooms}
        >
          <h1>Hi General modal</h1>
        </GeneralModal>
      </div>
    </div>
  );
};

export default AssignPanel;
